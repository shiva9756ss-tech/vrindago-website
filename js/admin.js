// VrindaGo Admin Panel System
// Complete admin functionality for platform management

document.addEventListener('DOMContentLoaded', function() {
    initializeAdminPanel();
});

function initializeAdminPanel() {
    // Check authentication and admin role
    if (!window.VrindaGoAuth || !window.VrindaGoAuth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const currentUser = window.VrindaGoAuth.getCurrentUser();
    
    // Ensure user has admin role
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Access denied. Admin privileges required.');
        window.location.href = 'dashboard.html';
        return;
    }
    
    setupAdminSidebar();
    setupAdminNavigation();
    setupAdminUserInfo();
    loadAdminDashboard();
    setupAdminLogout();
    setupAdminMobileMenu();
    setupAdminSearch();
    
    console.log('VrindaGo Admin Panel initialized for:', currentUser?.name);
}

function setupAdminSidebar() {
    const sidebar = document.getElementById('adminSidebar');
    const menuToggle = document.getElementById('adminMenuToggle');
    const mainContent = document.getElementById('adminMain');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if (window.innerWidth <= 1024) {
                sidebar.classList.toggle('open');
            } else {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });
    }
}

function setupAdminNavigation() {
    const navItems = document.querySelectorAll('.admin-nav-item[data-page]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageId = this.getAttribute('data-page');
            showAdminPage(pageId);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update breadcrumb
            updateAdminBreadcrumb(this.textContent.trim());
        });
    });
}

function showAdminPage(pageId) {
    // Hide all admin pages
    const pages = document.querySelectorAll('.admin-page');
    pages.forEach(page => page.style.display = 'none');
    
    // Show selected page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        
        // Load page-specific admin data
        loadAdminPageData(pageId);
    }
}

function loadAdminPageData(pageId) {
    switch (pageId) {
        case 'overview':
            loadAdminOverview();
            break;
        case 'properties':
            loadAdminProperties();
            break;
        case 'owners':
            loadAdminOwners();
            break;
        case 'bookings':
            loadAdminBookings();
            break;
        case 'users':
            loadAdminUsers();
            break;
        case 'analytics':
            loadAdminAnalytics();
            break;
        case 'settings':
            loadAdminSettings();
            break;
    }
}

function setupAdminUserInfo() {
    const currentUser = window.VrindaGoAuth.getCurrentUser();
    
    if (currentUser) {
        const adminNameEl = document.getElementById('adminName');
        
        if (adminNameEl) {
            adminNameEl.textContent = currentUser.name;
        }
    }
}

function loadAdminDashboard() {
    // Load initial admin dashboard data
    setTimeout(() => {
        updateAdminStats();
        loadRecentSubmissions();
        loadRecentUsers();
        loadSystemAlerts();
    }, 500);
}

function updateAdminStats() {
    // Simulate admin statistics
    const stats = {
        totalProperties: 247 + Math.floor(Math.random() * 20),
        totalUsers: 1234 + Math.floor(Math.random() * 100),
        totalBookings: 856 + Math.floor(Math.random() * 50),
        monthlyRevenue: 240000 + Math.floor(Math.random() * 50000),
        pendingApprovals: Math.floor(Math.random() * 15) + 5,
        averageRating: (4.5 + Math.random() * 0.3).toFixed(1)
    };
    
    // Update admin stat cards
    const statCards = document.querySelectorAll('.admin-stat-card');
    if (statCards.length >= 6) {
        statCards[0].querySelector('.admin-stat-number').textContent = stats.totalProperties;
        statCards[1].querySelector('.admin-stat-number').textContent = stats.totalUsers.toLocaleString();
        statCards[2].querySelector('.admin-stat-number').textContent = stats.totalBookings;
        statCards[3].querySelector('.admin-stat-number').textContent = `₹${(stats.monthlyRevenue/100000).toFixed(1)}L`;
        statCards[4].querySelector('.admin-stat-number').textContent = stats.pendingApprovals;
        statCards[5].querySelector('.admin-stat-number').textContent = stats.averageRating;
    }
}

function loadRecentSubmissions() {
    // Simulate recent property submissions
    const submissions = [
        {
            name: 'Radha Krishna Guest House',
            owner: 'Ramesh Sharma',
            status: 'pending',
            submittedAt: '2025-01-02'
        },
        {
            name: 'Temple View Rooms',
            owner: 'Priya Gupta',
            status: 'approved',
            submittedAt: '2025-01-01'
        },
        {
            name: 'Krishna Heritage Hotel',
            owner: 'Vinod Kumar',
            status: 'rejected',
            submittedAt: '2024-12-30'
        }
    ];
    
    console.log('Recent submissions loaded:', submissions);
}

function loadRecentUsers() {
    // Simulate recent user registrations
    const users = [
        {
            name: 'Amit Singh',
            type: 'Guest',
            status: 'active',
            registeredAt: '2025-01-03'
        },
        {
            name: 'Sunita Patel',
            type: 'Owner',
            status: 'active',
            registeredAt: '2025-01-02'
        },
        {
            name: 'Rajesh Verma',
            type: 'Guest',
            status: 'pending',
            registeredAt: '2025-01-01'
        }
    ];
    
    console.log('Recent users loaded:', users);
}

function loadSystemAlerts() {
    // Check for system alerts and notifications
    const alerts = [
        {
            type: 'warning',
            message: '12 properties pending approval',
            action: 'review'
        },
        {
            type: 'info',
            message: '5 new user registrations',
            action: 'verify'
        },
        {
            type: 'error',
            message: '2 reported issues',
            action: 'investigate'
        }
    ];
    
    updateAdminNotifications(alerts.length);
    console.log('System alerts loaded:', alerts);
}

function updateAdminNotifications(count) {
    const notificationBadges = document.querySelectorAll('.admin-notifications .badge');
    notificationBadges.forEach(badge => {
        badge.textContent = count;
    });
}

function loadAdminOverview() {
    console.log('Loading admin overview...');
    updateAdminStats();
}

function loadAdminProperties() {
    console.log('Loading admin properties management...');
    // This would load properties management interface
}

function loadAdminOwners() {
    console.log('Loading admin owners management...');
    // This would load property owners management interface
}

function loadAdminBookings() {
    console.log('Loading admin bookings management...');
    // This would load bookings management interface
}

function loadAdminUsers() {
    console.log('Loading admin users management...');
    // This would load users management interface
}

function loadAdminAnalytics() {
    console.log('Loading admin analytics...');
    // This would load comprehensive analytics dashboard
}

function loadAdminSettings() {
    console.log('Loading admin settings...');
    // This would load system settings interface
}

function updateAdminBreadcrumb(pageTitle) {
    const breadcrumb = document.querySelector('.admin-breadcrumb span');
    if (breadcrumb) {
        breadcrumb.textContent = pageTitle;
    }
}

function setupAdminLogout() {
    const logoutBtn = document.getElementById('adminLogout');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout from admin panel?')) {
                // Clear session
                window.VrindaGoAuth.clearSession();
                
                // Show logout message
                window.VrindaGoAuth.showMessage('success', 'Admin session ended successfully!');
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
}

function setupAdminMobileMenu() {
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            const sidebar = document.getElementById('adminSidebar');
            const menuToggle = document.getElementById('adminMenuToggle');
            
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('adminSidebar');
        const mainContent = document.getElementById('adminMain');
        
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    });
}

function setupAdminSearch() {
    const searchInput = document.querySelector('.admin-search input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length > 2) {
                performAdminSearch(query);
            }
        });
    }
}

function performAdminSearch(query) {
    console.log('Admin search:', query);
    // This would perform search across all admin data
    // Properties, users, bookings, etc.
}

// Admin action functions
function approveProperty(propertyId) {
    if (confirm('Approve this property listing?')) {
        console.log('Approving property:', propertyId);
        // API call to approve property
        showAdminNotification('Property approved successfully!', 'success');
    }
}

function rejectProperty(propertyId) {
    const reason = prompt('Reason for rejection:');
    if (reason) {
        console.log('Rejecting property:', propertyId, 'Reason:', reason);
        // API call to reject property
        showAdminNotification('Property rejected.', 'warning');
    }
}

function suspendUser(userId) {
    if (confirm('Suspend this user account?')) {
        console.log('Suspending user:', userId);
        // API call to suspend user
        showAdminNotification('User account suspended.', 'warning');
    }
}

function verifyUser(userId) {
    console.log('Verifying user:', userId);
    // API call to verify user
    showAdminNotification('User account verified!', 'success');
}

function deleteUser(userId) {
    if (confirm('Permanently delete this user account? This action cannot be undone.')) {
        console.log('Deleting user:', userId);
        // API call to delete user
        showAdminNotification('User account deleted.', 'error');
    }
}

function showAdminNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `admin-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-primary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-md);
        padding: var(--space-4);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: var(--space-2);
        min-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Color based on type
    const colors = {
        success: 'var(--text-success)',
        warning: 'var(--text-warning)',
        error: 'var(--text-danger)',
        info: 'var(--accent-blue)'
    };
    
    notification.querySelector('i').style.color = colors[type];
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button
    notification.querySelector('.close-notification').addEventListener('click', () => {
        notification.remove();
    });
}

// Admin API simulation functions
function fetchAdminStats() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                properties: 247,
                users: 1234,
                bookings: 856,
                revenue: 240000,
                pendingApprovals: 12,
                averageRating: 4.6
            });
        }, 1000);
    });
}

function fetchSystemHealth() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                status: 'healthy',
                uptime: '99.9%',
                responseTime: '245ms',
                errors: 0,
                lastBackup: '2025-01-03T02:00:00Z'
            });
        }, 800);
    });
}

// Export admin functions for global access
window.VrindaGoAdmin = {
    showAdminPage,
    approveProperty,
    rejectProperty,
    suspendUser,
    verifyUser,
    deleteUser,
    showAdminNotification,
    fetchAdminStats,
    fetchSystemHealth
};