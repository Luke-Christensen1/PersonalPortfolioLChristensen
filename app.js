// Intersection Observer for scroll animations (fade in)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    // --- Smart Navbar Hide on Scroll Down, Show on Scroll Up ---
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 120) {
            navbar.classList.add('hide');
        } else {
            navbar.classList.remove('hide');
        }
        lastScrollTop = Math.max(0, scrollTop);
    });

    // --- Guided View Controller Logic (Progressive Disclosure) ---
    const viewPanes = document.querySelectorAll('.view-pane');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#view-"]');

    function activateView(viewId, updateHash = true) {
        if (!viewId) viewId = 'overview';
        const cleanId = viewId.replace(/^#?view-?/, '');
        const targetPane = document.getElementById(`view-${cleanId}`) || document.getElementById('view-overview');
        
        if (!targetPane) return;

        // Switch active view
        viewPanes.forEach(pane => pane.classList.remove('active'));
        targetPane.classList.add('active');

        // Update nav active indicators
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === `#view-${cleanId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Trigger animations
        targetPane.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

        if (updateHash) {
            history.pushState(null, '', `#view-${cleanId}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    window.activateView = activateView;

    // Handle view navigation on data-navigate elements & nav links
    document.querySelectorAll('[data-navigate]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const targetView = el.dataset.navigate;
            activateView(targetView);
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const viewId = link.getAttribute('href').replace('#view-', '');
            activateView(viewId);
        });
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#view-')) {
            activateView(hash.replace('#view-', ''), false);
        } else if (!hash || hash === '#overview' || hash === '#') {
            activateView('overview', false);
        }
    });

    // Check initial hash on load
    const initialHash = window.location.hash;
    if (initialHash && initialHash.startsWith('#view-')) {
        activateView(initialHash.replace('#view-', ''), false);
    } else {
        activateView('overview', false);
    }

    // --- Interactive System Architecture & Pipeline Workbench Tabs ---
    const workbenchTabs = document.querySelectorAll('.workbench-tab-btn');
    const systemPanes = document.querySelectorAll('.system-pane');

    window.switchSystemTab = function(tabId) {
        workbenchTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        systemPanes.forEach(pane => {
            if (pane.id === tabId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    };

    workbenchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            if (tabId) {
                window.switchSystemTab(tabId);
            }
        });
    });

    // --- Featured Work Category Filter Logic ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            projectCards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    card.classList.add('visible');
                } else {
                    card.style.display = 'none';
                }
            });
        });
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
        
        if (slides.length === 0) return;
        
        if (n > slides.length) { slideIndex = 1; }    
        if (n < 1) { slideIndex = slides.length; }
        
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));
        
        slides[slideIndex - 1].classList.add("active");  
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add("active");
        }
    }

    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(() => { window.changeSlide(1); }, 6000);
    }

    showSlides(slideIndex);
    resetInterval();

    // --- Document Viewer Modal Logic ---
    const viewerModal = document.getElementById('viewerModal');
    const closeViewer = document.getElementById('closeViewer');
    const viewerFrame = document.getElementById('viewerFrame');
    const viewerTitle = document.getElementById('viewerTitle');
    const viewerExternalLink = document.getElementById('viewerExternalLink');

    const isMobile = () => window.innerWidth <= 768 || ('ontouchstart' in window && window.innerWidth <= 1024);

    const docLinks = document.querySelectorAll('.project-link, .view-doc-link');

    docLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const isPdf = href.toLowerCase().endsWith('.pdf');

            if (isPdf) {
                e.preventDefault();

                if (isMobile()) {
                    window.open(href, '_blank');
                } else {
                    const card = link.closest('.project-card') || link.closest('.timeline-item') || link.closest('.cert-card');
                    const title = card ? (card.querySelector('h3') ? card.querySelector('h3').innerText : "Document Viewer") : "Document Viewer";
                    viewerTitle.innerText = title;
                    viewerExternalLink.href = href;

                    viewerModal.classList.add('open');
                    document.body.style.overflow = 'hidden';
                    viewerFrame.src = href;
                }
            }
        });
    });

    const hideViewer = () => {
        viewerModal.classList.remove('open');
        viewerFrame.src = '';
        document.body.style.overflow = '';
    };

    if (closeViewer) closeViewer.addEventListener('click', hideViewer);
    if (viewerModal) {
        viewerModal.addEventListener('click', (e) => {
            if (e.target === viewerModal) hideViewer();
        });
    }

    // --- Contact Modal Logic ---
    const contactModal = document.getElementById('contactModal');
    const openBtns = document.querySelectorAll('.open-modal-btn');
    const closeModal = document.getElementById('closeModal');
    const submitModal = document.getElementById('submitModal');
    
    openBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('open');
        });
    });

    const hideContact = () => {
        contactModal.classList.remove('open');
    };

    if (closeModal) closeModal.addEventListener('click', hideContact);
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) hideContact();
        });
    }

    if (submitModal) {
        submitModal.addEventListener('click', () => {
            const name = document.getElementById('contactName').value.trim();
            const message = document.getElementById('contactMessage').value.trim();
            
            if (!message) {
                alert('Please write a message!');
                return;
            }

            const targetEmail = "luke.r.christensen@gmail.com";
            const subject = encodeURIComponent(`Portfolio Connect: ${name ? name : "New Inquiry"}`);
            const body = encodeURIComponent(`Hi Luke,\n\n${message}\n\n${name ? `- ${name}` : ""}`);
            
            window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
            hideContact();
        });
    }
});
