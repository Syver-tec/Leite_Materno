// MENU HAMBURGER
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navbar nav");

menuToggle.addEventListener("click", () => {

  nav.classList.toggle("active");
  menuToggle.classList.toggle("active");

});

// FECHAR MENU AO CLICAR EM UM LINK (melhora UX mobile)

const navLinks = document.querySelectorAll(".navbar nav a");

navLinks.forEach(link => {
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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.2 });

cards.forEach(card => observer.observe(card));

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

