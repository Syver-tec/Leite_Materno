// ===============================
// Configuração do Supabase
// ===============================
// Preencha com os dados do SEU projeto Supabase.
// Você encontra esses valores em: Project Settings > API
//
// SUPABASE_URL  -> "Project URL"
// SUPABASE_ANON_KEY -> "anon public" key
//
// Esses dois valores NÃO são segredos: eles são feitos para
// ficar no código do site (a segurança de verdade é feita
// pelas políticas RLS configuradas no banco - veja supabase/schema.sql)

const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE";
const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO_SUPABASE";

// persistSession: false -> a sessão de login NÃO fica salva no navegador.
// Assim, ao fechar/sair da página do admin e voltar depois (ou dar F5),
// o painel sempre pede login de novo, em vez de continuar logado.
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);
