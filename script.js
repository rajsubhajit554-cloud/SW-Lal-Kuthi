// ============================================================
// GUARANTEED PRELOADER INITIALIZATION & SAFETY FALLBACK
// ============================================================
(function() {
    let preloaderDismissed = false;
    function dismissPreloader() {
        if (preloaderDismissed) return;
        preloaderDismissed = true;
        
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('preloader-fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 900);
        }
        document.body.classList.remove('no-scroll');

        // Trigger promo modal if present
        const promoModal = document.getElementById('promo-modal');
        if (promoModal && typeof openPromoModal === 'function') {
            setTimeout(openPromoModal, 300);
        }
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(dismissPreloader, 800);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(dismissPreloader, 800));
        window.addEventListener('load', () => setTimeout(dismissPreloader, 800));
    }
    
    // Hard fallback timeout (maximum 2.5 seconds)
    setTimeout(dismissPreloader, 2500);
})();
// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});

// Mobile & Desktop Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent document click handler from firing immediately
    navLinks.classList.toggle('nav-active');
    });
}

// Close menu when a link is clicked
const navItems = document.querySelectorAll('.nav-links li a');
if (navItems && navLinks) {
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
        });
    });
}

// Close menu when clicking anywhere outside the menu and hamburger button
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('nav-active')) {
        if (!navLinks.contains(e.target) && (!hamburger || !hamburger.contains(e.target))) {
            navLinks.classList.remove('nav-active');
        }
    }
});

// Close menu when user scrolls the page
window.addEventListener('scroll', () => {
    if (navLinks && navLinks.classList.contains('nav-active')) {
        navLinks.classList.remove('nav-active');
    }
});

// Reveal Elements on Scroll
const revealElements = document.querySelectorAll('.reviews-slider-container, .vibe-text, .contact-container');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
            el.style.transition = 'all 0.8s ease-out';
        } else if (!el.style.opacity) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(50px)';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Banner Image Slider (Fade and Scale Effect with Hover Preview & Side Click Zones)
const bannerImages = document.querySelectorAll('.hero-bg img');
const leftZone = document.querySelector('.hero-nav-zone.left-zone');
const rightZone = document.querySelector('.hero-nav-zone.right-zone');

let currentImageIndex = 0;
let lastDisplayedIndex = -1;
let bannerInterval;

function updateBannerBg(imgElement) {
    const bannerContainer = document.querySelector('.hero-bg');
    if (bannerContainer && imgElement) {
        bannerContainer.style.setProperty('--bg-image', `url("${imgElement.src}")`);
    }
}

function transitionToBannerImage(targetIndex) {
    if (targetIndex === lastDisplayedIndex) return;
    if (targetIndex < 0 || targetIndex >= bannerImages.length) return;
    
    bannerImages.forEach(img => {
        img.classList.remove('active', 'prev');
    });
    
    if (lastDisplayedIndex !== -1 && lastDisplayedIndex < bannerImages.length) {
        bannerImages[lastDisplayedIndex].classList.add('prev');
    }
    
    bannerImages[targetIndex].classList.add('active');
    updateBannerBg(bannerImages[targetIndex]);
    lastDisplayedIndex = targetIndex;
}

function rotateBanner() {
    if (bannerImages.length <= 1) return;
    const nextIndex = (currentImageIndex + 1) % bannerImages.length;
    transitionToBannerImage(nextIndex);
    currentImageIndex = nextIndex;
}

function startBannerTimer() {
    stopBannerTimer();
    if (bannerImages.length > 1) {
        bannerInterval = setInterval(rotateBanner, 5000); // Change image every 5 seconds
    }
}

function stopBannerTimer() {
    if (bannerInterval) {
        clearInterval(bannerInterval);
    }
}

// Initialize banner
if (bannerImages.length > 0) {
    transitionToBannerImage(0);
    startBannerTimer();
}

// Add event listeners for navigation zones
if (leftZone && bannerImages.length > 1) {
    leftZone.addEventListener('click', () => {
        const prevIndex = (currentImageIndex - 1 + bannerImages.length) % bannerImages.length;
        currentImageIndex = prevIndex;
        transitionToBannerImage(currentImageIndex);
        startBannerTimer(); // reset auto-slide timer on manual click
    });
}

if (rightZone && bannerImages.length > 1) {
    rightZone.addEventListener('click', () => {
        const nextIndex = (currentImageIndex + 1) % bannerImages.length;
        currentImageIndex = nextIndex;
        transitionToBannerImage(currentImageIndex);
        startBannerTimer(); // reset auto-slide timer on manual click
    });
}

// Reviews Slider Animation
const reviewItems = document.querySelectorAll('.reviews-slider .review-slide');
const reviewDots = document.querySelectorAll('.slider-dots .dot');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentReviewIndex = 0;
let reviewInterval;

function showReview(index) {
    if (reviewItems.length === 0) return;
    
    // Wrap around index
    if (index >= reviewItems.length) {
        currentReviewIndex = 0;
    } else if (index < 0) {
        currentReviewIndex = reviewItems.length - 1;
    } else {
        currentReviewIndex = index;
    }
    
    // Update active classes for reviews
    reviewItems.forEach((item, i) => {
        if (i === currentReviewIndex) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Update active classes for dots
    reviewDots.forEach((dot, i) => {
        if (i === currentReviewIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function startReviewTimer() {
    stopReviewTimer();
    reviewInterval = setInterval(() => {
        showReview(currentReviewIndex + 1);
    }, 5000); // changes review every 5 seconds
}

function stopReviewTimer() {
    if (reviewInterval) {
        clearInterval(reviewInterval);
    }
}

// Event Listeners for controls
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        showReview(currentReviewIndex + 1);
        startReviewTimer(); // reset timer on manual click
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        showReview(currentReviewIndex - 1);
        startReviewTimer(); // reset timer on manual click
    });
}

if (reviewDots) {
    reviewDots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showReview(index);
            startReviewTimer(); // reset timer on manual click
        });
    });
}

// Initialize reviews slider
if (reviewItems.length > 0) {
    showReview(0);
    startReviewTimer();
}

// Preloader Screen Logic (Fades out after 1 second and reveals Promo Poster if present)
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('preloader-fade-out');
            
            // Show Promo Modal after preloader fades out
            const promoModal = document.getElementById('promo-modal');
            if (promoModal) {
                setTimeout(openPromoModal, 300);
            } else {
                document.body.classList.remove('no-scroll'); // Re-enable vertical scrolling if no promo modal
            }
        }, 1000); // 1 second duration
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', initPreloader);
} else {
    initPreloader();
}

// Rath Yatra Hotel Feast Click-to-Activate Animation
const templeBell = document.getElementById('temple-bell');
const rathAltar = document.getElementById('rath-feast-altar');
if (templeBell && rathAltar) {
    templeBell.addEventListener('click', () => {
        if (!rathAltar.classList.contains('activated')) {
            rathAltar.classList.add('activated');
            
            // Reset animations after 2.5 seconds
            setTimeout(() => {
                rathAltar.classList.remove('activated');
            }, 2500);
        }
    });
}

// ============================================================
// SLIDE-OUT MESSAGE PANEL LOGIC
// ============================================================
// Message Panel Logic
const closeMsgPanelBtn = document.getElementById('close-msg-panel-btn');
const msgPanel = document.getElementById('msg-panel');
const msgPanelOverlay = document.getElementById('msg-panel-overlay');
const msgPanelForm = document.getElementById('msg-panel-form');
const submitMsgBtn = document.getElementById('submit-msg-btn');
const msgStatusContainer = document.getElementById('msg-status-container');
const openMsgPanelDirectBtn = document.getElementById('open-msg-panel-direct-btn');

// Google Sheet Web App URL provided by user
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwFRBfgECv4kyCOJCrjDmpbWn4oIkiCJOpGndOI_d3SCzTtWGuG14uJZ2xGtUIDEsL8/exec";

function openMessagePanel() {
    if (msgPanel && msgPanelOverlay) {
        msgPanel.classList.add('active');
        msgPanelOverlay.classList.add('active');
        document.body.classList.add('no-scroll'); // Disable page scrolling
    }
}

function closeMessagePanel() {
    if (msgPanel && msgPanelOverlay) {
        msgPanel.classList.remove('active');
        msgPanelOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll'); // Restore page scrolling
        // Reset status message
        if (msgStatusContainer) {
            msgStatusContainer.style.display = 'none';
            msgStatusContainer.className = 'msg-status-container';
        }
    }
}

if (openMsgPanelDirectBtn) {
    openMsgPanelDirectBtn.addEventListener('click', openMessagePanel);
}

if (closeMsgPanelBtn) {
    closeMsgPanelBtn.addEventListener('click', closeMessagePanel);
}

if (msgPanelOverlay) {
    msgPanelOverlay.addEventListener('click', closeMessagePanel);
}

// Handle Form Submission
if (msgPanelForm) {
    msgPanelForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameInput = document.getElementById('msg-name');
        const emailInput = document.getElementById('msg-email');
        const contentInput = document.getElementById('msg-content');

        if (!nameInput || !emailInput || !contentInput) return;

        const payload = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: contentInput.value.trim()
        };

        // Disable button and show loading state
        submitMsgBtn.disabled = true;
        const originalBtnContent = submitMsgBtn.innerHTML;
        submitMsgBtn.innerHTML = '<div class="btn-loader"></div> Sending...';

        // Hide previous status
        if (msgStatusContainer) {
            msgStatusContainer.style.display = 'none';
        }

        // Send post request to Google Sheets script
        fetch(GOOGLE_SHEET_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8' // Apps Script handles text/plain without triggering CORS preflight options blocks in some environments
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            // Apps script returns 200 or redirect
            submitMsgBtn.innerHTML = originalBtnContent;
            submitMsgBtn.disabled = false;
            
            if (msgStatusContainer) {
                msgStatusContainer.textContent = "Your message was sent successfully! Thank you.";
                msgStatusContainer.className = "msg-status-container success";
            }
            
            // Clear inputs
            msgPanelForm.reset();
            
            // Auto close after 3 seconds
            setTimeout(closeMessagePanel, 3000);
        })
        .catch((error) => {
            // Error response
            submitMsgBtn.innerHTML = originalBtnContent;
            submitMsgBtn.disabled = false;
            
            if (msgStatusContainer) {
                msgStatusContainer.textContent = "Something went wrong. Please try again.";
                msgStatusContainer.className = "msg-status-container error";
            }
            console.error("Error submitting contact form:", error);
        });
    });
}

// ============================================================
// PROMOTIONAL POSTER MODAL LOGIC
// ============================================================
const promoModal = document.getElementById('promo-modal');
const closePromoModalBtn = document.getElementById('close-promo-modal-btn');
const promoModalOverlay = document.querySelector('.promo-modal-overlay');
const promoModalContent = document.querySelector('.promo-modal-content');
const openPromoModalDirectBtn = document.getElementById('open-promo-modal-direct-btn');
let promoAutoCloseTimer = null;

function closePromoModal() {
    if (promoAutoCloseTimer) {
        clearTimeout(promoAutoCloseTimer);
        promoAutoCloseTimer = null;
    }
    if (promoModal && promoModalContent) {
        const button = document.getElementById('open-promo-modal-direct-btn');
        if (button) {
            const buttonRect = button.getBoundingClientRect();
            const contentRect = promoModalContent.getBoundingClientRect();

            // Calculate exact center coordinates difference
            const dx = (buttonRect.left + buttonRect.width / 2) - (contentRect.left + contentRect.width / 2);
            const dy = (buttonRect.top + buttonRect.height / 2) - (contentRect.top + contentRect.height / 2);

            // Apply to CSS variables
            promoModalContent.style.setProperty('--fly-x', `${dx}px`);
            promoModalContent.style.setProperty('--fly-y', `${dy}px`);
        }

        // Add closing state to trigger scale and translation
        promoModal.classList.add('closing');
        document.body.classList.remove('no-scroll'); // Restore scrolling

        setTimeout(() => {
            promoModal.classList.remove('active', 'closing');
            promoModalContent.style.removeProperty('--fly-x');
            promoModalContent.style.removeProperty('--fly-y');
        }, 650); // 650ms match with CSS keyframe animation duration
    } else if (promoModal) {
        promoModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
}

function openPromoModal() {
    if (promoModal) {
        if (promoAutoCloseTimer) {
            clearTimeout(promoAutoCloseTimer);
        }
        promoModal.classList.remove('closing');
        if (promoModalContent) {
            promoModalContent.style.removeProperty('--fly-x');
            promoModalContent.style.removeProperty('--fly-y');
        }
        promoModal.classList.add('active');
        document.body.classList.add('no-scroll'); // Lock scrolling

        // Automatically close the promo poster modal after 6 seconds (6000ms)
        promoAutoCloseTimer = setTimeout(() => {
            closePromoModal();
        }, 6000);
    }
}

if (openPromoModalDirectBtn) {
    openPromoModalDirectBtn.addEventListener('click', openPromoModal);
}

if (closePromoModalBtn) {
    closePromoModalBtn.addEventListener('click', closePromoModal);
}

if (promoModalOverlay) {
    promoModalOverlay.addEventListener('click', closePromoModal);
}

// ============================================================

// ============================================================
// MAIN RESTAURANT MENU HORIZONTAL SCROLL & CATEGORY FILTER
// ============================================================
const mainRestaurantMenuScroll = document.getElementById('main-restaurant-menu-scroll');
const inPageMenuTabs = document.querySelectorAll('.menu-category-tabs .menu-tab-btn');
const inPageFoodCards = document.querySelectorAll('#main-restaurant-menu-scroll .food-menu-card');

if (mainRestaurantMenuScroll) {
    // Normal mouse wheel horizontal scroll
    mainRestaurantMenuScroll.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            mainRestaurantMenuScroll.scrollLeft += e.deltaY;
        }
    }, { passive: false });

    // Mouse Drag to Scroll
    let isMouseDownMain = false;
    let startXMain = 0;
    let scrollLeftMain = 0;

    mainRestaurantMenuScroll.addEventListener('mousedown', (e) => {
        isMouseDownMain = true;
        startXMain = e.pageX - mainRestaurantMenuScroll.offsetLeft;
        scrollLeftMain = mainRestaurantMenuScroll.scrollLeft;
    });

    mainRestaurantMenuScroll.addEventListener('mouseleave', () => {
        isMouseDownMain = false;
    });

    mainRestaurantMenuScroll.addEventListener('mouseup', () => {
        isMouseDownMain = false;
    });

    mainRestaurantMenuScroll.addEventListener('mousemove', (e) => {
        if (!isMouseDownMain) return;
        e.preventDefault();
        const x = e.pageX - mainRestaurantMenuScroll.offsetLeft;
        const walk = (x - startXMain) * 1.5;
        mainRestaurantMenuScroll.scrollLeft = scrollLeftMain - walk;
    });
}

if (inPageMenuTabs.length > 0 && inPageFoodCards.length > 0) {
    inPageMenuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            inPageMenuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const selectedCategory = tab.getAttribute('data-category');

            inPageFoodCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });

            // Smoothly reset track to beginning when category is clicked
            if (mainRestaurantMenuScroll) {
                mainRestaurantMenuScroll.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    });
}


// ============================================================
// IN-PAGE FULL MENU POPUP MODAL LOGIC
// ============================================================
const fullMenuModal = document.getElementById('full-menu-modal');
const openFullMenuModalBtn = document.getElementById('open-full-menu-modal-btn');
const closeFullMenuModalBtn = document.getElementById('close-full-menu-modal-btn');
const closeFullMenuIconBtn = document.getElementById('close-full-menu-icon-btn');
const fullMenuModalOverlay = document.getElementById('full-menu-modal-overlay');
const modalMenuSearchInput = document.getElementById('modal-menu-search-input');
const modalCategoryTabs = document.querySelectorAll('#modal-menu-category-tabs .menu-tab-btn');
const modalFoodCards = document.querySelectorAll('#modal-full-menu-grid .food-menu-card');
const modalNoResultsMsg = document.getElementById('modal-no-results-msg');
const modalTimingBtn = document.getElementById('modal-timing-btn');
const modalOrderTimingsSection = document.getElementById('modal-order-timings');

let modalActiveCategory = 'all';

function filterModalMenu() {
    if (!modalFoodCards || modalFoodCards.length === 0) return;
    const query = modalMenuSearchInput ? modalMenuSearchInput.value.toLowerCase().trim() : '';
    let visibleCount = 0;

    modalFoodCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const keywords = (card.getAttribute('data-keywords') || '') + ' ' + card.innerText.toLowerCase();

        const matchesCategory = (modalActiveCategory === 'all' || cardCategory === modalActiveCategory);
        const matchesSearch = query === '' || keywords.includes(query);

        if (matchesCategory && matchesSearch) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    if (modalNoResultsMsg) {
        modalNoResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function openFullMenuModal() {
    if (fullMenuModal) {
        fullMenuModal.classList.add('active');
        fullMenuModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');

        // Reset filter
        modalActiveCategory = 'all';
        if (modalCategoryTabs) {
            modalCategoryTabs.forEach(t => {
                if (t.getAttribute('data-category') === 'all') {
                    t.classList.add('active');
                } else {
                    t.classList.remove('active');
                }
            });
        }
        if (modalMenuSearchInput) {
            modalMenuSearchInput.value = '';
        }
        filterModalMenu();
    }
}

function closeFullMenuModal() {
    if (fullMenuModal) {
        fullMenuModal.classList.remove('active');
        fullMenuModal.setAttribute('aria-hidden', 'true');
        
        // Only remove no-scroll if promo modal and message panel are not active
        const promoActive = promoModal && promoModal.classList.contains('active');
        const msgActive = document.getElementById('msg-panel') && document.getElementById('msg-panel').classList.contains('active');
        if (!promoActive && !msgActive) {
            document.body.classList.remove('no-scroll');
        }
    }
}

if (openFullMenuModalBtn) {
    openFullMenuModalBtn.addEventListener('click', openFullMenuModal);
}

if (closeFullMenuModalBtn) {
    closeFullMenuModalBtn.addEventListener('click', closeFullMenuModal);
}

if (closeFullMenuIconBtn) {
    closeFullMenuIconBtn.addEventListener('click', closeFullMenuModal);
}

if (fullMenuModalOverlay) {
    fullMenuModalOverlay.addEventListener('click', closeFullMenuModal);
}

// Category filter tabs inside modal
if (modalCategoryTabs.length > 0) {
    modalCategoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            modalCategoryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            modalActiveCategory = tab.getAttribute('data-category');
            filterModalMenu();
        });
    });
}

// Live search inside modal
if (modalMenuSearchInput) {
    modalMenuSearchInput.addEventListener('input', filterModalMenu);
}

// Two-Way Scroll for Modal Timings Button (Down to Timings / Up to Top)
const modalBody = document.querySelector('.full-menu-modal-body');
const modalTimingIcon = modalTimingBtn ? modalTimingBtn.querySelector('i') : null;
const modalTimingText = modalTimingBtn ? modalTimingBtn.querySelector('span') : null;

function isNearModalTimings() {
    if (!modalOrderTimingsSection || !modalBody) return false;
    const modalBodyRect = modalBody.getBoundingClientRect();
    const timingsRect = modalOrderTimingsSection.getBoundingClientRect();
    const isScrolledToBottom = (modalBody.scrollTop + modalBody.clientHeight >= modalBody.scrollHeight - 150);
    return (timingsRect.top <= modalBodyRect.bottom - 120) || isScrolledToBottom;
}

if (modalTimingBtn && modalOrderTimingsSection && modalBody) {
    modalTimingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isNearModalTimings()) {
            modalBody.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            modalOrderTimingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    modalBody.addEventListener('scroll', () => {
        if (isNearModalTimings()) {
            modalTimingBtn.classList.add('at-bottom');
            if (modalTimingIcon) modalTimingIcon.className = 'fas fa-arrow-up';
            if (modalTimingText) modalTimingText.innerText = 'Top';
            modalTimingBtn.title = 'Scroll back to Top (উপরে ফিরে যান)';
        } else {
            modalTimingBtn.classList.remove('at-bottom');
            if (modalTimingIcon) modalTimingIcon.className = 'fas fa-clock';
            if (modalTimingText) modalTimingText.innerText = 'Timings';
            modalTimingBtn.title = 'Order Timings (অর্ডার সময়সূচী)';
        }
    }, { passive: true });
}

// Close full menu modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fullMenuModal && fullMenuModal.classList.contains('active')) {
        closeFullMenuModal();
    }
});
