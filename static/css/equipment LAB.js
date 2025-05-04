// DOM Elements
const profileButton = document.getElementById('profileButton');
const profileModal = document.getElementById('profileModal');
const logoutBtn = document.querySelector('.logout-btn');
const updateButtons = document.querySelectorAll('.update-button');
const dualModalContainer = document.getElementById('dualModalContainer');
const cartButton = document.querySelector('.cart-button');
const searchInput = document.querySelector('.search-input');
const paginationButtons = document.querySelectorAll('.page-number');
const nextPageButton = document.querySelector('.page-next');

// Equipment data
const equipmentData = [
    { id: 1, name: "Breadboard", image: "images/breadboard.png", status: "Available", stock: 10 },
    { id: 2, name: "Semi-Conductor", image: "images/semiconductor.png", status: "Out of Stock", stock: 0 },
    { id: 3, name: "Capacitor", image: "images/capacitor.png", status: "Available", stock: 10 },
    { id: 4, name: "Multimeter", image: "images/multimeter.jpg", status: "Available", stock: 10 },
    { id: 5, name: "Processor", image: "images/processor.png", status: "Available", stock: 10 },
    { id: 6, name: "Diode", image: "images/diode.png", status: "Available", stock: 10 },
    { id: 7, name: "Arduino Uno", image: "images/arduino.png", status: "Available", stock: 5 },
    { id: 8, name: "Resistor Kit", image: "images/resistor.png", status: "Available", stock: 8 },
    { id: 9, name: "Oscilloscope", image: "images/oscilloscope.png", status: "Available", stock: 3 },
    { id: 10, name: "Logic Analyzer", image: "images/logic-analyzer.png", status: "Out of Stock", stock: 0 },
    { id: 11, name: "Raspberry Pi", image: "images/raspberry-pi.png", status: "Available", stock: 5 },
    { id: 12, name: "Soldering Iron", image: "images/soldering-iron.png", status: "Available", stock: 7 }
];

// Profile Modal Functions
function openProfileModal() {
    profileModal.classList.add('active');
}

function closeProfileModal() {
    profileModal.classList.remove('active');
}

// Equipment Update Modal Functions
function openUpdateModal(equipmentId) {
    const equipment = equipmentData.find(item => item.id === parseInt(equipmentId));
    if (!equipment) return;

    // Create the update modal HTML
    const updateModalHTML = `
        <div class="dual-modal-wrapper">
            <div class="update-modal">
                <button class="back-btn" id="backBtn">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h3>Update Equipment</h3>
                <img src="${equipment.image}" alt="${equipment.name}" class="equipment-image">
                <select class="status-select" id="statusSelect">
                    <option value="Available" ${equipment.status === 'Available' ? 'selected' : ''}>Available</option>
                    <option value="Out of Stock" ${equipment.status === 'Out of Stock' ? 'selected' : ''}>Out of Stock</option>
                    <option value="Reserved" ${equipment.status === 'Reserved' ? 'selected' : ''}>Reserved</option>
                </select>
                <div class="quantity-container">
                    <button class="quantity-btn" id="decreaseBtn">-</button>
                    <input type="number" class="quantity-input" id="quantityInput" value="${equipment.stock}" min="0">
                    <button class="quantity-btn" id="increaseBtn">+</button>
                </div>
                <button class="update-btn" id="updateBtn" data-id="${equipment.id}">Update Equipment</button>
                <button class="info-btn" id="infoBtn">
                    <i class="fas fa-info-circle"></i>
                </button>
            </div>
        </div>
    `;

    // Set the HTML content
    dualModalContainer.innerHTML = updateModalHTML;
    dualModalContainer.classList.add('active');

    // Add event listeners to the new buttons
    document.getElementById('backBtn').addEventListener('click', closeDualModal);
    document.getElementById('increaseBtn').addEventListener('click', () => {
        const inputEl = document.getElementById('quantityInput');
        inputEl.value = parseInt(inputEl.value) + 1;
    });
    document.getElementById('decreaseBtn').addEventListener('click', () => {
        const inputEl = document.getElementById('quantityInput');
        if (parseInt(inputEl.value) > 0) {
            inputEl.value = parseInt(inputEl.value) - 1;
        }
    });
    document.getElementById('updateBtn').addEventListener('click', () => updateEquipment(equipment.id));
    document.getElementById('infoBtn').addEventListener('click', () => showInfoModal(equipment.id));
}

function showInfoModal(equipmentId) {
    const equipment = equipmentData.find(item => item.id === parseInt(equipmentId));
    if (!equipment) return;

    // Add info modal to the existing dual modal container
    const infoModalHTML = `
        <div class="info-modal">
            <i class="fas fa-info-circle modal-info-icon"></i>
            <div class="info-details">
                <h3>Equipment Information</h3>
                <h4>Name</h4>
                <p>${equipment.name}</p>
                <h4>Current Status</h4>
                <p>${equipment.status}</p>
                <h4>Available Units</h4>
                <p>${equipment.stock}</p>
                <h4>Description</h4>
                <p>This is a ${equipment.name} used in electronics labs. It's important for students to have access to quality equipment for their coursework.</p>
                <h4>Maintenance Schedule</h4>
                <p>Last checked: April 15, 2025</p>
                <p>Next maintenance: May 15, 2025</p>
            </div>
        </div>
    `;

    // Append the info modal to the dual modal wrapper
    const dualModalWrapper = document.querySelector('.dual-modal-wrapper');
    dualModalWrapper.innerHTML += infoModalHTML;
}

function updateEquipment(equipmentId) {
    const statusSelect = document.getElementById('statusSelect');
    const quantityInput = document.getElementById('quantityInput');
    
    const equipment = equipmentData.find(item => item.id === parseInt(equipmentId));
    if (!equipment) return;

    // Update the equipment data
    equipment.status = statusSelect.value;
    equipment.stock = parseInt(quantityInput.value);

    // Update the UI
    const card = document.querySelector(`.update-button[data-id="${equipmentId}"]`).closest('.equipment-card');
    const statusElement = card.querySelector('.status');
    const stockElement = card.querySelector('.stock');

    // Update status class
    statusElement.className = 'status';
    if (equipment.status === 'Available') {
        statusElement.classList.add('available');
    } else {
        statusElement.classList.add('out-of-stock');
    }

    // Update text content
    statusElement.textContent = `Status: ${equipment.status}`;
    stockElement.textContent = `In stock: ${equipment.stock} units available`;

    // Close the modal
    closeDualModal();

    // Show a success message (optional)
    alert(`${equipment.name} has been updated successfully!`);
}

function closeDualModal() {
    dualModalContainer.classList.remove('active');
    dualModalContainer.innerHTML = '';
}

// Search Function
function searchEquipment() {
    const searchTerm = searchInput.value.toLowerCase();
    const equipmentCards = document.querySelectorAll('.equipment-card');

    equipmentCards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchTerm)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

// Pagination Functions
function changePage(pageNumber) {
    // Reset all buttons
    paginationButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activate the clicked button
    paginationButtons[pageNumber - 1].classList.add('active');
    
    // In a real application, you would load the appropriate page data here
    // For demonstration, we'll just show a message
    console.log(`Loading page ${pageNumber}`);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Profile modal
    profileButton.addEventListener('click', openProfileModal);
    profileModal.addEventListener('click', function(e) {
        if (e.target === profileModal) {
            closeProfileModal();
        }
    });
    logoutBtn.addEventListener('click', function() {
        alert('Logging out...');
        closeProfileModal();
        // In a real application, redirect to login page
        // window.location.href = 'login.html';
    });

    // Update buttons
    updateButtons.forEach(button => {
        button.addEventListener('click', function() {
            const equipmentId = this.getAttribute('data-id');
            openUpdateModal(equipmentId);
        });
    });

    // Search functionality
    searchInput.addEventListener('input', searchEquipment);

    // Cart button
    cartButton.addEventListener('click', function() {
        alert('Cart functionality will be implemented soon!');
    });

    // Pagination
    paginationButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            changePage(index + 1);
        });
    });

    nextPageButton.addEventListener('click', function() {
        const activePage = document.querySelector('.page-number.active');
        const nextPage = parseInt(activePage.textContent) + 1;
        if (nextPage <= paginationButtons.length) {
            changePage(nextPage);
        }
    });

    // Close modals when clicking outside
    dualModalContainer.addEventListener('click', function(e) {
        if (e.target === dualModalContainer) {
            closeDualModal();
        }
    });
});