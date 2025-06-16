// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    AOS.init({
        duration: 800,
        easing: 'ease',
        once: true,
        offset: 100
    });
    
    // Preloader
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        setTimeout(function() {
            preloader.classList.add('loaded');
        }, 500);
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active nav link based on scroll position
        updateActiveNavLink();
    });
    
    // Mobile menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    
    menuBtn.addEventListener('click', function() {
        menuBtn.classList.toggle('open');
        navLinksContainer.classList.toggle('open');
    });
    
    // Close mobile menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuBtn.classList.remove('open');
            navLinksContainer.classList.remove('open');
        });
    });
    
    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Skills progress bar animation
    const progressBars = document.querySelectorAll('.progress-bar');
    const skillsSection = document.querySelector('#skills');
    
    function animateProgressBars() {
        progressBars.forEach(bar => {
            const width = bar.getAttribute('data-width') + '%';
            bar.style.width = width;
        });
    }
    
    // Check if skills section is in viewport
    const isInViewport = (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.bottom >= 0
        );
    };
    
    // Animate progress bars when skills section is in viewport
    window.addEventListener('scroll', function() {
        if (isInViewport(skillsSection)) {
            animateProgressBars();
        }
    });
    
    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                // Show all projects if filter is 'all'
                if (filterValue === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    // Check if project has the selected category
                    const categories = card.getAttribute('data-category').split(' ');
                    
                    if (categories.includes(filterValue)) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 200);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 500);
                    }
                }
            });
        });
    });
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.querySelector('.form-status');
    const submitButton = document.getElementById('submit-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Simple validation
            if (!name || !email || !subject || !message) {
                formStatus.classList.add('error');
                formStatus.classList.remove('success', 'sending');
                formStatus.style.display = 'block';
                formStatus.innerHTML = 'Please fill in all fields';
                return false;
            }
            
            // Email validation with regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.classList.add('error');
                formStatus.classList.remove('success', 'sending');
                formStatus.style.display = 'block';
                formStatus.innerHTML = 'Please enter a valid email address';
                return false;
            }
            
            // Update button state to show sending
            submitButton.disabled = true;
            submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            
            // Show sending message
            formStatus.classList.remove('error', 'success');
            formStatus.classList.add('sending');
            formStatus.style.display = 'block';
            formStatus.innerHTML = 'Sending your message...';
            
            // Google Apps Script URL
            const scriptURL = 'https://script.google.com/macros/s/AKfycbzUFzPmAYA7EnrjIRLiRj7qEnx1GFFb_-Y2-3CjD5UqcNxiwY-lW-V_8Y4ozZuGA_EOFA/exec';
            
            // Create data object
            const data = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                sheet_id: '1rTtGzGcDi424VlIgg8BDeX0bkleW-QNdZGMUXVp9TvA',
                timestamp: new Date().toISOString()
            };
            
            // Convert data to query string
            const queryString = Object.keys(data)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                .join('&');
                
            // Create script URL with parameters
            const fullURL = scriptURL + '?' + queryString;
            
            // Create a hidden iframe for submission
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            // Set up success and error handling
            const timeoutId = setTimeout(function() {
                // If it takes too long, show error
                formStatus.classList.remove('sending', 'success');
                formStatus.classList.add('error');
                formStatus.innerHTML = 'Request timed out. Please try again later.';
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            }, 10000); // 10 second timeout
            
            // Handle iframe load
            iframe.onload = function() {
                clearTimeout(timeoutId);
                formStatus.classList.remove('sending', 'error');
                formStatus.classList.add('success');
                formStatus.innerHTML = 'Your message has been sent successfully!';
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                contactForm.reset();
                setTimeout(function() {
                    if (document.body.contains(iframe)) {
                        document.body.removeChild(iframe);
                    }
                }, 1000);
            };
            
            // Handle iframe error
            iframe.onerror = function() {
                clearTimeout(timeoutId);
                formStatus.classList.remove('sending', 'success');
                formStatus.classList.add('error');
                formStatus.innerHTML = 'There was an error sending your message. Please try again.';
                submitButton.disabled = false;
                submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                if (document.body.contains(iframe)) {
                    document.body.removeChild(iframe);
                }
            };
            
            // Set iframe src to trigger the request
            iframe.src = fullURL;
            
            // For debugging - log the URL being used
            console.log('Submitting form to:', fullURL);
        });
    }
    
    // Back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Update active nav link based on scroll position
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY;
        
        document.querySelectorAll('section').forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Typewriter effect for hero section
    function typeWriter(element, text, speed = 100, delay = 1000) {
        let i = 0;
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, speed);
        }, delay);
    }
    
    // Image hover effect
    const projectImgs = document.querySelectorAll('.project-img');
    
    projectImgs.forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.querySelector('img').style.transform = 'scale(1.1)';
        });
        
        img.addEventListener('mouseleave', function() {
            this.querySelector('img').style.transform = 'scale(1)';
        });
    });
    
    // Initialize animations on page load
    animateProgressBars();
});
