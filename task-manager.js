/**
 * Task Manager - Main Animations
 * Core animations for the entire application
 * Include this script on all pages
 */

// Wait until DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all animations
    initPageTransitions();
    initButtonEffects();
    initAlertAnimations();
    initMenuAnimations();
    
    // Check if specific page elements exist and initialize their animations
    if (document.querySelector('table')) {
        initTableAnimations();
    }
    
    if (document.querySelector('form')) {
        initFormAnimations();
    }
});

/**
 * Page transition animations
 * Creates a smooth fade-in effect when page loads
 */
function initPageTransitions() {
    // Add initial opacity class to body
    document.body.classList.add('page-transition');
    
    // Remove the class after a short delay to trigger animation
    setTimeout(function() {
        document.body.classList.remove('page-transition');
    }, 50);
}

/**
 * Button click animations
 * Adds ripple and pressed effects to all buttons
 */
function initButtonEffects() {
    // Select all buttons and link elements that serve as buttons
    const buttons = document.querySelectorAll('button, input[type="submit"], .btn, .add-button, table a');
    
    buttons.forEach(button => {
        // Add ripple effect on click
        button.addEventListener('click', function(e) {
            // Only add ripple if it doesn't exist already
            if (!this.querySelector('.ripple')) {
                const ripple = document.createElement('span');
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                // Position the ripple where clicked
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = e.clientX - rect.left - size/2 + 'px';
                ripple.style.top = e.clientY - rect.top - size/2 + 'px';
                
                // Remove ripple after animation completes
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });
}

/**
 * Alert notification animations
 * Animate the appearance and dismissal of alert messages
 */
function initAlertAnimations() {
    const alerts = document.querySelectorAll('.alert, .alert-success, .alert-danger, .alert-warning');
    
    alerts.forEach(alert => {
        // Add appear animation class
        alert.classList.add('alert-animated');
        
        // Create dismiss button
        const dismissBtn = document.createElement('span');
        dismissBtn.innerHTML = '&times;';
        dismissBtn.classList.add('alert-dismiss');
        alert.appendChild(dismissBtn);
        
        // Add click event to dismiss button
        dismissBtn.addEventListener('click', function() {
            alert.classList.add('alert-dismissing');
            
            // Remove the alert after animation completes
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
        
        // Auto-dismiss alerts after 5 seconds
        setTimeout(() => {
            if (document.body.contains(alert)) {
                alert.classList.add('alert-dismissing');
                setTimeout(() => {
                    if (document.body.contains(alert)) {
                        alert.remove();
                    }
                }, 300);
            }
        }, 5000);
    });
}

/**
 * Menu hover animations
 * Adds interactive effects to the navigation menu
 */
function initMenuAnimations() {
    const menuItems = document.querySelectorAll('.menu a');
    
    if (menuItems.length > 0) {
        // Create the hover indicator element
        const indicator = document.createElement('span');
        indicator.classList.add('menu-indicator');
        document.querySelector('.menu').appendChild(indicator);
        
        // Set initial position based on active menu item
        const activeItem = document.querySelector('.menu a.active') || menuItems[0];
        positionIndicator(activeItem, indicator);
        
        // Update indicator position on hover
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                positionIndicator(this, indicator);
            });
        });
        
        // Reset to active item when mouse leaves menu
        document.querySelector('.menu').addEventListener('mouseleave', function() {
            const activeItem = document.querySelector('.menu a.active') || menuItems[0];
            positionIndicator(activeItem, indicator);
        });
    }
}

/**
 * Position the menu indicator under the current item
 */
function positionIndicator(item, indicator) {
    const rect = item.getBoundingClientRect();
    const menuRect = document.querySelector('.menu').getBoundingClientRect();
    
    indicator.style.width = rect.width + 'px';
    indicator.style.left = (rect.left - menuRect.left) + 'px';
    indicator.style.transform = 'scaleX(1)';
}

/**
 * Table row animations
 * Adds hover and click effects to table rows
 */
function initTableAnimations() {
    const tableRows = document.querySelectorAll('table tr:not(:first-child)');
    
    tableRows.forEach(row => {
        // Add hover animation class
        row.classList.add('row-animated');
        
        // Add click ripple effect
        row.addEventListener('click', function(e) {
            if (e.target.tagName.toLowerCase() !== 'a' && 
                e.target.tagName.toLowerCase() !== 'button' &&
                !e.target.closest('a') && 
                !e.target.closest('button')) {
                
                const ripple = document.createElement('span');
                ripple.classList.add('row-ripple');
                this.appendChild(ripple);
                
                // Position the ripple
                const rect = this.getBoundingClientRect();
                ripple.style.left = (e.clientX - rect.left) + 'px';
                ripple.style.top = (e.clientY - rect.top) + 'px';
                
                // Remove ripple after animation
                setTimeout(() => {
                    ripple.remove();
                }, 500);
            }
        });
    });
}

/**
 * Form animations
 * Adds interactive effects to form elements
 */
function initFormAnimations() {
    const formElements = document.querySelectorAll('input:not([type="submit"]), textarea, select');
    
    formElements.forEach(element => {
        // Add focus animation class
        element.classList.add('input-animated');
        
        // Create and add label animation if there's a preceding label
        if (element.previousElementSibling && 
            element.previousElementSibling.tagName.toLowerCase() === 'label') {
            
            const label = element.previousElementSibling;
            label.classList.add('label-animated');
            
            // Move label up if input has value
            if (element.value !== '') {
                label.classList.add('label-active');
            }
            
            // Toggle label position on focus/blur
            element.addEventListener('focus', function() {
                label.classList.add('label-active');
            });
            
            element.addEventListener('blur', function() {
                if (this.value === '') {
                    label.classList.remove('label-active');
                }
            });
        }
        
        // Add special animation for select elements
        if (element.tagName.toLowerCase() === 'select') {
            element.addEventListener('change', function() {
                this.classList.add('select-changed');
                setTimeout(() => {
                    this.classList.remove('select-changed');
                }, 500);
            });
        }
    });
    
    // Form submission animation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            // Don't animate if form is invalid
            if (!this.checkValidity()) {
                return;
            }
            
            // Add submitting animation
            this.classList.add('form-submitting');
            
            // Get submit button
            const submitBtn = this.querySelector('input[type="submit"], button[type="submit"]');
            if (submitBtn) {
                // Store original text
                const originalText = submitBtn.value || submitBtn.innerText;
                
                // Change text to loading indicator
                if (submitBtn.tagName.toLowerCase() === 'input') {
                    submitBtn.value = 'Submitting...';
                } else {
                    submitBtn.innerText = 'Submitting...';
                }
                
                // Add loading spinner
                submitBtn.classList.add('btn-loading');
                
                // Reset after delay if not actually submitting (for demo)
                setTimeout(() => {
                    if (submitBtn.classList.contains('btn-loading')) {
                        if (submitBtn.tagName.toLowerCase() === 'input') {
                            submitBtn.value = originalText;
                        } else {
                            submitBtn.innerText = originalText;
                        }
                        submitBtn.classList.remove('btn-loading');
                        form.classList.remove('form-submitting');
                    }
                }, 3000);
            }
        });
    });
}