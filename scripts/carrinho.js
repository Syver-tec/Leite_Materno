const CART_KEY = "lm_cart";

function formatBRL(value) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

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

function buildWhatsAppMessage(items, total) {
  const lines = ["Olá, quero solicitar esse produto:", ""];
  items.forEach((item) => {
    lines.push(
      `-> ${item.qty} x ${item.name} ${item.periodLabel} = ${formatBRL(item.subtotal)}`,
    );
  });
  lines.push("", `Total do carrinho: ${formatBRL(total)}`);
  return lines.join("\n");
}

document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-body");
  const totalEl = document.querySelector(".js-total");
  const updateBtn = document.querySelector(".js-update");
  const clearBtn = document.querySelector(".js-clear");
  const whatsappBtn = document.querySelector(".js-whatsapp");

  let cart = getCart();

  function render() {
    if (!cart.length) {
      cartBody.innerHTML = `
        <tr>
          <td colspan="4" class="cart-empty">Seu carrinho está vazio.</td>
        </tr>
      `;
      totalEl.textContent = formatBRL(0);
      return;
    }

    cartBody.innerHTML = cart
      .map((item) => {
        const subtotal = item.unitPrice * item.qty;
        return `
          <tr class="cart-row" data-key="${item.key}">
            <td class="product-cell" data-label="Nome do Produto">
              <img src="${item.image}" alt="${item.name}">
              <span class="product-name">${item.name.toUpperCase()} - ${item.period} DIAS</span>
            </td>
            <td data-label="Preço" class="js-price">${formatBRL(item.unitPrice)}</td>
            <td data-label="Quantidade">
              <div class="qty-control">
                <button type="button" class="qty-btn js-minus" aria-label="Diminuir quantidade">-</button>
                <input type="number" class="js-qty-input" min="0" value="${item.qty}" />
                <button type="button" class="qty-btn js-plus" aria-label="Aumentar quantidade">+</button>
              </div>
            </td>
            <td data-label="Subtotal" class="js-subtotal">${formatBRL(subtotal)}</td>
          </tr>
        `;
      })
      .join("");

    bindRowEvents();
    updateTotalUI();
  }

  function bindRowEvents() {
    cartBody.querySelectorAll(".cart-row").forEach((row) => {
      const key = row.dataset.key;
      const input = row.querySelector(".js-qty-input");
      const minus = row.querySelector(".js-minus");
      const plus = row.querySelector(".js-plus");

      minus.addEventListener("click", () => {
        const next = Math.max(0, Number(input.value || "0") - 1);
        input.value = String(next);
      });

      plus.addEventListener("click", () => {
        const next = Number(input.value || "0") + 1;
        input.value = String(next);
      });

      input.addEventListener("input", () => {
        if (Number(input.value) < 0) input.value = "0";
      });

      row.dataset.key = key;
    });
  }

  function updateTotalUI() {
    let total = 0;
    cart.forEach((item) => {
      total += item.unitPrice * item.qty;
    });
    totalEl.textContent = formatBRL(total);
  }

  function syncFromInputs() {
    const map = new Map();
    cartBody.querySelectorAll(".cart-row").forEach((row) => {
      const key = row.dataset.key;
      const qty = Math.max(0, Number(row.querySelector(".js-qty-input").value || "0"));
      map.set(key, qty);
    });

    cart = cart
      .map((item) => ({ ...item, qty: map.has(item.key) ? map.get(item.key) : item.qty }))
      .filter((item) => item.qty > 0);

    saveCart(cart);
    render();
  }

  updateBtn.addEventListener("click", syncFromInputs);

  clearBtn.addEventListener("click", () => {
    cart = [];
    saveCart(cart);
    render();
  });

  whatsappBtn.addEventListener("click", () => {
    syncFromInputs();
    if (!cart.length) return;

    const items = cart.map((item) => ({
      name: item.name,
      qty: item.qty,
      periodLabel: `${item.period} dias`,
      subtotal: item.unitPrice * item.qty,
    }));

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const message = buildWhatsAppMessage(items, total);
    const url = `https://wa.me/5581987370033?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  });

  render();
});
