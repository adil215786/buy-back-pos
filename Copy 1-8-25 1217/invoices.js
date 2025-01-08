document.addEventListener('DOMContentLoaded', function () {
    const invoices = JSON.parse(localStorage.getItem('invoices')) || [];
    const invoicesTableBody = document.getElementById('invoicesTableBody');
    const totalAmountElement = document.getElementById('totalAmount');
    const totalInvoicesElement = document.getElementById('totalInvoices');
    const sortableHeaders = document.getElementById('sortableHeaders').children;

    let sortConfig = { key: null, direction: null };

    function populateInvoicesTable(filteredInvoices = invoices) {
        invoicesTableBody.innerHTML = '';
        filteredInvoices.forEach(invoice => {
            const row = document.createElement('tr');
            row.classList.add('border-b', 'hover:bg-gray-100');
            row.innerHTML = `
                <td class="py-2 px-2 border border-gray-300">${invoice.invoiceNumber}</td>
                <td class="py-2 px-2 border border-gray-300">${new Date(invoice.date).toLocaleDateString()}</td>
                <td class="py-2 px-2 border border-gray-300">${new Date(invoice.date).toLocaleTimeString()}</td>
                <td class="py-2 px-2 border border-gray-300">${invoice.productName}</td>
                <td class="py-2 px-2 border border-gray-300">${invoice.customerName}</td>
                <td class="py-2 px-2 border border-gray-300">$${invoice.buyPrice.toFixed(2)}</td>
                <td class="py-2 px-2 border border-gray-300 text-center">
                    <button class="view-invoice bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600" 
                            data-invoice-number="${invoice.invoiceNumber}">
                        View Details
                    </button>
                </td>
            `;
            invoicesTableBody.appendChild(row);
        });

        document.querySelectorAll('.view-invoice').forEach(button => {
            button.addEventListener('click', function () {
                const invoiceNumber = this.getAttribute('data-invoice-number');
                showInvoiceDetails(invoiceNumber);
            });
        });

        const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.buyPrice, 0);
        totalAmountElement.textContent = `Total Amount: $${totalAmount.toFixed(2)}`;
        totalInvoicesElement.textContent = `Total Invoices: ${filteredInvoices.length}`;
    }

    function sortInvoices(key) {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        sortConfig = { key, direction };

        const sortedInvoices = [...invoices].sort((a, b) => {
            if (key === 'buyPrice') {
                return direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
            } else if (key === 'date') {
                return direction === 'asc' ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            } else {
                return direction === 'asc' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
            }
        });

        populateInvoicesTable(sortedInvoices);
    }

    [...sortableHeaders].forEach((header, index) => {
        if (index < sortableHeaders.length - 1) {
            header.addEventListener('click', () => {
                const key = ['invoiceNumber', 'date', 'date', 'productName', 'customerName', 'buyPrice'][index];
                sortInvoices(key);
            });
        }
    });

    populateInvoicesTable();
});
