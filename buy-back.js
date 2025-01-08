document.addEventListener('DOMContentLoaded', function () {
    console.log('BBD DEBUG: buy-back.js loaded');

    // Populate eBay Analyzer data if passed through URL
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    if (encodedData) {
        console.log('BBD DEBUG: Found data in URL');
        const buyBackData = JSON.parse(decodeURIComponent(encodedData));

        document.getElementById('productName').value = buyBackData.productName || '';
        document.getElementById('analysisProduct').textContent = buyBackData.productName || '';
        document.getElementById('analysisAveragePrice').textContent = buyBackData.averagePrice ? `$${buyBackData.averagePrice.toFixed(2)}` : '-';
        document.getElementById('analysisListings').textContent = buyBackData.listingsAnalyzed || '-';
        document.getElementById('analysisBuyPrice40').textContent = buyBackData.buyPrice40 ? `$${buyBackData.buyPrice40.toFixed(2)}` : '-';
        document.getElementById('analysisBuyPrice30').textContent = buyBackData.buyPrice30 ? `$${buyBackData.buyPrice30.toFixed(2)}` : '-';
        document.getElementById('buyPrice').value = buyBackData.buyPrice40 || '';
        const ebayLink = document.getElementById('viewEbayListings');
        if (ebayLink) ebayLink.href = buyBackData.ebaySearchUrl || '#';

        console.log('BBD DEBUG: Fields populated from eBay data');
    }

    // Handle form submission to pass data to customer-intake.html
    const buyBackForm = document.getElementById('buyBackForm');
    buyBackForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const gradeLevel = document.getElementById('gradeLevel').value;
        const buyPrice = document.getElementById('buyPrice').value;

        // Pass data via URL to customer-intake.html
        const params = new URLSearchParams({
            productName,
            productDescription,
            gradeLevel,
            buyPrice,
        });

        window.location.href = `customer-intake.html?${params.toString()}`;
    });
});
