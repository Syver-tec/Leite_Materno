-- =========================================================
-- Leite Materno — Setup do banco (Supabase)
-- Rode este arquivo inteiro no SQL Editor do Supabase,
-- de uma vez só (cole tudo e clique em "Run").
-- =========================================================

-- Tabela de produtos (usada nas páginas Comprar e Alugar)
create table if not exists produtos (
  id uuid primary key default gen_random_uuid(),
  pagina text not null check (pagina in ('comprar', 'alugar')),
  titulo text not null,
  descricao text not null default '',
  categoria text,
  indicacao text,
  imagem_url text,
  preco numeric,
  preco_15 numeric,
  preco_30 numeric,
  ordem integer not null default 0,
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

alter table produtos enable row level security;

-- Qualquer visitante do site pode LER produtos ativos
drop policy if exists "Leitura publica de produtos ativos" on produtos;
create policy "Leitura publica de produtos ativos"
  on produtos for select
  using (ativo = true);

-- O admin logado pode ler tudo, inclusive produtos inativos
drop policy if exists "Admin le todos os produtos" on produtos;
create policy "Admin le todos os produtos"
  on produtos for select
  to authenticated
  using (true);

-- Só o admin logado pode inserir / editar / excluir
drop policy if exists "Admin insere produtos" on produtos;
create policy "Admin insere produtos"
  on produtos for insert
  to authenticated
  with check (true);

drop policy if exists "Admin atualiza produtos" on produtos;
create policy "Admin atualiza produtos"
  on produtos for update
  to authenticated
  using (true);

drop policy if exists "Admin exclui produtos" on produtos;
create policy "Admin exclui produtos"
  on produtos for delete
  to authenticated
  using (true);

-- =========================================================
-- Políticas do Storage (rode depois de criar o bucket
-- "produtos-imagens" — veja o guia de configuração)
-- =========================================================

drop policy if exists "Leitura publica imagens produtos" on storage.objects;
create policy "Leitura publica imagens produtos"
  on storage.objects for select
  using (bucket_id = 'produtos-imagens');

drop policy if exists "Admin envia imagens" on storage.objects;
create policy "Admin envia imagens"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'produtos-imagens');

drop policy if exists "Admin atualiza imagens" on storage.objects;
create policy "Admin atualiza imagens"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'produtos-imagens');

drop policy if exists "Admin remove imagens" on storage.objects;
create policy "Admin remove imagens"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'produtos-imagens');

-- Seed: produtos da página Comprar
insert into produtos (pagina, titulo, descricao, imagem_url, preco, ordem) values
  ('comprar', 'Copa Medela', 'Peça utilizada junto ao acoplador.', 'imgs/compra/produto1.png', 150.00, 0),
  ('comprar', 'Copa Medela', 'Compativel com Swing Flex e Free Style.', 'imgs/compra/produto2.png', 280.00, 1),
  ('comprar', 'Copo Dosador', 'Ideal para oferecer o leite materno na ausencia da mãe.', 'imgs/compra/produto3.png', 10.00, 2),
  ('comprar', 'Correia Dentada Medela', 'Correia Plana Para Bombas Hospitalares Lactina Plus e Lactina Select Medela', 'imgs/compra/produto4.png', 750.00, 3),
  ('comprar', 'Gelox', 'Ideal para o transporte do leite materno.', 'imgs/compra/produto5.png', 45.00, 4),
  ('comprar', 'Kit de Utilização Individual', 'Kit descartável, de utilização individual, ideal para as mães que querem exclusividade.', 'imgs/compra/produto6.png', 150.00, 5),
  ('comprar', 'Kit Universal Medela', 'Kit com todos os itens necessários para a utilização universal do leite materno.', 'imgs/compra/produto7.png', 340.00, 6),
  ('comprar', 'Mamadeira Calma 150ml', 'Mamadeira com design ergonômico, ideal para bebês que preferem chupar de forma natural.', 'imgs/compra/produto8.png', 220.00, 7),
  ('comprar', 'Mangueira Medela', 'Compatível com as bombas medela: Swing , Lactina e Symphony medela.', 'imgs/compra/produto9.png', 85.00, 8),
  ('comprar', 'Mangueira Pump In Style Medela', 'Componente do kit da bomba de sucção silenciosa de acionamento elétrico Pump In Style da Medela.', 'imgs/compra/produto10.png', 100.00, 9),
  ('comprar', 'Medela Tubo Bomba Medela Free Style', 'Utilizada para conectar a Bomba Tira leite ao Kit Extrator de Leite Materno.', 'imgs/compra/produto11.png', 220.00, 10),
  ('comprar', 'Membrana', 'Membrana para uso em bombas de sucção.', 'imgs/compra/produto12.png', 45.00, 11),
  ('comprar', 'Pote de vidro 100ml', 'Pote de vidro, sem graduação, indicado para armazenar leite materno.', 'imgs/compra/produto13.png', 10.00, 12),
  ('comprar', 'Pote de vidro 150ml', 'Pote de vidro, sem graduação, indicado para armazenar e pasteurizar leite materno.', 'imgs/compra/produto14.png', 10.00, 13),
  ('comprar', 'Pote de vidro 200ml (Azul)', 'Pote de vidro com graduação azul.', 'imgs/compra/produto15.png', 10.00, 14),
  ('comprar', 'Pote de vidro 200ml (Rosa)', 'Pote de vidro com tampa, graduado, ideal para armazenar leite.', 'imgs/compra/produto16.png', 10.00, 15),
  ('comprar', 'Pote de vidro 70ml', 'Pote de vidro com graduação e rosca universal, rosqueavél em qualquer equipamento Medela. Evitando a manipulação e a contaminação também.', 'imgs/compra/produto17.png', 25.00, 16),
  ('comprar', 'Recipiente 150ml', 'Recipiente Medela 150ml. Compativel com todos os equipamentos medela.', 'imgs/compra/produto18.png', 100.00, 17),
  ('comprar', 'Recipiente Hospitalar 150ml', 'Frasco Plástico Para Leite Materno 150ml Medela (unidade).', 'imgs/compra/produto19.png', 100.00, 18),
  ('comprar', 'Tampa Medela', 'Tampa para frasco (recipientes, potes) de 150ml e/ou 80ml SGf-0076 da medela: 01 unidade.', 'imgs/compra/produto20.png', 45.00, 19),
  ('comprar', 'Válvula e Membrana Medela', 'Válvula amarela com membrana branca Para copas das bombas ordenhadeiras R0010 Medela.', 'imgs/compra/produto21.png', 90.00, 20),
  ('comprar', 'Válvula Medela', 'Acoplador rígido para retirada do leite materno Medela.', 'imgs/compra/produto22.png', 45.00, 21);

-- Seed: produtos da página Alugar
insert into produtos (pagina, titulo, categoria, descricao, indicacao, imagem_url, preco_15, preco_30, ordem) values
  ('alugar', 'Swing - Single', 'Bomba Elétrica', 'Leve, discreta e eficiente para rotina diária.', 'Indicação:

Utilize depois que o fluxo de leite já estiver bem estabelecido (cerca de 2 a 3 meses);

É excelente para as mamães que não possuem leite em excesso;

A mais indicada para a volta ao trabalho!

Contra Indicação:

Não é indicada para mamas cheias;

Não utilizar se as mamas estiverem empedradas ou ingurgitadas ou no período de apojadura, por volta dos primeiros 20 dias de amamentação;

Esse equipamento não é indicado para situações que necessitem de pressão: primeiros dias de amamentação, apojadura. O uso nesses casos é de total responsabilidade do locatário!', 'imgs/alugar/alugar7.png', 95, 155, 0),
  ('alugar', 'Pump Style - Single', 'Bomba Elétrica', 'Desempenho sólido com excelente custo-benefício.', 'Indicação:

Usada em várias maternidades de Recife, é a única bomba com dispositivo para bombeamento que contém as duas fases: libera o fluxo máximo de leite e estimula ao mesmo tempo (imitando a sucção do bebê);

Para mamães que precisam de pressão, tanto para a retirada (ingurgitamento, apojadura) quanto para o estímulo (aumentar a produção);

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores.
Pode ser usada os dois lados ao mesmo tempo. Para kit extra consulte
valores!

Contra Indicação:

Uso para mães que tem sensibilidade, ou fissura deve ser feito com ajuda de um profissional devidamente habilitado, para evitar qualquer eventual problema.', 'imgs/alugar/alugar6.png', 115, 175, 1),
  ('alugar', 'Pump Style - Duplo', 'Bomba Elétrica', 'Conforto com ajuste inteligente de sucção.', 'Indicação:

Usada em várias maternidades de Recife, é a única bomba com dispositivo para bombeamento que contém as duas fases: libera o fluxo máximo de leite e estimula ao mesmo tempo (imitando a sucção do bebê);

Para mamães que precisam de pressão, tanto para a retirada (ingurgitamento, apojadura) quanto para o estímulo (aumentar a produção);

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores.
Pode ser usada os dois lados ao mesmo tempo. Para kit extra consulte
valores!

Contra Indicação:

Uso para mães que tem sensibilidade, ou fissura deve ser feito com ajuda de um profissional devidamente habilitado, para evitar qualquer eventual problema.', 'imgs/alugar/alugar5.png', 155, 215, 2),
  ('alugar', 'Free Style - Single', 'Bomba Elétrica', 'Extração dupla para rotina mais dinâmica e confortável.', 'Indicação:
Portátil: tamanho compacto e bateria recarregável, extraia o leite onde quiser!

Permite extração dupla: extrair dos dois seios com o extrator Freestyle resulta
maior volume de leite, com mais calorias e em menos tempo.

Indicada para mamas cheias, ingurgimamento mamário ou para quem precisa
de estimulo, também imita a sucção do bebê!

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores. Pode
ser usada os dois lados ao mesmo tempo. Para kit extra consulte valores.

Contra Indicação:

Para mães que possuem fissura ou sensibilidade, indicado o uso com a orientação de uma consultora.', 'imgs/alugar/alugar2.png', 120, 200, 3),
  ('alugar', 'Free Style - Duplo', 'Bomba Elétrica', 'Modelo prático, portátil e eficiente para extração diária.', 'Indicação:
Portátil: tamanho compacto e bateria recarregável, extraia o leite onde quiser!

Permite extração dupla: extrair dos dois seios com o extrator Freestyle resulta
maior volume de leite, com mais calorias e em menos tempo.

Indicada para mamas cheias, ingurgimamento mamário ou para quem precisa
de estimulo, também imita a sucção do bebê!

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores. Pode
ser usada os dois lados ao mesmo tempo. Para kit extra consulte valores.

Contra Indicação:

Para mães que possuem fissura ou sensibilidade, indicado o uso com a orientação de uma consultora.', 'imgs/alugar/alugar1.png', 160, 240, 4),
  ('alugar', 'Lactina - Single', 'Bomba Elétrica', 'Compacta, silenciosa e fácil de transportar.', 'Indicação:

Modelo bastante utilizado nos hospitais e bancos de leite do mundo todo.

Robusto, extremamente confortável e indicado para o aumento da produção.

Imita a sucção do bebê, ajudando tanto na produção quanto na retirada de leite materno.

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores.

Pode ser usada os dois lados ao mesmo tempo. Para kit extra consulte valores.

Contra Indicação:

Para mães que possuem fissura ou sensibilidade, indicado o uso com a orientação de um especialista.', 'imgs/alugar/alugar4.png', 250, 400, 5),
  ('alugar', 'Lactina - Duplo', 'Hospitalar', 'Tecnologia hospitalar para alta performance de extração.', 'Indicação:

Modelo bastante utilizado nos hospitais e bancos de leite do mundo todo.

Robusto, extremamente confortável e indicado para o aumento da produção.

Imita a sucção do bebê, ajudando tanto na produção quanto na retirada de leite materno.

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores.

Pode ser usada os dois lados ao mesmo tempo. Para kit extra consulte valores.

Contra Indicação:

Para mães que possuem fissura ou sensibilidade, indicado o uso com a orientação de um especialista.', 'imgs/alugar/alugar3.png', 290, 440, 6),
  ('alugar', 'Symphony - Duplo', 'Bomba Elétrica', 'Potência equilibrada e uso confortável.', 'Indicação:

Modelo bastante utilizado nos hospitais e bancos de leite do mundo todo.

Robusto, extremamente confortável e indicado para o aumento da produção.

Imita a sucção do bebê, ajudando tanto na produção quanto na retirada de leite materno.

Inclui um kit para retirada de leite. Para o segundo kit solicitar valores.

Pode ser usada os dois lados ao mesmo tempo. Para kit extra consulte valores.

Contra Indicação:

Para mães que possuem fissura ou sensibilidade, indicado o uso com a orientação de um especialista.', 'imgs/alugar/alugar8.png', 850, 1600, 7);