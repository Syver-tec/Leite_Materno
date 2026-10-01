# Configuração do Painel Administrativo (Leite Materno)

Este site agora tem uma página `/admin.html` onde é possível trocar
imagem, título, descrição e preço dos produtos das páginas **Comprar**
e **Alugar**, sem mexer em código.

Para isso funcionar, os produtos deixaram de ficar "escritos" direto no
HTML e passaram a vir de um banco de dados gratuito no **Supabase**
(supabase.com). Siga os passos abaixo **uma única vez** para configurar.

---

## 1. Criar o projeto no Supabase

1. Acesse https://supabase.com e crie uma conta (pode ser com o GitHub
   ou e-mail).
2. Clique em **New project**.
3. Escolha um nome (ex: `leite-materno`), uma senha de banco de dados
   (guarde essa senha em local seguro, mas ela não será usada no site)
   e a região mais próxima (ex: South America).
4. Aguarde o projeto ser criado (leva 1-2 minutos).

## 2. Criar a tabela de produtos

1. No menu lateral do Supabase, clique em **SQL Editor**.
2. Clique em **New query**.
3. Abra o arquivo `supabase/schema.sql` (incluso neste projeto),
   copie todo o conteúdo e cole no editor.
4. Clique em **Run**. Isso cria a tabela `produtos`, as regras de
   segurança (RLS) e já cadastra todos os produtos que já existiam no
   site (22 de Comprar + 8 de Alugar).

## 3. Criar o espaço para as imagens (Storage)

1. No menu lateral, clique em **Storage**.
2. Clique em **New bucket**.
3. Nome do bucket: `produtos-imagens` (exatamente assim, minúsculo).
4. Marque a opção **Public bucket** (importante: precisa ser público
   para as imagens aparecerem no site).
5. Clique em **Create bucket**.
6. As políticas de acesso desse bucket (leitura pública, upload só
   para quem está logado) já foram criadas no passo 2, junto com o
   `schema.sql`.

## 4. Criar o usuário/login da administradora

1. No menu lateral, clique em **Authentication** → **Users**.
2. Clique em **Add user** → **Create new user**.
3. Preencha o e-mail e a senha que a cliente vai usar para entrar no
   painel (ex: `contato@leitematerno.com`).
4. Marque a opção **Auto Confirm User** (assim não precisa confirmar
   por e-mail).
5. Clique em **Create user**.

Esse é o login e a senha que devem ser repassados para a cliente
acessar `/admin.html`. Dá pra criar mais de um usuário aqui se quiser
mais de uma pessoa com acesso.

## 5. Conectar o site ao Supabase

1. No menu lateral, clique em **Project Settings** (ícone de
   engrenagem) → **API**.
2. Copie o valor de **Project URL**.
3. Copie o valor de **anon public** (a chave pública).
4. Abra o arquivo `scripts/supabase-config.js` neste projeto e
   substitua:
   ```js
   const SUPABASE_URL = "COLE_AQUI_A_URL_DO_SEU_PROJETO_SUPABASE";
   const SUPABASE_ANON_KEY = "COLE_AQUI_A_ANON_KEY_DO_SEU_PROJETO_SUPABASE";
   ```
   pelos valores copiados.
5. Salve o arquivo e publique o site normalmente (o mesmo processo de
   sempre, ex: subir no Netlify).

## 6. Usar o painel

1. Acesse `https://seudominio.com/admin.html`.
2. Faça login com o e-mail/senha criados no passo 4.
3. Escolha a aba **Comprar** ou **Alugar**.
4. Clique em um produto existente para editar (título, descrição,
   preço, imagem, ou ocultar o produto do site), ou em
   **+ Novo produto** para cadastrar um novo.
5. As mudanças aparecem no site (páginas `comprar.html` e
   `alugar.html`) assim que salvas — não precisa reimplantar o site.

---

### Observações importantes

- A URL e a chave `anon` do Supabase **não são segredos** — elas
  ficam visíveis no código do site propositalmente. Quem protege os
  dados são as regras de segurança (RLS) criadas no `schema.sql`, que
  garantem que só quem faz login consegue criar/editar/excluir
  produtos; qualquer visitante só consegue *ler* os produtos ativos.
- A página `/admin.html` não tem link visível em nenhum lugar do
  site — só quem tiver o endereço exato consegue chegar nela. Se
  quiser um nível extra de discrição, pode renomear o arquivo (ex:
  `painel-lm.html`) antes de publicar.
- O plano gratuito do Supabase é suficiente para esse volume de
  produtos e imagens.
