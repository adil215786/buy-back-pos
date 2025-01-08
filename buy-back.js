document.addEventListener('DOMContentLoaded', function() {
    console.log('BBD DEBUG: buy-back.js loaded');
    
    // Initialize storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let inventory = JSON.parse(localStorage.getItem('inventory')) || [];
    
    // Try to get data from URL
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedData = urlParams.get('data');
        
        if (encodedData) {
            console.log('BBD DEBUG: Found data in URL');
            const buyBackData = JSON.parse(decodeURIComponent(encodedData));
            console.log('BBD DEBUG: Parsed buyBackData:', buyBackData);
            
            // Update fields
            document.getElementById('productName').value = buyBackData.productName || '';
            document.getElementById('analysisProduct').textContent = buyBackData.productName || '';
            document.getElementById('analysisAveragePrice').textContent = buyBackData.averagePrice ? `$${buyBackData.averagePrice.toFixed(2)}` : '';
            document.getElementById('analysisListings').textContent = buyBackData.listingsAnalyzed || '';
            document.getElementById('analysisBuyPrice40').textContent = buyBackData.buyPrice40 ? `$${buyBackData.buyPrice40.toFixed(2)}` : '';
            document.getElementById('analysisBuyPrice30').textContent = buyBackData.buyPrice30 ? `$${buyBackData.buyPrice30.toFixed(2)}` : '';
            
            // Set buy price to 40% value
            document.getElementById('buyPrice').value = buyBackData.buyPrice40 ? buyBackData.buyPrice40.toFixed(2) : '';
            
            // Set eBay link
            const ebayLink = document.getElementById('viewEbayListings');
            if (ebayLink) {
                ebayLink.href = buyBackData.ebaySearchUrl || '#';
            }
            
            console.log('BBD DEBUG: All fields updated successfully');
            
            // Remove the data from the URL without refreshing the page
            window.history.replaceState({}, document.title, window.location.pathname);
        } else {
            console.log('BBD DEBUG: No data found in URL');
        }
    } catch (error) {
        console.error('BBD DEBUG: Error processing data:', error);
    }

    // Image preview function
    function setupImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const MAX_FILE_SIZE = 500 * 1024; // 500KB

        if (!input || !preview) return;

        input.addEventListener('change', function(e) {
            preview.innerHTML = '';
            const files = e.target.files;

            for (let i = 0; i < files.length; i++) {
                if (files[i].size > MAX_FILE_SIZE) {
                    alert(`Image ${files[i].name} is too large. Maximum size is 500KB`);
                    input.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML += `<img src="${e.target.result}" alt="Product Image">`;
                }
                reader.readAsDataURL(files[i]);
            }
        });
    }

    // Setup image previews
    setupImagePreview('productFront', 'frontPreview');
    setupImagePreview('productBack', 'backPreview');
    setupImagePreview('productOther', 'otherPreview');

    // Transaction search functionality
    const searchTransactions = document.getElementById('searchTransactions');
    if (searchTransactions) {
        searchTransactions.addEventListener('input', function(e) {
            updateTransactionLog(e.target.value.toLowerCase());
        });
    }

    // Process image files
    function processImageFile(file) {
        if (!file) return null;
        return {
            name: file.name,
            size: file.size,
            type: file.type
        };
    }

  // Handle form submission
const buyBackForm = document.getElementById('buyBackForm');
if (buyBackForm) {
    buyBackForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const productName = document.getElementById('productName').value;
        const productDescription = document.getElementById('productDescription').value;
        const gradeLevel = document.getElementById('gradeLevel').value;
        const buyPrice = parseFloat(document.getElementById('buyPrice').value);
        const ebaySearchUrl = document.getElementById('viewEbayListings')?.href || '';

        // Validate required fields
        if (!productName || !gradeLevel || !buyPrice) {
            alert('Please fill out all required fields.');
            return;
        }

        // Prepare product data for customer intake
        const productData = {
            productName,
            productDescription,
            gradeLevel,
            buyPrice,
            ebaySearchUrl,
            averagePrice: parseFloat(document.getElementById('analysisAveragePrice').textContent.replace('$', '') || 0),
            listingsAnalyzed: document.getElementById('analysisListings').textContent || '',
            buyPrice40: parseFloat(document.getElementById('analysisBuyPrice40').textContent.replace('$', '') || 0),
            buyPrice30: parseFloat(document.getElementById('analysisBuyPrice30').textContent.replace('$', '') || 0)
        };

        // Store product data in localStorage for customer intake page
        localStorage.setItem('pendingProductData', JSON.stringify(productData));

        // Redirect to customer intake page
        window.location.href = `${window.location.origin}/buy-back-pos/customer-intake.html`;
    });
}

    // Update transaction log
    function updateTransactionLog(searchTerm = '') {
        const transactionLog = document.getElementById('transactionLog')?.getElementsByTagName('tbody')[0];
        if (!transactionLog) return;

        transactionLog.innerHTML = '';
        
        const filteredTransactions = searchTerm 
            ? transactions.filter(t => 
                t.productName.toLowerCase().includes(searchTerm) ||
                t.customerName.toLowerCase().includes(searchTerm) ||
                t.transactionId.toLowerCase().includes(searchTerm)
            )
            : transactions;

        filteredTransactions.forEach(t => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${t.customerName}</td>
                <td>${t.productName}</td>
                <td>$${t.buyPrice.toFixed(2)}</td>
                <td>${t.gradeLevel}</td>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>${t.images ? t.images.length : 0} image(s)</td>
            `;
            transactionLog.appendChild(row);
        });
    }

    // Initial transaction log update
    updateTransactionLog();
});
