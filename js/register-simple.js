// Simple Registration Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const progressFill = document.getElementById('progressFill');
    const locationSelect = document.getElementById('location');
    const customLocationDiv = document.getElementById('customLocation');
    const submitBtn = document.getElementById('submitBtn');
    
    // Progress bar animation
    setTimeout(() => {
        progressFill.style.width = '20%';
    }, 500);
    
    // Form progress tracking
    const requiredFields = ['propertyName', 'propertyType', 'totalRooms', 'location', 'ownerName', 'whatsapp', 'minPrice', 'agreement'];
    
    function updateProgress() {
        const completed = requiredFields.filter(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                if (field.type === 'checkbox') {
                    return field.checked;
                } else {
                    return field.value.trim() !== '';
                }
            }
            return false;
        }).length;
        
        const progress = Math.min(20 + (completed / requiredFields.length) * 80, 100);
        progressFill.style.width = progress + '%';
        
        // Update submit button
        if (progress === 100) {
            submitBtn.innerHTML = '🎉 Everything looks perfect! Submit now';
            submitBtn.style.background = 'linear-gradient(135deg, #16a34a, #22c55e)';
        }
    }
    
    // Add event listeners to track progress
    requiredFields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.addEventListener('input', updateProgress);
            field.addEventListener('change', updateProgress);
        }
    });
    
    // Handle custom location
    locationSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            customLocationDiv.style.display = 'block';
            document.getElementById('customLocationText').required = true;
        } else {
            customLocationDiv.style.display = 'none';
            document.getElementById('customLocationText').required = false;
        }
        updateProgress();
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual Netlify submission)
        const formData = new FormData(form);
        
        // Add selected amenities to form data
        const amenities = [];
        document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
            amenities.push(checkbox.value);
        });
        formData.set('amenities', amenities.join(', '));
        
        // Submit to Netlify
        fetch('/', {
            method: 'POST',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(formData).toString()
        })
        .then(() => {
            // Show success
            document.getElementById('quickRegister').style.display = 'none';
            document.getElementById('success').style.display = 'block';
            progressFill.style.width = '100%';
            
            // Send WhatsApp notification (optional)
            const whatsappNumber = document.getElementById('whatsapp').value;
            const propertyName = document.getElementById('propertyName').value;
            if (whatsappNumber && propertyName) {
                const message = `🎉 Thank you for registering "${propertyName}" with VrindaGo! Our team will contact you within 24 hours to complete the setup. Welcome to the VrindaGo family! 🙏`;
                // This would typically be handled by your backend
                console.log('WhatsApp notification:', message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error submitting your registration. Please try again or contact support.');
            submitBtn.innerHTML = '🚀 List My Property Now - It\'s FREE!';
            submitBtn.disabled = false;
        });
    });
    
    // Add helpful tooltips and animations
    const inputs = document.querySelectorAll('.form-input, .form-select, .form-textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-blue)';
            this.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    });
    
    // Price validation
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    
    maxPriceInput.addEventListener('input', function() {
        const minPrice = parseInt(minPriceInput.value);
        const maxPrice = parseInt(this.value);
        
        if (maxPrice && minPrice && maxPrice <= minPrice) {
            this.setCustomValidity('Maximum price should be higher than minimum price');
        } else {
            this.setCustomValidity('');
        }
    });
    
    // Phone number formatting
    const whatsappInput = document.getElementById('whatsapp');
    whatsappInput.addEventListener('input', function() {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 0 && !value.startsWith('91')) {
            value = '91' + value;
        }
        if (value.length > 12) {
            value = value.substring(0, 12);
        }
        if (value.length > 2) {
            this.value = '+' + value;
        }
    });
    
    console.log('✨ VrindaGo Registration Form Initialized - Ready for property owners!');
});