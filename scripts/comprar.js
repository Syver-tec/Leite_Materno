// ===============================
// Comprar
// ===============================

const CART_KEY = "lm_cart";
let produtoAtual = null;

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
    priceText.replace("R$", "").replace(/\./g, "").replace(",", ".").trim(),
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

// MODAL DE DETALHES DO PRODUTO

const modal = document.getElementById("modalProduto");
const fechar = document.getElementById("fecharModal");

const modalImg = document.getElementById("modalImg");
const modalTitulo = document.getElementById("modalTitulo");
const modalPreco = document.getElementById("modalPreco");
const modalDescricao = document.getElementById("modalDescricao");

// pegar todos os cards
document.querySelectorAll(".produto-card").forEach((card) => {
card.addEventListener("click", (e) => {
  if (e.target.closest(".btn-comprar")) return; // evita conflito com botão comprar
    produtoAtual = {
      name: card.querySelector("h3").innerText,
      priceText: card.querySelector(".preco").innerText,
      image: card.querySelector("img").src,
      descricao: card.querySelector("p").innerText
    };

    modalImg.src = produtoAtual.image;
    modalTitulo.innerText = produtoAtual.name;
    modalPreco.innerText = "A partir de: " + produtoAtual.priceText;
    modalDescricao.innerText = produtoAtual.descricao;

    // reseta quantidade
    document.getElementById("modalQtd").value = 1;

    modal.style.display = "flex";
  });
});

document.getElementById("modalAddCarrinho").addEventListener("click", () => {

  if (!produtoAtual) return;

  const qtd = Number(document.getElementById("modalQtd").value) || 1;

  const unitPrice = parsePrice(produtoAtual.priceText);

  let cart = getCart();

  const existing = cart.find(item => item.name === produtoAtual.name);

  if (existing) {
    existing.qty += qtd;
  } else {
    cart.push({
      key: produtoAtual.name,
      id: produtoAtual.name,
      name: produtoAtual.name,
      image: produtoAtual.image,
      period: 1,
      unitPrice,
      qty: qtd
    });
  }

  saveCart(cart);

  showToast(`"${produtoAtual.name}" foi adicionado ao carrinho ✅`);

  modal.style.display = "none";
});

// fechar no X
fechar.addEventListener("click", () => {
  modal.style.display = "none";
});

// fechar clicando fora
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn-comprar");

  buttons.forEach((button, index) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

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
          period: 1,
          unitPrice,
          qty: 1,
        });
      }

      saveCart(cart);

      showToast(`"${name}" foi adicionado ao seu carrinho. ✅`);
    });
  });
});
