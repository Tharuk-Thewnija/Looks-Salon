/**
 * Slider Module
 * Handles testimonial slider with auto-play and swipe support.
 */

export function initSlider() {
  let current = 0;
  const track = document.getElementById('sliderTrack');
  const dots = document.querySelectorAll('.dot');
  const total = dots.length; // Use dots length to get total number of slides

  if (!track || total === 0) return;

  const goToSlide = (n) => {
    current = (n + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const changeSlide = (dir) => {
    goToSlide(current + dir);
  };

  // Auto-play every 5s
  let interval = setInterval(() => changeSlide(1), 5000);

  // Reset interval when user interacts
  const resetInterval = () => {
    clearInterval(interval);
    interval = setInterval(() => changeSlide(1), 5000);
  };

  // Event Listeners for Dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
      resetInterval();
    });
  });

  // Event Listeners for Arrows
  const prevBtn = document.querySelector('.slider-arrow:first-child');
  const nextBtn = document.querySelector('.slider-arrow:last-child');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      changeSlide(-1);
      resetInterval();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      changeSlide(1);
      resetInterval();
    });
  }

  // Touch/swipe support
  let startX = 0;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    clearInterval(interval);
  }, { passive: true });

  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      changeSlide(diff > 0 ? 1 : -1);
    }
    resetInterval();
  }, { passive: true });
}
