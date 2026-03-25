document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navbar nav");

  function updateNavbarScrolled() {
    if (navbar) {
      navbar.classList.toggle("scrolled", window.scrollY > 50);
    }
  }

  updateNavbarScrolled();
  window.addEventListener("scroll", updateNavbarScrolled, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    });

    document.querySelectorAll(".navbar nav a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });
  }
});
