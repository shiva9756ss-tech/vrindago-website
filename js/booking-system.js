// ===================================
//   VrindaGo™ - Booking & Payment System
//   Zero-Cost UPI, WhatsApp & Bank Transfer Integration
// ===================================

class VrindaGoBookingSystem {
    constructor() {
        this.currentBooking = {
            propertyId: '',
            propertyName: '',
            pricePerNight: 0,
            checkIn: '',
            checkOut: '',
            guests: 2,
            rooms: 1,
            totalNights: 1,
            totalAmount: 0,
            advanceAmount: 0,
            guestName: '',
            guestPhone: '',
            guestEmail: '',
            specialRequests: '',
            paymentMethod: 'upi',
            referenceId: ''
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupDateValidation();
    }

    bindEvents() {
        // Date change events
        const checkinDate = document.getElementById('checkinDate');
        const checkoutDate = document.getElementById('checkoutDate');
        if (checkinDate && checkoutDate) {
            checkinDate.addEventListener('change', () => this.calculateTotal());
            checkoutDate.addEventListener('change', () => this.calculateTotal());
        }

        // Guest and room counter events are handled by onclick attributes
        // Payment method selection events are handled by onclick attributes
    }

    setupDateValidation() {
        const today = new Date().toISOString().split('T')[0];
        const checkinDate = document.getElementById('checkinDate');
        const checkoutDate = document.getElementById('checkoutDate');
        
        if (checkinDate) {
            checkinDate.min = today;
            checkinDate.value = today;
        }
        
        if (checkoutDate) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            checkoutDate.min = tomorrow.toISOString().split('T')[0];
            checkoutDate.value = tomorrow.toISOString().split('T')[0];
        }
    }

    // Open booking modal
    openBookingModal(propertyId, propertyName, price) {
        this.currentBooking.propertyId = propertyId;
        this.currentBooking.propertyName = propertyName;
        this.currentBooking.pricePerNight = price;
        
        document.getElementById('modalPropertyName').textContent = `Book ${propertyName}`;
        this.calculateTotal();
        this.generateReferenceId();
        
        const modal = document.getElementById('bookingModal');
        modal.classList.add('active');
        modal.style.display = 'flex';
        
        // Reset to step 1
        this.showStep(1);
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close booking modal
    closeBookingModal() {
        const modal = document.getElementById('bookingModal');
        modal.classList.remove('active');
        modal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Reset form
        this.resetBookingForm();
    }

    // Show specific step
    showStep(stepNumber) {
        document.querySelectorAll('.booking-step').forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step${stepNumber}`).classList.add('active');
    }

    // Calculate total amount
    calculateTotal() {
        const checkinDate = document.getElementById('checkinDate').value;
        const checkoutDate = document.getElementById('checkoutDate').value;
        
        if (checkinDate && checkoutDate) {
            const checkin = new Date(checkinDate);
            const checkout = new Date(checkoutDate);
            const timeDiff = checkout.getTime() - checkin.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            if (nights > 0) {
                this.currentBooking.totalNights = nights;
                this.currentBooking.checkIn = checkinDate;
                this.currentBooking.checkOut = checkoutDate;
                
                const totalAmount = this.currentBooking.pricePerNight * nights * this.currentBooking.rooms;
                const advanceAmount = Math.round(totalAmount * 0.3); // 30% advance
                
                this.currentBooking.totalAmount = totalAmount;
                this.currentBooking.advanceAmount = advanceAmount;
                
                this.updatePriceDisplay();
            }
        }
    }

    // Update price display
    updatePriceDisplay() {
        const basePrice = document.getElementById('basePrice');
        const totalNights = document.getElementById('totalNights');
        const totalAmount = document.getElementById('totalAmount');
        const advanceAmount = document.getElementById('advanceAmount');
        
        if (basePrice) {
            basePrice.textContent = `₹${this.currentBooking.pricePerNight} × ${this.currentBooking.totalNights} night${this.currentBooking.totalNights > 1 ? 's' : ''}`;
        }
        if (totalNights) {
            totalNights.textContent = this.currentBooking.totalNights;
        }
        if (totalAmount) {
            totalAmount.textContent = `₹${this.currentBooking.totalAmount}`;
        }
        if (advanceAmount) {
            advanceAmount.textContent = `₹${this.currentBooking.advanceAmount}`;
        }
        
        // Update payment amounts
        this.updatePaymentAmounts();
    }

    // Update payment amounts in step 2
    updatePaymentAmounts() {
        const qrAmount = document.getElementById('qrAmount');
        const upiAmount = document.getElementById('upiAmount');
        const bankAmount = document.getElementById('bankAmount');
        
        if (qrAmount) qrAmount.textContent = `₹${this.currentBooking.advanceAmount}`;
        if (upiAmount) upiAmount.textContent = `₹${this.currentBooking.advanceAmount}`;
        if (bankAmount) bankAmount.textContent = `₹${this.currentBooking.advanceAmount}`;
    }

    // Generate unique reference ID
    generateReferenceId() {
        const prefix = 'VG';
        const propertyCode = this.currentBooking.propertyId.toUpperCase().substring(0, 3);
        const timestamp = Date.now().toString().slice(-6);
        this.currentBooking.referenceId = `${prefix}-${propertyCode}-${timestamp}`;
        
        const paymentRef = document.getElementById('paymentRef');
        const bankRef = document.getElementById('bankRef');
        if (paymentRef) paymentRef.textContent = this.currentBooking.referenceId;
        if (bankRef) bankRef.textContent = this.currentBooking.referenceId;
    }

    // Change guest count
    changeGuests(delta) {
        const newCount = Math.max(1, Math.min(10, this.currentBooking.guests + delta));
        this.currentBooking.guests = newCount;
        document.getElementById('guestCount').textContent = newCount;
    }

    // Change room count
    changeRooms(delta) {
        const newCount = Math.max(1, Math.min(5, this.currentBooking.rooms + delta));
        this.currentBooking.rooms = newCount;
        document.getElementById('roomCount').textContent = newCount;
        this.calculateTotal();
    }

    // Proceed to payment step
    goToPayment() {
        // Validate form data
        const guestName = document.getElementById('guestName').value.trim();
        const guestPhone = document.getElementById('guestPhone').value.trim();
        
        if (!guestName || !guestPhone) {
            alert('Please fill in all required fields');
            return;
        }
        
        if (!this.validatePhoneNumber(guestPhone)) {
            alert('Please enter a valid phone number');
            return;
        }
        
        // Save form data
        this.currentBooking.guestName = guestName;
        this.currentBooking.guestPhone = guestPhone;
        this.currentBooking.guestEmail = document.getElementById('guestEmail').value.trim();
        this.currentBooking.specialRequests = document.getElementById('specialRequests').value.trim();
        
        // Move to step 2
        this.showStep(2);
        this.updatePaymentAmounts();
    }

    // Go back to details
    goBackToDetails() {
        this.showStep(1);
    }

    // Select payment method
    selectPaymentMethod(method) {
        this.currentBooking.paymentMethod = method;
        
        // Update UI
        document.querySelectorAll('.payment-method').forEach(el => {
            el.classList.remove('active');
        });
        event.target.closest('.payment-method').classList.add('active');
        
        // Show/hide payment details
        document.querySelectorAll('.payment-details').forEach(el => {
            el.style.display = 'none';
        });
        document.getElementById(`${method}Payment`).style.display = 'block';
    }

    // Send WhatsApp payment request
    sendWhatsAppPayment() {
        const message = this.generateWhatsAppMessage();
        const whatsappUrl = `https://wa.me/919368904498?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Generate WhatsApp message
    generateWhatsAppMessage() {
        const checkinFormatted = this.formatDate(this.currentBooking.checkIn);
        const checkoutFormatted = this.formatDate(this.currentBooking.checkOut);
        
        return `🏨 *VrindaGo Booking Request*

📍 *Property:* ${this.currentBooking.propertyName}
👤 *Guest:* ${this.currentBooking.guestName}
📞 *Phone:* ${this.currentBooking.guestPhone}
${this.currentBooking.guestEmail ? `📧 *Email:* ${this.currentBooking.guestEmail}` : ''}

📅 *Check-in:* ${checkinFormatted}
📅 *Check-out:* ${checkoutFormatted}
🏠 *Rooms:* ${this.currentBooking.rooms}
👥 *Guests:* ${this.currentBooking.guests}
🌙 *Nights:* ${this.currentBooking.totalNights}

💰 *Total Amount:* ₹${this.currentBooking.totalAmount}
💳 *Advance Payment:* ₹${this.currentBooking.advanceAmount}
🔢 *Reference:* ${this.currentBooking.referenceId}

${this.currentBooking.specialRequests ? `📝 *Special Requests:* ${this.currentBooking.specialRequests}` : ''}

Please confirm availability and send UPI payment link for advance payment.

Thank you! 🙏`;
    }

    // Copy to clipboard
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Show success feedback
            const button = element.parentElement.querySelector('button');
            const originalIcon = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check"></i>';
            button.style.background = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalIcon;
                button.style.background = 'var(--primary-blue)';
            }, 2000);
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            alert('Copied to clipboard!');
        });
    }

    // Confirm via WhatsApp
    confirmViaWhatsApp() {
        const message = `✅ *Payment Confirmation - VrindaGo*

🔢 *Reference:* ${this.currentBooking.referenceId}
💰 *Amount Paid:* ₹${this.currentBooking.advanceAmount}
👤 *Guest:* ${this.currentBooking.guestName}

Payment completed successfully. Please confirm booking and share check-in details.

📷 Screenshot attached in next message.`;

        const whatsappUrl = `https://wa.me/919368904498?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Confirm via email
    confirmViaEmail() {
        const subject = `Payment Confirmation - ${this.currentBooking.referenceId}`;
        const body = `Dear VrindaGo Team,

I have completed the advance payment for my booking:

Reference: ${this.currentBooking.referenceId}
Property: ${this.currentBooking.propertyName}
Guest Name: ${this.currentBooking.guestName}
Amount Paid: ₹${this.currentBooking.advanceAmount}
Payment Method: ${this.currentBooking.paymentMethod.toUpperCase()}

Please confirm the booking and share check-in details.

Best regards,
${this.currentBooking.guestName}`;

        const emailUrl = `mailto:booking@vrindago.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(emailUrl, '_blank');
    }

    // Confirm via call
    confirmViaCall() {
        const phoneNumber = '+919368904498';
        window.open(`tel:${phoneNumber}`, '_self');
    }

    // Complete booking
    completeBooking() {
        // Show confirmation modal
        this.showConfirmationModal();
        this.closeBookingModal();
    }

    // Show confirmation modal
    showConfirmationModal() {
        const checkinFormatted = this.formatDate(this.currentBooking.checkIn);
        const checkoutFormatted = this.formatDate(this.currentBooking.checkOut);
        
        document.getElementById('confirmProperty').textContent = this.currentBooking.propertyName;
        document.getElementById('confirmDates').textContent = `${checkinFormatted} - ${checkoutFormatted}`;
        document.getElementById('confirmGuests').textContent = `${this.currentBooking.guests} guests, ${this.currentBooking.rooms} room${this.currentBooking.rooms > 1 ? 's' : ''}`;
        document.getElementById('confirmRef').textContent = this.currentBooking.referenceId;
        document.getElementById('confirmAmount').textContent = `₹${this.currentBooking.advanceAmount}`;
        
        const modal = document.getElementById('confirmationModal');
        modal.style.display = 'flex';
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    // Close confirmation modal
    closeConfirmationModal() {
        const modal = document.getElementById('confirmationModal');
        modal.style.display = 'none';
        
        // Restore body scroll
        document.body.style.overflow = 'auto';
    }

    // Reset booking form
    resetBookingForm() {
        document.getElementById('bookingForm').reset();
        this.currentBooking = {
            propertyId: '',
            propertyName: '',
            pricePerNight: 0,
            checkIn: '',
            checkOut: '',
            guests: 2,
            rooms: 1,
            totalNights: 1,
            totalAmount: 0,
            advanceAmount: 0,
            guestName: '',
            guestPhone: '',
            guestEmail: '',
            specialRequests: '',
            paymentMethod: 'upi',
            referenceId: ''
        };
        
        document.getElementById('guestCount').textContent = '2';
        document.getElementById('roomCount').textContent = '1';
        this.setupDateValidation();
    }

    // Validate phone number
    validatePhoneNumber(phone) {
        const phoneRegex = /^[+]?[1-9][\d\s\-\(\)]{8,15}$/;
        return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    // Format date for display
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}

// Global functions for button onclick events
function openBookingModal(propertyId, propertyName, price) {
    if (window.bookingSystem) {
        window.bookingSystem.openBookingModal(propertyId, propertyName, price);
    }
}

function closeBookingModal() {
    if (window.bookingSystem) {
        window.bookingSystem.closeBookingModal();
    }
}

function goToPayment() {
    if (window.bookingSystem) {
        window.bookingSystem.goToPayment();
    }
}

function goBackToDetails() {
    if (window.bookingSystem) {
        window.bookingSystem.goBackToDetails();
    }
}

function changeGuests(delta) {
    if (window.bookingSystem) {
        window.bookingSystem.changeGuests(delta);
    }
}

function changeRooms(delta) {
    if (window.bookingSystem) {
        window.bookingSystem.changeRooms(delta);
    }
}

function selectPaymentMethod(method) {
    if (window.bookingSystem) {
        window.bookingSystem.selectPaymentMethod(method);
    }
}

function sendWhatsAppPayment() {
    if (window.bookingSystem) {
        window.bookingSystem.sendWhatsAppPayment();
    }
}

function copyToClipboard(elementId) {
    if (window.bookingSystem) {
        window.bookingSystem.copyToClipboard(elementId);
    }
}

function confirmViaWhatsApp() {
    if (window.bookingSystem) {
        window.bookingSystem.confirmViaWhatsApp();
    }
}

function confirmViaEmail() {
    if (window.bookingSystem) {
        window.bookingSystem.confirmViaEmail();
    }
}

function confirmViaCall() {
    if (window.bookingSystem) {
        window.bookingSystem.confirmViaCall();
    }
}

function completeBooking() {
    if (window.bookingSystem) {
        window.bookingSystem.completeBooking();
    }
}

function closeConfirmationModal() {
    if (window.bookingSystem) {
        window.bookingSystem.closeConfirmationModal();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bookingSystem = new VrindaGoBookingSystem();
});

// Global functions for HTML onclick events
function openBookingModal(propertyId, propertyName, pricePerNight) {
    if (window.bookingSystem) {
        window.bookingSystem.openBookingModal(propertyId, propertyName, pricePerNight);
    }
}

function closeBookingModal() {
    if (window.bookingSystem) {
        window.bookingSystem.closeBookingModal();
    }
}

function changeGuests(delta) {
    if (window.bookingSystem) {
        window.bookingSystem.changeGuests(delta);
    }
}

function changeRooms(delta) {
    if (window.bookingSystem) {
        window.bookingSystem.changeRooms(delta);
    }
}

function goToPayment() {
    if (window.bookingSystem) {
        window.bookingSystem.goToPayment();
    }
}

function selectPaymentMethod(method) {
    if (window.bookingSystem) {
        window.bookingSystem.selectPaymentMethod(method);
    }
}

function showQRCode() {
    if (window.bookingSystem) {
        window.bookingSystem.showQRCode();
    }
}

function confirmBooking() {
    if (window.bookingSystem) {
        window.bookingSystem.confirmBooking();
    }
}

function closeConfirmationModal() {
    const confirmationModal = document.getElementById('confirmationModal');
    if (confirmationModal) {
        confirmationModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (event) => {
    const bookingModal = document.getElementById('bookingModal');
    const confirmationModal = document.getElementById('confirmationModal');
    
    if (event.target === bookingModal) {
        closeBookingModal();
    }
    
    if (event.target === confirmationModal) {
        closeConfirmationModal();
    }
});

// Handle escape key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const bookingModal = document.getElementById('bookingModal');
        const confirmationModal = document.getElementById('confirmationModal');
        
        if (bookingModal && bookingModal.classList.contains('active')) {
            closeBookingModal();
        }
        
        if (confirmationModal && confirmationModal.style.display === 'flex') {
            closeConfirmationModal();
        }
    }
});