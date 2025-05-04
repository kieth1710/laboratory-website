// Add this JavaScript to your notification.js file or create it if it doesn't exist

document.addEventListener('DOMContentLoaded', function() {
    // Sample notification data - in a real implementation, this would come from your backend
    const notificationData = [
        {
            id: 1,
            sender: "Prof.",
            info: "ECE C203 - 201G",
            date: "February 10, 2025",
            avatar: "images/sample.jpg",
            subject: "Reservation Approval Request",
            content: `
            <div class="notification-detail-formal">
                <h3>Reservation Approval Request | ECE C203 - 201G</h3>
                <p>March 12, 2025 at 10:30 am</p>
                
                <div class="notification-detail-section">
                    <h4>ITEM DETAILS</h4>
                    <p><strong>Item Name</strong></p>
                    <ul>
                        <li>Breadboard <strong>x1</strong></li>
                        <li>Resistors <strong>x4</strong></li>
                        <li>Ohmmeter <strong>x5</strong></li>
                    </ul>
                </div>
                
                <div class="notification-detail-section">
                    <h4>DATE / TIME NEEDED:</h4>
                    <p>March 12, 2025 | 9:00 am - 10:00 am</p>
                </div>
                
                <div class="notification-detail-section">
                    <h4>SUBJECT / SECTION:</h4>
                    <p>ECE C203 - 201G</p>
                </div>
                
                <div class="notification-detail-signature">
                    <div class="signature-line">
                        <p>Signature of student over printed name</p>
                    </div>
                    <div class="signature-line">
                        <p>Signature of professor over printed name</p>
                    </div>
                </div>
                
                <div class="notification-detail-status approved">
                    Your request has been approved. Please proceed to the laboratory to claim the equipment at your scheduled time.
                </div>
            </div>
            `
        },
        {
            id: 2,
            sender: "Lab Staff",
            info: "Laboratory Coordinator",
            date: "March 3, 2025",
            avatar: "images/sample.jpg",
            subject: "Laboratory Announcement",
            content: `
            <div class="notification-detail-announcement">
                <h3>IMPORTANT ANNOUNCEMENT</h3>
                <p>Dear Students,</p>
                <p>Borrowing or reservation of equipment is temporarily suspended from March 15-20, 2025 due to annual inventory and maintenance checks.</p>
                <p>Please plan your laboratory requirements accordingly. All ongoing borrows must be returned by March 14, 2025 before 5:00 PM.</p>
                <p>Normal operations will resume on March 21, 2025.</p>
                <p>For urgent concerns during this period, please contact the department office at ext. 235.</p>
                <p>Thank you for your understanding and cooperation.</p>
                <p class="notification-signature">Laboratory Management Office</p>
            </div>
            `
        }
    ];

    // Find all notification items
    const notificationItems = document.querySelectorAll('.notification-item');
    const overlay = document.getElementById('notificationDetailOverlay');
    const closeBtn = document.getElementById('closeDetailBtn');
    
    // Detail elements
    const detailAvatar = document.getElementById('detailAvatar');
    const detailSender = document.getElementById('detailSender');
    const detailInfo = document.getElementById('detailInfo');
    const detailDate = document.getElementById('detailDate');
    const detailContent = document.getElementById('detailContent');
    const replyBtn = document.getElementById('replyBtn');
    const deleteDetailBtn = document.getElementById('deleteDetailBtn');
    
    // Add click event to each notification item
    notificationItems.forEach((item, index) => {
        item.addEventListener('click', function(e) {
            // Ignore clicks on checkboxes and buttons
            if (e.target.type === 'checkbox' || e.target.closest('button')) {
                return;
            }
            
            // Get notification data based on index
            const data = notificationData[index] || {
                sender: "Unknown",
                info: "",
                date: "No date available",
                avatar: "images/sample.jpg",
                content: "No content available"
            };
            
            // Fill in the detail view
            detailAvatar.src = data.avatar;
            detailSender.textContent = data.sender;
            detailInfo.textContent = data.info;
            detailDate.textContent = data.date;
            detailContent.innerHTML = data.content;
            
            // Show the overlay
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close overlay when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        });
    }
    
    // Close overlay when clicking outside the modal
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Implement reply functionality
    if (replyBtn) {
        replyBtn.addEventListener('click', function() {
            alert('Reply functionality will be implemented with backend integration.');
        });
    }
    
    // Implement delete functionality
    if (deleteDetailBtn) {
        deleteDetailBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this notification?')) {
                alert('Delete functionality will be implemented with backend integration.');
                overlay.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
        });
    }
    
    // Additional CSS for the detail content
    const style = document.createElement('style');
    style.textContent = `
        .notification-detail-formal h3 {
            color: #003366;
            border-bottom: 1px solid #e0e0e0;
            padding-bottom: 10px;
            margin-top: 0;
        }
        
        .notification-detail-section {
            margin: 15px 0;
        }
        
        .notification-detail-section h4 {
            color: #003366;
            margin-bottom: 5px;
        }
        
        .notification-detail-signature {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        .signature-line {
            width: 45%;
            border-top: 1px solid #333;
            padding-top: 5px;
            text-align: center;
            font-size: 14px;
        }
        
        .notification-detail-status {
            margin-top: 20px;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
        }
        
        .notification-detail-status.approved {
            background-color: #e6f4ea;
            color: #137333;
        }
        
        .notification-detail-status.pending {
            background-color: #fff8e1;
            color: #996500;
        }
        
        .notification-detail-status.rejected {
            background-color: #fce8e6;
            color: #c5221f;
        }
        
        .notification-detail-announcement {
            padding: 10px;
        }
        
        .notification-detail-announcement h3 {
            color: #c5221f;
            text-align: center;
            margin-bottom: 20px;
        }
        
        .notification-signature {
            margin-top: 20px;
            font-style: italic;
            text-align: right;
        }
    `;
    document.head.appendChild(style);
});