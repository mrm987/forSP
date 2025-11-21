// 캐릭터 캐러셀 초기화
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    let currentIndex = 0;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTransform = 0;

    // 인디케이터 생성
    function createIndicators() {
        for (let i = 0; i < totalSlides; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // 슬라이드 이동
    function goToSlide(index) {
        if (index < 0) {
            currentIndex = 0;
        } else if (index >= totalSlides) {
            currentIndex = totalSlides - 1;
        } else {
            currentIndex = index;
        }

        const offset = -currentIndex * 100;
        track.style.transform = `translateX(${offset}%)`;
        updateIndicators();
    }

    // 인디케이터 업데이트
    function updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    }

    // 이전 슬라이드
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }

    // 다음 슬라이드
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }

    // 마우스/터치 드래그 시작
    function handleDragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const transform = window.getComputedStyle(track).transform;
        if (transform !== 'none') {
            const matrix = new DOMMatrix(transform);
            startTransform = matrix.m41;
        } else {
            startTransform = 0;
        }
        track.style.transition = 'none';
    }

    // 마우스/터치 드래그 중
    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;
        const newTransform = startTransform + diff;
        track.style.transform = `translateX(${newTransform}px)`;
    }

    // 마우스/터치 드래그 종료
    function handleDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        track.style.transition = 'transform 0.5s ease-in-out';

        const diff = currentX - startX;
        const threshold = track.offsetWidth * 0.2; // 20% 이상 드래그시 슬라이드 변경

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
        } else {
            goToSlide(currentIndex);
        }
    }

    // 이벤트 리스너 등록
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // 마우스 이벤트
    track.addEventListener('mousedown', handleDragStart);
    track.addEventListener('mousemove', handleDragMove);
    track.addEventListener('mouseup', handleDragEnd);
    track.addEventListener('mouseleave', handleDragEnd);

    // 터치 이벤트
    track.addEventListener('touchstart', handleDragStart, { passive: false });
    track.addEventListener('touchmove', handleDragMove, { passive: false });
    track.addEventListener('touchend', handleDragEnd);

    // 키보드 네비게이션
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // 초기화
    createIndicators();
    goToSlide(0);
});
