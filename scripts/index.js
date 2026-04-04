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
  let autoSlide = setInterval(nextSlide, 3000);

  // Pausa no hover
  document
    .querySelector(".hero-carousel")
    .addEventListener("mouseenter", () => {
      clearInterval(autoSlide);
    });

  document
    .querySelector(".hero-carousel")
    .addEventListener("mouseleave", () => {
      autoSlide = setInterval(nextSlide, 3000);
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

// Navbar (scroll + hamburger) em scripts/navbar.js

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

if (modal && openBtn && closeBtn) {
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
}

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

const counters = document.querySelectorAll(".counter");

counters.forEach((counter) => {
  const updateCount = () => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;

    const increment = target / 100;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target.toLocaleString("pt-BR");
    }
  };

  updateCount();
});

// FORMULÁRIO DE CONTATO

let currentStep = 0;
const steps = document.querySelectorAll(".step");

function showStep(index) {
  steps.forEach((step) => step.classList.remove("active"));
  steps[index].classList.add("active");
}

function nextStep() {
  if (!validateStep()) return;
  currentStep++;
  showStep(currentStep);
}

function prevStep() {
  currentStep--;
  showStep(currentStep);
}

function formatarDataBR(dataISO) {
  if (!dataISO) return "Não informado";

  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

function validateStep() {
  if (currentStep === 0) {
    const nome = document.getElementById("nome").value;
    const cpf = document.getElementById("cpf").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;

    if (!nome || !cpf || !telefone || !email) {
      alert("Preencha os campos obrigatórios");
      return false;
    }
  }
  return true;
}

document.getElementById("formLocacao").addEventListener("submit", function (e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const cpf = document.getElementById("cpf").value;
  const telefone = document.getElementById("telefone").value;
  const email = document.getElementById("email").value;
  const endereco = document.getElementById("endereco").value;
  const usou = document.getElementById("usou").value;
  const onde = document.getElementById("onde").value;
  const data = document.getElementById("data").value;

  const equipamentos = [
    ...document.querySelectorAll('input[type="checkbox"]:checked'),
  ].map((e) => e.value);

  const mensagem = `FORMULÁRIO DE LOCAÇÃO

DADOS PESSOAIS
Nome: ${nome}
CPF: ${cpf}
Telefone: ${telefone}
Email: ${email}
Endereço: ${endereco}

SOBRE O EQUIPAMENTO
Já utilizou: ${usou || "Não informado"}
Onde utilizou: ${onde || "Não informado"}

CONSULTORIA
${document.querySelector('input[name="consultoria"]:checked')?.value || "Não selecionado"}

EQUIPAMENTO E PERÍODO
Período: ${document.querySelector('input[name="periodo"]:checked')?.value || "Não selecionado"}

Equipamentos:
${equipamentos.length ? equipamentos.join(", ") : "Nenhum selecionado"}

MATERIAIS DE APOIO
${equipamentos.length ? equipamentos.join(", ") : "Nenhum"}

PAGAMENTO
Forma:
${document.querySelector('input[name="pagamento"]:checked')?.value || "Não selecionado"}

Data da solicitação: ${formatarDataBR(data)}

ENTREGA
${document.querySelector('input[name="entrega"]:checked')?.value || "Não selecionado"}
`;

  const url = `https://wa.me/5581987370033?text=${encodeURIComponent(mensagem)}`;
  window.open(url, "_blank");
});

showStep(currentStep);
