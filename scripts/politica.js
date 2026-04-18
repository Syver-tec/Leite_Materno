document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".politica h1, .politica h2, .politica p, .politica li");

  elements.forEach(el => el.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, {
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
});