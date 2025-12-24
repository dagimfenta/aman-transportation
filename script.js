// A-man Transportation - Main JavaScript

// ============================================
// EMAILJS CONFIGURATION
// ============================================
// To enable automatic email sending:
// 1. Go to https://www.emailjs.com/ and create a free account
// 2. Add an Email Service (Gmail) and get your SERVICE_ID
// 3. Create an Email Template and get your TEMPLATE_ID
// 4. Get your PUBLIC_KEY from Account > API Keys
// 5. Fill in the values below:

const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'TbKzJe6dmCzXXRqop',
    SERVICE_ID: 'service_rmvd0x8',
    TEMPLATE_ID: 'template_sxwknkv',
    // Optional: Create a second template for customer confirmation
    // and add the template ID here to send confirmations to customers
    CUSTOMER_TEMPLATE_ID: ''  // e.g., 'template_customer123'
};

// US Cities Database for Autocomplete
const US_CITIES = [
    "Atlanta, GA", "Austin, TX", "Baltimore, MD", "Birmingham, AL", "Boston, MA",
    "Buffalo, NY", "Charlotte, NC", "Chicago, IL", "Cincinnati, OH", "Cleveland, OH",
    "Columbus, OH", "Dallas, TX", "Denver, CO", "Detroit, MI", "El Paso, TX",
    "Fort Worth, TX", "Fresno, CA", "Henderson, NV", "Houston, TX", "Indianapolis, IN",
    "Jacksonville, FL", "Kansas City, MO", "Las Vegas, NV", "Los Angeles, CA", "Louisville, KY",
    "Memphis, TN", "Miami, FL", "Milwaukee, WI", "Minneapolis, MN", "Nashville, TN",
    "New Orleans, LA", "New York, NY", "Newark, NJ", "Oakland, CA", "Oklahoma City, OK",
    "Omaha, NE", "Orlando, FL", "Philadelphia, PA", "Phoenix, AZ", "Pittsburgh, PA",
    "Portland, OR", "Raleigh, NC", "Richmond, VA", "Sacramento, CA", "Salt Lake City, UT",
    "San Antonio, TX", "San Diego, CA", "San Francisco, CA", "San Jose, CA", "Seattle, WA",
    "St. Louis, MO", "Tampa, FL", "Tucson, AZ", "Virginia Beach, VA", "Washington, DC",
    "Albuquerque, NM", "Anaheim, CA", "Anchorage, AK", "Arlington, TX", "Aurora, CO",
    "Bakersfield, CA", "Baton Rouge, LA", "Boise, ID", "Chandler, AZ", "Chesapeake, VA",
    "Chula Vista, CA", "Colorado Springs, CO", "Corpus Christi, TX", "Durham, NC", "Fontana, CA",
    "Fort Wayne, IN", "Fremont, CA", "Garland, TX", "Gilbert, AZ", "Glendale, AZ",
    "Greensboro, NC", "Hialeah, FL", "Honolulu, HI", "Huntington Beach, CA", "Irvine, CA",
    "Irving, TX", "Jersey City, NJ", "Laredo, TX", "Lexington, KY", "Lincoln, NE",
    "Long Beach, CA", "Lubbock, TX", "Madison, WI", "Mesa, AZ", "Mobile, AL",
    "Modesto, CA", "Montgomery, AL", "Moreno Valley, CA", "Norfolk, VA", "North Las Vegas, NV",
    "Ontario, CA", "Oxnard, CA", "Plano, TX", "Reno, NV", "Riverside, CA",
    "Rochester, NY", "Santa Ana, CA", "Santa Clarita, CA", "Scottsdale, AZ", "Shreveport, LA",
    "Spokane, WA", "Stockton, CA", "St. Petersburg, FL", "Syracuse, NY", "Tacoma, WA",
    "Toledo, OH", "Tulsa, OK", "Wichita, KS", "Winston-Salem, NC", "Worcester, MA",
    "Little Rock, AR", "Jackson, MS", "Des Moines, IA", "Knoxville, TN", "Chattanooga, TN",
    "Savannah, GA", "Augusta, GA", "Macon, GA", "Columbia, SC", "Charleston, SC",
    "Greenville, SC", "Wilmington, NC", "Fayetteville, NC", "Asheville, NC", "Dayton, OH",
    "Akron, OH", "Canton, OH", "Youngstown, OH", "Grand Rapids, MI", "Lansing, MI",
    "Ann Arbor, MI", "Flint, MI", "Fort Lauderdale, FL", "West Palm Beach, FL", "Tallahassee, FL",
    "Pensacola, FL", "Gainesville, FL", "Springfield, MO", "Waco, TX", "Amarillo, TX",
    "Beaumont, TX", "Midland, TX", "Odessa, TX", "Abilene, TX", "Tyler, TX"
];

let emailJSReady = false;

// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded - initializing...');
    
    // Initialize EmailJS after page loads
    if (typeof emailjs !== 'undefined') {
        console.log('EmailJS SDK found, initializing...');
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
        emailJSReady = true;
        console.log('EmailJS initialized successfully!');
    } else {
        console.error('EmailJS SDK not loaded! Check if the script tag is in index.html');
    }
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.padding = '16px 0';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // City Autocomplete Setup
    setupCityAutocomplete('origin', 'originDropdown');
    setupCityAutocomplete('destination', 'destinationDropdown');

    // Quote Form Handling
    const quoteForm = document.getElementById('quoteForm');

    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Collect form data
            const formData = new FormData(quoteForm);
            const data = Object.fromEntries(formData.entries());

            // Simple validation
            const requiredFields = ['name', 'email', 'phone', 'origin', 'destination', 'loadType'];
            let isValid = true;

            requiredFields.forEach(field => {
                const input = document.getElementById(field);
                if (!data[field] || data[field].trim() === '') {
                    isValid = false;
                    input.style.borderColor = '#ef4444';
                } else {
                    input.style.borderColor = '';
                }
            });

            if (!isValid) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                document.getElementById('email').style.borderColor = '#ef4444';
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitBtn = quoteForm.querySelector('.btn-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;

            // Prepare email content
            const companyEmail = 'amantransportation20@gmail.com';
            const subject = `Quote Request from ${data.name}`;
            
            // Format load type for display
            const loadTypeLabels = {
                'ftl': 'Full Truckload (FTL)',
                'ltl': 'Less Than Truckload (LTL)',
                'expedited': 'Expedited',
                'other': 'Other'
            };
            const loadTypeDisplay = loadTypeLabels[data.loadType] || data.loadType;

            // Format dates for display
            const formatDate = (dateStr) => {
                if (!dateStr) return 'Not specified';
                const date = new Date(dateStr);
                return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            };

            const emailBody = `
QUOTE REQUEST DETAILS
=====================

Contact Information:
- Name: ${data.name}
- Company: ${data.company || 'N/A'}
- Email: ${data.email}
- Phone: ${data.phone}

Shipment Details:
- Pickup Location: ${data.origin}
- Delivery Location: ${data.destination}
- Pickup Date: ${formatDate(data.pickupDate)}
- Delivery Date: ${formatDate(data.deliveryDate)}
- Load Type: ${loadTypeDisplay}
- Estimated Weight: ${data.weight ? data.weight + ' lbs' : 'Not specified'}

Additional Details:
${data.details || 'None provided'}

=====================
This quote request was submitted via the A-man Transportation website.
            `.trim();

            // Send email using EmailJS (if configured) or mailto fallback
            console.log('Attempting to send email...');
            console.log('EmailJS Ready:', emailJSReady);
            
            if (emailJSReady) {
                console.log('Sending via EmailJS...');
                // EmailJS is configured - send directly
                emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
                    to_email: companyEmail,
                    from_name: data.name,
                    from_email: data.email,
                    reply_to: data.email,
                    phone: data.phone,
                    company: data.company || 'N/A',
                    pickup_city: data.origin,
                    delivery_city: data.destination,
                    pickup_date: formatDate(data.pickupDate),
                    delivery_date: formatDate(data.deliveryDate),
                    load_type: loadTypeDisplay,
                    weight: data.weight ? data.weight + ' lbs' : 'Not specified',
                    details: data.details || 'None provided',
                    subject: subject,
                    message: emailBody
                }).then(function(response) {
                    console.log('EmailJS SUCCESS!', response);
                    showNotification('Thank you! Your quote request has been sent. We\'ll contact you within 24 hours.', 'success');
                    
                    // Send confirmation to customer (if template is configured)
                    sendCustomerConfirmation(data, loadTypeDisplay);
                    
                    quoteForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }).catch(function(error) {
                    console.error('EmailJS FAILED:', error);
                    console.error('Error details:', JSON.stringify(error));
                    showNotification('There was an error sending your request. Please try again or contact us directly.', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            } else {
                // Use mailto fallback
                openMailto(companyEmail, subject, emailBody);
                
                setTimeout(() => {
                    showNotification('Your email client should open with the quote details. Please click send to submit your request.', 'success');
                    quoteForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 500);
            }
        });
    }

    // Helper function to open mailto link
    function openMailto(to, subject, body) {
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }

    // Input focus effects
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .about-content, .about-visual, .quote-wrapper').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            padding: 24px;
            gap: 16px;
            border-bottom: 1px solid var(--border);
            box-shadow: 0 10px 40px rgba(30, 42, 74, 0.1);
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    `;
    document.head.appendChild(style);
});

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        max-width: 400px;
        padding: 16px 20px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        ${type === 'success' 
            ? 'background: linear-gradient(135deg, #059669, #047857); color: white;' 
            : type === 'error' 
            ? 'background: linear-gradient(135deg, #dc2626, #b91c1c); color: white;'
            : 'background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white;'}
    `;

    // Add close button styles
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        line-height: 1;
        padding: 0;
        margin-left: auto;
    `;

    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    });

    // Add animation keyframes if not already present
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
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
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Phone number formatting
document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 3) {
                    value = `(${value}`;
                } else if (value.length <= 6) {
                    value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
                } else {
                    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
                }
            }
            e.target.value = value;
        });
    }
});

// City Autocomplete Function
function setupCityAutocomplete(inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    
    if (!input || !dropdown) return;
    
    let highlightedIndex = -1;
    let filteredCities = [];

    input.addEventListener('input', function() {
        const value = this.value.toLowerCase().trim();
        highlightedIndex = -1;
        
        if (value.length < 2) {
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
            return;
        }

        // Filter cities that match the input
        filteredCities = US_CITIES.filter(city => 
            city.toLowerCase().includes(value)
        ).slice(0, 8); // Limit to 8 results

        if (filteredCities.length === 0) {
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
            return;
        }

        // Build dropdown HTML
        dropdown.innerHTML = filteredCities.map((city, index) => 
            `<div class="autocomplete-item" data-index="${index}">${highlightMatch(city, value)}</div>`
        ).join('');

        dropdown.classList.add('active');

        // Add click handlers to items
        dropdown.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', function() {
                input.value = filteredCities[this.dataset.index];
                dropdown.classList.remove('active');
                dropdown.innerHTML = '';
            });
        });
    });

    // Keyboard navigation
    input.addEventListener('keydown', function(e) {
        const items = dropdown.querySelectorAll('.autocomplete-item');
        
        if (!dropdown.classList.contains('active') || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            highlightedIndex = Math.min(highlightedIndex + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            highlightedIndex = Math.max(highlightedIndex - 1, 0);
            updateHighlight(items);
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            input.value = filteredCities[highlightedIndex];
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
        } else if (e.key === 'Escape') {
            dropdown.classList.remove('active');
            dropdown.innerHTML = '';
        }
    });

    function updateHighlight(items) {
        items.forEach((item, index) => {
            item.classList.toggle('highlighted', index === highlightedIndex);
        });
    }

    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<strong>$1</strong>');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });
}

// Function to send customer confirmation email (optional)
function sendCustomerConfirmation(data, loadTypeDisplay) {
    if (!EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID) return;
    
    emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.CUSTOMER_TEMPLATE_ID, {
        to_email: data.email,
        customer_name: data.name,
        pickup_city: data.origin,
        delivery_city: data.destination,
        load_type: loadTypeDisplay
    }).then(function() {
        console.log('Customer confirmation sent');
    }).catch(function(error) {
        console.error('Customer confirmation failed:', error);
    });
}

