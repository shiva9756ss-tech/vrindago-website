// VrindaGo Performance & Business Tracking
// Real-time monitoring of website performance and business metrics

class VrindaGoAnalytics {
    constructor() {
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.trackPageLoad();
        this.trackUserEngagement();
        this.trackBusinessMetrics();
        this.setupHeatmapping();
    }

    // Track page load performance
    trackPageLoad() {
        window.addEventListener('load', () => {
            const loadTime = performance.now() - this.startTime;
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'page_load_time', {
                    'event_category': 'performance',
                    'custom_map': {'metric1': 'load_time'},
                    'metric1': Math.round(loadTime)
                });
            }

            console.log(`VrindaGo: Page loaded in ${Math.round(loadTime)}ms`);
        });
    }

    // Track user engagement patterns
    trackUserEngagement() {
        let scrollDepth = 0;
        let maxScroll = 0;

        // Scroll depth tracking
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                
                // Track milestone scrolls
                if ([25, 50, 75, 90].includes(scrollPercent)) {
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'scroll_depth', {
                            'event_category': 'engagement',
                            'scroll_percent': scrollPercent
                        });
                    }
                }
            }
        });

        // Time on page tracking
        let timeOnPage = 0;
        setInterval(() => {
            timeOnPage += 10;
            
            // Track every 30 seconds
            if (timeOnPage % 30 === 0) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'time_on_page', {
                        'event_category': 'engagement',
                        'time_seconds': timeOnPage
                    });
                }
            }
        }, 10000);
    }

    // Track business-specific metrics
    trackBusinessMetrics() {
        // Track property views
        const propertyCards = document.querySelectorAll('.business-card, .property-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const propertyName = entry.target.dataset.name || 'Unknown Property';
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'property_view', {
                            'event_category': 'business',
                            'property_name': propertyName
                        });
                    }
                }
            });
        }, { threshold: 0.5 });

        propertyCards.forEach(card => observer.observe(card));

        // Track search usage
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    if (e.target.value.length > 2) {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'search', {
                                'event_category': 'engagement',
                                'search_term': e.target.value
                            });
                        }
                    }
                }, 1000);
            });
        }

        // Track filter usage
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'filter_use', {
                        'event_category': 'engagement',
                        'filter_type': btn.textContent.trim()
                    });
                }
            });
        });
    }

    // Simple heatmapping for click tracking
    setupHeatmapping() {
        document.addEventListener('click', (e) => {
            const element = e.target;
            const elementInfo = {
                tag: element.tagName,
                class: element.className,
                id: element.id,
                text: element.textContent?.substring(0, 50) || '',
                x: e.pageX,
                y: e.pageY
            };

            if (typeof gtag !== 'undefined') {
                gtag('event', 'element_click', {
                    'event_category': 'interaction',
                    'element_type': elementInfo.tag,
                    'element_class': elementInfo.class || 'none',
                    'element_id': elementInfo.id || 'none'
                });
            }

            // Log important clicks
            if (element.classList.contains('book-now-btn') || 
                element.classList.contains('contact-btn') ||
                element.classList.contains('whatsapp-float') ||
                element.tagName === 'A') {
                console.log('VrindaGo: Important click tracked:', elementInfo);
            }
        });
    }

    // Manual business event tracking
    trackBusinessEvent(eventType, data = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', eventType, {
                'event_category': 'business',
                ...data
            });
        }
        
        console.log(`VrindaGo Business Event: ${eventType}`, data);
    }

    // Get basic performance metrics
    getPerformanceMetrics() {
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
            pageLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
            firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime || 0,
            firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
        };
    }
}

// Initialize analytics when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.vrindaGoAnalytics = new VrindaGoAnalytics();
    
    // Add to global scope for manual tracking
    window.trackBusinessEvent = (eventType, data) => {
        window.vrindaGoAnalytics.trackBusinessEvent(eventType, data);
    };

    console.log('VrindaGo Analytics initialized successfully! 📊');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VrindaGoAnalytics;
}