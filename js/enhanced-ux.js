// ===================================
//   VrindaGo™ - Enhanced User Experience & Travel Guide
//   Theme Toggle, Language Switch, Voice Search, Favorites & Weather
// ===================================

class VrindaGoEnhancedUX {
    constructor() {
        this.currentTheme = localStorage.getItem('vrindago-theme') || 'light';
        this.currentLanguage = localStorage.getItem('vrindago-language') || 'en';
        this.favorites = JSON.parse(localStorage.getItem('vrindago-favorites')) || [];
        this.isListening = false;
        this.recognition = null;
        this.translations = {};
        this.init();
    }

    init() {
        this.initTheme();
        this.initLanguage();
        this.initVoiceSearch();
        this.initFavorites();
        this.initWeather();
        this.bindEvents();
        this.loadTranslations();
    }

    // Initialize theme system
    initTheme() {
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        this.updateThemeIcon();
    }

    // Initialize language system
    initLanguage() {
        this.updateLanguageDisplay();
        this.applyLanguage();
    }

    // Initialize voice search
    initVoiceSearch() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';

            this.recognition.onstart = () => {
                this.isListening = true;
                this.updateVoiceIcon();
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.handleVoiceResult(transcript);
            };

            this.recognition.onend = () => {
                this.isListening = false;
                this.updateVoiceIcon();
            };

            this.recognition.onerror = (event) => {
                this.isListening = false;
                this.updateVoiceIcon();
                console.error('Voice recognition error:', event.error);
            };
        }
    }

    // Initialize favorites system
    initFavorites() {
        this.updateFavoritesCount();
        this.addFavoriteButtons();
        this.renderFavoritesList();
    }

    // Initialize weather widget
    initWeather() {
        this.fetchWeather();
    }

    // Load translation data
    loadTranslations() {
        this.translations = {
            en: {
                search: 'Search properties, locations, amenities...',
                travelGuide: 'Travel Guide',
                exploreVrindavan: 'Explore Vrindavan & Mathura',
                completeGuide: 'Complete guide for pilgrims and travelers',
                templeGuide: 'Temple Guide',
                iskconTemple: 'ISKCON Temple',
                premMandir: 'Prem Mandir',
                bankebihari: 'Banke Bihari Temple',
                krishnaBalaram: 'Krishna Balaram Temple',
                ramanReti: 'Raman Reti, Vrindavan',
                vrindavan: 'Vrindavan',
                festivalCalendar: 'Festival Calendar 2025',
                jan: 'Jan', mar: 'Mar', aug: 'Aug', oct: 'Oct',
                makarSankranti: 'Makar Sankranti',
                kiteFlying: 'Kite flying and traditional sweets',
                holi: 'Holi Festival',
                colorFestival: 'Colors and joy celebration',
                janmashtami: 'Krishna Janmashtami',
                krishnaBirthday: 'Lord Krishna\'s birthday',
                karvaChauth: 'Karva Chauth',
                fastingDay: 'Fasting for husband\'s long life',
                viewAllFestivals: 'View Full Calendar',
                localTips: 'Local Tips',
                bestTime: 'Best Time to Visit',
                bestTimeDesc: 'October to March for pleasant weather',
                dressCode: 'Dress Code',
                dressCodeDesc: 'Modest clothing required in temples',
                localFood: 'Local Food',
                localFoodDesc: 'Try Mathura ke Pede and temple prasadam',
                photography: 'Photography',
                photographyDesc: 'Check temple rules before taking photos',
                currentWeather: 'Current Weather',
                loadingWeather: 'Loading weather...',
                humidity: 'Humidity',
                wind: 'Wind',
                mathuraVrindavan: 'Mathura, Vrindavan',
                weatherError: 'Weather data unavailable',
                myFavorites: 'My Favorite Properties',
                noFavorites: 'No favorites yet',
                addFavorites: 'Add properties to your favorites by clicking the heart icon'
            },
            hi: {
                search: 'संपत्ति, स्थान, सुविधाएं खोजें...',
                travelGuide: 'यात्रा गाइड',
                exploreVrindavan: 'वृंदावन और मथुरा का अन्वेषण करें',
                completeGuide: 'तीर्थयात्रियों और यात्रियों के लिए संपूर्ण गाइड',
                templeGuide: 'मंदिर गाइड',
                iskconTemple: 'इस्कॉन मंदिर',
                premMandir: 'प्रेम मंदिर',
                bankebihari: 'बांके बिहारी मंदिर',
                krishnaBalaram: 'कृष्ण बलराम मंदिर',
                ramanReti: 'रमन रेती, वृंदावन',
                vrindavan: 'वृंदावन',
                festivalCalendar: 'त्योहार कैलेंडर 2025',
                jan: 'जन', mar: 'मार्च', aug: 'अग', oct: 'अक्टू',
                makarSankranti: 'मकर संक्रांति',
                kiteFlying: 'पतंगबाजी और पारंपरिक मिठाई',
                holi: 'होली त्योहार',
                colorFestival: 'रंग और आनंद का उत्सव',
                janmashtami: 'कृष्ण जन्माष्टमी',
                krishnaBirthday: 'भगवान कृष्ण का जन्मदिन',
                karvaChauth: 'करवा चौथ',
                fastingDay: 'पति की लंबी उम्र के लिए व्रत',
                viewAllFestivals: 'पूरा कैलेंडर देखें',
                localTips: 'स्थानीय सुझाव',
                bestTime: 'यात्रा का सबसे अच्छा समय',
                bestTimeDesc: 'सुखद मौसम के लिए अक्टूबर से मार्च',
                dressCode: 'ड्रेस कोड',
                dressCodeDesc: 'मंदिरों में शालीन पोशाक आवश्यक',
                localFood: 'स्थानीय भोजन',
                localFoodDesc: 'मथुरा के पेड़े और मंदिर का प्रसादम आज़माएं',
                photography: 'फोटोग्राफी',
                photographyDesc: 'फ़ोटो लेने से पहले मंदिर के नियम जांच लें',
                currentWeather: 'वर्तमान मौसम',
                loadingWeather: 'मौसम लोड हो रहा है...',
                humidity: 'आर्द्रता',
                wind: 'हवा',
                mathuraVrindavan: 'मथुरा, वृंदावन',
                weatherError: 'मौसम डेटा उपलब्ध नहीं',
                myFavorites: 'मेरी पसंदीदा संपत्ति',
                noFavorites: 'अभी तक कोई पसंदीदा नहीं',
                addFavorites: 'हृदय आइकन पर क्लिक करके संपत्ति को पसंदीदा में जोड़ें'
            }
        };
    }

    // Bind event listeners
    bindEvents() {
        // Theme toggle
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // Language toggle
        const languageToggle = document.getElementById('languageToggle');
        if (languageToggle) {
            languageToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Voice search buttons
        const voiceSearch = document.getElementById('voiceSearch');
        const voiceSearchBtn = document.getElementById('voiceSearchBtn');
        if (voiceSearch) {
            voiceSearch.addEventListener('click', () => this.toggleVoiceSearch());
        }
        if (voiceSearchBtn) {
            voiceSearchBtn.addEventListener('click', () => this.toggleVoiceSearch());
        }

        // Favorites button
        const favoritesBtn = document.getElementById('favoritesBtn');
        if (favoritesBtn) {
            favoritesBtn.addEventListener('click', () => this.toggleFavoritesPanel());
        }

        // Close favorites panel
        const closeFavorites = document.getElementById('closeFavorites');
        if (closeFavorites) {
            closeFavorites.addEventListener('click', () => this.closeFavoritesPanel());
        }

        // Festival view all button
        const viewAllFestivals = document.querySelector('.view-all-festivals');
        if (viewAllFestivals) {
            viewAllFestivals.addEventListener('click', () => this.showFestivalCalendar());
        }
    }

    // Theme toggle functionality
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem('vrindago-theme', this.currentTheme);
        document.body.classList.toggle('dark-theme', this.currentTheme === 'dark');
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const themeIcon = document.getElementById('themeIcon');
        if (themeIcon) {
            themeIcon.className = this.currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    // Language toggle functionality
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'hi' : 'en';
        localStorage.setItem('vrindago-language', this.currentLanguage);
        this.updateLanguageDisplay();
        this.applyLanguage();
        
        // Update voice recognition language
        if (this.recognition) {
            this.recognition.lang = this.currentLanguage === 'hi' ? 'hi-IN' : 'en-US';
        }
    }

    updateLanguageDisplay() {
        const languageText = document.getElementById('languageText');
        if (languageText) {
            languageText.textContent = this.currentLanguage === 'en' ? 'हिं' : 'EN';
        }
    }

    applyLanguage() {
        const translations = this.translations[this.currentLanguage];
        if (!translations) return;

        document.querySelectorAll('[data-lang-key]').forEach(element => {
            const key = element.getAttribute('data-lang-key');
            if (translations[key]) {
                if (element.tagName === 'INPUT') {
                    element.placeholder = translations[key];
                } else {
                    element.textContent = translations[key];
                }
            }
        });
    }

    // Voice search functionality
    toggleVoiceSearch() {
        if (!this.recognition) {
            alert('Voice search is not supported in this browser');
            return;
        }

        if (this.isListening) {
            this.recognition.stop();
        } else {
            this.recognition.start();
        }
    }

    updateVoiceIcon() {
        const voiceIcon = document.getElementById('voiceIcon');
        const voiceSearchIcon = document.getElementById('voiceSearchIcon');
        const voiceBtn = document.getElementById('voiceSearchBtn');
        
        const iconClass = this.isListening ? 'fas fa-stop' : 'fas fa-microphone';
        const btnClass = this.isListening ? 'listening' : '';
        
        if (voiceIcon) voiceIcon.className = iconClass;
        if (voiceSearchIcon) voiceSearchIcon.className = iconClass;
        if (voiceBtn) {
            voiceBtn.className = `voice-search-btn ${btnClass}`;
        }
    }

    handleVoiceResult(transcript) {
        const searchInput = document.getElementById('liveSearch');
        if (searchInput && window.searchSystem) {
            searchInput.value = transcript;
            window.searchSystem.handleLiveSearch(transcript.toLowerCase());
        }
    }

    // Favorites functionality
    addFavoriteButtons() {
        document.querySelectorAll('.business-card:not([data-favorite-added])').forEach(card => {
            if (!card.querySelector('.favorite-btn')) {
                const propertyId = card.getAttribute('data-name')?.toLowerCase().replace(/\\s+/g, '-') || 'property';
                const favoriteBtn = document.createElement('button');
                favoriteBtn.className = 'favorite-btn';
                favoriteBtn.setAttribute('data-property-id', propertyId);
                favoriteBtn.title = 'Add to Favorites';
                favoriteBtn.innerHTML = '<i class=\"far fa-heart\"></i>';
                
                favoriteBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.toggleFavorite(propertyId, card);
                });
                
                card.appendChild(favoriteBtn);
                card.setAttribute('data-favorite-added', 'true');
                
                // Update button state
                this.updateFavoriteButton(favoriteBtn, propertyId);
            }
        });
    }

    toggleFavorite(propertyId, card) {
        const index = this.favorites.findIndex(fav => fav.id === propertyId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            const propertyData = this.extractPropertyData(card);
            this.favorites.push({ id: propertyId, ...propertyData });
        }
        
        localStorage.setItem('vrindago-favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.updateFavoriteButton(card.querySelector('.favorite-btn'), propertyId);
        this.renderFavoritesList();
    }

    extractPropertyData(card) {
        const nameElement = card.querySelector('.business-title');
        const locationElement = card.querySelector('.business-location');
        const priceElement = card.querySelector('.business-price');
        const imageElement = card.querySelector('.business-img');
        const ratingElement = card.querySelector('.rating-badge');
        
        return {
            name: nameElement?.textContent || '',
            location: locationElement?.textContent || '',
            price: priceElement?.textContent || '',
            image: imageElement?.src || '',
            rating: ratingElement?.textContent || ''
        };
    }

    updateFavoriteButton(button, propertyId) {
        const isFavorited = this.favorites.some(fav => fav.id === propertyId);
        const icon = button.querySelector('i');
        
        button.classList.toggle('favorited', isFavorited);
        icon.className = isFavorited ? 'fas fa-heart' : 'far fa-heart';
        button.title = isFavorited ? 'Remove from Favorites' : 'Add to Favorites';
    }

    updateFavoritesCount() {
        const countElement = document.getElementById('favoritesCount');
        if (countElement) {
            countElement.textContent = this.favorites.length;
            countElement.classList.toggle('show', this.favorites.length > 0);
        }
    }

    toggleFavoritesPanel() {
        const panel = document.getElementById('favoritesPanel');
        if (panel) {
            panel.classList.toggle('open');
        }
    }

    closeFavoritesPanel() {
        const panel = document.getElementById('favoritesPanel');
        if (panel) {
            panel.classList.remove('open');
        }
    }

    renderFavoritesList() {
        const favoritesList = document.getElementById('favoritesList');
        const favoritesEmpty = document.getElementById('favoritesEmpty');
        
        if (!favoritesList || !favoritesEmpty) return;

        if (this.favorites.length === 0) {
            favoritesEmpty.style.display = 'block';
            favoritesList.style.display = 'none';
        } else {
            favoritesEmpty.style.display = 'none';
            favoritesList.style.display = 'block';
            
            favoritesList.innerHTML = this.favorites.map(fav => `
                <div class=\"favorite-item\">
                    <img src=\"${fav.image}\" alt=\"${fav.name}\" class=\"favorite-image\">
                    <div class=\"favorite-info\">
                        <h4>${fav.name}</h4>
                        <p>${fav.location}</p>
                        <span class=\"favorite-price\">${fav.price}</span>
                        <button class=\"remove-favorite\" onclick=\"enhancedUX.removeFavorite('${fav.id}')\">
                            <i class=\"fas fa-times\"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    removeFavorite(propertyId) {
        this.favorites = this.favorites.filter(fav => fav.id !== propertyId);
        localStorage.setItem('vrindago-favorites', JSON.stringify(this.favorites));
        this.updateFavoritesCount();
        this.renderFavoritesList();
        
        // Update button in main list
        const button = document.querySelector(`[data-property-id=\"${propertyId}\"]`);
        if (button) {
            this.updateFavoriteButton(button, propertyId);
        }
    }

    // Weather functionality
    async fetchWeather() {
        const weatherDisplay = document.getElementById('weatherDisplay');
        if (!weatherDisplay) return;

        try {
            // Using a simple mock weather data for demonstration
            // In production, you would use a real weather API like OpenWeatherMap
            const weatherData = await this.getMockWeatherData();
            this.displayWeather(weatherData);
        } catch (error) {
            this.displayWeatherError();
        }
    }

    async getMockWeatherData() {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock weather data for Mathura/Vrindavan
        const temp = Math.round(15 + Math.random() * 20); // 15-35°C
        const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Sunny'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        
        return {
            temperature: temp,
            description: condition,
            humidity: Math.round(40 + Math.random() * 40), // 40-80%
            windSpeed: Math.round(5 + Math.random() * 15) // 5-20 km/h
        };
    }

    displayWeather(data) {
        const weatherDisplay = document.getElementById('weatherDisplay');
        const weatherLoading = weatherDisplay.querySelector('.weather-loading');
        const weatherInfo = weatherDisplay.querySelector('.weather-info');
        const weatherError = weatherDisplay.querySelector('.weather-error');
        
        weatherLoading.style.display = 'none';
        weatherError.style.display = 'none';
        weatherInfo.style.display = 'block';
        
        document.getElementById('tempValue').textContent = data.temperature;
        document.getElementById('weatherDesc').textContent = data.description;
        document.getElementById('humidityValue').textContent = `${data.humidity}%`;
        document.getElementById('windValue').textContent = `${data.windSpeed} km/h`;
    }

    displayWeatherError() {
        const weatherDisplay = document.getElementById('weatherDisplay');
        const weatherLoading = weatherDisplay.querySelector('.weather-loading');
        const weatherInfo = weatherDisplay.querySelector('.weather-info');
        const weatherError = weatherDisplay.querySelector('.weather-error');
        
        weatherLoading.style.display = 'none';
        weatherInfo.style.display = 'none';
        weatherError.style.display = 'block';
    }

    // Festival calendar functionality
    showFestivalCalendar() {
        // This would open a detailed festival calendar modal or page
        alert(this.currentLanguage === 'hi' ? 
            'पूर्ण त्योहार कैलेंडर जल्द ही उपलब्ध होगा!' : 
            'Full festival calendar coming soon!');
    }
}

// Global functions for button onclick events
function toggleFavorite(propertyId) {
    if (window.enhancedUX) {
        const card = document.querySelector(`[data-property-id=\"${propertyId}\"]`).closest('.business-card');
        window.enhancedUX.toggleFavorite(propertyId, card);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedUX = new VrindaGoEnhancedUX();
    
    // Initialize favorites on existing cards
    setTimeout(() => {
        if (window.enhancedUX) {
            window.enhancedUX.addFavoriteButtons();
        }
    }, 500);
});

// Add observer for dynamically added content
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && window.enhancedUX) {
            window.enhancedUX.addFavoriteButtons();
        }
    });
});

// Start observing
if (document.querySelector('.business-grid')) {
    observer.observe(document.querySelector('.business-grid'), {
        childList: true,
        subtree: true
    });
}