// ===============================
// Carrega produtos (Comprar) do Supabase
// ===============================

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function formatarPrecoBRL(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function cardComprarHTML(produto) {
  return `
    <div class="produto-card" data-id="${produto.id}">
      <div class="produto-img">
        <img src="${escapeHtml(produto.imagem_url)}" alt="${escapeHtml(produto.titulo)}">
      </div>

      <div class="produto-content">
        <h3>${escapeHtml(produto.titulo)}</h3>
        <p>${escapeHtml(produto.descricao)}</p>

        <div class="produto-footer">
          <span class="preco">${formatarPrecoBRL(produto.preco)}</span>
          <a href="#" class="btn-comprar">
            <svg width="16" height="16" stroke="currentColor" fill="none">
              <circle cx="6" cy="14" r="1" />
              <circle cx="12" cy="14" r="1" />
              <path d="M1 1h2l2.5 9h7l2-6H4" />
            </svg>
            Comprar
          </a>
        </div>
      </div>
    </div>
  `;
}

async function carregarProdutosComprar() {
  const container = document.getElementById("cards-produtos");
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("produtos")
    .select("*")
    .eq("pagina", "comprar")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao carregar produtos:", error);
    container.innerHTML = `<p class="produtos-status">Não foi possível carregar os produtos agora. Tente novamente em instantes.</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<p class="produtos-status">Nenhum produto disponível no momento.</p>`;
    return;
  }

  container.innerHTML = data.map(cardComprarHTML).join("");

  if (typeof window.initProdutoCards === "function") {
    window.initProdutoCards();
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutosComprar);
