// VrindaGo - JustDial Style Business Directory
// Enhanced search and interaction functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize app
    initializeApp();
});

function initializeApp() {
    setupSearchFunctionality();
    setupFilterFunctionality();
    setupInteractionTracking();
    setupScrollAnimations();
    console.log('VrindaGo JustDial Directory initialized successfully');
}

// Enhanced Search Functionality
function setupSearchFunctionality() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const businessCards = document.querySelectorAll('.business-card');
    
    if (searchInput) {
        // Real-time search with debouncing
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(this.value.toLowerCase(), businessCards);
            }, 300);
        });
        
        // Search on enter key
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value.toLowerCase(), businessCards);
            }
        });
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
            performSearch(searchTerm, businessCards);
        });
    }
}

function performSearch(searchTerm, businessCards) {
    let visibleCount = 0;
    
    businessCards.forEach(card => {
        const name = card.dataset.name?.toLowerCase() || '';
        const location = card.dataset.location?.toLowerCase() || '';
        const price = card.dataset.price?.toLowerCase() || '';
        const category = card.querySelector('.business-category')?.textContent.toLowerCase() || '';
        const amenities = Array.from(card.querySelectorAll('.amenity-tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
        
        const isMatch = name.includes(searchTerm) || 
                       location.includes(searchTerm) || 
                       price.includes(searchTerm) || 
                       category.includes(searchTerm) ||
                       amenities.includes(searchTerm);
        
        if (isMatch || searchTerm === '') {
            card.style.display = 'block';
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.style.display = 'none';
            card.classList.add('hidden');
        }
    });
    
    // Update results count
    updateResultsCount(visibleCount);
    
    // Show no results message if needed
    showNoResultsMessage(visibleCount);
}

function updateResultsCount(count) {
    const countElement = document.querySelector('.listings-count');
    if (countElement) {
        countElement.textContent = `${count} verified accommodation${count !== 1 ? 's' : ''} found`;
    }
}

function showNoResultsMessage(count) {
    let noResultsMsg = document.querySelector('.no-results-message');
    
    if (count === 0) {
        if (!noResultsMsg) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.className = 'no-results-message';
            noResultsMsg.innerHTML = `
                <div style="text-align: center; padding: 3rem; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                    <h3>No accommodations found</h3>
                    <p>Try adjusting your search terms or browse all listings</p>
                    <button onclick="clearSearch()" style="background: var(--primary-orange); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 0.5rem; margin-top: 1rem; cursor: pointer;">
                        View All Listings
                    </button>
                </div>
            `;
            document.querySelector('.business-grid').appendChild(noResultsMsg);
        }
        noResultsMsg.style.display = 'block';
    } else {
        if (noResultsMsg) {
            noResultsMsg.style.display = 'none';
        }
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        performSearch('', document.querySelectorAll('.business-card'));
    }
}

// Filter and Sort Functionality
function setupFilterFunctionality() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categoryItems = document.querySelectorAll('.category-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filterType = this.querySelector('i').className;
            
            if (filterType.includes('fa-filter')) {
                showFilterModal();
            } else if (filterType.includes('fa-sort')) {
                togglePriceSort();
            } else if (filterType.includes('fa-map-marker-alt')) {
                sortByLocation();
            }
        });
    });
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            filterByCategory(this.textContent.toLowerCase());
        });
    });
}

function togglePriceSort() {
    const businessGrid = document.querySelector('.business-grid');
    const cards = Array.from(document.querySelectorAll('.business-card:not(.hidden)'));
    
    // Check current sort order
    const isAscending = businessGrid.dataset.sortOrder !== 'asc';
    businessGrid.dataset.sortOrder = isAscending ? 'asc' : 'desc';
    
    cards.sort((a, b) => {
        const priceA = parseInt(a.dataset.price);
        const priceB = parseInt(b.dataset.price);
        return isAscending ? priceA - priceB : priceB - priceA;
    });
    
    // Reorder DOM elements
    cards.forEach(card => businessGrid.appendChild(card));
    
    // Visual feedback
    showSortFeedback(isAscending ? 'Price: Low to High' : 'Price: High to Low');
}

function filterByCategory(category) {
    const businessCards = document.querySelectorAll('.business-card');
    let visibleCount = 0;
    
    businessCards.forEach(card => {
        const cardCategory = card.querySelector('.business-category')?.textContent.toLowerCase() || '';
        
        if (category.includes('budget') && cardCategory.includes('budget')) {
            card.style.display = 'block';
            visibleCount++;
        } else if (category.includes('deluxe') && cardCategory.includes('deluxe')) {
            card.style.display = 'block';
            visibleCount++;
        } else if (category.includes('premium') && cardCategory.includes('premium')) {
            card.style.display = 'block';
            visibleCount++;
        } else if (category.includes('family')) {
            card.style.display = 'block';
            visibleCount++;
        } else if (category.includes('ac')) {
            const hasAC = Array.from(card.querySelectorAll('.amenity-tag')).some(tag => 
                tag.textContent.toLowerCase().includes('ac') || tag.textContent.toLowerCase().includes('air')
            );
            if (hasAC) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        } else if (category === 'all') {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
    showFilterFeedback(category);
}

function showSortFeedback(message) {
    showToast(`Sorted by ${message}`, 'success');
}

function showFilterFeedback(category) {
    showToast(`Filtered by ${category}`, 'info');
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-orange);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Interaction Tracking
function setupInteractionTracking() {
    // Track WhatsApp clicks
    document.querySelectorAll('.whatsapp-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const businessName = this.closest('.business-card').dataset.name;
            trackInteraction('whatsapp_click', businessName);
            console.log(`WhatsApp clicked for: ${businessName}`);
        });
    });
    
    // Track phone calls
    document.querySelectorAll('.call-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const businessName = this.closest('.business-card').dataset.name;
            trackInteraction('phone_click', businessName);
            console.log(`Phone call initiated for: ${businessName}`);
        });
    });
    
    // Track card views
    observeCardViews();
}

function trackInteraction(type, businessName) {
    // Placeholder for analytics tracking
    // In a real app, this would send data to analytics service
    const data = {
        type: type,
        business: businessName,
        timestamp: new Date().toISOString(),
        page: window.location.pathname
    };
    
    // Store in localStorage for demo purposes
    let interactions = JSON.parse(localStorage.getItem('vrindago_interactions') || '[]');
    interactions.push(data);
    localStorage.setItem('vrindago_interactions', JSON.stringify(interactions));
}

function observeCardViews() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const businessName = entry.target.dataset.name;
                trackInteraction('card_view', businessName);
            }
        });
    }, { threshold: 0.7 });
    
    document.querySelectorAll('.business-card').forEach(card => {
        observer.observe(card);
    });
}

// Scroll Animations
function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.business-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
    });
}

// Modal for advanced filters (placeholder)
function showFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'filter-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Filter Options</h3>
                <button onclick="this.closest('.filter-modal').remove()" class="close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                <div class="filter-group">
                    <label>Price Range</label>
                    <input type="range" min="500" max="3000" step="100" value="1500" id="priceRange">
                    <span id="priceValue">₹1,500</span>
                </div>
                <div class="filter-group">
                    <label>Amenities</label>
                    <div class="checkbox-group">
                        <label><input type="checkbox" value="ac"> AC</label>
                        <label><input type="checkbox" value="wifi"> WiFi</label>
                        <label><input type="checkbox" value="parking"> Parking</label>
                        <label><input type="checkbox" value="kitchen"> Kitchen</label>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button onclick="applyFilters()" class="apply-btn">Apply Filters</button>
                <button onclick="clearFilters()" class="clear-btn">Clear All</button>
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    document.body.appendChild(modal);
    
    // Setup price range slider
    const priceRange = modal.querySelector('#priceRange');
    const priceValue = modal.querySelector('#priceValue');
    
    priceRange.addEventListener('input', function() {
        priceValue.textContent = `₹${this.value}`;
    });
}

function applyFilters() {
    // Implementation for applying advanced filters
    showToast('Filters applied successfully', 'success');
    document.querySelector('.filter-modal').remove();
}

function clearFilters() {
    filterByCategory('all');
    showToast('Filters cleared', 'info');
    document.querySelector('.filter-modal').remove();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .modal-content {
        background: white;
        border-radius: 0.75rem;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
    }
    
    .modal-header, .modal-footer {
        padding: 1.5rem;
        border-bottom: 1px solid var(--border-light);
    }
    
    .modal-footer {
        border-bottom: none;
        border-top: 1px solid var(--border-light);
        display: flex;
        gap: 1rem;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .filter-group {
        margin-bottom: 1.5rem;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }
    
    .checkbox-group {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }
    
    .checkbox-group label {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .apply-btn, .clear-btn {
        flex: 1;
        padding: 0.75rem;
        border-radius: 0.5rem;
        border: none;
        cursor: pointer;
    }
    
    .apply-btn {
        background: var(--primary-orange);
        color: white;
    }
    
    .clear-btn {
        background: var(--bg-light);
        color: var(--text-secondary);
    }
    
    .close-btn {
        position: absolute;
        right: 1rem;
        top: 1rem;
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
    }
`;

document.head.appendChild(style);

// January 2026 Offers Banner Functionality
function initializeOffersBanner() {
    // Countdown Timer
    const countdownDate = new Date('January 31, 2026 23:59:59').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countdownDate - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            
            const daysEl = document.getElementById('days');
            const hoursEl = document.getElementById('hours');
            const minutesEl = document.getElementById('minutes');
            
            if (daysEl) daysEl.textContent = days;
            if (hoursEl) hoursEl.textContent = hours;
            if (minutesEl) minutesEl.textContent = minutes;
        } else {
            // Offer expired
            const banner = document.getElementById('offersBanner');
            if (banner) {
                banner.style.display = 'none';
            }
        }
    }
    
    // Update countdown every minute
    updateCountdown();
    setInterval(updateCountdown, 60000);
    
    // Check if banner was previously closed
    const bannerClosed = localStorage.getItem('jan2026OfferBannerClosed');
    if (bannerClosed === 'true') {
        const banner = document.getElementById('offersBanner');
        if (banner) {
            banner.style.display = 'none';
        }
    }
}

// Close banner function
function closeBanner() {
    const banner = document.getElementById('offersBanner');
    if (banner) {
        banner.style.animation = 'slideUp 0.5s ease-out forwards';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 500);
        
        // Remember user closed the banner
        localStorage.setItem('jan2026OfferBannerClosed', 'true');
        
        // Track banner close event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'banner_closed', {
                'banner_name': 'january_2026_offers',
                'event_category': 'user_interaction'
            });
        }
    }
}

// Scroll to rooms function
function scrollToRooms() {
    const roomsSection = document.getElementById('rooms') || document.querySelector('.business-listings');
    if (roomsSection) {
        roomsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Track offer banner click
        if (typeof gtag !== 'undefined') {
            gtag('event', 'offer_banner_click', {
                'banner_name': 'january_2026_offers',
                'event_category': 'conversion'
            });
        }
    }
}

// Add slide up animation
const bannerStyle = document.createElement('style');
bannerStyle.textContent = `
    @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-100%); opacity: 0; }
    }
`;
document.head.appendChild(bannerStyle);

// Initialize banner when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeOffersBanner();
});