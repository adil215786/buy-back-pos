const { useState, useEffect } = React;

const STATUS_OPTIONS = [
    { value: "Inspecting", color: "bg-yellow-300" },
    { value: "Hold Period", color: "bg-red-300" },
    { value: "Other", color: "bg-orange-300" },
    { value: "Ready To Sell", color: "bg-green-300" },
];

const InventoryView = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([
        { id: "invoiceNumber", label: "Invoice #", visible: true },
        { id: "customerName", label: "Customer Name", visible: true },
        { id: "productName", label: "Product Name", visible: true },
        { id: "status", label: "Status", visible: true },
        { id: "dateCreated", label: "Date Created", visible: true },
        { id: "statusDate", label: "Status Date", visible: true },
        { id: "payoutMethod", label: "Payout Method", visible: true },
        { id: "buyPrice", label: "Buy Price", visible: true },
    ]);
    const [showCustomizeColumns, setShowCustomizeColumns] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [selectedDate, setSelectedDate] = useState(""); // State for date search

    // Load data from invoices stored in localStorage
    useEffect(() => {
        const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
        const formattedData = invoices.map((invoice) => ({
            invoiceNumber: invoice.invoiceNumber,
            customerName: invoice.customerName,
            productName: invoice.productName,
            status: invoice.status || "Inspecting", // Default status
            dateCreated: new Date(invoice.date).toISOString().split("T")[0], // ISO format for comparison
            statusDate: invoice.statusDate
                ? new Date(invoice.statusDate).toISOString().split("T")[0]
                : new Date().toISOString().split("T")[0],
            payoutMethod: invoice.payoutMethod || "Cash", // Default payout method
            buyPrice: invoice.buyPrice.toFixed(2), // Ensure it's a number
        }));
        setData(formattedData);
    }, []);

    const handleStatusChange = (index, newStatus) => {
        const updatedData = [...data];
        updatedData[index].status = newStatus;
        updatedData[index].statusDate = new Date().toISOString().split("T")[0]; // Update status date
        setData(updatedData);

        // Update the localStorage data
        const invoices = JSON.parse(localStorage.getItem("invoices")) || [];
        invoices[index].status = newStatus;
        invoices[index].statusDate = new Date().toISOString();
        localStorage.setItem("invoices", JSON.stringify(invoices));
    };

    const getStatusClass = (status) => {
        const statusOption = STATUS_OPTIONS.find(
            (option) => option.value === status
        );
        return statusOption ? statusOption.color : "bg-gray-300";
    };

    const handleColumnToggle = (id) => {
        const updatedColumns = columns.map((col) =>
            col.id === id ? { ...col, visible: !col.visible } : col
        );
        setColumns(updatedColumns);
    };

    const sortData = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });

        const sortedData = [...data].sort((a, b) => {
            if (key === "buyPrice") {
                // Numeric sorting for buyPrice
                return direction === "asc"
                    ? parseFloat(a[key]) - parseFloat(b[key])
                    : parseFloat(b[key]) - parseFloat(a[key]);
            } else if (key === "dateCreated" || key === "statusDate") {
                // Date sorting
                return direction === "asc"
                    ? new Date(a[key]) - new Date(b[key])
                    : new Date(b[key]) - new Date(a[key]);
            } else {
                // String sorting for other columns
                return direction === "asc"
                    ? a[key].localeCompare(b[key])
                    : b[key].localeCompare(a[key]);
            }
        });
        setData(sortedData);
    };

    const filteredData = data.filter((item) => {
        const matchesSearchTerm = Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

        const matchesSelectedDate =
            !selectedDate || item.dateCreated === selectedDate;

        return matchesSearchTerm && matchesSelectedDate;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full max-w-7xl">
                {/* Top Bar with Customize Columns Button and Date Search */}
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={() =>
                            setShowCustomizeColumns(!showCustomizeColumns)
                        }
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Customize Columns
                    </button>
                    <div>
                        <label
                            htmlFor="date-search"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Search by Date
                        </label>
                        <input
                            id="date-search"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-4 pr-4 py-2 border rounded-lg w-full"
                    />
                </div>

                {/* Inventory Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border border-gray-300 text-xs">
                        <thead>
                            <tr className="bg-gray-50">
                                {columns
                                    .filter((col) => col.visible)
                                    .map((column) => (
                                        <th
                                            key={column.id}
                                            onClick={() => sortData(column.id)}
                                            className="px-4 py-2 border border-gray-300 text-left text-gray-700 uppercase font-semibold cursor-pointer"
                                        >
                                            {column.label}{" "}
                                            {sortConfig.key === column.id
                                                ? sortConfig.direction === "asc"
                                                    ? "▲"
                                                    : "▼"
                                                : ""}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {columns.map((column) =>
                                        column.visible ? (
                                            <td
                                                key={column.id}
                                                className="px-4 py-2 border border-gray-300 text-gray-600"
                                            >
                                                {column.id === "status" ? (
                                                    <select
                                                        value={item.status}
                                                        onChange={(e) =>
                                                            handleStatusChange(
                                                                index,
                                                                e.target.value
                                                            )
                                                        }
                                                        className={`w-full border border-gray-300 rounded px-2 py-1 ${getStatusClass(
                                                            item.status
                                                        )}`}
                                                    >
                                                        {STATUS_OPTIONS.map(
                                                            (option) => (
                                                                <option
                                                                    key={
                                                                        option.value
                                                                    }
                                                                    value={
                                                                        option.value
                                                                    }
                                                                    className={getStatusClass(
                                                                        option.value
                                                                    )}
                                                                >
                                                                    {
                                                                        option.value
                                                                    }
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                ) : (
                                                    item[column.id]
                                                )}
                                            </td>
                                        ) : null
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing {indexOfFirstItem + 1} to{" "}
                            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
                            {filteredData.length} entries
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.max(1, prev - 1)
                                )
                            }
                            disabled={currentPage === 1}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border rounded-md disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Render the component
ReactDOM.render(
    <InventoryView />,
    document.getElementById("inventory-app")
);
