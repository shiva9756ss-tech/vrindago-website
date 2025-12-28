// ===================================
//   VrindaGo™ - Advanced Search & Filter System
//   Live Search, Price Range, Location & Amenity Filtering
// ===================================

class VrindaGoSearchSystem {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.activeFilters = {
            search: '',
            priceRange: { min: 500, max: 5000 },
            location: '',
            amenities: []
        };
        this.init();
    }

    init() {
        this.loadProperties();
        this.bindEvents();
        this.initPriceSliders();
    }

    // Load property data from DOM elements
    loadProperties() {
        const businessCards = document.querySelectorAll('.business-card[data-name]');
        this.properties = Array.from(businessCards).map((card, index) => ({
            id: index,
            element: card,
            name: card.getAttribute('data-name') || '',
            price: parseInt(card.getAttribute('data-price')) || 0,
            location: card.getAttribute('data-location') || '',
            amenities: this.extractAmenities(card),
            rating: this.extractRating(card),
            category: this.extractCategory(card)
        }));
        this.filteredProperties = [...this.properties];
        this.updateResultsCount();
    }

    // Extract amenities from card HTML
    extractAmenities(card) {
        const amenities = [];
        const amenityElements = card.querySelectorAll('.amenity-tag');
        amenityElements.forEach(amenity => {
            const text = amenity.textContent.toLowerCase();
            if (text.includes('ac')) amenities.push('ac');
            if (text.includes('wifi')) amenities.push('wifi');
            if (text.includes('parking')) amenities.push('parking');
            if (text.includes('prasadam')) amenities.push('prasadam');
            if (text.includes('temple') || text.includes('view')) amenities.push('temple-view');
        });
        return amenities;
    }

    // Extract rating from card HTML
    extractRating(card) {
        const ratingElement = card.querySelector('.rating-badge');
        if (ratingElement) {
            const ratingText = ratingElement.textContent;
            const rating = parseFloat(ratingText.replace(/[^\d.]/g, ''));
            return isNaN(rating) ? 0 : rating;
        }
        return 0;
    }

    // Extract category from card HTML
    extractCategory(card) {
        const categoryElement = card.querySelector('.business-category');
        return categoryElement ? categoryElement.textContent.toLowerCase() : '';
    }

    // Bind event listeners
    bindEvents() {
        // Toggle advanced filters
        const toggleBtn = document.getElementById('toggleAdvancedFilters');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleAdvancedFilters());
        }

        // Live search
        const searchInput = document.getElementById('liveSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleLiveSearch(e.target.value));
        }

        // Location filter
        const locationFilter = document.getElementById('locationFilter');
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => this.handleLocationFilter(e.target.value));
        }

        // Amenity checkboxes
        const amenityCheckboxes = document.querySelectorAll('.amenity-checkbox');
        amenityCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleAmenityFilter());
        });

        // Price sliders
        const minPriceSlider = document.getElementById('minPrice');
        const maxPriceSlider = document.getElementById('maxPrice');
        if (minPriceSlider && maxPriceSlider) {
            minPriceSlider.addEventListener('input', () => this.updatePriceRange());
            maxPriceSlider.addEventListener('input', () => this.updatePriceRange());
        }
    }

    // Initialize price range sliders
    initPriceSliders() {
        this.updatePriceDisplay();
        this.updatePriceRange();
    }

    // Toggle advanced filters panel
    toggleAdvancedFilters() {
        const panel = document.getElementById('advancedSearchPanel');
        if (panel) {
            const isHidden = panel.style.display === 'none';
            panel.style.display = isHidden ? 'block' : 'none';
            
            // Update button text
            const btn = document.getElementById('toggleAdvancedFilters');
            const icon = btn.querySelector('i');
            icon.className = isHidden ? 'fas fa-times' : 'fas fa-sliders-h';
        }
    }

    // Handle live search
    handleLiveSearch(searchTerm) {
        this.activeFilters.search = searchTerm.toLowerCase();
        this.applyFilters();
        this.updateActiveFilters();
    }

    // Handle location filter
    handleLocationFilter(location) {
        this.activeFilters.location = location;
        this.applyFilters();
        this.updateActiveFilters();
    }

    // Handle amenity filter
    handleAmenityFilter() {
        const checkedAmenities = [];
        const checkboxes = document.querySelectorAll('.amenity-checkbox:checked');
        checkboxes.forEach(checkbox => {
            checkedAmenities.push(checkbox.value);
        });
        this.activeFilters.amenities = checkedAmenities;
        this.applyFilters();
        this.updateActiveFilters();
    }

    // Update price range
    updatePriceRange() {
        const minSlider = document.getElementById('minPrice');
        const maxSlider = document.getElementById('maxPrice');
        
        let minVal = parseInt(minSlider.value);
        let maxVal = parseInt(maxSlider.value);
        
        // Ensure min is not greater than max
        if (minVal >= maxVal) {
            minVal = maxVal - 100;
            minSlider.value = minVal;
        }
        
        this.activeFilters.priceRange.min = minVal;
        this.activeFilters.priceRange.max = maxVal;
        
        this.updatePriceDisplay();
        this.applyFilters();
        this.updateActiveFilters();
    }

    // Update price display
    updatePriceDisplay() {
        const minDisplay = document.getElementById('minPriceValue');
        const maxDisplay = document.getElementById('maxPriceValue');
        if (minDisplay && maxDisplay) {
            minDisplay.textContent = this.activeFilters.priceRange.min;
            maxDisplay.textContent = this.activeFilters.priceRange.max;
        }
    }

    // Apply all filters
    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // Search filter
            if (this.activeFilters.search && !this.matchesSearch(property, this.activeFilters.search)) {
                return false;
            }
            
            // Price filter
            if (property.price < this.activeFilters.priceRange.min || 
                property.price > this.activeFilters.priceRange.max) {
                return false;
            }
            
            // Location filter
            if (this.activeFilters.location && 
                !property.location.toLowerCase().includes(this.activeFilters.location.toLowerCase())) {
                return false;
            }
            
            // Amenities filter
            if (this.activeFilters.amenities.length > 0) {
                const hasAllAmenities = this.activeFilters.amenities.every(amenity => 
                    property.amenities.includes(amenity)
                );
                if (!hasAllAmenities) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.updateDisplay();
        this.updateResultsCount();
    }

    // Check if property matches search term
    matchesSearch(property, searchTerm) {
        const searchFields = [
            property.name,
            property.location,
            property.category,
            ...property.amenities
        ].join(' ').toLowerCase();
        
        return searchFields.includes(searchTerm);
    }

    // Update display to show/hide filtered properties
    updateDisplay() {
        this.properties.forEach(property => {
            const isVisible = this.filteredProperties.includes(property);
            property.element.classList.toggle('filtered-out', !isVisible);
            
            if (isVisible && this.activeFilters.search) {
                property.element.classList.add('highlighted');
            } else {
                property.element.classList.remove('highlighted');
            }
        });
    }

    // Update results count
    updateResultsCount() {
        const countElement = document.getElementById('resultCount');
        if (countElement) {
            countElement.textContent = this.filteredProperties.length;
        }
    }

    // Update active filters display
    updateActiveFilters() {
        const activeFiltersContainer = document.getElementById('activeFilters');
        const filterTagsContainer = document.getElementById('filterTags');
        
        if (!activeFiltersContainer || !filterTagsContainer) return;
        
        const tags = [];
        
        // Search filter tag
        if (this.activeFilters.search) {
            tags.push({
                type: 'search',
                text: `Search: "${this.activeFilters.search}"`,
                value: this.activeFilters.search
            });
        }
        
        // Price filter tag
        if (this.activeFilters.priceRange.min > 500 || this.activeFilters.priceRange.max < 5000) {
            tags.push({
                type: 'price',
                text: `₹${this.activeFilters.priceRange.min} - ₹${this.activeFilters.priceRange.max}`,
                value: 'price'
            });
        }
        
        // Location filter tag
        if (this.activeFilters.location) {
            tags.push({
                type: 'location',
                text: `Location: ${this.activeFilters.location}`,
                value: this.activeFilters.location
            });
        }
        
        // Amenity filter tags
        this.activeFilters.amenities.forEach(amenity => {
            tags.push({
                type: 'amenity',
                text: amenity.charAt(0).toUpperCase() + amenity.slice(1),
                value: amenity
            });
        });
        
        // Update display
        if (tags.length > 0) {
            filterTagsContainer.innerHTML = tags.map(tag => `
                <span class="filter-tag" data-type="${tag.type}" data-value="${tag.value}">
                    ${tag.text}
                    <button class="remove-tag" onclick="searchSystem.removeFilter('${tag.type}', '${tag.value}')">
                        <i class="fas fa-times"></i>
                    </button>
                </span>
            `).join('');
            activeFiltersContainer.style.display = 'block';
        } else {
            activeFiltersContainer.style.display = 'none';
        }
    }

    // Remove individual filter
    removeFilter(type, value) {
        switch (type) {
            case 'search':
                document.getElementById('liveSearch').value = '';
                this.activeFilters.search = '';
                break;
            case 'price':
                document.getElementById('minPrice').value = 500;
                document.getElementById('maxPrice').value = 5000;
                this.activeFilters.priceRange = { min: 500, max: 5000 };
                this.updatePriceDisplay();
                break;
            case 'location':
                document.getElementById('locationFilter').value = '';
                this.activeFilters.location = '';
                break;
            case 'amenity':
                const checkbox = document.querySelector(`input[value="${value}"]`);
                if (checkbox) checkbox.checked = false;
                this.activeFilters.amenities = this.activeFilters.amenities.filter(a => a !== value);
                break;
        }
        this.applyFilters();
        this.updateActiveFilters();
    }

    // Clear all filters
    clearAllFilters() {
        // Reset search
        document.getElementById('liveSearch').value = '';
        this.activeFilters.search = '';
        
        // Reset price range
        document.getElementById('minPrice').value = 500;
        document.getElementById('maxPrice').value = 5000;
        this.activeFilters.priceRange = { min: 500, max: 5000 };
        this.updatePriceDisplay();
        
        // Reset location
        document.getElementById('locationFilter').value = '';
        this.activeFilters.location = '';
        
        // Reset amenities
        document.querySelectorAll('.amenity-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        this.activeFilters.amenities = [];
        
        this.applyFilters();
        this.updateActiveFilters();
    }

    // Sort properties
    sortProperties(sortBy) {
        switch (sortBy) {
            case 'price':
                this.filteredProperties.sort((a, b) => a.price - b.price);
                break;
            case 'rating':
                this.filteredProperties.sort((a, b) => b.rating - a.rating);
                break;
        }
        this.reorderElements();
    }

    // Filter by location proximity
    filterByLocation(type) {
        if (type === 'temple') {
            const templeLocations = ['raman-reti', 'loi-bazaar'];
            this.filteredProperties = this.properties.filter(property =>
                templeLocations.some(loc => property.location.toLowerCase().includes(loc))
            );
            this.updateDisplay();
            this.updateResultsCount();
        }
    }

    // Reorder DOM elements based on filtered array
    reorderElements() {
        const container = document.querySelector('.business-grid');
        if (!container) return;
        
        // Remove all property elements
        this.properties.forEach(property => {
            property.element.remove();
        });
        
        // Add filtered properties in new order
        this.filteredProperties.forEach(property => {
            container.appendChild(property.element);
        });
        
        // Add remaining non-filtered properties at the end
        const remainingProperties = this.properties.filter(p => !this.filteredProperties.includes(p));
        remainingProperties.forEach(property => {
            container.appendChild(property.element);
        });
    }

    // Switch view between grid and list
    switchView(viewType) {
        const container = document.querySelector('.business-grid');
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');
        
        if (viewType === 'list') {
            container.classList.add('list-view');
            gridBtn.classList.remove('active');
            listBtn.classList.add('active');
        } else {
            container.classList.remove('list-view');
            listBtn.classList.remove('active');
            gridBtn.classList.add('active');
        }
    }
}

// Global functions for button onclick events
function sortProperties(type) {
    if (window.searchSystem) {
        window.searchSystem.sortProperties(type);
    }
}

function filterByLocation(type) {
    if (window.searchSystem) {
        window.searchSystem.filterByLocation(type);
    }
}

function clearAllFilters() {
    if (window.searchSystem) {
        window.searchSystem.clearAllFilters();
    }
}

function applyFilters() {
    if (window.searchSystem) {
        window.searchSystem.applyFilters();
    }
}

function switchView(type) {
    if (window.searchSystem) {
        window.searchSystem.switchView(type);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.searchSystem = new VrindaGoSearchSystem();
    
    // Add some sample data attributes to existing cards if they don't have them
    const cards = document.querySelectorAll('.business-card:not([data-name])');
    const sampleData = [
        { name: 'MVT Guest House', price: 1200, location: 'Raman Reti' },
        { name: 'Krishna Villa', price: 800, location: 'Loi Bazaar' },
        { name: 'Vrindavan Heritage', price: 2000, location: 'Mathura' },
        { name: 'Temple View Rooms', price: 1500, location: 'Govardhan' },
        { name: 'Radha Guest House', price: 900, location: 'Nandgaon' },
        { name: 'Spiritual Stays', price: 1800, location: 'Barsana' }
    ];
    
    cards.forEach((card, index) => {
        if (sampleData[index]) {
            card.setAttribute('data-name', sampleData[index].name);
            card.setAttribute('data-price', sampleData[index].price);
            card.setAttribute('data-location', sampleData[index].location);
        }
    });
    
    // Reload properties after adding data attributes
    if (window.searchSystem) {
        window.searchSystem.loadProperties();
    }
});

// Auto-hide advanced panel on mobile
window.addEventListener('resize', () => {
    if (window.innerWidth < 768) {
        const panel = document.getElementById('advancedSearchPanel');
        if (panel && panel.style.display === 'block') {
            panel.style.display = 'none';
            const btn = document.getElementById('toggleAdvancedFilters');
            const icon = btn.querySelector('i');
            icon.className = 'fas fa-sliders-h';
        }
    }
});