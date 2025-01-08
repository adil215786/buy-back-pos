// auth.js - Authentication and Authorization System
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const currentPage = window.location.pathname.split('/').pop();
    
    // Skip auth check for login page to avoid redirect loop
    if (currentPage === 'login.html') {
        return;
    }

    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Update auth button state
    const authButton = document.getElementById('auth-button');
    if (authButton) {
        authButton.textContent = 'Logout';
        authButton.classList.remove('bg-green-500');
        authButton.classList.add('bg-red-500');
        
        // Add logout functionality
        authButton.addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('role');
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
}

// Run auth check when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

// Also check auth when the page becomes visible again
// This handles cases where user navigates back/forward
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        checkAuth();
    }
});