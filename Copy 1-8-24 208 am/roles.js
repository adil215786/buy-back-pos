const { useState, useEffect } = React;

const RolesManagement = () => {
    const [roles, setRoles] = useState([
        { id: 1, role: 'Admin', firstName: 'Super', lastName: 'Admin' },
        { id: 2, role: 'Manager', firstName: 'John', lastName: 'Doe' },
        { id: 3, role: 'Sales Rep', firstName: 'Jane', lastName: 'Smith' },
    ]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newRole, setNewRole] = useState({ role: '', firstName: '', lastName: '', password: '' });

    useEffect(() => {
        const loggedUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!loggedUser) {
            console.warn('No user found in localStorage.');
        }
        setCurrentUser(loggedUser);
    }, []);

    const handleAddRole = () => {
        const newId = roles.length ? roles[roles.length - 1].id + 1 : 1;
        const updatedRoles = [...roles, { id: newId, ...newRole }];
        setRoles(updatedRoles);
        setNewRole({ role: '', firstName: '', lastName: '', password: '' });
        setIsModalOpen(false);
    };

    if (!currentUser) {
        return (
            <div className="text-center mt-10">
                <h2 className="text-red-500 text-lg">No user found. Please log in.</h2>
                <p className="text-gray-600">Ensure you are logged in to access this page.</p>
            </div>
        );
    }

    return (
        <div className="p-4 flex justify-center">
            <div className="w-full max-w-4xl">
                {currentUser && currentUser.role === 'Admin' && (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mb-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                    >
                        Add Role
                    </button>
                )}

                <table className="table-auto w-full border border-gray-300 text-sm text-center">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="px-4 py-2 border">ID</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border">First Name</th>
                            <th className="px-4 py-2 border">Last Name</th>
                            {currentUser && currentUser.role === 'Admin' && (
                                <th className="px-4 py-2 border">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((role) => (
                            <tr key={role.id} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2 border">{role.id}</td>
                                <td className="px-4 py-2 border">{role.role}</td>
                                <td className="px-4 py-2 border">{role.firstName}</td>
                                <td className="px-4 py-2 border">{role.lastName}</td>
                                {currentUser && currentUser.role === 'Admin' && (
                                    <td className="px-4 py-2 border">
                                        <button
                                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded shadow-md w-1/3">
                            <h2 className="text-lg font-bold mb-4">Add New Role</h2>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                                <select
                                    value={newRole.role}
                                    onChange={(e) => setNewRole({ ...newRole, role: e.target.value })}
                                    className="w-full border rounded px-3 py-2"
                                >
                                    <option value="">Select a role</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Sales Rep">Sales Rep</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    value={newRole.firstName}
                                    onChange={(e) =>
                                        setNewRole({ ...newRole, firstName: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter first name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    value={newRole.lastName}
                                    onChange={(e) =>
                                        setNewRole({ ...newRole, lastName: e.target.value })
                                    }
                                    className="w-full border rounded px-3 py-2"
                                    placeholder="Enter last name"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddRole}
                                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

ReactDOM.render(<RolesManagement />, document.getElementById('roles-root'));
