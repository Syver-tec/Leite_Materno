const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {
  const target = +counter.getAttribute("data-target");
  const duration = 2000;
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(progress * target);

    counter.textContent = value.toLocaleString("pt-BR");

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
});

// Carrossel customizado (só roda se os elementos existirem na página)
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".carousel-track");
  const carouselCards = document.querySelectorAll(".carousel-track .card");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");
  const container = document.querySelector(".carousel-container");

  if (!track || !nextBtn || !prevBtn || !carouselCards.length || !container) return;

  let index = 0;

  function getCardWidth() {
    return carouselCards[0].offsetWidth + 30;
  }

  function getVisibleCards() {
    return Math.floor(container.offsetWidth / (carouselCards[0].offsetWidth + 30));
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${index * getCardWidth()}px)`;
  }

  nextBtn.addEventListener("click", () => {
    if (index < carouselCards.length - getVisibleCards()) {
      index++;
      updateCarousel();
    }
  });

  prevBtn.addEventListener("click", () => {
    if (index > 0) {
      index--;
      updateCarousel();
    }
  });

  window.addEventListener("resize", updateCarousel);
});
