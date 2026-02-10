  document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("menu-toggle");
    const nav = document.getElementById("nav");

    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        nav.classList.toggle("active");
      });

      // Fecha menu ao clicar em link
      nav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => nav.classList.remove("active"));
      });

      // Fecha ao clicar fora
      document.addEventListener("click", (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          nav.classList.remove("active");
        }
      });
    }
  });
