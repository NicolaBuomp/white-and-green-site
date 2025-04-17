document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');

    // Performance optimization for scroll events
    function throttle(callback, limit) {
        let waiting = false;
        return function() {
            if (!waiting) {
                callback.apply(this, arguments);
                waiting = true;
                setTimeout(function() {
                    waiting = false;
                }, limit);
            }
        };
    }

    const handleScroll = throttle(function() {
        // Navbar scrolled effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        // Reading progress bar updates
        if (progressBar) {
            const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (windowScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        }

        // Back to top button functionality
        if (backToTopButton) {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('active');
            } else {
                backToTopButton.classList.remove('active');
            }
        }
    }, 100); // 100ms throttle

    window.addEventListener('scroll', handleScroll);

    // Active link highlight
    const sections = document.querySelectorAll('section, header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Collapse navbar on link click (mobile)
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navLinksMobile = document.querySelectorAll('.nav-link');
    const navCollapse = document.querySelector('.navbar-collapse');

    navLinksMobile.forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navCollapse.classList.remove('show');
            }
        });
    });

    // Enhanced smooth scroll with better animation
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target element
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                // Create a flash highlight animation on the navbar link
                this.classList.add('nav-flash');
                setTimeout(() => {
                    this.classList.remove('nav-flash');
                }, 700);

                // Add an entrance animation to the section (except for hero)
                if (targetId !== '#hero') {
                    // Reset any existing animations
                    target.classList.remove('section-entrance');
                    // Force a reflow to ensure animation restarts
                    void target.offsetWidth;
                    // Add animation class
                    target.classList.add('section-entrance');
                }

                // Enhanced smooth scroll animation
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const startPosition = window.pageYOffset;
                const targetPosition = startPosition + elementPosition - headerOffset;
                
                // Show the scroll indicator during navigation
                const scrollIndicator = document.getElementById('scroll-indicator');
                if (scrollIndicator) {
                    scrollIndicator.classList.add('active');
                    setTimeout(() => {
                        scrollIndicator.classList.remove('active');
                    }, 800);
                }

                // Custom smooth scroll with easing
                smoothScrollTo(targetPosition, 800);
            }
        });
    });

    // Custom smooth scroll function with easing
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            
            // Easing function - easeInOutQuad for smoother animation
            const easing = progress => {
                return progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
            };
            
            window.scrollTo(0, startPosition + distance * easing(progress));
            
            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }

    // Create and add scroll indicator to the body if it doesn't exist
    if (!document.getElementById('scroll-indicator')) {
        const scrollIndicator = document.createElement('div');
        scrollIndicator.id = 'scroll-indicator';
        document.body.appendChild(scrollIndicator);
    }

    const progressBar = document.getElementById('reading-progress-bar');
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        backToTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo(0, 800);
        });
    }

    // Gallery Modal Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.getElementById('galleryModal');
    
    if (galleryItems.length > 0 && galleryModal) {
        const modalTitle = galleryModal.querySelector('.gallery-modal-title');
        const modalImg = galleryModal.querySelector('.gallery-modal-img');
        const modalDescription = galleryModal.querySelector('.gallery-modal-description');
        const modalInstance = new bootstrap.Modal(galleryModal);
        
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Get data from gallery item
                const title = this.getAttribute('data-title');
                const img = this.getAttribute('data-img');
                const description = this.getAttribute('data-description');
                
                // Populate modal
                modalTitle.textContent = title;
                modalImg.src = img;
                modalImg.alt = title;
                modalDescription.textContent = description;
                
                // Show modal with animation
                modalInstance.show();
                
                // Apply entrance animation to modal content
                modalImg.classList.add('img-entrance');
                setTimeout(() => {
                    modalImg.classList.remove('img-entrance');
                }, 800);
            });
        });
        
        // Handle the "Richiedi Preventivo" button - smooth scroll after modal closes
        const contactBtn = galleryModal.querySelector('.gallery-contact-btn');
        if (contactBtn) {
            contactBtn.addEventListener('click', function() {
                setTimeout(() => {
                    const contactSection = document.querySelector(this.getAttribute('href'));
                    if (contactSection) {
                        const headerOffset = 80;
                        const elementPosition = contactSection.getBoundingClientRect().top;
                        const offsetPosition = window.pageYOffset + elementPosition - headerOffset;
                        
                        // Use our custom smooth scroll
                        smoothScrollTo(offsetPosition, 800);
                    }
                }, 350); // Small delay to allow modal to close first
            });
        }
    }

    // Optimize animations for mobile
    const isMobile = window.innerWidth < 768;
    
    // If on mobile, reduce animation duration for better performance
    if (isMobile) {
        // Adjust AOS settings for mobile
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600, // Shorter duration on mobile
                once: true,
                offset: 50 // Smaller offset for earlier animation trigger
            });
        }
    }
    
    // Better mobile touch handling for gallery items
    if (isMobile) {
        galleryItems.forEach(item => {
            // Add/Remove touch feedback class
            item.addEventListener('touchstart', function() {
                this.classList.add('touch-active');
            }, { passive: true });
            
            item.addEventListener('touchend', function() {
                this.classList.remove('touch-active');
            }, { passive: true });
        });
    }
    
    // Improved mobile navigation
    if (isMobile) {
        // Fix iOS touch delay on navbar toggle
        if (navbarToggler) {
            navbarToggler.addEventListener('touchend', function(e) {
                e.preventDefault();
                this.click();
            }, { passive: false });
        }
    }
    
    // Fix for mobile 100vh issue (address iOS Safari viewport height bug)
    function adjustMobileVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Adjust hero section height
        const heroSection = document.getElementById('hero');
        if (heroSection) {
            heroSection.style.height = `calc(var(--vh, 1vh) * 100)`;
        }
    }
    
    adjustMobileVH();
    window.addEventListener('resize', adjustMobileVH);
});
