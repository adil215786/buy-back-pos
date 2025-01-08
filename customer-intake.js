document.addEventListener('DOMContentLoaded', function () {
    // Get DOM elements
    const customerIntakeForm = document.getElementById('customerIntakeForm');
    const cancelButton = document.getElementById('cancelButton');

    // Load product details from localStorage
    function loadProductDetails() {
        const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct')) || {};
        
        // Update the product details table
        document.getElementById('productNameDisplay').textContent = selectedProduct.name || '';
        document.getElementById('productDescriptionDisplay').textContent = selectedProduct.description || '';
        document.getElementById('gradeLevelDisplay').textContent = selectedProduct.gradeLevel || '';
        document.getElementById('buyPriceDisplay').textContent = selectedProduct.price ? `$${selectedProduct.price}` : '';
    }

    // Load product details when page loads
    loadProductDetails();

    // Handle form submission
    if (customerIntakeForm) {
        customerIntakeForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get selected product details
            const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct')) || {};

            // Validate phone number format
            const phoneNumber = document.getElementById('customerPhone').value.trim();
            const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
            if (!phoneRegex.test(phoneNumber)) {
                alert('Please enter a valid phone number in the format: 123-456-7890');
                return;
            }

            // Generate invoice number
            const generateInvoiceNumber = () => {
                const date = new Date();
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const random = Math.random().toString(36).substring(2, 7).toUpperCase();
                return `INV-${year}${month}${day}-${random}`;
            };

            try {
                // Create transaction object
                const transaction = {
                    invoiceNumber: generateInvoiceNumber(),
                    date: Date.now(),
                    customerName: `${document.getElementById('customerFirstName').value.trim()} ${document.getElementById('customerLastName').value.trim()}`,
                    customerInfo: {
                        firstName: document.getElementById('customerFirstName').value.trim(),
                        lastName: document.getElementById('customerLastName').value.trim(),
                        address: document.getElementById('customerAddress').value.trim(),
                        city: document.getElementById('customerCity').value.trim(),
                        state: document.getElementById('customerState').value.trim(),
                        zipCode: document.getElementById('customerZip').value.trim(),
                        email: document.getElementById('customerEmail').value.trim(),
                        phone: document.getElementById('customerPhone').value.trim(),
                        driversLicense: document.getElementById('customerDL').value.trim()
                    },
                    productName: selectedProduct.name || '',
                    productDetails: {
                        name: selectedProduct.name || '',
                        description: selectedProduct.description || '',
                        gradeLevel: selectedProduct.gradeLevel || '',
                        buyPrice: selectedProduct.price || 0
                    },
                    buyPrice: selectedProduct.price || 0
                };

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
            // Navigate back
            window.history.back();
        });
    }
});