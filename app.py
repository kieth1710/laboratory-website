from flask import Flask, request, render_template, redirect, url_for, send_from_directory, session
import oracledb
import os
import cx_Oracle
from datetime import timedelta



# Create Flask app
app = Flask(__name__)

@app.context_processor
def inject_user_data():
    """Make user data available to all templates automatically"""
    if 'user_id' in session:
        return {
            'user_id': session.get('user_id'),
            'name': session.get('name'),
            'email': session.get('email'),
            'program': session.get('program'),
            'year_level': session.get('year_level'),
            'course_code': session.get('course_code', 'ECE C203'),
            'section': session.get('section', '201G'),
            'program_year': session.get('program_year'),
            'role': session.get('role'),
            'department': session.get('department'),  # Add department for lab/professor
            'position': session.get('position')
        }
    return {}

# Configure session
app.secret_key = os.environ.get('SECRET_KEY', 'dev_key_for_testing')  # Replace in production
app.permanent_session_lifetime = timedelta(days=7)  # Sessions last 7 days

# Debug: Print current directory for troubleshooting
print(f"Current working directory: {os.getcwd()}")
print(f"Files in current directory: {os.listdir('.')}")

# Oracle DB connection setup
def get_db_connection():
    return oracledb.connect(
        user="SYS",
        password="24263501",
        dsn="localhost:1521/FREE",
        mode=oracledb.SYSDBA
    )

def debug_lab_data():
    """Print lab table structure and data for debugging"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check table structure
        print("\n=== LAB_ACCESS Table Structure ===")
        cursor.execute("""
            SELECT column_name, data_type, column_id
            FROM user_tab_columns 
            WHERE table_name = 'LAB_ACCESS'
            ORDER BY column_id
        """)
        
        columns = cursor.fetchall()
        for col in columns:
            print(f"Column {col[2]}: {col[0]} ({col[1]})")
        
        # Check lab data
        print("\n=== LAB_ACCESS Data ===")
        cursor.execute("SELECT * FROM LAB_ACCESS")
        labs = cursor.fetchall()
        
        for i, lab in enumerate(labs):
            print(f"\nLab Staff {i+1}:")
            for j, col in enumerate(lab):
                col_name = columns[j][0] if j < len(columns) else f"Column {j}"
                print(f"  {col_name}: {col}")
                
        cursor.close()
        conn.close()
        print("\nDebug complete!")
        
    except Exception as e:
        print(f"Debug error: {e}")

# Route to serve static files directly (if not using Flask's built-in static folder)
@app.route('/css/<path:filename>')
def serve_css(filename):
    return send_from_directory('.', filename)

@app.route('/images/<path:filename>')
def serve_images(filename):
    return send_from_directory('images', filename)

# Home route: display index page (landing page)
@app.route('/')
def index():
    try:
        return render_template('index.html')
    except Exception as e:
        print(f"ERROR rendering template: {e}")
        return f"Error: {str(e)}"

# Home route alias (for consistent routing)
@app.route('/index')
def home():
    return redirect(url_for('index'))

# Login handler
@app.route('/login', methods=['GET', 'POST'])
def login():
    # If it's a GET request, just show the login page
    if request.method == 'GET':
        return render_template('Log-in.html')
    
    try:
        # For POST requests, handle the login logic
        user_id = request.form['id_number'].strip()
        password = request.form['password'].strip()

        print(f"Login attempt: ID={user_id}, Password={password}")
        
        conn = get_db_connection()
        cursor = conn.cursor()

        # 🧑 Student Login Check
        query = """
            SELECT * FROM STUDENT_ACCESS 
            WHERE STUDENT_ID = :id AND PASSWORDS = :pw
        """
        cursor.execute(query, {'id': user_id, 'pw': password})
        
        student = cursor.fetchone()
        
        if student:
            print(f"Student login successful: {user_id}")
            # Store student information in session
            session.permanent = True
            session['user_id'] = student[0]  # STUDENT_Id
            session['program_year'] = student[1]  # STUDENT_Program_Year
            session['name'] = student[2]  # STUDENT_Name
            session['email'] = student[4]  # STUDENT_Email
            
            # Parse program and year from STUDENT_Program_Year
            program_year = student[1].split()
            if len(program_year) >= 2:
                session['program'] = program_year[0]
                session['year_level'] = ' '.join(program_year[1:])
            else:
                session['program'] = student[1]
                session['year_level'] = ""
            
            # Set default course code and section if needed
            session['course_code'] = "ECE C203"
            session['section'] = "201G"
            
            session['role'] = 'student'
            
            cursor.close()
            conn.close()
            return redirect(url_for('dashboard'))

        # 🧪 Professor Check - Fixed to match exact column names
        prof_query = """
            SELECT * FROM PROFESSOR_ACCESS
            WHERE PROFESSOR_ID = :id AND PASSWORDS = :pw
        """
        cursor.execute(prof_query, {'id': user_id, 'pw': password})
        professor = cursor.fetchone()

        if professor:
            print(f"Professor login successful: {user_id}")
            print(f"Professor data: {professor}")  # Debug: Print all professor data
            
            # Store professor information correctly in session
            session.permanent = True
            session['user_id'] = professor[0]     # PROFESSOR_ID (column 0)
            session['name'] = professor[1]        # PROFESSOR_NAME (column 1)
            session['email'] = professor[2]       # PROFESSOR_EMAIL (column 2)
            session['department'] = professor[3]  # PROFESSOR_DEPARTMENT (column 3)
            
            # Set role to professor
            session['role'] = 'professor'
            
            # Set default course code and section
            session['course_code'] = "ECE C203"
            session['section'] = "201G"
            
            # Debug: Print session data
            print("Session data after professor login:")
            for key, value in session.items():
                print(f"  {key}: {value}")
            
            cursor.close()
            conn.close()
            return redirect(url_for('dashboard_prof'))

        # 🧪 Lab Check - Updated to match professor pattern
        lab_query = """
            SELECT * FROM LAB_ACCESS
            WHERE LAB_ID = :id AND PASSWORDS = :pw
        """
        cursor.execute(lab_query, {'id': user_id, 'pw': password})
        laboratory = cursor.fetchone()

        if laboratory:
            print(f"Lab login successful: {user_id}")
            print(f"Lab data: {laboratory}")  # Debug: Print all lab data
            
            # Store lab information correctly in session
            session.permanent = True
            session['user_id'] = laboratory[0]    # LAB_ID (column 0)
            session['name'] = laboratory[1]       # LAB_NAME (column 1)
            session['email'] = laboratory[2]      # LAB_EMAIL (column 2)
            session['department'] = laboratory[3] # LAB_DEPARTMENT (column 3)
            session['position'] = laboratory[4] if len(laboratory) > 4 else "Lab Staff" # LAB_POSITION (column 4) if exists
            
            # Set role to lab
            session['role'] = 'lab'
            
            # Debug: Print session data
            print("Session data after lab login:")
            for key, value in session.items():
                print(f"  {key}: {value}")
            
            cursor.close()
            conn.close()
            return redirect(url_for('dashboard_lab'))

        # ❌ Invalid credentials
        cursor.close()
        conn.close()
        return render_template('Log-in.html', error="Invalid ID or Password")
    except Exception as e:
        print(f"Login error - DETAILED: {e}")
        return render_template('Log-in.html', error=f"Login error: {str(e)}")
       
# Student Dashboard route
@app.route('/dashboard')
def dashboard():
    if 'user_id' in session and session.get('role') == 'student':
        # Pass all session data to the template
        return render_template(
            'Dashboard.html',
            name=session.get('name'),
            user_id=session.get('user_id'),
            email=session.get('email'),
            program=session.get('program'),
            year_level=session.get('year_level'),
            course_code=session.get('course_code', 'ECE C203'),
            section=session.get('section', '201G'),
            program_year=session.get('program_year')
        )
    return redirect(url_for('login'))

# Lab Dashboard route
@app.route('/dashboard_lab')
def dashboard_lab():
    if 'user_id' in session and session.get('role') == 'lab':
        # Pass all lab session data to the template
        return render_template(
            'Dashboard LAB.html',
            name=session.get('name'),
            user_id=session.get('user_id'),
            email=session.get('email'),
            department=session.get('department'),
            position=session.get('position', 'Laboratory Staff')
        )
    return redirect(url_for('login'))

# Lab Request route
@app.route('/Lab_request')
def Lab_request():
    if 'user_id' in session and session.get('role') == 'lab':
        return render_template('laboratory request.html')
    return redirect(url_for('login'))

# Lab history route
@app.route('/History_lab')
def History_lab():
    if 'user_id' in session and session.get('role') == 'lab':
        return render_template('history LAB.html')
    return redirect(url_for('login'))

# Lab notification route
@app.route('/Notification_lab')
def Notification_lab():
    if 'user_id' in session and session.get('role') == 'lab':
        return render_template('notification lab.html')
    return redirect(url_for('login'))

# Prof Dashboard route
@app.route('/dashboard_prof')
def dashboard_prof():
    if 'user_id' in session and session.get('role') == 'professor':
        # Pass all professor session data to the template
        return render_template(
            'Dashboard Professor.html',
            name=session.get('name'),
            user_id=session.get('user_id'),
            email=session.get('email'),
            program=session.get('program'),
            year_level=session.get('year_level'),
            department=session.get('department', 'ECE & CSE'),  # Default if not set
            course_code=session.get('course_code', 'ECE C203'),
            section=session.get('section', '201G')
        )
    # If not logged in as professor, redirect to login
    return redirect(url_for('login'))

# Prof Equipment route
@app.route('/Equipment_prof')
def Equipment_prof():
    if 'user_id' in session and session.get('role') == 'professor':
        return render_template('equipment prof.html')
    return redirect(url_for('login'))

# Prof Cart route
@app.route('/cart_prof')
def cart_prof():
    if 'user_id' in session and session.get('role') == 'professor':
        return render_template('cart prof.html')
    return redirect(url_for('login'))

# Prof Cart route
@app.route('/borrowed_prof')
def borrowed_prof():
    if 'user_id' in session and session.get('role') == 'professor':
        return render_template('borrowed prof.html')
    return redirect(url_for('login'))

# Prof history route
@app.route('/history_prof')
def history_prof():
    if 'user_id' in session and session.get('role') == 'professor':
        return render_template('history prof.html')
    return redirect(url_for('login'))

# Prof notification route
@app.route('/notification_prof')
def notification_prof():
    if 'user_id' in session and session.get('role') == 'professor':
        return render_template('notification prof.html')
    return redirect(url_for('login'))

# Equipment route for students
@app.route('/equipment')
def equipment():
    if 'user_id' in session and session.get('role') == 'student':
        return render_template('equipment.html')
    return redirect(url_for('login'))

# Cart/Request route for students
@app.route('/cart')
def cart():
    if 'user_id' in session and session.get('role') == 'student':
        return render_template('cart.html')
    return redirect(url_for('login'))

# Borrowed items route for students
@app.route('/borrowed')
def borrowed():
    if 'user_id' in session and session.get('role') == 'student':
        return render_template('borrowed.html')
    return redirect(url_for('login'))

# History route for students
@app.route('/history')
def history():
    if 'user_id' in session and session.get('role') == 'student':
        return render_template('history.html')
    return redirect(url_for('login'))

# Notification route for students
@app.route('/notification_student')
def notification_student():
    if 'user_id' in session and session.get('role') == 'student':
        return render_template('notification Student.html')
    return redirect(url_for('login'))

# Equipment route for lab
@app.route('/equipment_lab')
def equipment_lab():
    if 'user_id' in session and session.get('role') == 'lab':
        return render_template('equipment LAB.html')
    return redirect(url_for('login'))

# Help route
@app.route('/help')
def help():
    return render_template('help.html')

# About route
@app.route('/about')
def about():
    return render_template('about.html')

# Mission route
@app.route('/mission')
def mission():
    return render_template('mission.html')

# Guidelines route
@app.route('/guidelines')
def guidelines():
    return render_template('guidelines.html')

# Contact route
@app.route('/contact')
def contact():
    return render_template('contact.html')

# Logout route
@app.route('/logout')
def logout():
    # Clear the session
    session.clear()
    return redirect(url_for('login'))

# Form submission for lab requests
@app.route('/submit', methods=['POST'])
def submit():
    try:
        data = request.form
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            INSERT INTO lab_requests 
            (student_name, professor_name, professor_id, program, equipment_item, quantity, source_page)
            VALUES (:1, :2, :3, :4, :5, :6, :7)
        """, (
            data.get('student_name'),
            data.get('professor_name'),
            data.get('professor_id'),
            data.get('program'),
            data.get('equipment_item'),
            int(data.get('quantity')),
            request.referrer.split('/')[-1] if request.referrer else 'unknown'
        ))
        
        conn.commit()
        cursor.close()
        conn.close()
        return 'Data submitted successfully!'
    except Exception as e:
        print(f"Submission error: {e}")
        return f"Error submitting data: {str(e)}"

if __name__ == '__main__':
    # Run the debug function to check lab data
    debug_lab_data()
    # Start the Flask application
    app.run(debug=False)