let slideIndex = 0;
const slidesWrapper = document.querySelector('.slides-wrapper');
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;
let slideTime;

function showSlide(index) {
    if (index >= totalSlides) {
        slideIndex = 0;
    } else if (index < 0) {
        slideIndex = totalSlides - 1;
    } else {
        slideIndex = index;
    }

    slidesWrapper.style.transform = `translateX(-${slideIndex * 20}%)`;

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
    });
}

function resetTime() {
    clearInterval(slideTime);
    slideTime = setInterval(() => {
        changeSlide(1);
    }, 5000);
}

function changeSlide(n) {
    showSlide(slideIndex + n);
    resetTime();
}

function currentSlide(n) {
    showSlide(n - 1);
    resetTime();
}

resetTime();
showSlide(0);