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

    // --- Technical Work Simple Tabs Logic ---
    const techTabs = document.querySelectorAll('.tech-tab-btn');
    const techPanes = document.querySelectorAll('.tech-pane');

    window.switchTechTab = function(tabId) {
        techTabs.forEach(tab => {
            if (tab.dataset.tab === tabId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        techPanes.forEach(pane => {
            if (pane.id === tabId) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });
    };

    techTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            if (tabId) {
                window.switchTechTab(tabId);
            }
        });
    });

    // --- Agent Pipeline Mini-Switcher Logic ---
    const agentSubBtns = document.querySelectorAll('.agent-sub-btn');
    const agentSubPanes = document.querySelectorAll('.agent-subpane');

    agentSubBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subtabId = btn.dataset.subtab;
            agentSubBtns.forEach(b => b.classList.toggle('active', b === btn));
            agentSubPanes.forEach(pane => pane.classList.toggle('active', pane.id === subtabId));
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

    // --- Make Work Cards & Cert Cards Fully Clickable ---
    document.querySelectorAll('.work-card, .cert-card-clean').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const primaryLink = card.querySelector('a');
                if (primaryLink) {
                    primaryLink.click();
                }
            }
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

    // --- Interactive UI Style Switcher Controller ---
    const stylePicker = document.getElementById('stylePicker');
    const styleChoiceBtns = document.querySelectorAll('.style-choice-btn');
    const hidePickerBtn = document.getElementById('hidePickerBtn');
    const showPickerBtn = document.getElementById('showPickerBtn');

    function applyUITheme(themeName) {
        document.body.dataset.uiTheme = themeName;
        styleChoiceBtns.forEach(btn => {
            if (btn.dataset.style === themeName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        localStorage.setItem('preferred-ui-theme', themeName);
    }

    const savedTheme = localStorage.getItem('preferred-ui-theme') || 'studio';
    applyUITheme(savedTheme);

    styleChoiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const style = btn.dataset.style;
            applyUITheme(style);
        });
    });

    if (hidePickerBtn && stylePicker && showPickerBtn) {
        hidePickerBtn.addEventListener('click', () => {
            stylePicker.style.display = 'none';
            showPickerBtn.style.display = 'block';
        });

        showPickerBtn.addEventListener('click', () => {
            stylePicker.style.display = 'flex';
            showPickerBtn.style.display = 'none';
        });
    }

    // Interactive Spotlight Tracking on Mouse Move
    window.addEventListener('mousemove', (e) => {
        const x = Math.round((e.clientX / window.innerWidth) * 100);
        const y = Math.round((e.clientY / window.innerHeight) * 100);
        document.documentElement.style.setProperty('--spot-x', `${x}%`);
        document.documentElement.style.setProperty('--spot-y', `${y}%`);
    });
});
