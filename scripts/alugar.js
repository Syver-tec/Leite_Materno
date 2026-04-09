const CART_KEY = "lm_cart";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (error) {
    console.error("Erro ao ler carrinho local:", error);
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("alugar-modal");
  const closeBtn = document.getElementById("modal-close");
  const cards = document.querySelectorAll(".alugar-card");
  const periodSelect = document.getElementById("modal-periodo");
  const qtyInput = document.getElementById("modal-qty");
  const addBtn = document.getElementById("modal-add-cart");

  const modalImage = document.getElementById("modal-image");
  const modalCategory = document.getElementById("modal-category");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalPrice15 = document.getElementById("modal-price15");
  const modalPrice30 = document.getElementById("modal-price30");
  const tabDescricao = document.getElementById("tab-descricao");
  const tabAdicional = document.getElementById("tab-adicional");

  let currentProduct = null;

  function openModal(card) {
    currentProduct = {
      id: card.dataset.id,
      name: card.dataset.title,
      image: card.dataset.img,
      category: card.dataset.category,
      desc: card.dataset.desc,
      adicional: card.dataset.adicional,
      price15: Number(card.dataset.price15),
      price30: Number(card.dataset.price30),
    };

    modalImage.src = currentProduct.image;
    modalImage.alt = currentProduct.name;
    modalCategory.textContent = currentProduct.category;
    modalTitle.textContent = currentProduct.name;
    modalDesc.textContent = currentProduct.desc;
    tabDescricao.textContent = currentProduct.desc;
    tabAdicional.textContent = currentProduct.adicional;
    modalPrice15.textContent = formatBRL(currentProduct.price15);
    modalPrice30.textContent = formatBRL(currentProduct.price30);
    periodSelect.value = "15";
    qtyInput.value = "1";
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.textContent = message;
  
    document.body.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.add("show");
    }, 100);
  
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => openModal(card));
  });

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
  });

  document.querySelectorAll(".tab-btn").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(`tab-${button.dataset.tab}`).classList.add("active");
    });
  });

  addBtn.addEventListener("click", () => {
    if (!currentProduct) return;

    const period = Number(periodSelect.value);
    const qty = Math.max(1, Number(qtyInput.value || "1"));
    const unitPrice = period === 30 ? currentProduct.price30 : currentProduct.price15;
    const key = `${currentProduct.id}-${period}`;

    const cart = getCart();
    const existing = cart.find((item) => item.key === key);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        key,
        id: currentProduct.id,
        name: currentProduct.name,
        image: currentProduct.image,
        period,
        unitPrice,
        qty,
      });
    }

    saveCart(cart);

    showToast(`"${currentProduct.name}" foi adicionado ao seu carrinho. ✅`);

    closeModal();
  });

});
