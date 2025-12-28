// VrindaGo Login System
// Handles property owner and admin authentication

document.addEventListener('DOMContentLoaded', function() {
    initializeLogin();
});

function initializeLogin() {
    const loginForm = document.getElementById('loginForm');
    const passwordToggle = document.getElementById('passwordToggle');
    const forgotPassword = document.getElementById('forgotPassword');
    
    // Password visibility toggle
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    }
    
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Forgot password
    if (forgotPassword) {
        forgotPassword.addEventListener('click', function(e) {
            e.preventDefault();
            handleForgotPassword();
        });
    }
    
    // Auto-fill demo credentials on focus
    setupDemoCredentials();
    
    console.log('VrindaGo Login System initialized');
}

function handleLogin(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email').toLowerCase().trim();
    const password = formData.get('password');
    const remember = formData.get('remember');
    
    // Clear previous messages
    hideMessage();
    
    // Show loading state
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn.innerHTML;
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
    
    // Simulate API call delay
    setTimeout(() => {
        const authResult = authenticateUser(email, password);
        
        if (authResult.success) {
            // Store session data
            storeSession(authResult.user, remember);
            
            // Show success message
            showMessage('success', `Welcome back, ${authResult.user.name}!`);
            
            // Redirect based on user role
            setTimeout(() => {
                if (authResult.user.role === 'admin') {
                    window.location.href = 'admin.html';
                } else {
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
            
        } else {
            // Show error message
            showMessage('error', authResult.message);
            
            // Reset button
            loginBtn.disabled = false;
            loginBtn.innerHTML = originalText;
        }
    }, 1500);
}

function authenticateUser(email, password) {
    // Demo authentication - replace with real API call
    const demoUsers = {
        'owner@vrindago.in': {
            password: 'owner123',
            name: 'Property Owner',
            role: 'owner',
            id: 'owner_001',
            properties: ['prop_001', 'prop_002', 'prop_003'],
            verified: true
        },
        'admin@vrindago.in': {
            password: 'admin123',
            name: 'System Administrator',
            role: 'admin',
            id: 'admin_001',
            permissions: ['all'],
            verified: true
        },
        'demo@vrindago.in': {
            password: 'demo123',
            name: 'Demo User',
            role: 'owner',
            id: 'demo_001',
            properties: ['demo_prop_001'],
            verified: true
        }
    };
    
    if (email in demoUsers) {
        const user = demoUsers[email];
        if (user.password === password) {
            return {
                success: true,
                user: {
                    id: user.id,
                    name: user.name,
                    email: email,
                    role: user.role,
                    verified: user.verified,
                    properties: user.properties || [],
                    permissions: user.permissions || []
                },
                token: generateToken()
            };
        } else {
            return {
                success: false,
                message: 'Invalid password. Please try again.'
            };
        }
    } else {
        return {
            success: false,
            message: 'Email not found. Please check your email address.'
        };
    }
}

function generateToken() {
    // Generate a simple demo token
    return 'vrindago_' + Date.now() + '_' + Math.random().toString(36).substring(7);
}

function storeSession(user, remember) {
    const sessionData = {
        user: user,
        token: generateToken(),
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + (remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)).toISOString()
    };
    
    if (remember) {
        localStorage.setItem('vrindago_session', JSON.stringify(sessionData));
    } else {
        sessionStorage.setItem('vrindago_session', JSON.stringify(sessionData));
    }
    
    // Also store user preferences
    localStorage.setItem('vrindago_user_preferences', JSON.stringify({
        theme: 'light',
        notifications: true,
        language: 'en'
    }));
}

function handleForgotPassword() {
    const email = document.getElementById('email').value;
    
    if (!email) {
        showMessage('error', 'Please enter your email address first.');
        return;
    }
    
    // Simulate password reset
    showMessage('success', `Password reset link sent to ${email}. Check your inbox.`);
    
    // In a real application, you would make an API call here
    console.log('Password reset requested for:', email);
}

function setupDemoCredentials() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    // Add quick-fill buttons for demo credentials
    const demoCredentials = document.querySelector('.demo-credentials');
    if (demoCredentials) {
        demoCredentials.addEventListener('click', function(e) {
            if (e.target.tagName === 'P') {
                const text = e.target.textContent;
                if (text.includes('owner@vrindago.in')) {
                    emailInput.value = 'owner@vrindago.in';
                    passwordInput.value = 'owner123';
                } else if (text.includes('admin@vrindago.in')) {
                    emailInput.value = 'admin@vrindago.in';
                    passwordInput.value = 'admin123';
                }
            }
        });
    }
}

function showMessage(type, message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    // Hide both first
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
    
    if (type === 'error') {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    } else if (type === 'success') {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDiv.style.display = 'none';
        successDiv.style.display = 'none';
    }, 5000);
}

function hideMessage() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';
}

// Session management utilities
function getSession() {
    const sessionData = localStorage.getItem('vrindago_session') || 
                       sessionStorage.getItem('vrindago_session');
    
    if (!sessionData) return null;
    
    try {
        const parsed = JSON.parse(sessionData);
        
        // Check if session is expired
        if (new Date() > new Date(parsed.expiresAt)) {
            clearSession();
            return null;
        }
        
        return parsed;
    } catch (error) {
        console.error('Error parsing session data:', error);
        clearSession();
        return null;
    }
}

function clearSession() {
    localStorage.removeItem('vrindago_session');
    sessionStorage.removeItem('vrindago_session');
}

function isAuthenticated() {
    return getSession() !== null;
}

function getCurrentUser() {
    const session = getSession();
    return session ? session.user : null;
}

// Export functions for use in other scripts
window.VrindaGoAuth = {
    getSession,
    clearSession,
    isAuthenticated,
    getCurrentUser,
    showMessage,
    hideMessage
};