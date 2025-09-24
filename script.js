// Testimonials data
const testimonials = [
    'assets/images/testimonials/3.webp',
    'assets/images/testimonials/6(1).webp',
    'assets/images/testimonials/4.webp',
    'assets/images/testimonials/2.webp',
    'assets/images/testimonials/10.webp',
    'assets/images/testimonials/3(1).webp',
    'assets/images/testimonials/6.webp',
    'assets/images/testimonials/8.webp'
];

class TestimonialsSlider {
    constructor() {
        this.slider = document.getElementById('testimonialsSlider');
        this.track = document.getElementById('testimonialsTrack');
        this.currentIndex = 0;
        this.cardWidth = 350;
        this.gap = 30;
        this.visibleCards = this.getVisibleCards();
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.initialTransform = 0;
        
        this.init();
        this.setupEventListeners();
        this.setupResponsive();
    }
    
    getVisibleCards() {
        if (window.innerWidth <= 480) return 1;
        if (window.innerWidth <= 768) return 2;
        return 3;
    }
    
    init() {
        // Create testimonial cards
        testimonials.forEach((imageSrc, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `<img src="${imageSrc}" alt="Depoimento ${index + 1}" class="testimonial-image">`;
            this.track.appendChild(card);
        });
        
        // Duplicate cards for infinite scroll
        testimonials.forEach((imageSrc, index) => {
            const card = document.createElement('div');
            card.className = 'testimonial-card';
            card.innerHTML = `<img src="${imageSrc}" alt="Depoimento ${index + 1}" class="testimonial-image">`;
            this.track.appendChild(card);
        });
        
        this.updateCardWidth();
        this.updateSliderPosition();
    }
    
    updateCardWidth() {
        if (window.innerWidth <= 480) {
            this.cardWidth = 250;
            this.gap = 20;
        } else if (window.innerWidth <= 768) {
            this.cardWidth = 280;
            this.gap = 25;
        } else {
            this.cardWidth = 350;
            this.gap = 30;
        }
        
        const cards = this.track.querySelectorAll('.testimonial-card');
        cards.forEach(card => {
            card.style.flex = `0 0 ${this.cardWidth}px`;
        });
    }
    
    setupEventListeners() {
        // Mouse events
        this.slider.addEventListener('mousedown', this.handleStart.bind(this));
        this.slider.addEventListener('mousemove', this.handleMove.bind(this));
        this.slider.addEventListener('mouseup', this.handleEnd.bind(this));
        this.slider.addEventListener('mouseleave', this.handleEnd.bind(this));
        
        // Touch events
        this.slider.addEventListener('touchstart', this.handleStart.bind(this));
        this.slider.addEventListener('touchmove', this.handleMove.bind(this));
        this.slider.addEventListener('touchend', this.handleEnd.bind(this));
        
        // Prevent default drag behavior on images
        this.slider.addEventListener('dragstart', (e) => e.preventDefault());
    }
    
    setupResponsive() {
        window.addEventListener('resize', () => {
            this.visibleCards = this.getVisibleCards();
            this.updateCardWidth();
            this.updateSliderPosition();
        });
    }
    
    handleStart(e) {
        this.isDragging = true;
        this.startX = this.getEventX(e);
        this.initialTransform = this.getCurrentTransform();
        this.slider.style.cursor = 'grabbing';
        
        // Stop any ongoing transitions
        this.track.style.transition = 'none';
    }
    
    handleMove(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.currentX = this.getEventX(e);
        const deltaX = this.currentX - this.startX;
        const newTransform = this.initialTransform + deltaX;
        
        this.track.style.transform = `translateX(${newTransform}px)`;
    }
    
    handleEnd(e) {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.slider.style.cursor = 'grab';
        
        // Re-enable transitions
        this.track.style.transition = 'transform 0.3s ease';
        
        const deltaX = this.currentX - this.startX;
        const threshold = this.cardWidth / 3;
        
        if (Math.abs(deltaX) > threshold) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        } else {
            this.updateSliderPosition();
        }
    }
    
    getEventX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }
    
    getCurrentTransform() {
        const transform = window.getComputedStyle(this.track).transform;
        if (transform === 'none') return 0;
        
        const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(', ');
        return parseFloat(matrix[4]);
    }
    
    nextSlide() {
        this.currentIndex++;
        if (this.currentIndex >= testimonials.length) {
            this.currentIndex = 0;
        }
        this.updateSliderPosition();
    }
    
    prevSlide() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = testimonials.length - 1;
        }
        this.updateSliderPosition();
    }
    
    updateSliderPosition() {
        const translateX = -this.currentIndex * (this.cardWidth + this.gap);
        this.track.style.transform = `translateX(${translateX}px)`;
        
        // Handle infinite scroll
        if (this.currentIndex >= testimonials.length) {
            setTimeout(() => {
                this.track.style.transition = 'none';
                this.currentIndex = 0;
                this.track.style.transform = `translateX(0px)`;
                setTimeout(() => {
                    this.track.style.transition = 'transform 0.3s ease';
                }, 50);
            }, 300);
        }
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            if (!this.isDragging) {
                this.nextSlide();
            }
        }, 4000);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
        }
    }
}

// Payment link functionality
function setupPaymentLinks() {
    const paymentUrl = 'https://pay.cakto.com.br/ij3ekbu_416993';
    
    // Get all buttons that should link to payment
    const paymentButtons = document.querySelectorAll('.badge-button, .cta-button, .offer-cta, .guarantee-cta');
    
    paymentButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            window.open(paymentUrl, '_blank');
        });
    });
}

// Smooth scrolling for arrow
function setupSmoothScrolling() {
    const arrow = document.querySelector('.hero-arrow');
    if (arrow) {
        arrow.addEventListener('click', () => {
            const socialProofSection = document.querySelector('.social-proof');
            if (socialProofSection) {
                socialProofSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize testimonials slider
    const slider = new TestimonialsSlider();
    
    // Start autoplay after a short delay
    setTimeout(() => {
        slider.startAutoPlay();
    }, 2000);
    
    // Pause autoplay when user hovers over slider
    const sliderElement = document.getElementById('testimonialsSlider');
    if (sliderElement) {
        sliderElement.addEventListener('mouseenter', () => slider.stopAutoPlay());
        sliderElement.addEventListener('mouseleave', () => slider.startAutoPlay());
    }
    
    // Setup payment links
    setupPaymentLinks();
    
    // Setup smooth scrolling
    setupSmoothScrolling();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Add some entrance animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe sections for animations
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
});
