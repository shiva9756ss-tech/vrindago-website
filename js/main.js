/**
 * VrindaGo Website JavaScript
 * Vanilla JavaScript for mobile menu, form handling, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // ===================================
    // MOBILE NAVIGATION
    // ===================================
    
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            // Toggle navigation menu
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // Close menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // ===================================
    // SMOOTH SCROLLING
    // ===================================
    
    // Handle anchor links for smooth scrolling
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip empty anchors or just #
            if (href === '#' || href === '') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                // Calculate offset for fixed header
                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===================================
    // FORM HANDLING
    // ===================================
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'contact');
        });
    }
    
    // Guide Interest Form
    const guideInterestForm = document.getElementById('guideInterestForm');
    if (guideInterestForm) {
        guideInterestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'guide-interest');
        });
    }
    
    // Host Interest Form
    const hostInterestForm = document.getElementById('hostInterestForm');
    if (hostInterestForm) {
        hostInterestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'host-interest');
        });
    }
    
    // Traveler Interest Form
    const travelerInterestForm = document.getElementById('travelerInterestForm');
    if (travelerInterestForm) {
        travelerInterestForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmission(this, 'traveler-interest');
        });
    }
    
    /**
     * Handle form submission
     * @param {HTMLFormElement} form - The form element
     * @param {string} formType - Type of form being submitted
     */
    function handleFormSubmission(form, formType) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Disable button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';
        submitButton.style.opacity = '0.7';
        
        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (!validateFormData(data, formType)) {
            // Reset button state
            resetSubmitButton(submitButton, originalButtonText);
            return;
        }
        
        // Simulate form submission (since there's no backend)
        setTimeout(() => {
            // Show success message
            showSuccessMessage(form, formType);
            
            // Reset form
            form.reset();
            
            // Reset button state
            resetSubmitButton(submitButton, originalButtonText);
            
            // Log data (for development purposes)
            console.log('Form submitted:', formType, data);
        }, 1500);
    }
    
    /**
     * Validate form data
     * @param {Object} data - Form data object
     * @param {string} formType - Type of form
     * @returns {boolean} - Validation result
     */
    function validateFormData(data, formType) {
        let isValid = true;
        const errors = [];
        
        // Contact Form Validation
        if (formType === 'contact') {
            if (!data.contactName?.trim()) {
                errors.push('Name is required');
                isValid = false;
            }
            
            if (!data.contactEmail?.trim() || !isValidEmail(data.contactEmail)) {
                errors.push('Valid email address is required');
                isValid = false;
            }
            
            if (!data.contactMessage?.trim()) {
                errors.push('Message is required');
                isValid = false;
            }
        }
        
        // Guide Interest Form Validation
        else if (formType === 'guide-interest') {
            if (!data.guideName?.trim()) {
                errors.push('Name is required');
                isValid = false;
            }
            
            if (!data.guidePhone?.trim()) {
                errors.push('Phone number is required');
                isValid = false;
            }
            
            if (!data.guideCity) {
                errors.push('City is required');
                isValid = false;
            }
            
            if (!data.guideLanguages?.trim()) {
                errors.push('Languages spoken is required');
                isValid = false;
            }
        }
        
        // Host Interest Form Validation
        else if (formType === 'host-interest') {
            if (!data.hostName?.trim()) {
                errors.push('Name is required');
                isValid = false;
            }
            
            if (!data.hostPhone?.trim()) {
                errors.push('Phone number is required');
                isValid = false;
            }
            
            if (!data.hostCity) {
                errors.push('City is required');
                isValid = false;
            }
            
            if (!data.propertyType) {
                errors.push('Property type is required');
                isValid = false;
            }
        }
        
        // Traveler Interest Form Validation
        else if (formType === 'traveler-interest') {
            if (!data.travelerName?.trim()) {
                errors.push('Name is required');
                isValid = false;
            }
            
            if (!data.travelerEmail?.trim() || !isValidEmail(data.travelerEmail)) {
                errors.push('Valid email address is required');
                isValid = false;
            }
        }
        
        // Show validation errors
        if (!isValid) {
            showErrorMessage(errors);
        }
        
        return isValid;
    }
    
    /**
     * Validate email address
     * @param {string} email - Email address to validate
     * @returns {boolean} - Validation result
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Reset submit button to original state
     * @param {HTMLElement} button - Submit button element
     * @param {string} originalText - Original button text
     */
    function resetSubmitButton(button, originalText) {
        button.disabled = false;
        button.textContent = originalText;
        button.style.opacity = '1';
    }
    
    /**
     * Show success message
     * @param {HTMLFormElement} form - Form element
     * @param {string} formType - Type of form
     */
    function showSuccessMessage(form, formType) {
        // Standardized success message for all forms
        const message = 'Thank you! We will contact you soon.';
        showNotification(message, 'success');
    }
    
    /**
     * Show error message
     * @param {Array} errors - Array of error messages
     */
    function showErrorMessage(errors) {
        const message = 'Please fix the following errors:\n• ' + errors.join('\n• ');
        showNotification(message, 'error');
    }
    
    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {string} type - Type of notification ('success' or 'error')
     */
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <p>${message.replace(/\n/g, '<br>')}</p>
                <button class="notification-close" aria-label="Close notification">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            padding: 1rem;
            border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0,0,0,0.15);
            background: ${type === 'success' ? '#4CAF50' : '#f44336'};
            color: white;
            transform: translateX(420px);
            transition: transform 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Handle close button
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            hideNotification(notification);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                hideNotification(notification);
            }
        }, 5000);
    }
    
    /**
     * Hide notification
     * @param {HTMLElement} notification - Notification element
     */
    function hideNotification(notification) {
        notification.style.transform = 'translateX(420px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 300);
    }
    
    // ===================================
    // SCROLL TO TOP
    // ===================================
    
    // Create scroll to top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '↑';
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.setAttribute('aria-label', 'Scroll to top');
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        width: 50px;
        height: 50px;
        border: none;
        border-radius: 50%;
        background: #1B4F8C;
        color: white;
        font-size: 20px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
            scrollToTopButton.style.transform = 'translateY(0)';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
            scrollToTopButton.style.transform = 'translateY(20px)';
        }
    });
    
    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===================================
    // CTA BUTTON HANDLERS
    // ===================================
    
    // Handle "Get the App" buttons (for remaining placeholder links)
    const getAppButtons = document.querySelectorAll('a[href="#get-app"]');
    getAppButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // Redirect to Play Store
            window.open('https://play.google.com/store/apps/details?id=com.vrindago.app', '_blank');
        });
    });
    
    // Handle "List Your Room" buttons
    const listRoomButtons = document.querySelectorAll('a[href="#list-room"], a[href="#host-interest"]');
    listRoomButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#list-room') {
                e.preventDefault();
                showNotification('To list your room, please fill out the host interest form below or contact us at support@vrindago.in', 'success');
                
                // Scroll to host interest form if it exists
                const hostSection = document.getElementById('host-interest');
                if (hostSection) {
                    setTimeout(() => {
                        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                        const targetPosition = hostSection.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }, 1000);
                }
            }
            // #host-interest links will be handled by the smooth scrolling code above
        });
    });
    
    // ===================================
    // PERFORMANCE OPTIMIZATIONS
    // ===================================
    
    // Lazy loading for images when implemented
    function setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });
            
            const lazyImages = document.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    setupLazyLoading();
    
    // ===================================
    // ACCESSIBILITY ENHANCEMENTS
    // ===================================
    
    // Enhance keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Skip to main content on Tab key
        if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
            const mainContent = document.querySelector('main');
            if (mainContent) {
                e.preventDefault();
                mainContent.focus();
            }
        }
    });
    
    // Add focus indicators for card hover effects
    const focusableCards = document.querySelectorAll('.feature-card, .room-card, .about-card, .value-card, .vm-card, .contact-card');
    focusableCards.forEach(card => {
        // Make cards focusable if they contain links
        const links = card.querySelectorAll('a');
        if (links.length > 0) {
            card.setAttribute('tabindex', '0');
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const firstLink = links[0];
                    if (firstLink) {
                        firstLink.click();
                    }
                }
            });
        }
    });
    
    // ===================================
    // UTILITIES
    // ===================================
    
    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Debounced scroll handler for better performance
    const debouncedScrollHandler = debounce(function() {
        // Add any scroll-based functionality here
        console.log('Scroll event handled');
    }, 100);
    
    window.addEventListener('scroll', debouncedScrollHandler);
    
    // ===================================
    // INITIALIZATION COMPLETE
    // ===================================
    
    console.log('VrindaGo website initialized successfully');
});

// ===================================
// SERVICE WORKER REGISTRATION
// ===================================

// Register service worker for offline functionality (when implemented)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(function(registration) {
        //         console.log('ServiceWorker registration successful');
        //     })
        //     .catch(function(error) {
        //         console.log('ServiceWorker registration failed');
        //     });
    });
}