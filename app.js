// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations (fade in)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Optional: stop observing once it has become visible
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    
    // --- Smart Navbar Logic ---
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add shadow when not at top
        if (scrollTop > 50) {
            navbar.classList.add('shadow');
        } else {
            navbar.classList.remove('shadow');
        }

        // Hide on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.classList.add('hide');
        } else {
            // Scrolling up
            navbar.classList.remove('hide');
        }
        lastScrollTop = scrollTop;
    });

    // --- Contact Modal Logic ---
    const contactModal = document.getElementById('contactModal');
    const openTabs = document.querySelectorAll('.open-modal-btn');
    const closeModal = document.getElementById('closeModal');
    const submitModal = document.getElementById('submitModal');
    
    // Open modal
    openTabs.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('open');
        });
    });

    // Close modal via button
    closeModal.addEventListener('click', () => {
        contactModal.classList.remove('open');
    });

    // Close modal via backdrop click
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            contactModal.classList.remove('open');
        }
    });

    // Submit Draft Email logic
    submitModal.addEventListener('click', () => {
        const name = document.getElementById('contactName').value.trim();
        const message = document.getElementById('contactMessage').value.trim();
        
        if (!message) {
            alert('Please include a message!');
            return;
        }

        // Construct standard mailto structure
        const targetEmail = "luke.r.christensen@gmail.com";
        const subject = encodeURIComponent(`Portfolio Connect: ${name ? name : "New Inquiry"}`);
        const body = encodeURIComponent(`Hi Luke,\n\n${message}\n\n${name ? `- ${name}` : ""}`);
        
        window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
        contactModal.classList.remove('open');
    });

    // --- Slideshow Logic ---
    let slideIndex = 1;
    let slideInterval;
    
    window.changeSlide = function(n) {
        showSlides(slideIndex += n);
        resetInterval();
    };

    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
        resetInterval();
    };

    function showSlides(n) {
        let slides = document.querySelectorAll(".slide");
        let dots = document.querySelectorAll(".dot");
        
        if (slides.length === 0) return; // Exit if no slides exist
        
        if (n > slides.length) {slideIndex = 1}    
        if (n < 1) {slideIndex = slides.length}
        
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));
        
        slides[slideIndex-1].classList.add("active");  
        dots[slideIndex-1].classList.add("active");
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => { window.changeSlide(1); }, 5000);
    }

    // Initialize
    showSlides(slideIndex);
    resetInterval();

    // --- Document Viewer Logic ---
    const viewerModal = document.getElementById('viewerModal');
    const closeViewer = document.getElementById('closeViewer');
    const viewerFrame = document.getElementById('viewerFrame');
    const viewerTitle = document.getElementById('viewerTitle');
    const viewerExternalLink = document.getElementById('viewerExternalLink');

    // Detect mobile: phones can't scroll PDFs inside iframes, so we open in new tab instead
    const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);

    const projectLinks = document.querySelectorAll('.project-link, .view-doc-link');

    projectLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const isPdf = href.toLowerCase().endsWith('.pdf');

            if (isPdf) {
                e.preventDefault();

                if (isMobile()) {
                    // On mobile: open PDF directly in new tab — native, scrollable, full-featured
                    window.open(href, '_blank');
                } else {
                    // On desktop: use the in-window document viewer modal
                    const card = link.closest('.project-card') || link.closest('.timeline-item');
                    const title = card ? card.querySelector('h3').innerText : "Document Viewer";
                    viewerTitle.innerText = title;
                    viewerExternalLink.href = href;

                    viewerModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                    viewerFrame.src = href;
                }
            }
            // For .fig files or others, let default browser behavior happen (download)
        });
    });

    const hideViewer = () => {
        viewerModal.classList.remove('open');
        viewerFrame.src = ''; // Clear iframe to stop background loading
        document.body.style.overflow = '';
    };

    closeViewer.addEventListener('click', hideViewer);
    viewerModal.addEventListener('click', (e) => {
        if (e.target === viewerModal) hideViewer();
    });
});
