// sobre.js (MENU + CARRINHO GLOBAL)

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // MENU HAMBURGUER
  // =========================
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");

  if (toggle && nav) {
    toggle.addEventListener("click", () => nav.classList.toggle("active"));

    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => nav.classList.remove("active"));
    });

    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("active");
      }
    });
  }

  // =========================
  // CARRINHO GLOBAL (navbar + drawer)
  // =========================
  const CART_KEY = "cart_leite_materno"; // <-- MESMA KEY EM TODAS AS PÁGINAS

  function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  }
  function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }
  function moneyBR(v) {
    return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  // Navbar
  const navTotal = document.querySelector("#btn-cart .valor");
  const navCount = document.querySelector("#btn-cart .cart-count");

  function updateNavbar() {
    const cart = getCart();
    const count = cart.reduce((a, i) => a + (Number(i.qty) || 0), 0);
    const total = cart.reduce((a, i) => a + ((Number(i.price) || 0) * (Number(i.qty) || 0)), 0);

    if (navCount) navCount.textContent = count;
    if (navTotal) navTotal.textContent = moneyBR(total);
  }

  // Drawer
  const btnCart = document.getElementById("btn-cart");
  const drawer = document.getElementById("drawer-cart");
  const drawerClose = document.getElementById("drawer-close");
  const drawerItems = document.getElementById("drawer-items");
  const drawerTotal = document.getElementById("drawer-total");
  const drawerClear = document.getElementById("drawer-clear");
  const drawerCheckout = document.getElementById("drawer-checkout");

  function renderDrawer() {
    if (!drawerItems || !drawerTotal) return;

    const cart = getCart();

    if (!cart.length) {
      drawerItems.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
      drawerTotal.textContent = moneyBR(0);
      return;
    }

    let total = 0;

    drawerItems.innerHTML = cart
      .map((item) => {
        const qty = Number(item.qty) || 0;
        const price = Number(item.price) || 0;
        const subtotal = price * qty;
        total += subtotal;

        const periodLine =
          item.type === "alugar" && item.period
            ? `<div class="meta">Período: ${item.period} dias</div>`
            : ``;

        return `
          <div class="cart-item" data-id="${item.id}">
            <img src="${item.img}" alt="">
            <div>
              <h4>${item.title}</h4>
              ${periodLine}
              <div class="price">${moneyBR(price)} x ${qty} = ${moneyBR(subtotal)}</div>
            </div>

            <div class="right">
              <div class="qty-controls">
                <button class="qty-btn" data-action="dec">-</button>
                <span class="qty-number">${qty}</span>
                <button class="qty-btn" data-action="inc">+</button>
              </div>
              <button class="remove-btn" data-action="remove">Remover</button>
            </div>
          </div>
        `;
      })
      .join("");

    drawerTotal.textContent = moneyBR(total);
  }

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add("open");
    document.body.style.overflow = "hidden";
    renderDrawer();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove("open");
    document.body.style.overflow = "auto";
  }

  // Eventos
  if (btnCart) {
    btnCart.addEventListener("click", openDrawer);
    btnCart.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openDrawer();
    });
  }

  if (drawerClose) drawerClose.addEventListener("click", closeDrawer);

  if (drawer) {
    drawer.addEventListener("click", (e) => {
      if (e.target?.dataset?.closeCart === "true") closeDrawer();
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("open")) closeDrawer();
  });

  if (drawerItems) {
    drawerItems.addEventListener("click", (e) => {
      const action = e.target?.dataset?.action;
      if (!action) return;

      const row = e.target.closest(".cart-item");
      if (!row) return;

      const id = row.dataset.id;
      const cart = getCart();
      const item = cart.find((i) => i.id === id);
      if (!item) return;

      if (action === "inc") item.qty = (Number(item.qty) || 1) + 1;
      if (action === "dec") item.qty = Math.max(1, (Number(item.qty) || 1) - 1);
      if (action === "remove") {
        const idx = cart.findIndex((i) => i.id === id);
        if (idx >= 0) cart.splice(idx, 1);
      }

      setCart(cart);
      updateNavbar();
      renderDrawer();
    });
  }

  if (drawerClear) {
    drawerClear.addEventListener("click", () => {
      setCart([]);
      updateNavbar();
      renderDrawer();
    });
  }

  if (drawerCheckout) {
    drawerCheckout.addEventListener("click", () => {
      const cart = getCart();
      if (!cart.length) return alert("Seu carrinho está vazio.");
      alert("Finalizar compra (próximo passo: WhatsApp/checkout).");
    });
  }

  // Inicializa navbar ao abrir a página
  updateNavbar();
});
