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

function openModal() {
  document.getElementById("checkout-modal").classList.add("active");
}

function closeModal() {
  document.getElementById("checkout-modal").classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
  const cartBody = document.getElementById("cart-body");
  const totalEl = document.querySelector(".js-total");
  const updateBtn = document.querySelector(".js-update");
  const clearBtn = document.querySelector(".js-clear");
  const whatsappBtn = document.querySelector(".js-whatsapp");
  const closeBtn = document.getElementById("close-modal");

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
              <span class="product-name">${item.name.toUpperCase()}${item.period > 1 ? ` - ${item.period} DIAS` : ""}</span>
            </td>
            <td data-label="Preço">${formatBRL(item.unitPrice)}</td>
            <td data-label="Quantidade">
              <div class="qty-control">
                <button type="button" class="qty-btn js-minus">-</button>
                <input type="number" class="js-qty-input" min="0" value="${item.qty}" />
                <button type="button" class="qty-btn js-plus">+</button>
              </div>
            </td>
            <td data-label="Subtotal">${formatBRL(subtotal)}</td>
          </tr>
        `;
      })
      .join("");

    bindRowEvents();
    updateTotalUI();
  }

  function bindRowEvents() {
    cartBody.querySelectorAll(".cart-row").forEach((row) => {
      const input = row.querySelector(".js-qty-input");
      const minus = row.querySelector(".js-minus");
      const plus = row.querySelector(".js-plus");

      minus.addEventListener("click", () => {
        input.value = Math.max(0, Number(input.value) - 1);
      });

      plus.addEventListener("click", () => {
        input.value = Number(input.value) + 1;
      });

      input.addEventListener("input", () => {
        if (Number(input.value) < 0) input.value = 0;
      });
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
      const qty = Math.max(0, Number(row.querySelector(".js-qty-input").value));
      map.set(key, qty);
    });

    cart = cart
      .map((item) => ({
        ...item,
        qty: map.has(item.key) ? map.get(item.key) : item.qty,
      }))
      .filter((item) => item.qty > 0);

    saveCart(cart);
    render();
  }

  updateBtn?.addEventListener("click", syncFromInputs);

  clearBtn?.addEventListener("click", () => {
    cart = [];
    saveCart(cart);
    render();
  });

  whatsappBtn?.addEventListener("click", () => {
    syncFromInputs();
    if (!cart.length) return;
    openModal();
  });

  closeBtn?.addEventListener("click", closeModal);

  // ✅ FINALIZAR PEDIDO (AGORA FUNCIONA SEM CONFLITO)
  document.addEventListener("click", (e) => {
    if (e.target.id === "finish-order") {
      if (!cart.length) return;

      const name = document.getElementById("client-name")?.value || "";
      const cpf = document.getElementById("client-cpf")?.value || "";
      const phone = document.getElementById("client-phone")?.value || "";
      const email = document.getElementById("client-email")?.value || "";
      const address = document.getElementById("client-address")?.value || "";
      const neighborhood = document.getElementById("client-neighborhood")?.value || "";

      const consultoria =
        document.querySelector('input[name="consultoria"]:checked')?.value ||
        "Não informado";
      const pagamento =
        document.querySelector('input[name="pagamento"]:checked')?.value ||
        "Não informado";

      const today = new Date();
      const dataFormatada = today.toLocaleDateString("pt-BR");

      if (!name || !phone) {
        alert("Preencha nome e telefone!");
        return;
      }

      const items = cart.map((item) => ({
        name: item.name,
        qty: item.qty,
        periodLabel:
          item.period && item.period > 1 ? `${item.period} dias` : "",
        subtotal: item.unitPrice * item.qty,
      }));

      const total = items.reduce((sum, item) => sum + item.subtotal, 0);

      let message = buildWhatsAppMessage(items, total);

      message += `\n\n--- Dados do Cliente ---`;
      message += `\nNome: ${name}`;
      message += `\nCPF: ${cpf || "Não informado"}`;
      message += `\nTelefone: ${phone}`;
      message += `\nEmail: ${email || "Não informado"}`;
      message += `\nEndereço: ${address || "Não informado"}`;
      message += `\nBairro: ${neighborhood || "Não informado"}`;

      message += `\n\n--- Consultoria ---\n${consultoria}`;
      message += `\n\n--- Pagamento ---\n${pagamento}`;
      message += `\nObs: Equipamento liberado após confirmação do pagamento`;
      message += `\n\nData do Pedido: ${dataFormatada}`;

      const url = `https://wa.me/5581987370033?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");

      closeModal();
    }
  });

  // ✅ MÁSCARAS AGORA FUNCIONAM CERTO
  const cpfInput = document.getElementById("client-cpf");
  const phoneInput = document.getElementById("client-phone");

  if (cpfInput) {
    cpfInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");

      value = value
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2")
        .slice(0, 14);

      e.target.value = value;
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");

      if (value.length <= 10) {
        value = value
          .replace(/^(\d{2})(\d)/g, "($1) $2")
          .replace(/(\d{4})(\d)/, "$1-$2")
          .slice(0, 14);
      } else {
        value = value
          .replace(/^(\d{2})(\d)/g, "($1) $2")
          .replace(/(\d{5})(\d)/, "$1-$2")
          .slice(0, 15);
      }

      e.target.value = value;
    });
  }

  render();
});
