document.addEventListener("DOMContentLoaded", () => {
    // ====== CONFIG ÚNICA (todas as páginas) ======
    const CART_KEY = "cart_leite_materno";

    // ====== HELPERS ======
    const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    const setCart = (cart) => localStorage.setItem(CART_KEY, JSON.stringify(cart));
    const moneyBR = (v) => (v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    // ====== GARANTE O DRAWER EM QUALQUER PÁGINA ======
    function ensureDrawerExists() {
        if (document.getElementById("drawer-cart")) return;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
      <div class="drawer" id="drawer-cart" aria-hidden="true">
        <div class="drawer-overlay" data-close-cart="true"></div>

        <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Carrinho">
          <div class="drawer-header">
            <h3>Seu carrinho</h3>
            <button class="drawer-close" id="drawer-close" aria-label="Fechar">&times;</button>
          </div>

          <div class="drawer-body" id="drawer-items"></div>

          <div class="drawer-footer">
            <div class="drawer-total">
              <span>Total</span>
              <strong id="drawer-total">R$0,00</strong>
            </div>

            <div class="drawer-actions">
              <button class="drawer-btn outline" id="drawer-clear">Limpar</button>
              <button class="drawer-btn" id="drawer-checkout">Finalizar</button>
            </div>
          </div>
        </aside>
      </div>
    `.trim();

        document.body.appendChild(wrapper.firstChild);
    }

    ensureDrawerExists();

    // ====== ELEMENTOS NAVBAR ======
    const navTotal = document.querySelector("#btn-cart .valor");
    const navCount = document.querySelector("#btn-cart .cart-count");

    // ====== ELEMENTOS DRAWER ======
    const btnCart = document.getElementById("btn-cart");
    const drawer = document.getElementById("drawer-cart");
    const drawerClose = document.getElementById("drawer-close");
    const drawerItems = document.getElementById("drawer-items");
    const drawerTotal = document.getElementById("drawer-total");
    const drawerClear = document.getElementById("drawer-clear");
    const drawerCheckout = document.getElementById("drawer-checkout");

    // ====== NAVBAR ======
    function updateNavbar() {
        const cart = getCart();
        const count = cart.reduce((a, i) => a + (Number(i.qty) || 0), 0);
        const total = cart.reduce((a, i) => a + ((Number(i.price) || 0) * (Number(i.qty) || 0)), 0);

        if (navCount) navCount.textContent = count;
        if (navTotal) navTotal.textContent = moneyBR(total);
    }

    // ====== DRAWER RENDER ======
    function renderDrawer() {
        const cart = getCart();

        if (!drawerItems || !drawerTotal) return;

        if (!cart.length) {
            drawerItems.innerHTML = `<div class="cart-empty">Seu carrinho está vazio.</div>`;
            drawerTotal.textContent = moneyBR(0);
            return;
        }

        let total = 0;

        drawerItems.innerHTML = cart.map(item => {
            const price = Number(item.price) || 0;
            const qty = Number(item.qty) || 0;
            const subtotal = price * qty;
            total += subtotal;

            const periodLine = item.type === "alugar" && item.period
                ? `<div class="meta">Período: ${item.period} dias</div>`
                : "";

            return `
        <div class="cart-item" data-id="${item.id}">
          <img src="${item.img || ""}" alt="">
          <div>
            <h4>${item.title || ""}</h4>
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
        }).join("");

        drawerTotal.textContent = moneyBR(total);
    }

    // ====== ABRIR/FECHAR DRAWER ======
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

    // ====== EVENTOS DRAWER ======
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
            const item = cart.find(i => i.id === id);
            if (!item) return;

            item.qty = Number(item.qty) || 1;

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
            
            // Função para enviar ao WhatsApp
            sendCartToWhatsApp(cart);
        });
    }

    // ====== FUNÇÃO WHATSAPP ======
    window.sendCartToWhatsApp = function(cart) {
        if (!cart || !cart.length) return alert("Seu carrinho está vazio.");

        // Monta a mensagem bonitinha com emojis
        let message = "Ola! Gostaria de fazer um pedido!\n\n";
        message += "LEITE MATERNO\n";
        message += "======================\n\n";
        
        let total = 0;

        cart.forEach((item, index) => {
            const subtotal = (Number(item.price) || 0) * (Number(item.qty) || 0);
            total += subtotal;

            message += `${index + 1}. ${item.title}\n`;
            message += `   Quantidade: ${item.qty} ${item.qty > 1 ? 'unidades' : 'unidade'}\n`;
            message += `   Preco: ${moneyBR(item.price)} cada\n`;
            message += `   ${item.qty} x ${moneyBR(item.price)} = ${moneyBR(subtotal)}\n`;

            if (item.type === "alugar" && item.period) {
                message += `   Periodo: ${item.period} dias\n`;
            }
            message += "\n";
        });

        message += `======================\n`;
        message += `TOTAL DO PEDIDO\n`;
        message += `${moneyBR(total)}\n`;
        message += `======================\n\n`;
        message += `Por favor, confirme o pedido!\n`;
        message += `Entraremos em contato em breve.\n`;
        message += `Obrigado! Aguardamos! :)`;

        // Codifica a mensagem para URL preservando emojis
        const encodedMessage = encodeURIComponent(message);

        // Abre o WhatsApp com a mensagem (usa o número configurado no whatsapp-config.js)
        const whatsappURL = `https://wa.me/${window.WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappURL, "_blank");
    };

    // ====== FUNÇÕES GLOBAIS (qualquer página adiciona item) ======
    window.cartLM = {
        getCart,
        setCart,
        openDrawer,
        updateNavbar,
        addItem(product) {
            const cart = getCart();

            // garantia de tipos
            const safe = {
                id: String(product.id || ""),
                title: String(product.title || ""),
                img: String(product.img || ""),
                type: String(product.type || "comprar"),
                period: product.period ? String(product.period) : undefined,
                price: Number(product.price) || 0,
                qty: Math.max(1, Number(product.qty) || 1),
            };

            if (!safe.id) return;

            const existing = cart.find(i => i.id === safe.id);
            if (existing) existing.qty = (Number(existing.qty) || 0) + safe.qty;
            else cart.push(safe);

            setCart(cart);
            updateNavbar();
        }
    };

    // ====== IMPORTANTE: atualiza ao abrir qualquer página ======
    updateNavbar();
});
