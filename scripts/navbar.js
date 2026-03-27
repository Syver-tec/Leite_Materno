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
  }
});
