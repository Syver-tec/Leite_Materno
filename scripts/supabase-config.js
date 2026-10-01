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

const SUPABASE_URL = "https://bbbaubiiolymrvdvvvpj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiYmF1Ymlpb2x5bXJ2ZHZ2dnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4MTAzNTMsImV4cCI6MjEwNjM4NjM1M30.broTDWjYkHYlOzpNjgbyzwAIujsP0vGAd4Ix24B_UbA";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
