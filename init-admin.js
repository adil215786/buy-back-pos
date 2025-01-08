document.addEventListener('DOMContentLoaded', function() {
    // Check if users exist in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // If no users exist, create the initial admin user
    if (users.length === 0) {
        const adminUser = {
            id: Date.now().toString(),
            username: 'admin',
            password: 'admin123', // You should change this password
            role: 'admin',
            isActive: true,
            dateCreated: new Date().toISOString()
        };
        
        users.push(adminUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Initial admin user created');
    }
});