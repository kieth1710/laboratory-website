// Professor/Lab Coordinator Notification JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sample request data - in a real implementation, this would come from your backend
    const requestData = [
        {
            id: "REQ-2025-0342",
            title: "Equipment Request for Laboratory Exercise",
            status: "pending",
            student: {
                name: "Renren Borja",
                id: "24-287495",
                program: "BSCpE - 2nd year",
                section: "ECE C203 - 201G",
                avatar: "images/sample.jpg"
            },
            timestamp: {
                date: "March 10, 2025",
                time: "2:35 PM"
            },
            items: [
                { 
                    name: "Breadboard", 
                    quantity: 1,
                    icon: "fa-microchip"
                },
                { 
                    name: "Resistors", 
                    quantity: 4,
                    icon: "fa-bolt"
                },
                { 
                    name: "Ohmmeter", 
                    quantity: 5,
                    icon: "fa-tachometer-alt"
                }
            ],
            schedule: "March 12, 2025 (9:00 AM - 10:00 AM)",
            purpose: "Circuit design and implementation for ECE C203 laboratory exercise on voltage dividers and series-parallel circuits.",
            notes: "Need the equipment for the laboratory exercise due on March 13. Will return all equipment immediately after the session.",
            availability: [
                {
                    item: "Breadboard",
                    status: "available",
                    details: "15 units available"
                },
                {
                    item: "Resistors",
                    status: "available",
                    details: "Over 100 units available"
                },
                {
                    item: "Ohmmeter",
                    status: "limited",
                    details: "7 units available (2 currently reserved)"
                }
            ]
        }
    ];

    // Elements for professor notification overlay
    const notificationItems = document.querySelectorAll('.notification-item');
    const staffOverlay = document.getElementById('staffNotificationOverlay');
    const closeStaffBtn = document.getElementById('closeStaffDetailBtn');
    
    // Detail elements
    const requestTitle = document.getElementById('requestTitle');
    const requestStatus = document.getElementById('requestStatus');
    const studentAvatar = document.getElementById('studentAvatar');
    const studentName = document.getElementById('studentName');
    const studentId = document.getElementById('studentId');
    const studentProgram = document.getElementById('studentProgram');
    const studentSection = document.getElementById('studentSection');
    const requestDate = document.getElementById('requestDate');
    const requestTime = document.getElementById('requestTime');
    const requestItems = document.getElementById('requestItems');
    const requestSchedule = document.getElementById('requestSchedule');
    const requestPurpose = document.getElementById('requestPurpose');
    const requestNotes = document.getElementById('requestNotes');
    const availabilityStatus = document.getElementById('availabilityStatus');
    const approveRequestBtn = document.getElementById('approveRequestBtn');
    const rejectRequestBtn = document.getElementById('rejectRequestBtn');
    
    // Function to display request details
    function displayRequestDetails(data) {
        // Set basic info
        requestTitle.textContent = data.title;
        
        // Set status with appropriate class
        requestStatus.textContent = data.status === 'pending' ? 'Pending Review' : 
                                   data.status === 'approved' ? 'Approved' : 'Rejected';
        requestStatus.className = 'request-status ' + data.status;
        
        // Set student info
        studentAvatar.src = data.student.avatar;
        studentName.textContent = data.student.name;
        studentId.textContent = 'Student ID: ' + data.student.id;
        studentProgram.textContent = 'Program: ' + data.student.program;
        studentSection.textContent = 'Section: ' + data.student.section;
        
        // Set timestamp
        requestDate.textContent = data.timestamp.date;
        requestTime.textContent = data.timestamp.time;
        
        // Set items
        requestItems.innerHTML = '';
        data.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'request-item';
            itemElement.innerHTML = `
                <div class="item-icon">
                    <i class="fas ${item.icon}"></i>
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">Quantity: ${item.quantity}</div>
                </div>
            `;
            requestItems.appendChild(itemElement);
        });
        
        // Set schedule, purpose, notes
        requestSchedule.textContent = data.schedule;
        requestPurpose.textContent = data.purpose;
        requestNotes.textContent = data.notes || 'No additional notes provided.';
        
        // Set availability
        availabilityStatus.innerHTML = '';
        data.availability.forEach(item => {
            const availabilityElement = document.createElement('div');
            availabilityElement.className = 'availability-item';
            availabilityElement.innerHTML = `
                <div class="availability-item-header">
                    <span class="availability-item-name">${item.item}</span>
                    <span class="availability-item-status ${item.status}">${item.status === 'available' ? 'Available' : 
                            item.status === 'limited' ? 'Limited' : 'Unavailable'}</span>
                </div>
                <div class="availability-item-details">${item.details}</div>
            `;
            availabilityStatus.appendChild(availabilityElement);
        });
    }
    
    // Add click event to notification items (for demonstration)
    notificationItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            // Ignore clicks on checkboxes and buttons
            if (e.target.type === 'checkbox' || e.target.closest('button')) {
                return;
            }
            
            // Get request data based on index (in real scenario, this would be based on notification ID)
            const data = requestData[0]; // Just using the first item for demo
            
            // Display request details
            displayRequestDetails(data);
            
            // Show the overlay
            staffOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close overlay when clicking the close button
    if (closeStaffBtn) {
        closeStaffBtn.addEventListener('click', function() {
            staffOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Close overlay when clicking outside the modal
    staffOverlay.addEventListener('click', function(e) {
        if (e.target === staffOverlay) {
            staffOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Implement approve functionality
    if (approveRequestBtn) {
        approveRequestBtn.addEventListener('click', function() {
            const message = document.getElementById('approvalMessage').value;
            alert('Request approved!' + (message ? '\nMessage: ' + message : '') + 
                  '\n\nThis will be implemented with backend integration.');
            
            // Update status
            requestStatus.textContent = 'Approved';
            requestStatus.className = 'request-status approved';
            
            // In real implementation, this would send data to backend
        });
    }
    
    // Implement reject functionality
    if (rejectRequestBtn) {
        rejectRequestBtn.addEventListener('click', function() {
            const message = document.getElementById('approvalMessage').value;
            if (!message) {
                alert('Please provide a reason for rejection in the message field.');
                return;
            }
            
            alert('Request rejected!\nReason: ' + message + 
                  '\n\nThis will be implemented with backend integration.');
            
            // Update status
            requestStatus.textContent = 'Rejected';
            requestStatus.className = 'request-status rejected';
            
            // In real implementation, this would send data to backend
        });
    }
});