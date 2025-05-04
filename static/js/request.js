document.addEventListener('DOMContentLoaded', function() {
    // Profile Modal Functionality
    const profileButton = document.getElementById('profileButton');
    const profileModal = document.getElementById('profileModal');

    profileButton.addEventListener('click', function() {
        profileModal.classList.toggle('active');
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            profileModal.classList.remove('active');
        }
    });

    // Request Item Selection
    const requestItems = document.querySelectorAll('.request-item');
    requestItems.forEach(item => {
        item.addEventListener('click', function() {
            // Remove selected class from all items
            requestItems.forEach(i => i.classList.remove('selected'));
            // Add selected class to clicked item
            this.classList.add('selected');
            
            // Here you would typically update the details panel based on the selected item
            // For demo purposes, we're just updating the selection visually
        });
    });

    // Checkbox functionality
    const checkboxes = document.querySelectorAll('.checkbox-container input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function(event) {
            // Prevent the click from propagating to the parent (request-item)
            event.stopPropagation();
        });
    });

    // Select All button functionality
    const selectAllBtn = document.querySelector('.select-all-btn');
    selectAllBtn.addEventListener('click', function() {
        const allChecked = Array.from(checkboxes).every(cb => cb.checked);
        
        checkboxes.forEach(checkbox => {
            checkbox.checked = !allChecked;
        });
    });

    // Approve and Deny button functionality
    const approveBtn = document.querySelector('.approve-btn');
    const denyBtn = document.querySelector('.deny-btn');

    approveBtn.addEventListener('click', function() {
        alert('Request approved!');
        // Here you would typically handle the approval process
    });

    denyBtn.addEventListener('click', function() {
        alert('Request denied!');
        // Here you would typically handle the denial process
    });

    // Search functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        
        requestItems.forEach(item => {
            const userName = item.querySelector('.request-user').textContent.toLowerCase();
            const requestType = item.querySelector('.request-type').textContent.toLowerCase();
            
            if (userName.includes(searchValue) || requestType.includes(searchValue)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });
});