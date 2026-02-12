// alugar.js (CORRIGIDO / organizado / sem bug do preço e com carrinho único)
//
// ✅ Corrige: 30 dias agora usa o preço do range (max)
// ✅ Carrinho único: use a MESMA key em todas as páginas
// ✅ Evita bugs: checa elementos antes de usar
// ✅ Drawer e Modal funcionando

document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // CONFIG
    // =========================
    const CART_KEY = "cart_leite_materno"; // <-- USE ESSA MESMA KEY EM TODAS AS PÁGINAS

    // =========================
    // HELPERS
    // =========================
    function getCart() {
        return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    }
    function setCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
    function moneyBR(v) {
        return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // range: "R$160,00 – R$240,00" (ou hífen normal)
    function parsePrecoRange(txt) {
        const raw = (txt || "").replace(/\s+/g, " ").trim();
        const parts = raw.includes("–") ? raw.split("–") : raw.split("-");

        const toNumber = (s) => {
            const num = (s || "")
                .replace("R$", "")
                .replace(/\./g, "")
                .replace(",", ".")
                .trim();
            const v = Number(num);
            return Number.isFinite(v) ? v : 0;
        };

        const min = toNumber(parts[0]);
        const max = parts[1] ? toNumber(parts[1]) : min;

        return { min, max };
    }

    function cartCount(cart) {
        return cart.reduce((a, i) => a + (Number(i.qty) || 0), 0);
    }

    function cartTotal(cart) {
        return cart.reduce((a, i) => a + ((Number(i.price) || 0) * (Number(i.qty) || 0)), 0);
    }

    // =========================
    // NAVBAR (TOTAL + COUNT)
    // =========================
    const navTotal = document.querySelector("#btn-cart .valor");
    const navCount = document.querySelector("#btn-cart .cart-count");

    function updateNavbar() {
        const cart = getCart();
        if (navCount) navCount.textContent = cartCount(cart);
        if (navTotal) navTotal.textContent = moneyBR(cartTotal(cart));
    }
    updateNavbar();

    // =========================
    // MODAL
    // =========================
    const modal = document.getElementById("modal-produto");
    const closeBtn = document.getElementById("modal-close");

    const mImg = document.getElementById("m-img");
    const mTitulo = document.getElementById("m-titulo");
    const mCategorias = document.getElementById("m-categorias");
    const mPreco = document.getElementById("m-preco");
    const mDesc = document.getElementById("m-desc");

    const mPeriodo = document.getElementById("m-periodo");
    const mQty = document.getElementById("m-qty");
    const mAdd = document.getElementById("m-add");

    let currentProduct = null;

    function openModal(card) {
        if (!modal) return;

        const range = parsePrecoRange(card.dataset.preco);

        currentProduct = {
            type: "alugar",
            title: card.dataset.titulo || "",
            categories: card.dataset.categorias || "",
            priceText: card.dataset.preco || "",
            priceMin: range.min,
            priceMax: range.max,
            desc: card.dataset.desc || "",
            img: card.dataset.img || ""
        };

        if (mImg) mImg.src = currentProduct.img;
        if (mTitulo) mTitulo.textContent = currentProduct.title;
        if (mCategorias) mCategorias.textContent = currentProduct.categories;
        if (mPreco) mPreco.textContent = currentProduct.priceText;
        if (mDesc) mDesc.textContent = currentProduct.desc;

        if (mPeriodo) mPeriodo.value = "";
        if (mQty) mQty.value = 1;

        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove("open");
        document.body.style.overflow = "auto";
        currentProduct = null;
    }

    document.querySelectorAll(".card-produto").forEach((card) => {
        card.addEventListener("click", () => openModal(card));
    });

    if (closeBtn) closeBtn.addEventListener("click", closeModal);

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target?.dataset?.close === "true") closeModal();
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal?.classList.contains("open")) closeModal();
    });

    // =========================
    // DRAWER (CARRINHO LATERAL)
    // =========================
    const btnCart = document.getElementById("btn-cart");
    const drawer = document.getElementById("drawer-cart");
    const drawerClose = document.getElementById("drawer-close");
    const drawerItems = document.getElementById("drawer-items");
    const drawerTotalEl = document.getElementById("drawer-total");
    const drawerClear = document.getElementById("drawer-clear");
    const drawerCheckout = document.getElementById("drawer-checkout");

    function renderDrawer() {
        if (!drawerItems || !drawerTotalEl) return;

        const cart = getCart();

        if (!cart.length) {
            drawerItems.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
            drawerTotalEl.textContent = moneyBR(0);
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

        drawerTotalEl.textContent = moneyBR(total);
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

    // =========================
    // ADD TO CART (MODAL)  ✅ PREÇO CERTO POR PERÍODO
    // =========================
    if (mAdd) {
        mAdd.addEventListener("click", () => {
            if (!currentProduct) return;

            if (!mPeriodo || !mPeriodo.value) {
                alert("Selecione o período de locação.");
                mPeriodo?.focus();
                return;
            }

            const period = String(mPeriodo.value); // "15" | "30"
            const qty = Math.max(1, Number(mQty?.value || 1));

            // ✅ preço muda conforme período
            const unitPrice = period === "15" ? currentProduct.priceMin : currentProduct.priceMax;

            // id único por produto+período
            const id = (currentProduct.title + "_" + period).toLowerCase().trim();

            const cart = getCart();
            const existing = cart.find((i) => i.id === id);

            if (existing) existing.qty = (Number(existing.qty) || 0) + qty;
            else {
                cart.push({
                    id,
                    type: "alugar",
                    title: currentProduct.title,
                    period,
                    qty,
                    price: unitPrice,
                    img: currentProduct.img
                });
            }

            setCart(cart);
            updateNavbar();

            closeModal();
            openDrawer();
        });
    }

    // =========================
    // MENU MOBILE (HAMBURGER)
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

    // garante navbar sempre atualizada ao carregar
    updateNavbar();
});
