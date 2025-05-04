// Profile Modal Functionality and Equipment Overlays
document.addEventListener('DOMContentLoaded', function() {
    // Profile modal functionality
    const profileButton = document.getElementById('profileButton');
    const profileModal = document.getElementById('profileModal');
    const dualModalContainer = document.getElementById('dualModalContainer');
    
    if (profileButton && profileModal) {
        profileButton.addEventListener('click', function() {
            profileModal.classList.add('active');
        });
        
        // Close modal when clicking outside the modal content
        profileModal.addEventListener('click', function(e) {
            if (e.target === profileModal) {
                profileModal.classList.remove('active');
            }
        });
        
        // Close modal when clicking the logout button
        const logoutBtn = profileModal.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                profileModal.classList.remove('active');
                // Add actual logout functionality if needed
                alert('You have been logged out');
            });
        }
    }
    
    // Equipment card interactions
    const addButtons = document.querySelectorAll('.add-button');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the parent card
            const card = this.closest('.equipment-card');
            
            // Get the equipment name
            const equipmentName = card.querySelector('h3').textContent;

            // Get the equipment image
            const equipmentImgSrc = card.querySelector('img').src;
            
            // Get equipment status
            const status = card.querySelector('.status').textContent;
            
            // Check if equipment is available
            if (status.includes('Available')) {
                // Show Add to Cart overlay
                showAddToCartOverlay(equipmentName, card, equipmentImgSrc);
            } else {
                // Alert that equipment is out of stock
                alert(`Sorry, ${equipmentName} is currently out of stock.`);
            }
        });
    });
    
    // Function to show Add to Cart overlay
    function showAddToCartOverlay(equipmentName, card, equipmentImgSrc) {
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay active';
        overlay.id = 'addToCartOverlay';
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'quantity-modal';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = equipmentName;
        content.appendChild(heading);
        
        // Add equipment image
        const equipmentImg = document.createElement('img');
        equipmentImg.src = equipmentImgSrc;
        equipmentImg.alt = equipmentName;
        equipmentImg.className = 'equipment-image';
        content.appendChild(equipmentImg);
        
        // Add status and stock info
        const info = document.createElement('p');
        info.className = 'status available';
        info.textContent = 'Status: Available';
        content.appendChild(info);
        
        const stock = document.createElement('p');
        stock.className = 'stock';
        stock.textContent = card.querySelector('.stock').textContent;
        content.appendChild(stock);
        
        // Add quantity selector
        const quantityContainer = document.createElement('div');
        quantityContainer.className = 'quantity-container';
        
        const minusBtn = document.createElement('button');

        quantityContainer.appendChild(minusBtn);
        
        const quantityInput = document.createElement('input');
        quantityInput.type = 'text';
        quantityInput.className = 'quantity-input';
        quantityInput.value = '1';
        quantityInput.readOnly = true;
        quantityContainer.appendChild(quantityInput);
        
        const plusBtn = document.createElement('button');

        quantityContainer.appendChild(plusBtn);
        
        content.appendChild(quantityContainer);
        
        // Add add to cart button
        const addToCartBtn = document.createElement('button');
        content.appendChild(addToCartBtn);
        
        // Add info button inside the add to cart modal
        const infoBtn = document.createElement('button');
        infoBtn.className = 'info-btn';
        infoBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
        content.appendChild(infoBtn);
        
        // Add back button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        content.appendChild(backBtn);
        
        // Append content to overlay
        overlay.appendChild(content);
        
        // Append overlay to body
        document.body.appendChild(overlay);
        
        // Event listeners for quantity buttons
        minusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            const maxStock = parseInt(card.querySelector('.stock').textContent.match(/\d+/)[0]);
            if (quantity < maxStock) {
                quantityInput.value = quantity + 1;
            }
        });
        
        // Event listener for add to cart button
        addToCartBtn.addEventListener('click', function() {
            const quantity = quantityInput.value;
            alert(`Added ${quantity} ${equipmentName}(s) to your cart.`);
            document.body.removeChild(overlay);
            if (dualModalContainer.classList.contains('active')) {
                dualModalContainer.classList.remove('active');
                dualModalContainer.innerHTML = '';
            }
        });
        
        // Event listener for info button - shows details overlay on top of add to cart overlay
        infoBtn.addEventListener('click', function() {
            const status = card.querySelector('.status').textContent;
            const stock = card.querySelector('.stock').textContent.match(/\d+/)[0];
            
            // Hide the original overlay and show dual overlay
            document.body.removeChild(overlay);
            showDualOverlay(equipmentName, status, stock, card, equipmentImgSrc);
        });
        
        // Event listener for back button and clicking outside
        backBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
    
    // Function to show dual overlay (info + add to cart)
    function showDualOverlay(name, status, stock, card, equipmentImgSrc) {
        // Clear any existing content
        dualModalContainer.innerHTML = '';
        
        // Create wrapper for the two modals
        const dualModalWrapper = document.createElement('div');
        dualModalWrapper.className = 'dual-modal-wrapper';
        
        // Create info modal content
        const infoModal = document.createElement('div');
        infoModal.className = 'info-modal';
        
        // Equipment descriptions - in a real app, this would come from a database
        const descriptions = {
            'Breadboard': 'A construction base for prototyping of electronics. Used to build and test circuits quickly without soldering.',
            'Semi-Conductor': 'Electronic component whose electrical conductivity value falls between that of a conductor and an insulator.',
            'Capacitor': 'Passive two-terminal electronic component that stores electrical energy in an electric field.',
            'Multimeter': 'Electronic measuring instrument that combines several measurement functions in one unit.',
            'Processor': 'Electronic circuitry that executes instructions comprising a computer program.',
            'Diode': 'Semiconductor device, typically made of silicon, that essentially acts as a one-way switch for current.',
            'Arduino Uno': 'Microcontroller board based on the ATmega328P. It has 14 digital input/output pins and 6 analog inputs.',
            'Resistor Kit': 'Collection of various resistors with different resistance values used to limit current flow in circuits.',
            'Oscilloscope': 'Electronic test instrument that allows observation of varying signal voltages as a two-dimensional plot.',
            'Logic Analyzer': 'Electronic instrument that captures and displays multiple signals from a digital system or circuit.',
            'Raspberry Pi': 'Small single-board computer developed to promote teaching of basic computer science.',
            'Soldering Iron': 'Hand tool used in soldering that supplies heat to melt solder to create a permanent bond.'
        };
        
        // Default description if not found
        const defaultDesc = 'No detailed description available for this item.';
        
        // Create info icon
        const infoIcon = document.createElement('div');
        infoIcon.className = 'modal-info-icon';
        infoIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
        infoModal.appendChild(infoIcon);
        
        // Add details
        const details = document.createElement('div');
        details.className = 'info-details';
        
        details.innerHTML = `
            <h3>Name: ${name}</h3>
            <p>Stock: ${stock} units available</p>
            <p class="${status.includes('Available') ? 'status available' : 'status out-of-stock'}">Status: ${status.includes('Available') ? 'Available' : 'Out of Stock'}</p>
            <h4>Description:</h4>
            <p>${descriptions[name] || defaultDesc}</p>
        `;
        
        infoModal.appendChild(details);
        
        // Create add to cart modal content
        const cartModal = document.createElement('div');
        cartModal.className = 'quantity-modal';
        
        // Add heading
        const heading = document.createElement('h3');
        heading.textContent = name;
        cartModal.appendChild(heading);
        
        // Add equipment image
        const equipmentImg = document.createElement('img');
        equipmentImg.src = equipmentImgSrc;
        equipmentImg.alt = name;
        equipmentImg.className = 'equipment-image';
        cartModal.appendChild(equipmentImg);
        
        // Add status and stock info
        const info = document.createElement('p');
        info.className = 'status available';
        info.textContent = 'Status: Available';
        cartModal.appendChild(info);
        
        const stockInfo = document.createElement('p');
        stockInfo.className = 'stock';
        stockInfo.textContent = `In stock: ${stock} units available`;
        cartModal.appendChild(stockInfo);
        
        // Add quantity selector
        const quantityContainer = document.createElement('div');
        quantityContainer.className = 'quantity-container';
        
        const minusBtn = document.createElement('button');

        quantityContainer.appendChild(minusBtn);
        
        const quantityInput = document.createElement('input');


        const plusBtn = document.createElement('button');

        quantityContainer.appendChild(plusBtn);
        
        cartModal.appendChild(quantityContainer);
        
        // Add add to cart button
        const addToCartBtn = document.createElement('button');

        cartModal.appendChild(addToCartBtn);
        
        // Add back button to the cart modal
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        cartModal.appendChild(backBtn);
        
        // Append both modals to the wrapper
        dualModalWrapper.appendChild(infoModal);
        dualModalWrapper.appendChild(cartModal);
        dualModalContainer.appendChild(dualModalWrapper);
        
        // Show the dual modal container
        dualModalContainer.classList.add('active');
        
        // Event listeners for quantity buttons
        minusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity > 1) {
                quantityInput.value = quantity - 1;
            }
        });
        
        plusBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityInput.value);
            if (quantity < stock) {
                quantityInput.value = quantity + 1;
            }
        });
        
        // Event listener for add to cart button
        addToCartBtn.addEventListener('click', function() {
            const quantity = quantityInput.value;
            alert(`Added ${quantity} ${name}(s) to your cart.`);
            dualModalContainer.classList.remove('active');
            dualModalContainer.innerHTML = '';
        });
        
        // Event listener for back button
        backBtn.addEventListener('click', function() {
            dualModalContainer.classList.remove('active');
            dualModalContainer.innerHTML = '';
            showAddToCartOverlay(name, card, equipmentImgSrc);
        });
        
        // Event listener for clicking outside
        dualModalContainer.addEventListener('click', function(e) {
            if (e.target === dualModalContainer) {
                dualModalContainer.classList.remove('active');
                dualModalContainer.innerHTML = '';
            }
        });
    }
    
    // Function to show info overlay (standalone version - not used in dual modal)
    function showInfoOverlay(name, status, stock) {
        // Equipment descriptions - in a real app, this would come from a database
        const descriptions = {
            'Breadboard': 'A construction base for prototyping of electronics. Used to build and test circuits quickly without soldering.',
            'Semi-Conductor': 'Electronic component whose electrical conductivity value falls between that of a conductor and an insulator.',
            'Capacitor': 'Passive two-terminal electronic component that stores electrical energy in an electric field.',
            'Multimeter': 'Electronic measuring instrument that combines several measurement functions in one unit.',
            'Processor': 'Electronic circuitry that executes instructions comprising a computer program.',
            'Diode': 'Semiconductor device, typically made of silicon, that essentially acts as a one-way switch for current.',
            'Arduino Uno': 'Microcontroller board based on the ATmega328P. It has 14 digital input/output pins and 6 analog inputs.',
            'Resistor Kit': 'Collection of various resistors with different resistance values used to limit current flow in circuits.',
            'Oscilloscope': 'Electronic test instrument that allows observation of varying signal voltages as a two-dimensional plot.',
            'Logic Analyzer': 'Electronic instrument that captures and displays multiple signals from a digital system or circuit.',
            'Raspberry Pi': 'Small single-board computer developed to promote teaching of basic computer science.',
            'Soldering Iron': 'Hand tool used in soldering that supplies heat to melt solder to create a permanent bond.'
        };
        
        // Default description if not found
        const defaultDesc = 'No detailed description available for this item.';
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay info-overlay active';
        
        // Create content container
        const content = document.createElement('div');
        content.className = 'info-modal';
        
        // Create info icon
        const infoIcon = document.createElement('div');
        infoIcon.className = 'modal-info-icon';
        infoIcon.innerHTML = '<i class="fas fa-info-circle"></i>';
        content.appendChild(infoIcon);
        
        // Add details
        const details = document.createElement('div');
        details.className = 'info-details';
        
        details.innerHTML = `
            <h3>Name: ${name}</h3>
            <p>Stock: ${stock} units available</p>
            <p class="${status.includes('Available') ? 'status available' : 'status out-of-stock'}">Status: ${status.includes('Available') ? 'Available' : 'Out of Stock'}</p>
            <h4>Description:</h4>
            <p>${descriptions[name] || defaultDesc}</p>
        `;
        
        content.appendChild(details);
        
        // Add back button
        const backBtn = document.createElement('button');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        content.appendChild(backBtn);
        
        // Append content to overlay
        overlay.appendChild(content);
        
        // Append overlay to body
        document.body.appendChild(overlay);
        
        // Event listener for back button and clicking outside
        backBtn.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }
});