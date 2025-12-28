// VrindaGo Property Registration System
// Multi-step registration form for property owners

document.addEventListener('DOMContentLoaded', function() {
    initializeRegistration();
});

let currentStep = 1;
const totalSteps = 4;

function initializeRegistration() {
    setupStepNavigation();
    setupFileUploads();
    setupFormValidation();
    setupFormSubmission();
    
    console.log('VrindaGo Registration System initialized');
}

function setupStepNavigation() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', handleNextStep);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', handlePrevStep);
    }
}

function handleNextStep() {
    if (validateCurrentStep()) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateStepDisplay();
        } else {
            // Last step - submit form
            submitRegistration();
        }
    }
}

function handlePrevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
    }
}

function updateStepDisplay() {
    // Hide all sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show current section
    const currentSection = document.getElementById(`step${currentStep}`);
    if (currentSection) {
        currentSection.classList.add('active');
    }
    
    // Update step indicators
    updateStepIndicators();
    
    // Update navigation buttons
    updateNavigationButtons();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicators() {
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');
    
    steps.forEach((step, index) => {
        const stepNumber = index + 1;
        step.classList.remove('active', 'completed');
        
        if (stepNumber < currentStep) {
            step.classList.add('completed');
        } else if (stepNumber === currentStep) {
            step.classList.add('active');
        }
    });
    
    stepLines.forEach((line, index) => {
        const stepNumber = index + 1;
        line.classList.remove('completed');
        
        if (stepNumber < currentStep) {
            line.classList.add('completed');
        }
    });
}

function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const navigation = document.getElementById('formNavigation');
    
    if (currentStep === 1) {
        prevBtn.style.visibility = 'hidden';
    } else {
        prevBtn.style.visibility = 'visible';
    }
    
    if (currentStep === totalSteps) {
        nextBtn.innerHTML = '<i class="fas fa-check"></i> Submit Registration';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-arrow-right"></i>';
    }
    
    // Hide navigation on success page
    const successSection = document.getElementById('success');
    if (successSection && successSection.style.display === 'block') {
        navigation.style.display = 'none';
    } else {
        navigation.style.display = 'flex';
    }
}

function validateCurrentStep() {
    const currentSection = document.getElementById(`step${currentStep}`);
    if (!currentSection) return false;
    
    const requiredFields = currentSection.querySelectorAll('[required]');
    let isValid = true;
    
    hideMessage();
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    // Additional validation based on step
    switch (currentStep) {
        case 1:
            isValid = validateStep1() && isValid;
            break;
        case 2:
            isValid = validateStep2() && isValid;
            break;
        case 3:
            isValid = validateStep3() && isValid;
            break;
        case 4:
            isValid = validateStep4() && isValid;
            break;
    }
    
    if (!isValid) {
        showMessage('Please fill in all required fields correctly.');
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        highlightField(field, false);
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            highlightField(field, false);
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
            highlightField(field, false);
            return false;
        }
    }
    
    highlightField(field, true);
    return true;
}

function validateStep1() {
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Additional email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage('Please enter a valid email address.');
        return false;
    }
    
    // Phone number format check
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
        showMessage('Please enter a valid 10-digit Indian mobile number.');
        return false;
    }
    
    return true;
}

function validateStep2() {
    const totalRooms = parseInt(document.getElementById('totalRooms').value);
    
    if (totalRooms < 1 || totalRooms > 1000) {
        showMessage('Please enter a valid number of rooms (1-1000).');
        return false;
    }
    
    return true;
}

function validateStep3() {
    const description = document.getElementById('description').value;
    
    if (description.length < 50) {
        showMessage('Property description should be at least 50 characters long.');
        return false;
    }
    
    return true;
}

function validateStep4() {
    const propertyImages = document.getElementById('propertyImages').files;
    const ownerIdProof = document.getElementById('ownerIdProof').files;
    const terms = document.getElementById('terms').checked;
    const commission = document.getElementById('commission').checked;
    const accuracy = document.getElementById('accuracy').checked;
    
    if (propertyImages.length < 3) {
        showMessage('Please upload at least 3 property images.');
        return false;
    }
    
    if (ownerIdProof.length === 0) {
        showMessage('Please upload your ID proof.');
        return false;
    }
    
    if (!terms || !commission || !accuracy) {
        showMessage('Please accept all terms and conditions.');
        return false;
    }
    
    return true;
}

function highlightField(field, isValid) {
    if (isValid) {
        field.style.borderColor = 'var(--accent-green)';
        field.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
    } else {
        field.style.borderColor = 'var(--accent-red)';
        field.style.backgroundColor = 'rgba(220, 53, 69, 0.05)';
    }
    
    // Reset after 3 seconds
    setTimeout(() => {
        field.style.borderColor = '';
        field.style.backgroundColor = '';
    }, 3000);
}

function setupFileUploads() {
    const fileUploads = document.querySelectorAll('.file-upload');
    
    fileUploads.forEach(upload => {
        const input = upload.querySelector('input[type="file"]');
        
        // Drag and drop
        upload.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        upload.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        upload.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            if (input) {
                input.files = e.dataTransfer.files;
                updateFileUploadDisplay(upload, input);
            }
        });
        
        // File selection
        if (input) {
            input.addEventListener('change', function() {
                updateFileUploadDisplay(upload, this);
            });
        }
    });
}

function updateFileUploadDisplay(uploadDiv, input) {
    const textDiv = uploadDiv.querySelector('.file-upload-text');
    const files = input.files;
    
    if (files.length > 0) {
        let fileText = '';
        if (files.length === 1) {
            fileText = `<strong>${files[0].name}</strong><br><small>File selected successfully</small>`;
        } else {
            fileText = `<strong>${files.length} files selected</strong><br><small>Files ready for upload</small>`;
        }
        textDiv.innerHTML = fileText;
        uploadDiv.style.borderColor = 'var(--accent-green)';
        uploadDiv.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
    }
}

function setupFormValidation() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required')) {
                validateField(this);
            }
        });
        
        input.addEventListener('input', function() {
            // Clear error styling on input
            this.style.borderColor = '';
            this.style.backgroundColor = '';
        });
    });
}

function setupFormSubmission() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            submitRegistration();
        });
    }
}

function submitRegistration() {
    // Show loading state
    const nextBtn = document.getElementById('nextBtn');
    const originalText = nextBtn.innerHTML;
    nextBtn.disabled = true;
    nextBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Collect form data
    const formData = collectFormData();
    
    // Simulate API submission
    setTimeout(() => {
        const success = processRegistration(formData);
        
        if (success) {
            showSuccessPage();
        } else {
            showMessage('Registration failed. Please try again or contact support.');
            nextBtn.disabled = false;
            nextBtn.innerHTML = originalText;
        }
    }, 3000);
}

function collectFormData() {
    const form = document.getElementById('registrationForm');
    const formData = new FormData(form);
    
    // Convert FormData to object
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            // Handle multiple values (like amenities)
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Add current timestamp
    data.submissionDate = new Date().toISOString();
    data.status = 'pending';
    
    return data;
}

function processRegistration(data) {
    // Simulate registration processing
    console.log('Processing registration:', data);
    
    // In a real application, this would:
    // 1. Upload files to cloud storage
    // 2. Save data to database
    // 3. Send confirmation emails
    // 4. Create user account
    // 5. Generate verification tokens
    
    // Generate a registration ID
    data.registrationId = 'VRG' + Date.now();
    
    // Store in localStorage for demo
    localStorage.setItem('vrindago_registration', JSON.stringify(data));
    
    // Simulate success (90% success rate for demo)
    return Math.random() > 0.1;
}

function showSuccessPage() {
    // Hide all form sections
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show success section
    const successSection = document.getElementById('success');
    if (successSection) {
        successSection.style.display = 'block';
    }
    
    // Hide navigation
    const navigation = document.getElementById('formNavigation');
    if (navigation) {
        navigation.style.display = 'none';
    }
    
    // Update step indicators to show completion
    const steps = document.querySelectorAll('.step');
    const stepLines = document.querySelectorAll('.step-line');
    
    steps.forEach(step => {
        step.classList.remove('active');
        step.classList.add('completed');
    });
    
    stepLines.forEach(line => {
        line.classList.add('completed');
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showMessage(message) {
    const errorDiv = document.getElementById('errorMessage');
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        
        // Scroll to message
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function hideMessage() {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Utility functions
function formatPhoneNumber(phone) {
    // Format phone number for display
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
    }
    return phone;
}

function validateFileSize(file, maxSizeMB = 5) {
    const maxSize = maxSizeMB * 1024 * 1024; // Convert to bytes
    return file.size <= maxSize;
}

function validateFileType(file, allowedTypes) {
    return allowedTypes.includes(file.type);
}

// Export for global access
window.VrindaGoRegistration = {
    showMessage,
    hideMessage,
    validateField,
    formatPhoneNumber
};