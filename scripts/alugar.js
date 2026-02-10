document.addEventListener("DOMContentLoaded", () => {

    const CART_KEY = "cart_leite_materno";

    function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || "[]"); }
    function setCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

    function moneyBR(v) {
        return (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    function parsePrecoRange(txt) {
        const first = (txt || "").split("–")[0].trim();
        const num = first.replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
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

    // Modal
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
        currentProduct = {
            title: card.dataset.titulo || "",
            categories: card.dataset.categorias || "",
            priceText: card.dataset.preco || "",
            price: parsePrecoRange(card.dataset.preco),
            desc: card.dataset.desc || "",
            img: card.dataset.img || ""
        };

        mImg.src = currentProduct.img;
        mTitulo.textContent = currentProduct.title;
        mCategorias.textContent = currentProduct.categories;
        mPreco.textContent = currentProduct.priceText;
        mDesc.textContent = currentProduct.desc;

        mPeriodo.value = "";
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

    // Drawer
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
                <div class="meta">Período: ${item.period} dias</div>
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

    // Add to cart (Modal)
    mAdd.addEventListener("click", () => {
        if (!currentProduct) return;

        if (!mPeriodo.value) {
            alert("Selecione o período de locação.");
            mPeriodo.focus();
            return;
        }

        const qty = Math.max(1, Number(mQty.value || 1));
        const period = mPeriodo.value;

        const id = (currentProduct.title + "_" + period).toLowerCase();

        const cart = getCart();
        const existing = cart.find(i => i.id === id);

        if (existing) existing.qty += qty;
        else {
            cart.push({
                id,
                title: currentProduct.title,
                period,
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

});