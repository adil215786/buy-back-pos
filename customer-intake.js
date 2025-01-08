document.addEventListener('DOMContentLoaded', function () {
    // Parse product data from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productName = urlParams.get('productName') || '';
    const productDescription = urlParams.get('productDescription') || '';
    const gradeLevel = urlParams.get('gradeLevel') || '';
    const buyPrice = urlParams.get('buyPrice') || '';

    // Populate product details in the table
    document.getElementById('productNameDisplay').textContent = productName;
    document.getElementById('productDescriptionDisplay').textContent = productDescription;
    document.getElementById('gradeLevelDisplay').textContent = gradeLevel;
    document.getElementById('buyPriceDisplay').textContent = `$${parseFloat(buyPrice).toFixed(2)}`;

    // Handle form submission
    const customerIntakeForm = document.getElementById('customerIntakeForm');
    customerIntakeForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Buyback completed successfully!');
    });
});
