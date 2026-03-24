// JavaScript para o Carrossel
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".carousel-slide");
  const indicators = document.querySelectorAll(".indicator");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  let currentSlide = 0;
  const totalSlides = slides.length;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
  }

  function prevSlide() {
    const prev = currentSlide === 0 ? totalSlides - 1 : currentSlide - 1;
    showSlide(prev);
  }

  // Auto-avanço a cada 5 segundos
  let autoSlide = setInterval(nextSlide, 5000);

  // Pausa no hover
  document
    .querySelector(".hero-carousel")
    .addEventListener("mouseenter", () => {
      clearInterval(autoSlide);
    });

  document
    .querySelector(".hero-carousel")
    .addEventListener("mouseleave", () => {
      autoSlide = setInterval(nextSlide, 5000);
    });

  // Navegação
  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Indicadores
  indicators.forEach((indicator, index) => {
    indicator.addEventListener("click", () => showSlide(index));
  });

  // Teclado
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") prevSlide();
    if (e.key === "ArrowRight") nextSlide();
  });
});

// MENU HAMBURGER
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navbar nav");

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("active");
  menuToggle.classList.toggle("active");
});

// FECHAR MENU AO CLICAR EM UM LINK (melhora UX mobile)

const navLinks = document.querySelectorAll(".navbar nav a");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});

// Navbar background ao rolar
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});

// Animação cards
const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.2 },
);

cards.forEach((card) => observer.observe(card));

const modal = document.querySelector(".modal");
const openBtn = document.querySelector(".modal-btn");
const closeBtn = document.querySelector(".close-modal");

openBtn.addEventListener("click", () => {
  modal.classList.add("active");
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("show");
          }, index * 200);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 },
  );

  cards.forEach((card) => observer.observe(card));
});
