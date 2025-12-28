// VrindaGo Dashboard System
// Property owner dashboard functionality

document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

function initializeDashboard() {
    // Check authentication
    if (!window.VrindaGoAuth || !window.VrindaGoAuth.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }
    
    const currentUser = window.VrindaGoAuth.getCurrentUser();
    
    // Redirect admin users to admin panel
    if (currentUser && currentUser.role === 'admin') {
        window.location.href = 'admin.html';
        return;
    }
    
    setupSidebar();
    setupNavigation();
    setupUserInfo();
    loadDashboardData();
    setupLogout();
    setupMobileMenu();
    
    console.log('VrindaGo Dashboard initialized for:', currentUser?.name);
}

function setupSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');
    const mainContent = document.getElementById('mainContent');
    
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

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageId = this.getAttribute('data-page');
            showPage(pageId);
            
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update breadcrumb
            updateBreadcrumb(this.textContent.trim());
        });
    });
}

function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.style.display = 'none');
    
    // Show selected page
    const targetPage = document.getElementById(`page-${pageId}`);
    if (targetPage) {
        targetPage.style.display = 'block';
        
        // Load page-specific data
        loadPageData(pageId);
    }
}

function loadPageData(pageId) {
    switch (pageId) {
        case 'dashboard':
            loadDashboardStats();
            break;
        case 'properties':
            loadPropertiesData();
            break;
        case 'bookings':
            loadBookingsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

function setupUserInfo() {
    const currentUser = window.VrindaGoAuth.getCurrentUser();
    
    if (currentUser) {
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatar = document.querySelector('.user-avatar');
        
        if (userNameEl) userNameEl.textContent = currentUser.name;
        if (userRoleEl) userRoleEl.textContent = getUserRoleDisplay(currentUser.role);
        if (userAvatar) {
            const initials = currentUser.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.textContent = initials;
        }
    }
}

function getUserRoleDisplay(role) {
    const roleMap = {
        'owner': 'Verified Owner',
        'admin': 'Administrator',
        'guest': 'Guest User'
    };
    return roleMap[role] || 'User';
}

function loadDashboardData() {
    // Simulate loading dashboard data
    setTimeout(() => {
        updateDashboardStats();
        loadRecentProperties();
        loadRecentActivity();
    }, 500);
}

function updateDashboardStats() {
    const currentUser = window.VrindaGoAuth.getCurrentUser();
    
    // Simulate different stats based on user
    const stats = {
        totalProperties: currentUser?.properties?.length || 3,
        activeBookings: Math.floor(Math.random() * 30) + 15,
        monthlyRevenue: Math.floor(Math.random() * 50000) + 25000,
        averageRating: (4.5 + Math.random() * 0.5).toFixed(1)
    };
    
    // Update stat cards
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards.length >= 4) {
        statCards[0].querySelector('.stat-number').textContent = stats.totalProperties;
        statCards[1].querySelector('.stat-number').textContent = stats.activeBookings;
        statCards[2].querySelector('.stat-number').textContent = `₹${stats.monthlyRevenue.toLocaleString()}`;
        statCards[3].querySelector('.stat-number').textContent = stats.averageRating;
    }
}

function loadRecentProperties() {
    // This would typically fetch from an API
    const sampleProperties = [
        {
            name: 'Radha Krishna Guest House',
            status: 'active',
            image: 'assets/images/vrindago-logo.png',
            id: 'prop_001'
        },
        {
            name: 'Vrindavan Heritage Hotel', 
            status: 'active',
            image: 'assets/images/vrindago-logo.png',
            id: 'prop_002'
        },
        {
            name: 'Temple View Rooms',
            status: 'pending',
            image: 'assets/images/vrindago-logo.png',
            id: 'prop_003'
        }
    ];
    
    const propertyContainer = document.querySelector('.card-content');
    if (propertyContainer) {
        // Update property items if they exist
        const propertyItems = propertyContainer.querySelectorAll('.property-item');
        propertyItems.forEach((item, index) => {
            if (sampleProperties[index]) {
                const prop = sampleProperties[index];
                const nameEl = item.querySelector('.property-name');
                const statusEl = item.querySelector('.property-status');
                
                if (nameEl) nameEl.textContent = prop.name;
                if (statusEl) {
                    statusEl.textContent = prop.status === 'active' ? 'Active' : 'Pending Review';
                    statusEl.className = `property-status ${prop.status}`;
                }
            }
        });
    }
}

function loadRecentActivity() {
    // Simulate recent activity data
    console.log('Loading recent activity...');
}

function loadPropertiesData() {
    console.log('Loading properties data...');
    // This would fetch and display all user properties
}

function loadBookingsData() {
    console.log('Loading bookings data...');
    // This would fetch and display booking information
}

function loadAnalyticsData() {
    console.log('Loading analytics data...');
    // This would fetch and display analytics charts
}

function updateBreadcrumb(pageTitle) {
    const breadcrumb = document.querySelector('.breadcrumb span');
    if (breadcrumb) {
        breadcrumb.textContent = pageTitle;
    }
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (confirm('Are you sure you want to logout?')) {
                // Clear session
                window.VrindaGoAuth.clearSession();
                
                // Show logout message
                window.VrindaGoAuth.showMessage('success', 'Successfully logged out!');
                
                // Redirect to login
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 1000);
            }
        });
    }
}

function setupMobileMenu() {
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 1024) {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.getElementById('mainContent');
        
        if (window.innerWidth > 1024) {
            sidebar.classList.remove('open');
        } else {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
        }
    });
}

// Dashboard API simulation functions
function fetchDashboardStats() {
    // Simulate API call
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                properties: Math.floor(Math.random() * 10) + 1,
                bookings: Math.floor(Math.random() * 50) + 10,
                revenue: Math.floor(Math.random() * 100000) + 20000,
                rating: (4.0 + Math.random()).toFixed(1)
            });
        }, 1000);
    });
}

function fetchRecentBookings() {
    // Simulate API call for recent bookings
    return new Promise((resolve) => {
        setTimeout(() => {
            const bookings = [
                {
                    id: 'book_001',
                    guestName: 'Amit Sharma',
                    property: 'Radha Krishna Guest House',
                    checkIn: '2025-01-05',
                    checkOut: '2025-01-08',
                    status: 'confirmed',
                    amount: 2400
                },
                {
                    id: 'book_002',
                    guestName: 'Priya Patel',
                    property: 'Temple View Rooms',
                    checkIn: '2025-01-10',
                    checkOut: '2025-01-12',
                    status: 'pending',
                    amount: 1800
                }
            ];
            resolve(bookings);
        }, 800);
    });
}

// Property management functions
function addNewProperty() {
    console.log('Adding new property...');
    // This would open a form to add new property
}

function editProperty(propertyId) {
    console.log('Editing property:', propertyId);
    // This would open edit form for the property
}

function deleteProperty(propertyId) {
    if (confirm('Are you sure you want to delete this property?')) {
        console.log('Deleting property:', propertyId);
        // This would delete the property
    }
}

// Booking management functions
function viewBooking(bookingId) {
    console.log('Viewing booking:', bookingId);
    // This would open booking details
}

function confirmBooking(bookingId) {
    console.log('Confirming booking:', bookingId);
    // This would confirm the booking
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        console.log('Cancelling booking:', bookingId);
        // This would cancel the booking
    }
}

// Export dashboard functions for global access
window.VrindaGoDashboard = {
    showPage,
    addNewProperty,
    editProperty,
    deleteProperty,
    viewBooking,
    confirmBooking,
    cancelBooking,
    fetchDashboardStats,
    fetchRecentBookings
};