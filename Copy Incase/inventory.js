// Import React hooks from React object
const { useState, useEffect } = React;

const InventoryView = () => {
    console.log('InventoryView component rendering');  // Debug log
    
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([
        { id: 'invoiceNumber', label: 'Invoice #', visible: true },
        { id: 'customerName', label: 'Customer Name', visible: true },
        { id: 'status', label: 'Status', visible: true },
        { id: 'dateCreated', label: 'Date Created', visible: false },
        { id: 'statusDate', label: 'Status Date', visible: true },
        { id: 'payoutMethod', label: 'Payout Method', visible: true },
        { id: 'payoutTotal', label: 'Payout Total', visible: true },
        { id: 'phoneNumber', label: 'Phone Number', visible: false },
        { id: 'email', label: 'Email', visible: false },
        { id: 'imeiSn', label: 'IMEI/SN', visible: false },
        { id: 'isbn', label: 'ISBN', visible: false },
        { id: 'notes', label: 'Notes', visible: false }
    ]);
    const [showColumnManager, setShowColumnManager] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    useEffect(() => {
        console.log('Loading data from localStorage');  // Debug log
        const loadData = () => {
            const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
            console.log('Loaded transactions:', transactions);  // Debug log
            setData(transactions);

            const savedColumns = localStorage.getItem('inventoryColumns');
            if (savedColumns) {
                setColumns(JSON.parse(savedColumns));
            }
        };
        loadData();
    }, []);

    useEffect(() => {
        localStorage.setItem('inventoryColumns', JSON.stringify(columns));
    }, [columns]);

    const handleColumnToggle = (columnId) => {
        setColumns(prevColumns =>
            prevColumns.map(col =>
                col.id === columnId ? { ...col, visible: !col.visible } : col
            )
        );
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = data.filter(item =>
        Object.values(item).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const ColumnManager = () => (
        <div className="absolute right-0 top-12 bg-white border rounded-lg shadow-lg p-4 w-64 z-10">
            <h3 className="font-medium mb-2">Customize Columns</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
                {columns.map(column => (
                    <label key={column.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={column.visible}
                            onChange={() => handleColumnToggle(column.id)}
                            className="h-4 w-4"
                        />
                        <span className="select-none">{column.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );

    console.log('Rendering table with data:', currentItems);  // Debug log

    return (
        <div className="p-4">
            <div className="flex justify-between mb-4">
                <div className="flex space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="pl-4 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setShowColumnManager(!showColumnManager)}
                            className="px-4 py-2 border rounded-lg flex items-center space-x-2"
                        >
                            <span>Columns</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {showColumnManager && <ColumnManager />}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50">
                            {columns
                                .filter(col => col.visible)
                                .map(column => (
                                    <th
                                        key={column.id}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.label}
                                    </th>
                                ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentItems.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                {columns
                                    .filter(col => col.visible)
                                    .map(column => (
                                        <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item[column.id]}
                                        </td>
                                    ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} entries
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

// Add console log to confirm script is running
console.log('Starting to render InventoryView');

// Render the component
ReactDOM.render(
    <InventoryView />,
    document.getElementById('inventory-app')
);

console.log('Finished rendering InventoryView');