document.getElementById('login-button').addEventListener('click', () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Mock user data
    const users = [
        { username: 'admin', password: 'admin123', role: 'Admin' },
        { username: 'manager', password: 'manager123', role: 'Manager' },
        { username: 'salesrep', password: 'sales123', role: 'Sales Rep' },
    ];

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'roles.html'; // Redirect to roles page
    } else {
        alert('Invalid username or password!');
    }
});
