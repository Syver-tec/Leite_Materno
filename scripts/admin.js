// ===============================
// Painel Administrativo - Leite Materno
// ===============================

const BUCKET_IMAGENS = "produtos-imagens";

let paginaAtual = "comprar";
let produtosCache = [];

// --------- ELEMENTOS ---------
const loginScreen = document.getElementById("admin-login-screen");
const painel = document.getElementById("admin-panel");
const loginForm = document.getElementById("admin-login-form");
const loginErro = document.getElementById("admin-login-erro");
const loginBtn = document.getElementById("admin-login-btn");
const logoutBtn = document.getElementById("admin-logout-btn");

const tabs = document.querySelectorAll(".admin-tab");
const listaTitulo = document.getElementById("admin-lista-titulo");
const listaStatus = document.getElementById("admin-lista-status");
const lista = document.getElementById("admin-lista");
const novoBtn = document.getElementById("admin-novo-btn");

const modal = document.getElementById("admin-modal");
const modalFechar = document.getElementById("admin-modal-fechar");
const modalTitulo = document.getElementById("admin-modal-titulo");
const form = document.getElementById("admin-form");
const formErro = document.getElementById("admin-form-erro");
const excluirBtn = document.getElementById("admin-excluir-btn");

const campoCategoria = document.getElementById("campo-categoria");
const campoIndicacao = document.getElementById("campo-indicacao");
const campoPrecoUnico = document.getElementById("campo-preco-unico");
const campoPrecosLocacao = document.getElementById("campo-precos-locacao");

const fId = document.getElementById("f-id");
const fPagina = document.getElementById("f-pagina");
const fTitulo = document.getElementById("f-titulo");
const fCategoria = document.getElementById("f-categoria");
const fDescricao = document.getElementById("f-descricao");
const fIndicacao = document.getElementById("f-indicacao");
const fPreco = document.getElementById("f-preco");
const fPreco15 = document.getElementById("f-preco15");
const fPreco30 = document.getElementById("f-preco30");
const fImagemArquivo = document.getElementById("f-imagem-arquivo");
const fImagemUrl = document.getElementById("f-imagem-url");
const fImagemPreview = document.getElementById("f-imagem-preview");
const uploadStatus = document.getElementById("admin-upload-status");
const fAtivo = document.getElementById("f-ativo");

// --------- AUTENTICAÇÃO ---------

async function verificarSessao() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    mostrarPainel();
  } else {
    mostrarLogin();
  }
}

function mostrarLogin() {
  loginScreen.hidden = false;
  painel.hidden = true;

  // Limpa qualquer dado/produto que estava em tela, pra não ficar
  // visível por um instante caso a pessoa volte a abrir o painel.
  lista.innerHTML = "";
  produtosCache = [];
  loginForm.reset();
  fecharModal();
}

function mostrarPainel() {
  loginScreen.hidden = true;
  painel.hidden = false;
  carregarLista();
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginErro.hidden = true;
  loginBtn.disabled = true;
  loginBtn.textContent = "Entrando...";

  const email = document.getElementById("admin-email").value.trim();
  const senha = document.getElementById("admin-senha").value;

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password: senha,
  });

  loginBtn.disabled = false;
  loginBtn.textContent = "Entrar";

  if (error) {
    loginErro.textContent = "E-mail ou senha inválidos.";
    loginErro.hidden = false;
    return;
  }

  mostrarPainel();
});

logoutBtn.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  mostrarLogin();
});

// --------- ABAS (Comprar / Alugar) ---------

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    paginaAtual = tab.dataset.pagina;
    listaTitulo.innerHTML = `Produtos da página <strong>${paginaAtual === "comprar" ? "Comprar" : "Alugar"}</strong>`;
    carregarLista();
  });
});

// --------- LISTAR PRODUTOS ---------

async function carregarLista() {
  lista.innerHTML = "";
  listaStatus.hidden = false;
  listaStatus.textContent = "Carregando...";

  const { data, error } = await supabaseClient
    .from("produtos")
    .select("*")
    .eq("pagina", paginaAtual)
    .order("ordem", { ascending: true });

  if (error) {
    listaStatus.textContent = "Erro ao carregar produtos: " + error.message;
    return;
  }

  produtosCache = data || [];

  if (produtosCache.length === 0) {
    listaStatus.textContent = "Nenhum produto cadastrado ainda nesta página.";
    return;
  }

  listaStatus.hidden = true;

  lista.innerHTML = produtosCache
    .map((p) => {
      const precoTexto =
        paginaAtual === "comprar"
          ? formatBRLAdmin(p.preco)
          : `${formatBRLAdmin(p.preco_15)} / 15d · ${formatBRLAdmin(p.preco_30)} / 30d`;

      return `
        <div class="admin-item ${p.ativo ? "" : "inativo"}" data-id="${p.id}">
          <div class="admin-item-img">
            <img src="${p.imagem_url || ""}" alt="${escapeHtmlAdmin(p.titulo)}" onerror="this.style.visibility='hidden'">
          </div>
          <h4>${escapeHtmlAdmin(p.titulo)}</h4>
          <span class="admin-item-preco">${precoTexto}</span>
          <span class="admin-item-badge">${p.ativo ? "Visível" : "Oculto"}</span>
        </div>
      `;
    })
    .join("");

  lista.querySelectorAll(".admin-item").forEach((el) => {
    el.addEventListener("click", () => {
      const produto = produtosCache.find((p) => p.id === el.dataset.id);
      if (produto) abrirFormEdicao(produto);
    });
  });
}

function formatBRLAdmin(value) {
  if (value === null || value === undefined) return "-";
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function escapeHtmlAdmin(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

// --------- FORMULÁRIO (novo / editar) ---------

function ajustarCamposPorPagina(pagina) {
  const isAlugar = pagina === "alugar";
  campoCategoria.hidden = !isAlugar;
  campoIndicacao.hidden = !isAlugar;
  campoPrecosLocacao.hidden = !isAlugar;
  campoPrecoUnico.hidden = isAlugar;

  fPreco.required = !isAlugar;
  fPreco15.required = isAlugar;
  fPreco30.required = isAlugar;
}

function limparForm() {
  form.reset();
  fId.value = "";
  fImagemUrl.value = "";
  fImagemPreview.hidden = true;
  uploadStatus.textContent = "";
  formErro.hidden = true;
  excluirBtn.hidden = true;
}

novoBtn.addEventListener("click", () => {
  limparForm();
  fPagina.value = paginaAtual;
  ajustarCamposPorPagina(paginaAtual);
  modalTitulo.textContent = paginaAtual === "comprar" ? "Novo produto" : "Novo equipamento";
  abrirModal();
});

function abrirFormEdicao(produto) {
  limparForm();

  fId.value = produto.id;
  fPagina.value = produto.pagina;
  ajustarCamposPorPagina(produto.pagina);

  fTitulo.value = produto.titulo || "";
  fCategoria.value = produto.categoria || "";
  fDescricao.value = produto.descricao || "";
  fIndicacao.value = produto.indicacao || "";
  fPreco.value = produto.preco ?? "";
  fPreco15.value = produto.preco_15 ?? "";
  fPreco30.value = produto.preco_30 ?? "";
  fImagemUrl.value = produto.imagem_url || "";
  fAtivo.checked = !!produto.ativo;

  if (produto.imagem_url) {
    fImagemPreview.src = produto.imagem_url;
    fImagemPreview.hidden = false;
  }

  modalTitulo.textContent = "Editar " + (produto.pagina === "comprar" ? "produto" : "equipamento");
  excluirBtn.hidden = false;

  abrirModal();
}

function abrirModal() {
  modal.classList.add("active");
}

function fecharModal() {
  modal.classList.remove("active");
}

modalFechar.addEventListener("click", fecharModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});

// --------- UPLOAD DE IMAGEM ---------

fImagemArquivo.addEventListener("change", async () => {
  const arquivo = fImagemArquivo.files[0];
  if (!arquivo) return;

  uploadStatus.textContent = "Enviando imagem...";

  const extensao = arquivo.name.split(".").pop();
  const nomeArquivo = `${paginaAtual}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensao}`;

  const { error: erroUpload } = await supabaseClient.storage
    .from(BUCKET_IMAGENS)
    .upload(nomeArquivo, arquivo, { cacheControl: "3600", upsert: false });

  if (erroUpload) {
    uploadStatus.textContent = "Erro ao enviar imagem: " + erroUpload.message;
    return;
  }

  const { data: publicData } = supabaseClient.storage
    .from(BUCKET_IMAGENS)
    .getPublicUrl(nomeArquivo);

  fImagemUrl.value = publicData.publicUrl;
  fImagemPreview.src = publicData.publicUrl;
  fImagemPreview.hidden = false;
  uploadStatus.textContent = "Imagem enviada ✅";
});

// --------- SALVAR (criar / atualizar) ---------

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  formErro.hidden = true;

  const pagina = fPagina.value;

  const payload = {
    pagina,
    titulo: fTitulo.value.trim(),
    descricao: fDescricao.value.trim(),
    imagem_url: fImagemUrl.value || null,
    ativo: fAtivo.checked,
  };

  if (pagina === "comprar") {
    payload.preco = fPreco.value ? Number(fPreco.value) : null;
  } else {
    payload.categoria = fCategoria.value.trim() || null;
    payload.indicacao = fIndicacao.value.trim() || null;
    payload.preco_15 = fPreco15.value ? Number(fPreco15.value) : null;
    payload.preco_30 = fPreco30.value ? Number(fPreco30.value) : null;
  }

  const salvarBtn = document.getElementById("admin-salvar-btn");
  salvarBtn.disabled = true;
  salvarBtn.textContent = "Salvando...";

  let resultado;
  if (fId.value) {
    resultado = await supabaseClient.from("produtos").update(payload).eq("id", fId.value);
  } else {
    resultado = await supabaseClient.from("produtos").insert(payload);
  }

  salvarBtn.disabled = false;
  salvarBtn.textContent = "Salvar";

  if (resultado.error) {
    formErro.textContent = "Erro ao salvar: " + resultado.error.message;
    formErro.hidden = false;
    return;
  }

  fecharModal();
  carregarLista();
});

// --------- EXCLUIR ---------

excluirBtn.addEventListener("click", async () => {
  if (!fId.value) return;
  const confirmar = confirm("Tem certeza que deseja excluir este produto? Essa ação não pode ser desfeita.");
  if (!confirmar) return;

  const { error } = await supabaseClient.from("produtos").delete().eq("id", fId.value);

  if (error) {
    formErro.textContent = "Erro ao excluir: " + error.message;
    formErro.hidden = false;
    return;
  }

  fecharModal();
  carregarLista();
});

// --------- INÍCIO ---------
document.addEventListener("DOMContentLoaded", verificarSessao);

// Alguns navegadores restauram a página "congelada" (ex: botão Voltar)
// sem recarregar o script. Isso força checar a sessão de novo nesse caso,
// pra não deixar o painel visível indevidamente.
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    verificarSessao();
  }
});
