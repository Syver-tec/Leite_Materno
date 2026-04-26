// ===============================
// Navbar
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".navbar nav");

  if (menuToggle && nav) {
    const toggleMenu = () => {
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
    };

    menuToggle.addEventListener("click", toggleMenu);
    menuToggle.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleMenu();
      }
    });

    document.querySelectorAll(".navbar nav a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      });
    });

    // Fecha menu ao clicar fora dele
    document.addEventListener("click", (event) => {
      const clickedOutsideNav = !nav.contains(event.target);
      const clickedOutsideButton = !menuToggle.contains(event.target);

      if (
        nav.classList.contains("active") &&
        clickedOutsideNav &&
        clickedOutsideButton
      ) {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
      }
    });
  }
});
