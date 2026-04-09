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
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// CONVERTE "R$ 1.234,56" → 1234.56
function parsePrice(priceText) {
  return Number(
    priceText
      .replace("R$", "")
      .replace(/\./g, "")
      .replace(",", ".")
      .trim()
  );
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

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn-comprar");

  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();

      const card = button.closest(".produto-card");

      if (!card) return;

      // PEGANDO DADOS DO HTML
      const name = card.querySelector("h3")?.textContent || "Produto";
      const priceText = card.querySelector(".preco")?.textContent || "R$ 0";
      const image = card.querySelector("img")?.src || "";

      const unitPrice = parsePrice(priceText);

      const key = `produto-${index}`;

      let cart = getCart();

      const existing = cart.find((item) => item.key === key);

      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          key,
          id: key,
          name,
          image,
          period: 1, // compra não usa período, mas mantemos padrão do carrinho
          unitPrice,
          qty: 1,
        });
      }

      saveCart(cart);

      showToast(`"${name}" foi adicionado ao seu carrinho. ✅`);
      // REDIRECIONA PRO CARRINHO
    //   window.location.href = "carrinho.html";
    });
  });
});