// ===============================
// Dicas
// ===============================

// Seleciona todos os headers do accordion
const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {
  header.addEventListener("click", () => {
    
    const item = header.parentElement;

    // Fecha todos (comportamento clássico de accordion)
    document.querySelectorAll(".accordion-item").forEach(i => {
      if (i !== item) {
        i.classList.remove("active");
      }
    });

    // Alterna o atual
    item.classList.toggle("active");
  });
});