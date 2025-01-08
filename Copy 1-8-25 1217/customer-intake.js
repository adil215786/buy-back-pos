document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const customerIntakeForm = document.getElementById('customerIntakeForm');
    const cancelButton = document.getElementById('cancelButton');

    // Get product details from URL parameters or localStorage
    function loadProductDetails() {
        const productDetails = JSON.parse(localStorage.getItem('selectedProduct')) || {};
        
        // Update the product details table
        document.getElementById('productNameDisplay').textContent = productDetails.productName || '';
        document.getElementById('productDescriptionDisplay').textContent = productDetails.description || '';
        document.getElementById('gradeLevelDisplay').textContent = productDetails.gradeLevel || '';
        document.getElementById('buyPriceDisplay').textContent = productDetails.buyPrice ? `$${productDetails.buyPrice}` : '';
    }

    // Load product details when page loads
    loadProductDetails();

    // Handle form submission
    if (customerIntakeForm) {
        customerIntakeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all required fields
            const requiredFields = [
                'customerFirstName', 'customerLastName', 'customerAddress',
                'customerCity', 'customerState', 'customerZip',
                'customerEmail', 'customerPhone', 'customerDL'
            ];

            const missingFields = requiredFields.filter(fieldId => {
                const field = document.getElementById(fieldId);
                return !field.value.trim();
            });

            if (missingFields.length > 0) {
                alert('Please fill in all required fields');
                return;
            }

            // Validate phone number format
            const phoneNumber = document.getElementById('customerPhone').value.trim();
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!phoneRegex.test(phoneNumber)) {
                alert('Please enter a valid phone number in the format: 123-456-7890');
                return;
            }

            // Validate email format
            const email = document.getElementById('customerEmail').value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            // Validate zip code
            const zipCode = document.getElementById('customerZip').value.trim();
            if (!/^\d{5}$/.test(zipCode)) {
                alert('Please enter a valid 5-digit zip code');
                return;
            }

            // Generate invoice number with date and random string
            const generateInvoiceNumber = () => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const random = Math.random().toString(36).substring(2, 7).toUpperCase();
                return `INV-${year}${month}${day}-${random}`;
            };

            // Get product details
            const productDetails = JSON.parse(localStorage.getItem('selectedProduct')) || {};

            // Create the transaction object
            const transaction = {
                invoiceNumber: generateInvoiceNumber(),
                date: Date.now(),
                customerInfo: {
                    firstName: document.getElementById('customerFirstName').value.trim(),
                    lastName: document.getElementById('customerLastName').value.trim(),
                    fullName: `${document.getElementById('customerFirstName').value.trim()} ${document.getElementById('customerLastName').value.trim()}`,
                    address: document.getElementById('customerAddress').value.trim(),
                    city: document.getElementById('customerCity').value.trim(),
                    state: document.getElementById('customerState').value.trim(),
                    zipCode: document.getElementById('customerZip').value.trim(),
                    email: document.getElementById('customerEmail').value.trim(),
                    phone: document.getElementById('customerPhone').value.trim(),
                    driversLicense: document.getElementById('customerDL').value.trim()
                },
                productDetails: {
                    productName: productDetails.productName || '',
                    description: productDetails.description || '',
                    gradeLevel: productDetails.gradeLevel || '',
                    buyPrice: productDetails.buyPrice || 0
                }
            };

            try {
                // Get existing invoices
                let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
                
                // Ensure invoices is an array
                if (!Array.isArray(invoices)) {
                    invoices = [];
                }

                // Add new transaction
                invoices.push(transaction);

                // Save back to localStorage
                localStorage.setItem('invoices', JSON.stringify(invoices));

                // Clear the selected product
                localStorage.removeItem('selectedProduct');

                alert(`Transaction completed successfully! Invoice Number: ${transaction.invoiceNumber}`);
                window.location.href = 'invoices.html';
            } catch (error) {
                console.error('Error saving transaction:', error);
                alert('An error occurred while saving the transaction. Please try again.');
            }
        });
    }

    // Handle cancel button
    if (cancelButton) {
        cancelButton.addEventListener('click', function() {
            // Clear the selected product
            localStorage.removeItem('selectedProduct');
            // Navigate back to the previous page
            window.history.back();
        });
    }
});