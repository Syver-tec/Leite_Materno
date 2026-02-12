// comprar.js (CORRIGIDO / organizado / carrinho ÚNICO em todas as páginas)
//
// ✅ Use a MESMA key em todas as páginas: cart_leite_materno
// ✅ Evita crash se algum elemento não existir
// ✅ Paginação funciona e não quebra clique dos cards
// ✅ Modal + Drawer + Navbar ok

document.addEventListener("DOMContentLoaded", () => {
    // =========================
    // CONFIG
    // =========================
    const CART_KEY = "cart_leite_materno"; // <-- MESMA KEY EM TODAS AS PÁGINAS

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
    function parsePreco(txt) {
        const num = (txt || "")
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();
        const v = Number(num);
        return Number.isFinite(v) ? v : 0;
    }
    function safeQty(v) {
        const n = Number(v);
        return Number.isFinite(n) && n > 0 ? n : 1;
    }

    // =========================
    // NAVBAR
    // =========================
    const navTotal = document.querySelector("#btn-cart .valor");
    const navCount = document.querySelector("#btn-cart .cart-count");

    function updateNavbar() {
        const cart = getCart();
        const count = cart.reduce((a, i) => a + (Number(i.qty) || 0), 0);
        const total = cart.reduce((a, i) => a + ((Number(i.price) || 0) * (Number(i.qty) || 0)), 0);
        if (navCount) navCount.textContent = count;
        if (navTotal) navTotal.textContent = moneyBR(total);
    }
    updateNavbar();

    // =========================
    // MODAL
    // =========================
    const modal = document.getElementById("modal-produto");
    const closeBtn = document.getElementById("modal-close");

    const mImg = document.getElementById("m-img");
    const mTitulo = document.getElementById("m-titulo");
    const mPreco = document.getElementById("m-preco");
    const mDesc = document.getElementById("m-desc");

    const mQty = document.getElementById("m-qty");
    const mAdd = document.getElementById("m-add");

    let currentProduct = null;

    function openModal(card) {
        if (!modal) return;

        currentProduct = {
            type: "comprar",
            title: card.dataset.titulo || "",
            priceText: card.dataset.preco || "",
            price: parsePreco(card.dataset.preco),
            desc: card.dataset.desc || "",
            img: card.dataset.img || ""
        };

        if (mImg) mImg.src = currentProduct.img;
        if (mTitulo) mTitulo.textContent = currentProduct.title;
        if (mPreco) mPreco.textContent = currentProduct.priceText;
        if (mDesc) mDesc.textContent = currentProduct.desc;
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

    // clique nos cards (abre modal)
    const allCards = Array.from(document.querySelectorAll(".card-produto"));
    allCards.forEach((card) => {
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
    // DRAWER
    // =========================
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
    // ADD TO CART (MODAL)
    // =========================
    if (mAdd) {
        mAdd.addEventListener("click", () => {
            if (!currentProduct) return;

            const qty = safeQty(mQty?.value);

            // ✅ id único (melhor que só "title", evita conflito de item com mesmo nome no futuro)
            const id = ("comprar_" + currentProduct.title).toLowerCase().trim();

            const cart = getCart();
            const existing = cart.find((i) => i.id === id);

            if (existing) existing.qty = (Number(existing.qty) || 0) + qty;
            else {
                cart.push({
                    id,
                    type: "comprar",
                    title: currentProduct.title,
                    qty,
                    price: currentProduct.price,
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
    // PAGINAÇÃO (IMPORTANTE: fora da .grid)
    // =========================
    const pag = document.getElementById("paginacao");
    const ITEMS_PER_PAGE = 8;
    let currentPage = 1;

    function totalPages() {
        return Math.max(1, Math.ceil(allCards.length / ITEMS_PER_PAGE));
    }

    function pageBtn(n) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = n;
        if (n === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => renderPage(n));
        return btn;
    }

    function dots() {
        const span = document.createElement("span");
        span.textContent = "...";
        span.style.color = "#8e4aa3";
        span.style.fontWeight = "800";
        return span;
    }

    function renderPagination() {
        if (!pag) return;

        const pages = totalPages();
        pag.innerHTML = "";

        const prev = document.createElement("button");
        prev.type = "button";
        prev.className = "nav-btn";
        prev.textContent = "←";
        prev.disabled = currentPage === 1;
        prev.addEventListener("click", () => renderPage(currentPage - 1));
        pag.appendChild(prev);

        const maxButtons = 5;
        let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let end = start + maxButtons - 1;

        if (end > pages) {
            end = pages;
            start = Math.max(1, end - maxButtons + 1);
        }

        if (start > 1) {
            pag.appendChild(pageBtn(1));
            if (start > 2) pag.appendChild(dots());
        }

        for (let p = start; p <= end; p++) pag.appendChild(pageBtn(p));

        if (end < pages) {
            if (end < pages - 1) pag.appendChild(dots());
            pag.appendChild(pageBtn(pages));
        }

        const next = document.createElement("button");
        next.type = "button";
        next.className = "nav-btn";
        next.textContent = "→";
        next.disabled = currentPage === pages;
        next.addEventListener("click", () => renderPage(currentPage + 1));
        pag.appendChild(next);
    }

    function renderPage(page) {
        currentPage = Math.min(Math.max(1, page), totalPages());

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        allCards.forEach((card, idx) => {
            card.style.display = idx >= start && idx < end ? "" : "none";
        });

        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // inicia paginação
    if (pag && allCards.length) renderPage(1);

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

    // garante navbar correta ao abrir
    updateNavbar();
});
