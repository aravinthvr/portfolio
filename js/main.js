// Portfolio website functionality
document.addEventListener('DOMContentLoaded', () => {
    // Define a function that will be called after all components are loaded
    window.initSite = function() {
        console.log('Initializing site functionality...');
        
        // DOM Elements - access these after components are loaded
        const body = document.querySelector('body');
        const themeToggle = document.getElementById('themeToggle');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        const dropdowns = document.querySelectorAll('.dropdown');
        const scrollToTopBtn = document.getElementById('scrollToTop');
        const currentYearSpan = document.getElementById('current-year');
        const projectFilters = document.querySelectorAll('.filter-button');
        const contactForm = document.getElementById('contactForm');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Theme Switcher
    function initTheme() {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (savedTheme === null && prefersDarkScheme)) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
        }
    }

    if (themeToggle) {
        // Ensure theme toggle reflects current theme
        themeToggle.addEventListener('click', () => {
            // Toggle theme classes
            document.body.classList.toggle('dark-theme');
            
            // Save preference to localStorage
            const isDarkMode = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Log for debugging
            console.log('Theme toggled. Current theme:', isDarkMode ? 'dark' : 'light');
        });
    }

    // Mobile Navigation
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            // Toggle active class on the nav toggle button
            navToggle.classList.toggle('active');
            
            // Toggle active class on the menu
            navMenu.classList.toggle('active');
            
            // Add/remove body scroll lock when menu is open
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile nav when clicking a link
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', () => {
                    if (navToggle && navMenu) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }
    
    // Handle dropdown toggles
    if (dropdownToggles.length > 0) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                
                if (window.innerWidth <= 768) {
                    // Mobile view behavior - toggle dropdown
                    
                    // Close other dropdowns
                    dropdowns.forEach(d => {
                        if (d !== dropdown) {
                            d.classList.remove('active');
                        }
                    });
                    
                    // Toggle current dropdown
                    dropdown.classList.toggle('active');
                } else {
                    // Desktop view behavior - click to toggle
                    if (dropdown.classList.contains('active')) {
                        dropdown.classList.remove('active');
                    } else {
                        // Close any open dropdowns
                        dropdowns.forEach(d => d.classList.remove('active'));
                        // Open the clicked dropdown
                        dropdown.classList.add('active');
                    }
                }
            });
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Active Navigation Link on Scroll
    function setActiveLink() {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100; // Offset for better UX

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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

    // Scroll to Top Button
    function toggleScrollToTopBtn() {
        if (scrollToTopBtn) {
            if (window.scrollY > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Resume PDF Preview/Download
    const previewButtons = document.querySelectorAll('.btn-preview');
    previewButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const pdfPath = btn.getAttribute('href');
            if (pdfPath && pdfPath !== '#') {
                window.open(pdfPath, '_blank');
            }
        });
    });

    // Project Filters
    projectFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            const filterValue = filter.getAttribute('data-filter');
            
            // Remove active class from all filters and add to current
            projectFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            // Show/hide projects based on filter
            const projectCards = document.querySelectorAll('.project-card');
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Remove any existing success message
            const oldMsg = contactForm.parentNode.querySelector('.form-success');
            if (oldMsg) oldMsg.remove();

            // Optionally disable the submit button
            const submitBtn = contactForm.querySelector('.btn-submit');
            if (submitBtn) submitBtn.disabled = true;

            // Get form data
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();

                    // Show success message
                    const successMsg = document.createElement('div');
                    successMsg.classList.add('form-success');
                    successMsg.textContent = 'Thank you for your message! I will get back to you soon.';

                    contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);

                    // Optionally hide the form after submission
                    // contactForm.style.display = 'none';

                    setTimeout(() => {
                        successMsg.remove();
                        // Optionally show the form again
                        // contactForm.style.display = '';
                    }, 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Oops! There was a problem submitting your form. Please try again later.');
            })
            .finally(() => {
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }

    // Intersection Observer for animations
    function setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, options);

        // Observe sections for animations
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });
    }

    // Initialize Functions
    initTheme();
    setupIntersectionObserver();

    // Event Listeners
    window.addEventListener('scroll', () => {
        setActiveLink();
        toggleScrollToTopBtn();
    });
      // Initial call to functions that need to run on page load
    setActiveLink();
    toggleScrollToTopBtn();
    
    console.log('Site initialization complete.');
    };
    
    // Note: initSite will be called by the component loader in index_new.html
});
