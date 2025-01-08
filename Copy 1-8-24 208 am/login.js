// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const errorMessage = document.getElementById('error-message');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        // Clear any previous error messages
        errorMessage.style.display = 'none';
        errorMessage.textContent = '';

        // Hardcoded credentials for simplicity
        const validCredentials = {
            admin: { password: 'admin123', role: 'Admin' },
            manager: { password: 'manager123', role: 'Manager' },
            sales: { password: 'sales123', role: 'Sales Rep' }
        };

        const userCredentials = validCredentials[username];

        if (userCredentials && userCredentials.password === password) {
            // Set login status and role in localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', userCredentials.role);
            
            // Store user info
            const userInfo = {
                username: username,
                role: userCredentials.role,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(userInfo));

            // Redirect to homepage
            window.location.href = 'index.html';
        } else {
            // Show error message
            errorMessage.textContent = 'Invalid username or password';
            errorMessage.style.display = 'block';
        }
    });

    // Clear localStorage if any exists (logout cleanup)
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    localStorage.removeItem('currentUser');
});