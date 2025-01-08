document.addEventListener('DOMContentLoaded', function () {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];

    const invoicesTableBody = document.getElementById('invoicesTableBody');
    const invoiceDetailsModal = document.getElementById('invoiceDetailsModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const totalAmountElement = document.getElementById('totalAmount');
    const totalInvoicesElement = document.getElementById('totalInvoices');
    const dateFilterStart = document.getElementById('dateFilterStart');
    const dateFilterEnd = document.getElementById('dateFilterEnd');
    const exportButton = document.getElementById('exportButton');

    console.log('Loaded invoices from localStorage:', invoices);

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function populateInvoicesTable(filteredInvoices = invoices) {
        invoicesTableBody.innerHTML = '';
        filteredInvoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'hover:bg-gray-100');
            row.innerHTML = `
                <td class="py-3 px-3">${invoice.invoiceNumber}</td>
                <td class="py-3 px-3">${new Date(invoice.date).toLocaleDateString()}</td>
                <td class="py-3 px-3">${formatTime(invoice.date)}</td>
                <td class="py-3 px-3">${invoice.productName}</td>
                <td class="py-3 px-3">${invoice.customerName}</td>
                <td class="py-3 px-3">$${invoice.buyPrice.toFixed(2)}</td>
                <td class="py-3 px-3 text-center">
                    <button class="view-invoice bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" 
                            data-invoice-number="${invoice.invoiceNumber}">
                        View Details
                    </button>
                </td>
            `;
            invoicesTableBody.appendChild(row);

            row.querySelector('.view-invoice').addEventListener('click', () => showInvoiceDetails(invoice));
        });

        const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.buyPrice, 0);
        totalAmountElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
        totalInvoicesElement.textContent = `Total Invoices: ${filteredInvoices.length}`;
    }

    function showInvoiceDetails(invoice) {
        document.getElementById('modalInvoiceNumber').textContent = `Invoice: ${invoice.invoiceNumber}`;
        document.getElementById('modalCustomerName').textContent = invoice.customerName || 'N/A';
        document.getElementById('modalProductName').textContent = invoice.productName || 'N/A';
        document.getElementById('modalBuyPrice').textContent = `$${invoice.buyPrice.toFixed(2)}`;
        document.getElementById('modalCustomerEmail').textContent = invoice.customerEmail || 'N/A';
        document.getElementById('modalCustomerPhone').textContent = invoice.customerPhone || 'N/A';

        const ebayAnalysis = invoice.ebayAnalysis || {};
        document.getElementById('modalAveragePrice').textContent =
            ebayAnalysis.averagePrice ? `$${ebayAnalysis.averagePrice.toFixed(2)}` : 'N/A';
        document.getElementById('modalListingsAnalyzed').textContent =
            ebayAnalysis.listingsAnalyzed || 'N/A';
        document.getElementById('modalBuyPrice40').textContent =
            ebayAnalysis.buyPrice40 ? `$${ebayAnalysis.buyPrice40.toFixed(2)}` : 'N/A';
        document.getElementById('modalBuyPrice30').textContent =
            ebayAnalysis.buyPrice30 ? `$${ebayAnalysis.buyPrice30.toFixed(2)}` : 'N/A';

        invoiceDetailsModal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => {
        invoiceDetailsModal.classList.add('hidden');
    });

    exportButton.addEventListener('click', () => {
        const headers = ["Invoice #", "Date", "Time", "Product Name", "Customer Name", "Buy Price"];
        const rows = invoices.map(invoice => [
            invoice.invoiceNumber,
            new Date(invoice.date).toLocaleDateString(),
            formatTime(invoice.date),
            invoice.productName,
            invoice.customerName,
            `$${invoice.buyPrice.toFixed(2)}`
        ]);

        const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "invoices.csv";
        link.click();
    });

    populateInvoicesTable();
});
