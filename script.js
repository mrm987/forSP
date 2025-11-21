// Modern Vertical Character Carousel
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('container');
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dotsContainer');
    const progressBar = document.getElementById('progressBar');
    const swipeHint = document.getElementById('swipeHint');
    const totalSlides = slides.length;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let isAnimating = false;

    // Create navigation dots
    function createDots() {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Update navigation dots
    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Update progress bar
    function updateProgress() {
        const progress = ((currentIndex + 1) / totalSlides) * 100;
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressBar.style.width = `${progress}%`;
    }

    // Go to specific slide
    function goToSlide(index) {
        if (isAnimating || index < 0 || index >= totalSlides) return;

        isAnimating = true;

        // Remove active class from current slide
        slides[currentIndex].classList.remove('active');
        if (index < currentIndex) {
            slides[currentIndex].classList.add('prev');
        }

        // Update current index
        currentIndex = index;

        // Add active class to new slide
        slides[currentIndex].classList.add('active');
        slides[currentIndex].classList.remove('prev');

        // Update UI
        updateDots();
        updateProgress();

        // Hide swipe hint after first interaction
        if (swipeHint) {
            swipeHint.classList.add('hidden');
        }

        setTimeout(() => {
            isAnimating = false;
            // Clean up prev class from all slides
            slides.forEach(slide => {
                if (slide !== slides[currentIndex]) {
                    slide.classList.remove('prev');
                }
            });
        }, 600);
    }

    // Next slide
    function nextSlide() {
        if (currentIndex < totalSlides - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    // Previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    // Touch/Mouse start
    function handleStart(e) {
        if (isAnimating) return;
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }

    // Touch/Mouse move
    function handleMove(e) {
        if (!isDragging || isAnimating) return;

        e.preventDefault();
        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
    }

    // Touch/Mouse end
    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        const diff = currentX - startX;
        const threshold = 50; // Minimum swipe distance in pixels

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // Swiped right - next slide
                nextSlide();
            } else {
                // Swiped left - previous slide
                prevSlide();
            }
        }
    }

    // Mouse wheel handler
    function handleWheel(e) {
        if (isAnimating) return;

        e.preventDefault();

        if (e.deltaY > 0) {
            nextSlide();
        } else if (e.deltaY < 0) {
            prevSlide();
        }
    }

    // Keyboard navigation
    function handleKeyboard(e) {
        if (isAnimating) return;

        switch(e.key) {
            case 'ArrowRight':
            case 'PageDown':
                e.preventDefault();
                nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides - 1);
                break;
        }
    }

    // Event listeners
    // Touch events
    container.addEventListener('touchstart', handleStart, { passive: true });
    container.addEventListener('touchmove', handleMove, { passive: false });
    container.addEventListener('touchend', handleEnd, { passive: true });

    // Mouse events
    container.addEventListener('mousedown', handleStart);
    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseup', handleEnd);
    container.addEventListener('mouseleave', handleEnd);

    // Wheel event
    container.addEventListener('wheel', handleWheel, { passive: false });

    // Keyboard events
    document.addEventListener('keydown', handleKeyboard);

    // Initialize
    createDots();
    updateProgress();

    // Hide swipe hint after 3 seconds
    setTimeout(() => {
        if (swipeHint && currentIndex === 0) {
            swipeHint.style.opacity = '0';
            setTimeout(() => {
                swipeHint.classList.add('hidden');
            }, 300);
        }
    }, 3000);

    // Prevent pull-to-refresh on mobile
    document.body.addEventListener('touchmove', function(e) {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });
});
