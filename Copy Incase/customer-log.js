// Load customers and transactions from local storage
let customers = JSON.parse(localStorage.getItem('customers')) || [];
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// DOM Elements
const customerLogTable = document.getElementById('customerLogTable').getElementsByTagName('tbody')[0];
const customerSearch = document.getElementById('customerSearch');
const dateFilter = document.getElementById('dateFilter');
const exportButton = document.getElementById('exportCustomers');
const customerModal = document.getElementById('customerModal');
const closeBtn = document.getElementsByClassName('close')[0];

// Close modal when clicking X or outside
closeBtn.onclick = function() {
  customerModal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == customerModal) {
    customerModal.style.display = 'none';
  }
}

// Filter customers
function filterCustomers() {
  const searchTerm = customerSearch.value.toLowerCase();
  const dateValue = dateFilter.value;

  return customers.filter(customer => {
    const matchesSearch = customer.customerName.toLowerCase().includes(searchTerm) ||
                         customer.customerEmail.toLowerCase().includes(searchTerm) ||
                         customer.customerId.toLowerCase().includes(searchTerm);
    
    if (dateValue) {
      const filterDate = new Date(dateValue).setHours(0,0,0,0);
      const lastVisit = new Date(customer.lastVisit).setHours(0,0,0,0);
      return matchesSearch && lastVisit >= filterDate;
    }
    
    return matchesSearch;
  });
}

// Show customer details
function showCustomerDetails(customerId) {
  const customer = customers.find(c => c.customerId === customerId);
  const customerTransactions = transactions.filter(t => t.customerId === customerId);
  
  if (customer) {
    document.getElementById('customerDetails').innerHTML = `
      <div class="customer-details">
        <h3>Customer Information</h3>
        <p><strong>ID:</strong> ${customer.customerId}</p>
        <p><strong>Name:</strong> ${customer.customerName}</p>
        <p><strong>Email:</strong> ${customer.customerEmail}</p>
        <p><strong>Phone:</strong> ${customer.customerPhone}</p>
        <p><strong>Created:</strong> ${new Date(customer.dateCreated).toLocaleDateString()}</p>
        <p><strong>Last Visit:</strong> ${new Date(customer.lastVisit).toLocaleDateString()}</p>
        
        <h3>Transaction History</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Grade</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${customerTransactions.map(t => `
              <tr>
                <td>${new Date(t.date).toLocaleDateString()}</td>
                <td>${t.productName}</td>
                <td>${t.gradeLevel}</td>
                <td>$${t.buyPrice.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    customerModal.style.display = 'block';
  }
}

// Update the customer log table
function updateCustomerLogTable() {
  const filteredCustomers = filterCustomers();
  customerLogTable.innerHTML = '';
  
  filteredCustomers.forEach(customer => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${customer.customerId}</td>
      <td>${customer.customerName}</td>
      <td>${customer.customerEmail}</td>
      <td>${customer.customerPhone}</td>
      <td>${customer.totalTransactions}</td>
      <td>${new Date(customer.lastVisit).toLocaleDateString()}</td>
      <td>
        <button onclick="showCustomerDetails('${customer.customerId}')">Details</button>
      </td>
    `;
    customerLogTable.appendChild(row);
  });
}

// Export customers to CSV
exportButton.addEventListener('click', function() {
  const filteredCustomers = filterCustomers();
  let csv = 'Customer ID,Name,Email,Phone,Total Transactions,Last Visit\n';
  
  filteredCustomers.forEach(customer => {
    csv += `${customer.customerId},${customer.customerName},${customer.customerEmail},` +
           `${customer.customerPhone},${customer.totalTransactions},` +
           `${new Date(customer.lastVisit).toLocaleDateString()}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'customer_export.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

// Event listeners for search and filter
customerSearch.addEventListener('input', updateCustomerLogTable);
dateFilter.addEventListener('change', updateCustomerLogTable);

// Initial load
updateCustomerLogTable();