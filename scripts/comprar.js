document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // CARRINHO (localStorage)
    // =========================
    const CART_KEY = "cart_compras_leite_materno";

    function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    function setCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    function moneyBR(v) { return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

    function parsePreco(txt) {
        const num = (txt || "")
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();
        const v = Number(num);
        return Number.isFinite(v) ? v : 0;
    }

    // Navbar
    const navTotal = document.querySelector("#btn-cart .valor");
    const navCount = document.querySelector("#btn-cart .cart-count");

    function updateNavbar() {
        const cart = getCart();
        const count = cart.reduce((a, i) => a + i.qty, 0);
        const total = cart.reduce((a, i) => a + (i.price * i.qty), 0);
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
        currentProduct = {
            title: card.dataset.titulo || "",
            priceText: card.dataset.preco || "",
            price: parsePreco(card.dataset.preco),
            desc: card.dataset.desc || "",
            img: card.dataset.img || ""
        };

        mImg.src = currentProduct.img;
        mTitulo.textContent = currentProduct.title;
        mPreco.textContent = currentProduct.priceText;
        mDesc.textContent = currentProduct.desc;
        mQty.value = 1;

        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }

    function closeModal() {
        modal.classList.remove("open");
        document.body.style.overflow = "auto";
        currentProduct = null;
    }

    document.querySelectorAll(".card-produto").forEach(card => {
        card.addEventListener("click", () => openModal(card));
    });

    closeBtn.addEventListener("click", closeModal);

    modal.addEventListener("click", (e) => {
        if (e.target?.dataset?.close === "true") closeModal();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
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
        const cart = getCart();

        if (!cart.length) {
            drawerItems.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
            drawerTotal.textContent = moneyBR(0);
            return;
        }

        let total = 0;

        drawerItems.innerHTML = cart.map(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;

            return `
            <div class="cart-item" data-id="${item.id}">
              <img src="${item.img}" alt="">
              <div>
                <h4>${item.title}</h4>
                <div class="price">${moneyBR(item.price)} x ${item.qty} = ${moneyBR(subtotal)}</div>
              </div>

              <div class="right">
                <div class="qty-controls">
                  <button class="qty-btn" data-action="dec">-</button>
                  <span class="qty-number">${item.qty}</span>
                  <button class="qty-btn" data-action="inc">+</button>
                </div>
                <button class="remove-btn" data-action="remove">Remover</button>
              </div>
            </div>
          `;
        }).join("");

        drawerTotal.textContent = moneyBR(total);
    }

    function openDrawer() {
        drawer.classList.add("open");
        document.body.style.overflow = "hidden";
        renderDrawer();
    }

    function closeDrawer() {
        drawer.classList.remove("open");
        document.body.style.overflow = "auto";
    }

    btnCart.addEventListener("click", openDrawer);
    btnCart.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openDrawer();
    });

    drawerClose.addEventListener("click", closeDrawer);

    drawer.addEventListener("click", (e) => {
        if (e.target?.dataset?.closeCart === "true") closeDrawer();
    });

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && drawer.classList.contains("open")) closeDrawer();
    });

    drawerItems.addEventListener("click", (e) => {
        const action = e.target?.dataset?.action;
        if (!action) return;

        const row = e.target.closest(".cart-item");
        if (!row) return;

        const id = row.dataset.id;
        const cart = getCart();
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (action === "inc") item.qty += 1;
        if (action === "dec") item.qty = Math.max(1, item.qty - 1);
        if (action === "remove") {
            const idx = cart.findIndex(i => i.id === id);
            if (idx >= 0) cart.splice(idx, 1);
        }

        setCart(cart);
        updateNavbar();
        renderDrawer();
    });

    drawerClear.addEventListener("click", () => {
        setCart([]);
        updateNavbar();
        renderDrawer();
    });

    drawerCheckout.addEventListener("click", () => {
        const cart = getCart();
        if (!cart.length) return alert("Seu carrinho está vazio.");
        alert("Finalizar compra (próximo passo: WhatsApp/checkout).");
    });


    // =========================
    // ADD TO CART (MODAL)
    // =========================
    mAdd.addEventListener("click", () => {
        if (!currentProduct) return;

        const qty = Math.max(1, Number(mQty.value || 1));
        const id = currentProduct.title.toLowerCase().trim();

        const cart = getCart();
        const existing = cart.find(i => i.id === id);

        if (existing) existing.qty += qty;
        else {
            cart.push({
                id,
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


    // =========================
    // PAGINAÇÃO AUTOMÁTICA
    // =========================
    const pag = document.getElementById("paginacao");
    const cards = Array.from(document.querySelectorAll(".card-produto"));

    const ITEMS_PER_PAGE = 8; // <-- ajuste aqui
    let currentPage = 1;

    function totalPages() {
        return Math.max(1, Math.ceil(cards.length / ITEMS_PER_PAGE));
    }

    function renderPage(page) {
        currentPage = Math.min(Math.max(1, page), totalPages());

        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;

        cards.forEach((card, idx) => {
            card.style.display = (idx >= start && idx < end) ? "" : "none";
        });

        renderPagination();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function renderPagination() {
        if (!pag) return;

        const pages = totalPages();
        pag.innerHTML = "";

        const prev = document.createElement("button");
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
        next.className = "nav-btn";
        next.textContent = "→";
        next.disabled = currentPage === pages;
        next.addEventListener("click", () => renderPage(currentPage + 1));
        pag.appendChild(next);
    }

    function pageBtn(n) {
        const btn = document.createElement("button");
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

    renderPage(1);

});