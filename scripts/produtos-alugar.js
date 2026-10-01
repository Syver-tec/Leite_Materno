// ===============================
// Carrega equipamentos (Alugar) do Supabase
// ===============================

function escapeAttr(str) {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function cardAlugarHTML(produto) {
  return `
    <article class="card alugar-card" data-id="${escapeAttr(produto.id)}" data-img="${escapeAttr(produto.imagem_url)}"
      data-title="${escapeAttr(produto.titulo)}" data-category="${escapeAttr(produto.categoria)}"
      data-desc="${escapeAttr(produto.descricao)}" data-price15="${produto.preco_15 ?? 0}" data-price30="${produto.preco_30 ?? 0}"
      data-adicional="${escapeAttr(produto.indicacao)}">
      <div class="card-image"><img src="${escapeAttr(produto.imagem_url)}" alt="${escapeAttr(produto.titulo)}"></div>
      <div class="content">
        <h3>${escapeAttr(produto.titulo)}</h3>
        <div class="price">R$ ${(produto.preco_15 ?? 0).toLocaleString("pt-BR")} <span>/15 dias</span></div>
        <div class="price">R$ ${(produto.preco_30 ?? 0).toLocaleString("pt-BR")} <span>/30 dias</span></div>
      </div>
    </article>
  `;
}

async function carregarProdutosAlugar() {
  const container = document.getElementById("alugar-cards");
  if (!container) return;

  const { data, error } = await supabaseClient
    .from("produtos")
    .select("*")
    .eq("pagina", "alugar")
    .eq("ativo", true)
    .order("ordem", { ascending: true });

  if (error) {
    console.error("Erro ao carregar equipamentos:", error);
    container.innerHTML = `<p class="produtos-status">Não foi possível carregar os equipamentos agora. Tente novamente em instantes.</p>`;
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = `<p class="produtos-status">Nenhum equipamento disponível no momento.</p>`;
    return;
  }

  container.innerHTML = data.map(cardAlugarHTML).join("");

  if (typeof window.initAlugarCards === "function") {
    window.initAlugarCards();
  }
}

document.addEventListener("DOMContentLoaded", carregarProdutosAlugar);
