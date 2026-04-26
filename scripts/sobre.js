// ===============================
// Sobre nós
// ===============================

/* Página Sobre: interações opcionais; carrossel de clientes é CSS (marquee). */
document.addEventListener("DOMContentLoaded", () => {

  const elements = document.querySelectorAll(
    ".sobre-intro h1, .hero-left p, .hero-right img, .sobre-valores-title, .valor-card"
  );

  // adiciona classe base
  elements.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {

        // animação com delay nos cards
        if (entry.target.classList.contains("valor-card")) {
          const index = [...entry.target.parentElement.children].indexOf(entry.target);
          entry.target.style.transitionDelay = `${index * 0.15}s`;
        }

        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));

});