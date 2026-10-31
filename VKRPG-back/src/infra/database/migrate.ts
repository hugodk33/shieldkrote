// src/infra/database/migrate.ts
import { db } from './database'
import { adminId, playerOneId } from '../variables/MainUUIDIds/uuidGeral'

db.exec(`

PRAGMA foreign_keys = ON;

-- =========================
-- USERS
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  type INTEGER,
  username TEXT,
  password TEXT,
  phone TEXT,
  email TEXT
);

-- =========================
-- NARRATORS
-- =========================
CREATE TABLE IF NOT EXISTS narrators (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  name TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS narrator_images (
  id TEXT PRIMARY KEY,
  narrator_id TEXT,
  url TEXT,
  FOREIGN KEY (narrator_id) REFERENCES narrators(id)
);

-- =========================
-- GAME TABLES
-- =========================
CREATE TABLE IF NOT EXISTS game_tables (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  narrator_id TEXT,
  title TEXT,
  system TEXT,
  intro TEXT,
  default_location_id TEXT,
  modules TEXT DEFAULT '[]',
  PRIMARY KEY (id, lang),
  FOREIGN KEY (narrator_id) REFERENCES narrators(id)
);

-- =========================
-- TABLE SETTINGS (configurações de cada mesa)
-- =========================
CREATE TABLE IF NOT EXISTS game_table_settings (
  table_id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  turn_end_mode TEXT NOT NULL DEFAULT 'after_test',   -- 'after_test' | 'after_move' (o turno encerra depois de um teste, ou depois de mover + virar-se)
  item_mode TEXT NOT NULL DEFAULT 'gm',               -- 'points' | 'gm' (gastar pontos da ficha para adicionar itens, ou é o mestre que concede)
  reaction_mode TEXT NOT NULL DEFAULT 'gm',           -- 'points' | 'gm' (teste de reação com pontos, ou é o mestre quem resolve)
  gm_adds_item INTEGER NOT NULL DEFAULT 1,            -- o mestre pode adicionar o item diretamente (independente do gasto de pontos)
  money_item_id TEXT,                                 -- @deprecated Use game_table_currencies (uma mesa pode ter várias moedas)
  starting_shop INTEGER NOT NULL DEFAULT 0,           -- loja inicial habilitada
  starting_points INTEGER NOT NULL DEFAULT 0,         -- orçamento de pontos da primeira ficha; 0 = não configurado (mesa sem sistema de pontos)
  PRIMARY KEY (table_id, lang)
);

-- =========================
-- MOEDAS DA MESA (várias por mesa)
-- Cada linha declara que um item é uma moeda e quanto o mestre dá no
-- início. O saldo em carteira é a soma de character_equipment.quantity
-- dos itens declarados aqui.
-- =========================
CREATE TABLE IF NOT EXISTS game_table_currencies (
  table_id TEXT NOT NULL,
  item_id TEXT NOT NULL,                             -- item que representa a moeda
  starting_amount INTEGER NOT NULL DEFAULT 0,        -- quanto o mestre dá no início
  PRIMARY KEY (table_id, item_id)
);

CREATE TABLE IF NOT EXISTS game_table_players (
  id TEXT PRIMARY KEY,
  table_id TEXT,
  user_id TEXT,
  is_muted INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- ACESSO À MESA (narrador convidado)
-- Uma linha por (mesa, usuário) dizendo quais recursos da mesa aquele
-- narrador convidado enxerga e em quais pode escrever. A mesa continua
-- pertencendo ao narrador titular: esta tabela nunca altera game_tables.
-- permissions = JSON { "characters": "read", "scenes": "write", ... }
-- Sem FK em table_id porque game_tables tem chave primária composta
-- (id, lang) — mesmo motivo de game_table_players.
-- =========================
CREATE TABLE IF NOT EXISTS game_table_access (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  permissions TEXT NOT NULL DEFAULT '{}',
  granted_by TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (table_id, user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- SOLICITAÇÕES DE ENTRADA NA MESA (pré-aprovação)
-- Uma linha por (mesa, usuário): quem pediu para entrar e em que papel.
-- Nada entra na mesa sem o dono aprovar. Aprovar um jogador insere em
-- game_table_players; aprovar um co-narrador cria a concessão em
-- game_table_access. A mesa continua pertencendo ao narrador titular.
-- role   = 'player' | 'co_narrator'
-- status = 'pending' | 'approved' | 'rejected'
-- Sem FK em table_id pelo mesmo motivo de game_table_players/access
-- (game_tables tem chave primária composta (id, lang)).
-- =========================
CREATE TABLE IF NOT EXISTS game_table_join_requests (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'player',
  status TEXT NOT NULL DEFAULT 'pending',
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME,
  resolved_by TEXT,
  UNIQUE (table_id, user_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- CHARACTERS
-- =========================
CREATE TABLE IF NOT EXISTS game_table_characters (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  table_id TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  edit_enabled INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS game_table_character_images (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  url TEXT,
  role TEXT DEFAULT 'portrait',
  sort INTEGER DEFAULT 0,
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

-- =========================
-- CHARACTER SHEET (GURPS)
-- =========================
CREATE TABLE IF NOT EXISTS game_table_character_sheets (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  character_id TEXT,
  name TEXT,
  bio TEXT,
  backstory TEXT,
  points INTEGER,
  hp INTEGER,
  st INTEGER,
  dx INTEGER,
  iq INTEGER,
  ht INTEGER,
  fatigue INTEGER,
  encumbrance TEXT,
  PRIMARY KEY (id, lang),
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

-- =========================
-- SCENES
-- =========================
CREATE TABLE IF NOT EXISTS scenes (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  title TEXT,
  chapter INTEGER,
  moment INTEGER,
  image_url TEXT,
  PRIMARY KEY (id, lang)
);

-- =========================
-- NARRATIONS
-- =========================
CREATE TABLE IF NOT EXISTS narrations (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  scene_id TEXT,
  title TEXT,
  narration TEXT,
  moment INTEGER,
  PRIMARY KEY (id, lang)
);

-- =========================
-- LOCATIONS
-- -------------------------
-- Cada location é uma DIVISÃO DE TERRENO num funil:
--   world > continent > nation > region > city > district > site > battlemap
-- parent_id fecha a árvore (level/path são derivados e mantidos pela app).
-- Geometria = grade hexagonal (GURPS):
--   hex_size_m    lado de um hex nesta grade (escala; metro = mapa tático)
--   center_q/r    posição (coords axiais q,r) do CENTRO deste local
--                 dentro da grade do pai
--   width/height  pegada em hexes (redondos: díametro ao longo do eixo)
--   orientation   'flat' (GURPS) | 'pointy' | 'square' (sem hex)
--   is_battlemap  1 quando hex_size_m <= 2 (escala tática -> mapa de batalha)
-- =========================
CREATE TABLE IF NOT EXISTS table_locations (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  parent_id TEXT,
  kind TEXT,
  level INTEGER,
  path TEXT,
  name TEXT,
  region TEXT,
  address TEXT,
  sub_region TEXT,
  is_indoor INTEGER,
  other TEXT,
  country TEXT,
  area TEXT,
  dimensions TEXT,
  description TEXT,
  hex_size_m REAL,
  width_hexes INTEGER,
  height_hexes INTEGER,
  center_q INTEGER,
  center_r INTEGER,
  orientation TEXT DEFAULT 'flat',
  rotation_deg INTEGER DEFAULT 0,
  is_battlemap INTEGER DEFAULT 0,
  shop_name TEXT,
  tiles TEXT DEFAULT '[]',
  drawing TEXT DEFAULT '[]',
  bg_image_url TEXT,
  floor INTEGER,
  floor_name TEXT,
  PRIMARY KEY (id, lang)
);

-- =========================
-- LOCATION CONNECTIONS — ligações entre plantas (portas/escadas/...)
-- -------------------------
-- Conecta dois locais de uma MESMA mesa através de um hex em cada
-- planta (from_q/r na origem, to_q/r no destino). kind discrimina
-- o tipo (door | stairs | portal | bridge | elevator | trapdoor |
-- secret); floor_from/floor_to registram o andar de cada ponta
-- (escala próxima da real usa andares: 0 = térreo, -1 = subsolo...).
-- bidirectional indica se a passagem vale nos dois sentidos e
-- sort ordena os marcadores dentro de cada planta. direction guarda o
-- ponto cardeal de saída (N|NE|L|SE|S|SO|O|NO) usado pelo organograma
-- que liga as plantas entre si. Rows são por
-- idioma (PRIMARY KEY id, lang) para label/description localizadas.
-- =========================
CREATE TABLE IF NOT EXISTS location_connections (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  from_location_id TEXT,
  to_location_id TEXT,
  kind TEXT DEFAULT 'door',
  label TEXT,
  from_q INTEGER,
  from_r INTEGER,
  to_q INTEGER,
  to_r INTEGER,
  floor_from INTEGER,
  floor_to INTEGER,
  bidirectional INTEGER DEFAULT 1,
  sort INTEGER DEFAULT 0,
  direction TEXT,
  description TEXT,
  PRIMARY KEY (id, lang)
);

-- =========================
-- LOCATION SHOP ITEMS — estoque das lojas
-- -------------------------
-- Uma LOJA é um local (table_locations) com shop_name preenchido: a
-- prateleira da loja é o item do catálogo (game_table_items) ligado ao
-- local pelo location_id do próprio item.
--
-- Esta tabela guarda o que a LOJA tem de DIFFERENTE do item: o preço
-- praticado nela (NULL = vale o cost do item) e a quantidade em estoque
-- (-1 = ilimitado, 0 = esgotado). location_id é a loja, item_id é o
-- item do catálogo. Rows são por idioma (PRIMARY KEY id, lang).
-- =========================
CREATE TABLE IF NOT EXISTS location_shop_items (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  location_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  price INTEGER,
  stock INTEGER DEFAULT -1,
  notes TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id, lang)
);

CREATE INDEX IF NOT EXISTS idx_location_shop_items_location ON location_shop_items (location_id);
CREATE INDEX IF NOT EXISTS idx_location_shop_items_item ON location_shop_items (item_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_location_shop_items_unique
  ON location_shop_items (location_id, item_id, lang);

CREATE TABLE IF NOT EXISTS narration_actions (
  id TEXT PRIMARY KEY,
  narrations_id TEXT,
  queue NUMERIC,
  moment INTEGER,          -- etapa de tempo da action (espelha narrations.moment)
  result TEXT,
  dice_roll TEXT,
  modificator TEXT,
  target TEXT,
  multitarget BOOLEAN,
  description TEXT,
  character_id TEXT,
  location_id TEXT,      -- planta baixa onde a action acontece
  q INTEGER,             -- hex de destino da action (malha hexagonal local)
  r INTEGER,
  facing INTEGER DEFAULT 0, -- direção (0-5) após o movimento
  datetime DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
  FOREIGN KEY (target) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS narration_characters (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  narrations_id TEXT,
  conscious INTEGER NOT NULL DEFAULT 1,
  q INTEGER,              -- posição inicial do token na planta baixa
  r INTEGER,
  facing INTEGER DEFAULT 0,
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS narration_locations (
  id TEXT PRIMARY KEY,
  location_id TEXT,
  narrations_id TEXT
);

-- =====================================================================
-- ITEMS (GURPS)
-- ---------------------------------------------------------------------
-- Separação conceitual (REGRA GERAL):
--   DATABASE  = dados e parâmetros das regras
--   ENGINE    = cálculos (dano final, skill, vantagens, combate)
-- Não armazenamos o DANO FINAL de uma arma. A arma guarda parâmetros e
-- a engine combina com ST/THR/SW do personagem para calcular o resultado.
-- =====================================================================

-- ---------------------------------------------------------------
-- game_table_items  : dados GENÉRICOS do objeto
-- 'kind' discrimina a especialização (weapon/armor/shield/equipment)
-- 'holder_id'/'owner_id' NÃO ficam aqui: estado do personagem vive em
-- character_equipment.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_table_items (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  location_id TEXT,     -- vínculo opcional a um local (ex: estoque de uma loja)
  name TEXT,
  kind TEXT,            -- 'weapon' | 'armor' | 'shield' | 'equipment'
  category TEXT,        -- domínio: melee | ranged | clothing | ...
  weight_lb REAL,       -- peso em libras (GURPS)
  cost INTEGER,         -- custo na moeda de currency_item_id (GURPS)
  currency_item_id TEXT,-- item-moeda em que o custo está cotado (1 moeda por item)
  skill_id TEXT,       -- skill usada pelo item, resolvida de weapons.skill
  dimensions TEXT,
  description TEXT,
  quality TEXT,         -- domínio: cheap | standard | fine | very_fine
  condition TEXT,       -- domínio: new | worn | damaged | broken
  module_id TEXT,       -- pacote/fonte de conteúdo (ex: fantasy | mid-tech)
  subcategory TEXT,     -- subdivisão da categoria de item (ex: melee | ranged | body)
  tech_level TEXT,      -- Nível Tecnológico GURPS da peça (ex: 'TL3', 'TL8')
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS item_images (
  id TEXT PRIMARY KEY,
  item_id TEXT,
  url TEXT,
  role TEXT DEFAULT 'icon',
  sort INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS table_images (
  id TEXT PRIMARY KEY,
  table_id TEXT,
  url TEXT
);

CREATE TABLE IF NOT EXISTS location_images (
  id TEXT PRIMARY KEY,
  location_id TEXT,
  url TEXT,
  role TEXT DEFAULT 'gallery',
  sort INTEGER DEFAULT 0
);

-- ---------------------------------------------------------------
-- game_table_weapons : características específicas da ARMA
-- 1 item -> 1 weapon (opcional; só quando kind='weapon' ou 'shield')
-- min_st / rated_st / reach / parry / block  são parâmetros lidos
-- pela engine. reach é textual pois pode haver múltiplos (ex: 'C,1').
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_table_weapons (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  item_id TEXT,
  skill TEXT,           -- skill recomendada (ex: 'Shortsword') - domínio/texto
  skill_id TEXT,        -- game_table_skills.id resolvido a partir da coluna skill
  min_st INTEGER,       -- requisito mínimo de ST do personagem
  rated_st INTEGER,     -- Rated ST (essencial para arcos)
  handedness INTEGER,   -- 1 ou 2 (mãos padrão)
  reach TEXT,           -- ex: 'C', '1', 'C,1'
  parry TEXT,           -- ex: '0', '0U', 'No'
  block TEXT,           -- para escudos: DB genérico textual (ex: '3')
  fit TEXT DEFAULT 'normal', -- domínio: cheap | normal | tailored | loose
  PRIMARY KEY (id, lang)
);

-- ---------------------------------------------------------------
-- weapon_attacks : formas de ataque de UMA arma (1 arma -> N ataques)
-- NÃO guarda dano final. Guarda a FONTE de dano + modificador + tipo.
--   damage_source: 'st_swing' | 'st_thrust' | 'rated_st_swing' |
--                  'rated_st_thrust' | 'fixed'
--   - fontes baseadas em ST são resolvidas pela engine usando a
--     tabela gurps_damage_table (ST -> THR/SW).
--   - 'fixed' guarda o dano em dados (ex: pistola '2d+1').
--   damage_modifier: inteiro aplicado sobre a base (ex: SW+1 -> 1).
--   damage_dice    : usado só quando source='fixed' (ex: '2d').
--   damage_type    : tipo de dano GURPS (cut/imp/cr/pi/pi-/pi+/burn/tox...)
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weapon_attacks (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  weapon_id TEXT,
  name TEXT,                -- ex: 'Swing', 'Thrust', 'Shot'
  usage TEXT,               -- ex: 'one-hand' | 'two-hand' | null
  damage_source TEXT,       -- ver enum acima
  damage_modifier INTEGER,  -- ex: SW+1 -> +1
  damage_dice TEXT,         -- ex: '2d' (só p/ source='fixed')
  damage_type TEXT,         -- ex: 'cut', 'imp', 'cr', 'pi', 'pi-', 'pi+'
  armor_penetration INTEGER,-- ex: 0 (para piercing avançado), reservado
  accuracy INTEGER,         -- acurácia (armas de projétil)
  range TEXT,               -- ex: '1', '150/1600', 'Melee'
  recoil INTEGER,           -- recuo (armas de fogo)
  shots INTEGER,            -- capacidade / calibre específico p/ futura munição
  PRIMARY KEY (id, lang)
);

-- ---------------------------------------------------------------
-- game_table_armors : características específicas da ARMADURA / escudo
-- 1 item -> 1 armor (opcional; quando kind='armor' ou 'shield')
-- dr/flex/locations/fit são lidos pela engine de combate (não há
-- regra de dano final aqui). locations textual p/ liberdade de domínio.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS game_table_armors (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  item_id TEXT,
  dr INTEGER,           -- Damage Resistance
  flex INTEGER,         -- 1 = flexível (permite camadas)
  locations TEXT,       -- ex: 'torso', 'arms,legs', 'full_body'
  fit TEXT,             -- domínio: cheap | normal | tailored | loose
  PRIMARY KEY (id, lang)
);

-- ---------------------------------------------------------------
-- gurps_damage_table : relação ST -> THR/SW (tabela de regras do GURPS)
-- Dados de referência usados pela engine para derivar dano básico.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gurps_damage_table (
  id TEXT PRIMARY KEY,
  st INTEGER,
  thrust TEXT,
  swing TEXT
);

-- ---------------------------------------------------------------
-- character_equipment : ESTADO / EQUIPAMENTO do personagem
-- Separa o que "existe no mundo" (game_table_items) de quem possui e
-- como está equipado. 'status' = inventário | equipado | empunhado.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS character_equipment (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  item_id TEXT,
  quantity INTEGER DEFAULT 1,
  status TEXT,          -- domínio: in_inventory | equipped | wielded
  location TEXT,        -- ex: 'right_hand', 'torso', 'back', 'none'
  rendered_st INTEGER,  -- ST efetivo (buff/condição), reservado p/ engine
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

-- ---------------------------------------------------------------
-- TRADE : OFERTA DE TROCA ENTRE DOIS JOGADORES
-- Uma oferta tem DUAS mãos: 'from' (o que o proponente dá) e 'to'
-- (o que o destinatário dá). Mão 'to' vazia = transferência pura;
-- moeda do lado oposto = venda/compra; as duas mãos = troca.
-- A oferta só EXECUTA quando os dois lados confirmam.
-- Sem FK em table_id porque game_tables tem chave primária composta
-- (id, lang) — mesmo motivo de game_table_players.
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trade_offers (
  id TEXT PRIMARY KEY,
  table_id TEXT NOT NULL,
  proposer_character_id TEXT NOT NULL,
  recipient_character_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',   -- pending | completed | rejected | cancelled
  proposer_confirmed INTEGER NOT NULL DEFAULT 0,
  recipient_confirmed INTEGER NOT NULL DEFAULT 0,
  message TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  resolved_at TEXT,
  FOREIGN KEY (proposer_character_id) REFERENCES game_table_characters(id),
  FOREIGN KEY (recipient_character_id) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS trade_offer_items (
  id TEXT PRIMARY KEY,
  offer_id TEXT NOT NULL,
  side TEXT NOT NULL,                       -- from | to
  item_id TEXT NOT NULL,
  item_name TEXT,                           -- retrato do nome no momento da oferta
  quantity INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (offer_id) REFERENCES trade_offers(id)
);

CREATE INDEX IF NOT EXISTS idx_trade_offers_table ON trade_offers (table_id, status);
CREATE INDEX IF NOT EXISTS idx_trade_offer_items_offer ON trade_offer_items (offer_id);

-- =========================
-- NPCs
-- =========================
CREATE TABLE IF NOT EXISTS game_table_npcs (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  status TEXT,
  location_id TEXT,     -- vínculo opcional a um local (ex: equipe de uma loja)
  module_id TEXT,       -- pacote/fonte de conteúdo
  category TEXT,        -- papel do NPC (combatente | atirador | arcano | assassino)
  subcategory TEXT,     -- aliança (ally | neutral | enemy | boss)
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS narration_npcs (
  id TEXT PRIMARY KEY,
  narration_id TEXT NOT NULL,
  npc_id TEXT NOT NULL,
  q INTEGER,              -- posição inicial do token na planta baixa
  r INTEGER,
  facing INTEGER DEFAULT 0,
  FOREIGN KEY (npc_id) REFERENCES game_table_npcs(id)
);

-- =========================
-- SKILLS
-- =========================
CREATE TABLE IF NOT EXISTS game_table_skills (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  name TEXT,
  category TEXT,
  subcategory TEXT,
  type TEXT,
  predefinition_type TEXT,
  predefinition_difficulty TEXT,
  description TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS game_table_skill_predefinede (
  id TEXT PRIMARY KEY,
  origin_skill_id TEXT,
  depends_on_skill_id TEXT,
  depends_on_skill_value TEXT,
  depends_on_skill_for_others_attributes TEXT
);

CREATE TABLE IF NOT EXISTS game_table_skill_dependencies (
  id TEXT PRIMARY KEY,
  origin_skill_id TEXT,
  depends_on_skill_id TEXT,
  depends_on_skill_value TEXT,
  depends_type TEXT
);

-- =========================
-- CHARACTER SKILLS
-- =========================
CREATE TABLE IF NOT EXISTS game_table_character_skills (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  character_id TEXT,
  skill_id TEXT,
  cost_points INTEGER,
  effect TEXT,
  PRIMARY KEY (id, lang),
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

-- =========================
-- ADVANTAGES
-- =========================
CREATE TABLE IF NOT EXISTS game_table_character_advantages (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  advantage_id TEXT,
  name TEXT,
  character_id TEXT,
  cost_points INTEGER,
  effect TEXT,
  PRIMARY KEY (id, lang),
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS game_table_character_disadvantages (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  disadvantage_id TEXT,
  name TEXT,
  character_id TEXT,
  cost_points INTEGER,
  effect TEXT,
  PRIMARY KEY (id, lang),
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

-- =========================
-- DISADVANTAGES / PECULIARITIES
-- =========================
CREATE TABLE IF NOT EXISTS game_table_characters_quirks (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  character_id TEXT,
  name TEXT,
  cost_points INTEGER,
  effect TEXT,
  description TEXT,
  PRIMARY KEY (id, lang),
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS game_table_advantages (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  name TEXT,
  category TEXT,
  subcategory TEXT,
  cost_points INTEGER,
  description TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS game_table_disadvantages (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  table_id TEXT,
  name TEXT,
  category TEXT,
  subcategory TEXT,
  cost_points INTEGER,
  effect TEXT,
  description TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS modifiers (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  item_id TEXT,
  skill_id TEXT,
  advantage_id TEXT,
  disadvantage_id TEXT,
  location_id TEXT,
  action_id TEXT,
  narration_id TEXT,
  scene_id TEXT,
  name TEXT,
  cost_points INTEGER,
  effect TEXT,
  description TEXT,
  hp INTEGER,
  st INTEGER,
  dx INTEGER,
  iq INTEGER,
  ht INTEGER,
  fatigue INTEGER,
  encumbrance TEXT,
  mod_hp INTEGER,
  mod_st INTEGER,
  mod_dx INTEGER,
  mod_iq INTEGER,
  mod_ht INTEGER,
  mod_fatigue INTEGER,
  mod_encumbrance TEXT,
  skill_value TEXT,
  advantage_value TEXT,
  disadvantage_value TEXT,
  armor_value TEXT,
  damage_value TEXT,
  item_quantity INTEGER,
  item_dimension TEXT,
  item_weight INTEGER,
  item_range TEXT,
  item_status TEXT,
  apply_on_roll INTEGER NOT NULL DEFAULT 0,
  kind TEXT NOT NULL DEFAULT 'effect',
  enabled INTEGER NOT NULL DEFAULT 1,
  source_modifier_id TEXT,
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id),
  FOREIGN KEY (action_id) REFERENCES narration_actions(id)
);

CREATE TABLE IF NOT EXISTS visibility (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  other_character_id TEXT,
  skill_id TEXT,
  advantage_id TEXT,
  disadvantage_id TEXT,
  attribute TEXT,
  additionals_attributes TEXT,
  item_id TEXT,
  location_id TEXT,
  connection_id TEXT,
  value TEXT,
  status TEXT,
  scene_id TEXT,
  narration_id TEXT,
  moment INTEGER,
  previous_status TEXT,
  FOREIGN KEY (character_id) REFERENCES game_table_characters(id),
  FOREIGN KEY (other_character_id) REFERENCES game_table_characters(id)
);

CREATE TABLE IF NOT EXISTS queue (
  id TEXT PRIMARY KEY,
  character_id TEXT,
  action_id TEXT,
  queue TEXT,
  status TEXT,
  test_dice TEXT DEFAULT '6',
  test_count INTEGER DEFAULT 3,
  test_mod INTEGER DEFAULT 0,
  test_attr TEXT DEFAULT 'dx',
  test_kind TEXT DEFAULT 'attr',
  test_skill TEXT
);

CREATE TABLE IF NOT EXISTS log (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =========================
-- CONTENT MODULES (pacotes de campanha)
-- -------------------------
-- Módulos são PACOTES de conteúdo GURPS (ex: fantasy, mid-tech, cyberpunk).
-- Linhas de catálogo nas tabelas de skill/item/advantage/disadvantage/npc
-- apontam para um content_module via module_id (fonte/posse).
-- =========================
CREATE TABLE IF NOT EXISTS content_modules (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE,
  name TEXT,
  tech_level TEXT,
  description TEXT,
  accent TEXT,
  sort INTEGER DEFAULT 0
);

-- =========================
-- CONTENT CATEGORIES (taxonomia GURPS)
-- -------------------------
-- Árvore por domínio: category (nível raiz) e subcategory (filho).
-- parent_id aponta para a categoria raiz; NULL = categoria raiz.
-- =========================
CREATE TABLE IF NOT EXISTS content_categories (
  id TEXT PRIMARY KEY,
  domain TEXT,          -- skill | item | advantage | disadvantage | npc
  parent_id TEXT,
  name TEXT,            -- slug da categoria (raiz) ou subcategoria
  display_name TEXT,
  sort INTEGER DEFAULT 0,
  FOREIGN KEY (parent_id) REFERENCES content_categories(id)
);

-- =========================
-- CONTENT CATALOG GLOBAL (pacotes independentes de mesa)
-- -------------------------
-- O catálogo SÓ é povoado pelo seed (en/pt) e é a FONTE que o wizard
-- consulta (GET /content-modules) e copia para mesas novas via
-- installContent. Não há table_id: é conteúdo de referência global,
-- NÃO pertence a nenhuma mesa de jogo (ao contrário do que acontecia
-- lendo game_table_* com module_id, que enredava o catálogo na mesa
-- seedada).
-- =========================
CREATE TABLE IF NOT EXISTS content_skills (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  name TEXT,
  category TEXT,
  subcategory TEXT,
  type TEXT,
  predefinition_type TEXT,
  predefinition_difficulty TEXT,
  description TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_items (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  name TEXT,
  kind TEXT,            -- 'weapon' | 'armor' | 'shield' | 'equipment'
  category TEXT,
  weight_lb REAL,
  cost INTEGER,
  dimensions TEXT,
  description TEXT,
  quality TEXT,
  condition TEXT,
  module_id TEXT,
  subcategory TEXT,
  tech_level TEXT,      -- Nível Tecnológico GURPS da peça (ex: 'TL3', 'TL8')
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_weapons (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  item_id TEXT,
  skill TEXT,
  min_st INTEGER,
  rated_st INTEGER,
  handedness INTEGER,
  reach TEXT,
  parry TEXT,
  block TEXT,
  fit TEXT DEFAULT 'normal',
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_weapon_attacks (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  weapon_id TEXT,
  name TEXT,
  usage TEXT,
  damage_source TEXT,
  damage_modifier INTEGER,
  damage_dice TEXT,
  damage_type TEXT,
  armor_penetration INTEGER,
  accuracy INTEGER,
  range TEXT,
  recoil INTEGER,
  shots INTEGER,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_armors (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  item_id TEXT,
  dr INTEGER,
  flex INTEGER,
  locations TEXT,
  fit TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_advantages (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  name TEXT,
  category TEXT,
  subcategory TEXT,
  cost_points INTEGER,
  description TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_disadvantages (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  name TEXT,
  category TEXT,
  subcategory TEXT,
  cost_points INTEGER,
  effect TEXT,
  description TEXT,
  module_id TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_npcs (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  name TEXT,
  bio TEXT,
  backstory TEXT,
  points INTEGER,
  hp INTEGER,
  st INTEGER,
  dx INTEGER,
  iq INTEGER,
  ht INTEGER,
  fatigue INTEGER,
  encumbrance TEXT,
  status TEXT,
  module_id TEXT,
  category TEXT,
  subcategory TEXT,
  PRIMARY KEY (id, lang)
);

CREATE TABLE IF NOT EXISTS content_locations (
  id TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'pt',
  parent_id TEXT,
  kind TEXT,
  level INTEGER,
  path TEXT,
  name TEXT,
  region TEXT,
  address TEXT,
  sub_region TEXT,
  is_indoor INTEGER,
  other TEXT,
  country TEXT,
  area TEXT,
  dimensions TEXT,
  description TEXT,
  hex_size_m REAL,
  width_hexes INTEGER,
  height_hexes INTEGER,
  center_q INTEGER,
  center_r INTEGER,
  orientation TEXT DEFAULT 'flat',
  rotation_deg INTEGER DEFAULT 0,
  is_battlemap INTEGER DEFAULT 0,
  shop_name TEXT,
  tiles TEXT DEFAULT '[]',
  drawing TEXT DEFAULT '[]',
  PRIMARY KEY (id, lang)
);

`)

// Backfills para bases já existentes (CREATE TABLE IF NOT EXISTS não altera esquema)
const weaponCols = (db.prepare("PRAGMA table_info(game_table_weapons)").all() as any[]).map((c) => c.name)
if (!weaponCols.includes('fit')) {
  db.exec("ALTER TABLE game_table_weapons ADD COLUMN fit TEXT DEFAULT 'normal'")
}

// visibility.other_character_id para bases criadas antes da coluna
const visibilityCols = (db.prepare("PRAGMA table_info(visibility)").all() as any[]).map((c) => c.name)
if (visibilityCols.length && !visibilityCols.includes('other_character_id')) {
  db.exec("ALTER TABLE visibility ADD COLUMN other_character_id TEXT")
}
// visibility.location_id + rastros de descoberta (cena/narração/momento) para bases antigas
if (visibilityCols.length && !visibilityCols.includes('location_id')) {
  db.exec("ALTER TABLE visibility ADD COLUMN location_id TEXT")
}
if (visibilityCols.length && !visibilityCols.includes('scene_id')) {
  db.exec("ALTER TABLE visibility ADD COLUMN scene_id TEXT")
}
if (visibilityCols.length && !visibilityCols.includes('narration_id')) {
  db.exec("ALTER TABLE visibility ADD COLUMN narration_id TEXT")
}
if (visibilityCols.length && !visibilityCols.includes('moment')) {
  db.exec("ALTER TABLE visibility ADD COLUMN moment INTEGER")
}
if (visibilityCols.length && !visibilityCols.includes('previous_status')) {
  db.exec("ALTER TABLE visibility ADD COLUMN previous_status TEXT")
}
// visibility.connection_id — regras de conhecimento sobre CONEXÕES (bases antigas)
if (visibilityCols.length && !visibilityCols.includes('connection_id')) {
  db.exec("ALTER TABLE visibility ADD COLUMN connection_id TEXT")
}

// location_connections.direction — ponto cardeal de saída do organograma
const locConnCols = (db.prepare("PRAGMA table_info(location_connections)").all() as any[]).map((c) => c.name)
if (locConnCols.length && !locConnCols.includes('direction')) {
  db.exec("ALTER TABLE location_connections ADD COLUMN direction TEXT")
}

// queue.test_* para o teste controlado pelo narrador (bases criadas antes das colunas)
const queueCols = (db.prepare("PRAGMA table_info(queue)").all() as any[]).map((c) => c.name)
if (queueCols.length && !queueCols.includes('test_dice')) {
  db.exec("ALTER TABLE queue ADD COLUMN test_dice TEXT DEFAULT '6'")
  db.exec("ALTER TABLE queue ADD COLUMN test_count INTEGER DEFAULT 3")
  db.exec("ALTER TABLE queue ADD COLUMN test_mod INTEGER DEFAULT 0")
  db.exec("ALTER TABLE queue ADD COLUMN test_attr TEXT DEFAULT 'dx'")
}
// queue.test_kind/test_skill — teste baseado em skill (jogada montada por skill)
if (queueCols.length && !queueCols.includes('test_kind')) {
  db.exec("ALTER TABLE queue ADD COLUMN test_kind TEXT DEFAULT 'attr'")
}
if (queueCols.length && !queueCols.includes('test_skill')) {
  db.exec("ALTER TABLE queue ADD COLUMN test_skill TEXT")
}

// modifiers.apply_on_roll — efeito de skill que só é aplicado quando o teste passa
const modifierCols = (db.prepare("PRAGMA table_info(modifiers)").all() as any[]).map((c) => c.name)
if (modifierCols.length && !modifierCols.includes('apply_on_roll')) {
  db.exec("ALTER TABLE modifiers ADD COLUMN apply_on_roll INTEGER NOT NULL DEFAULT 0")
}
// modifiers.location_id — condição/evento vinculado a um local (bases antigas)
if (modifierCols.length && !modifierCols.includes('location_id')) {
  db.exec("ALTER TABLE modifiers ADD COLUMN location_id TEXT")
}
// modifiers.kind / enabled / source_modifier_id — a modificação como braço do jogo
//
// kind: 'effect' (uma vez, num character) ou 'modelo' (vinculado a um traço do
// catálogo: quem tiver a vantagem/desvantagem ou o item recebe). O modelo nunca
// entra sozinho na ficha: ele é resolvido na leitura contra o que o character
// possui, então não existe linha órfã para limpar quando o traço sai.
//
// source_modifier_id: numa linha 'effect', aponta para o modelo de origem.
// É a instância por character — desligar (enabled=0) ou sobrescrever os valores
// do modelo sem mexer no catálogo. Sem origem, a linha é um efeito solto.
if (modifierCols.length) {
  const modifierKindAdds: { col: string; ddl: string }[] = [
    { col: 'kind', ddl: "TEXT NOT NULL DEFAULT 'effect'" },
    { col: 'enabled', ddl: 'INTEGER NOT NULL DEFAULT 1' },
    { col: 'source_modifier_id', ddl: 'TEXT' },
  ]
  for (const { col, ddl } of modifierKindAdds) {
    if (!modifierCols.includes(col)) {
      db.exec(`ALTER TABLE modifiers ADD COLUMN ${col} ${ddl}`)
    }
  }
}

// ---- backfill: linhas de catálogo que já eram regras, não efeitos ----
// O ColumnKind nasceu com default 'effect', então os modifiers criados antes
// dele (via EntityModifiers, sempre sem character_id) ficaram marcados como
// efeito e o motor passivo não os via. Um modifier sem character_id e com
// algum traço/item vinculado é uma regra: promote.
const toPromote = (db.prepare(`
  SELECT count(*) AS n FROM modifiers
  WHERE kind = 'effect'
    AND character_id IS NULL
    AND (advantage_id IS NOT NULL OR disadvantage_id IS NOT NULL
         OR item_id IS NOT NULL OR skill_id IS NOT NULL)
`).get() as { n: number }).n
if (toPromote > 0) {
  db.prepare(`
    UPDATE modifiers SET kind = 'modelo'
    WHERE kind = 'effect'
      AND character_id IS NULL
      AND (advantage_id IS NOT NULL OR disadvantage_id IS NOT NULL
           OR item_id IS NOT NULL OR skill_id IS NOT NULL)
  `).run()
  console.log(`  ✓ modifiers: ${toPromote} linha(s) de catálogo promovida(s) a 'modelo'`)
}

// ---- índices das colunas de vínculo ----
// Só o PRIMARY KEY tinha índice (o autoindex do id): as 9 colunas de link do
// modifiers e as listas de traços do character eram varridas em full scan.
// SQLite não cria índice automático para coluna de FK, então declaramos aqui.
const linkIndexes: [string, string, string][] = [
  ['idx_modifiers_character', 'modifiers', 'character_id'],
  ['idx_modifiers_source', 'modifiers', 'source_modifier_id'],
  ['idx_modifiers_kind', 'modifiers', 'kind'],
  ['idx_modifiers_advantage', 'modifiers', 'advantage_id'],
  ['idx_modifiers_disadvantage', 'modifiers', 'disadvantage_id'],
  ['idx_modifiers_item', 'modifiers', 'item_id'],
  ['idx_modifiers_skill', 'modifiers', 'skill_id'],
  ['idx_modifiers_location', 'modifiers', 'location_id'],
  ['idx_modifiers_action', 'modifiers', 'action_id'],
  ['idx_modifiers_narration', 'modifiers', 'narration_id'],
  ['idx_modifiers_scene', 'modifiers', 'scene_id'],
  ['idx_char_adv_character', 'game_table_character_advantages', 'character_id'],
  ['idx_char_adv_advantage', 'game_table_character_advantages', 'advantage_id'],
  ['idx_char_dis_character', 'game_table_character_disadvantages', 'character_id'],
  ['idx_char_dis_disadvantage', 'game_table_character_disadvantages', 'disadvantage_id'],
  ['idx_equipment_character', 'character_equipment', 'character_id'],
  ['idx_equipment_item', 'character_equipment', 'item_id'],
]
for (const [name, table, column] of linkIndexes) {
  const tableCols = (db.prepare(`PRAGMA table_info(${table})`).all() as any[]).map((c) => c.name)
  if (!tableCols.includes(column)) continue
  db.exec(`CREATE INDEX IF NOT EXISTS ${name} ON ${table}(${column})`)
}

// narration_actions.moment — cada action segue a etapa de tempo da sua narration
const nactCols = (db.prepare("PRAGMA table_info(narration_actions)").all() as any[]).map((c) => c.name)
if (nactCols.length && !nactCols.includes('moment')) {
  db.exec("ALTER TABLE narration_actions ADD COLUMN moment INTEGER")
}
db.prepare(`
  UPDATE narration_actions
  SET moment = (SELECT n.moment FROM narrations n WHERE n.id = narration_actions.narrations_id)
  WHERE moment IS NULL
`).run()

// table_locations — hierarquia de território + grade hexagonal (bases pre-existentes)
const locationCols = (db.prepare("PRAGMA table_info(table_locations)").all() as any[]).map((c) => c.name)
if (locationCols.length) {
  const locationAdds: { col: string; ddl: string }[] = [
    { col: 'parent_id', ddl: 'TEXT' },
    { col: 'kind', ddl: "TEXT DEFAULT 'site'" },
    { col: 'level', ddl: 'INTEGER DEFAULT 0' },
    { col: 'path', ddl: "TEXT DEFAULT '/'" },
    { col: 'hex_size_m', ddl: 'REAL' },
    { col: 'width_hexes', ddl: 'INTEGER' },
    { col: 'height_hexes', ddl: 'INTEGER' },
    { col: 'center_q', ddl: 'INTEGER DEFAULT 0' },
    { col: 'center_r', ddl: 'INTEGER DEFAULT 0' },
    { col: 'orientation', ddl: "TEXT DEFAULT 'flat'" },
    { col: 'rotation_deg', ddl: 'INTEGER DEFAULT 0' },
    { col: 'is_battlemap', ddl: 'INTEGER DEFAULT 0' },
    { col: 'shop_name', ddl: 'TEXT' },
    { col: 'tiles', ddl: "TEXT DEFAULT '[]'" },
    { col: 'drawing', ddl: "TEXT DEFAULT '[]'" },
    { col: 'bg_image_url', ddl: 'TEXT' },
    { col: 'floor', ddl: 'INTEGER' },
    { col: 'floor_name', ddl: 'TEXT' },
  ]
  for (const { col, ddl } of locationAdds) {
    if (!locationCols.includes(col)) {
      db.exec(`ALTER TABLE table_locations ADD COLUMN ${col} ${ddl}`)
    }
  }
}

const sceneCols = (db.prepare("PRAGMA table_info(scenes)").all() as any[]).map((c) => c.name)
if (sceneCols.length && !sceneCols.includes('image_url')) {
  db.exec('ALTER TABLE scenes ADD COLUMN image_url TEXT')
}

// game_table_items.location_id — vínculo item -> local (estoque de lojas, bases antigas)
const itemCols = (db.prepare("PRAGMA table_info(game_table_items)").all() as any[]).map((c) => c.name)
if (itemCols.length && !itemCols.includes('location_id')) {
  db.exec("ALTER TABLE game_table_items ADD COLUMN location_id TEXT")
}

// tabelas de imagem — ganham `role` (retrato/corpo, ícone) e `sort` (bases antigas)
const imageTableAdds: [string, { col: string; ddl: string }[]][] = [
  ['game_table_character_images', [
    { col: 'role', ddl: "TEXT DEFAULT 'portrait'" },
    { col: 'sort', ddl: 'INTEGER DEFAULT 0' },
  ]],
  ['item_images', [
    { col: 'role', ddl: "TEXT DEFAULT 'icon'" },
    { col: 'sort', ddl: 'INTEGER DEFAULT 0' },
  ]],
]
for (const [table, defs] of imageTableAdds) {
  const cols = (db.prepare(`PRAGMA table_info(${table})`).all() as any[]).map((c) => c.name)
  if (!cols.length) continue
  for (const { col, ddl } of defs) {
    if (!cols.includes(col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`)
  }
}

// game_table_items.currency_item_id — em qual moeda o `cost` deste item está
if (itemCols.length && !itemCols.includes('currency_item_id')) {
  db.exec("ALTER TABLE game_table_items ADD COLUMN currency_item_id TEXT")
}

// game_table_items.tech_level — Nível Tecnológico GURPS da peça (ex: 'TL3').
// Fica no item (não só no módulo) para o front exibir a época de cada peça.
if (itemCols.length && !itemCols.includes('tech_level')) {
  db.exec("ALTER TABLE game_table_items ADD COLUMN tech_level TEXT")
}

// content_items.tech_level — mesma coluna espelhada no catálogo global.
const contentItemCols = (db.prepare("PRAGMA table_info(content_items)").all() as any[]).map((c) => c.name)
if (contentItemCols.length && !contentItemCols.includes('tech_level')) {
  db.exec("ALTER TABLE content_items ADD COLUMN tech_level TEXT")
}

// game_table_npcs.location_id — vínculo npc -> local (equipe de lojas, bases antigas)
const npcCols = (db.prepare("PRAGMA table_info(game_table_npcs)").all() as any[]).map((c) => c.name)
if (npcCols.length && !npcCols.includes('location_id')) {
  db.exec("ALTER TABLE game_table_npcs ADD COLUMN location_id TEXT")
}

// game_tables.default_location_id — location padrão que os players enxergam ao abrir o mapa
const gameTableCols = (db.prepare("PRAGMA table_info(game_tables)").all() as any[]).map((c) => c.name)
if (gameTableCols.length && !gameTableCols.includes('default_location_id')) {
  db.exec("ALTER TABLE game_tables ADD COLUMN default_location_id TEXT")
}

// narration_characters.conscious — presença consciente/inconsciente na cena (bases antigas)
const narrationCharCols = (db.prepare("PRAGMA table_info(narration_characters)").all() as any[]).map((c) => c.name)
if (narrationCharCols.length && !narrationCharCols.includes('conscious')) {
  db.exec("ALTER TABLE narration_characters ADD COLUMN conscious INTEGER NOT NULL DEFAULT 1")
}

// ---- Camada de CONTENT MODULES (colunas de etiquetagem) ----
// game_tables.modules — pacotes instalados no momento da criação da mesa
const gameTableBackfillCols = (db.prepare("PRAGMA table_info(game_tables)").all() as any[]).map((c) => c.name)
if (gameTableBackfillCols.length && !gameTableBackfillCols.includes('modules')) {
  db.exec("ALTER TABLE game_tables ADD COLUMN modules TEXT DEFAULT '[]'")
}

// domain tables: module_id / subcategory / category
const tagAdds: { table: string; cols: { col: string; ddl: string }[] }[] = [
  {
    table: 'game_table_items',
    cols: [
      { col: 'module_id', ddl: 'TEXT' },
      { col: 'subcategory', ddl: 'TEXT' }
    ]
  },
  {
    table: 'game_table_skills',
    cols: [{ col: 'module_id', ddl: 'TEXT' }]
  },
  {
    table: 'game_table_advantages',
    cols: [{ col: 'module_id', ddl: 'TEXT' }]
  },
  {
    table: 'game_table_disadvantages',
    cols: [{ col: 'module_id', ddl: 'TEXT' }]
  },
  {
    table: 'game_table_npcs',
    cols: [
      { col: 'module_id', ddl: 'TEXT' },
      { col: 'category', ddl: 'TEXT' },
      { col: 'subcategory', ddl: 'TEXT' }
    ]
  }
]
for (const { table, cols } of tagAdds) {
  const existing = (db.prepare(`PRAGMA table_info(${table})`).all() as any[]).map((c) => c.name)
  if (!existing.length) continue
  for (const { col, ddl } of cols) {
    if (!existing.includes(col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`)
    }
  }
}

// ---- Camada TÁTICA (q/r/facing + location_id) ----
// narration_actions — cada action corresponde a um movimento na malha
// hexagonal e aponta para a planta baixa (location_id) onde aconteceu
const tacticActionCols = (db.prepare("PRAGMA table_info(narration_actions)").all() as any[]).map((c) => c.name)
if (tacticActionCols.length) {
  const tacticActionAdds: { col: string; ddl: string }[] = [
    { col: 'location_id', ddl: 'TEXT' },
    { col: 'q', ddl: 'INTEGER' },
    { col: 'r', ddl: 'INTEGER' },
    { col: 'facing', ddl: 'INTEGER DEFAULT 0' }
  ]
  for (const { col, ddl } of tacticActionAdds) {
    if (!tacticActionCols.includes(col)) {
      db.exec(`ALTER TABLE narration_actions ADD COLUMN ${col} ${ddl}`)
    }
  }
}
// narration_characters / narration_npcs — posição inicial do token na planta baixa
for (const table of ['narration_characters', 'narration_npcs']) {
  const tacticTokenCols = (db.prepare(`PRAGMA table_info(${table})`).all() as any[]).map((c) => c.name)
  if (!tacticTokenCols.length) continue
  for (const col of ['q', 'r']) {
    if (!tacticTokenCols.includes(col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} INTEGER`)
    }
  }
  if (!tacticTokenCols.includes('facing')) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN facing INTEGER DEFAULT 0`)
  }
}

// ---- Camada de TABLE SETTINGS ----
// migração para mesas existentes: coluna de orçamento de pontos na primeira ficha
if (!(db.prepare("PRAGMA table_info(game_table_settings)").all() as any[]).some((c) => c.name === 'starting_points')) {
  db.exec(`ALTER TABLE game_table_settings ADD COLUMN starting_points INTEGER NOT NULL DEFAULT 0`)
}

// ---- Camada de STATUS de personagem ----
// migração para banco antigo: personagem desativado (fica na mesa mas fora de jogo)
const charCols = (db.prepare("PRAGMA table_info(game_table_characters)").all() as any[]).map((c) => c.name)
if (charCols.length && !charCols.includes('is_active')) {
  db.exec(`ALTER TABLE game_table_characters ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1`)
}
// ---- Camada de EDIÇÃO de ficha pelo jogador ----
// O mestre libera a edição por personagem; enquanto isso, o jogador só
// edita quando ainda tem pontos de criação/XP a distribuir.
if (charCols.length && !charCols.includes('edit_enabled')) {
  db.exec(`ALTER TABLE game_table_characters ADD COLUMN edit_enabled INTEGER NOT NULL DEFAULT 0`)
}

// ---- Camada de MEMBROS da mesa ----
// migração para banco antigo: jogador silenciado pelo mestre (continua na mesa,
// mas não posta ação, não enfileira e não encerra turno na sessão).
const playerMutedCols = (db.prepare("PRAGMA table_info(game_table_players)").all() as any[]).map((c) => c.name)
if (playerMutedCols.length && !playerMutedCols.includes('is_muted')) {
  db.exec(`ALTER TABLE game_table_players ADD COLUMN is_muted INTEGER NOT NULL DEFAULT 0`)
}

// default de configurações para mesas existentes que ainda não têm a linha
const settingsCols = (db.prepare("PRAGMA table_info(game_table_settings)").all() as any[]).map((c) => c.name)
if (settingsCols.length) {
  const missingTables = db.prepare(`
    SELECT id, lang FROM game_tables
    WHERE NOT EXISTS (
      SELECT 1 FROM game_table_settings s
      WHERE s.table_id = game_tables.id AND s.lang = game_tables.lang
    )
  `).all() as any[]
  const insertSettings = db.prepare(`
    INSERT INTO game_table_settings (table_id, lang, turn_end_mode, item_mode, reaction_mode, gm_adds_item, money_item_id, starting_shop, starting_points)
    VALUES (?, ?, 'after_test', 'gm', 'gm', 1, NULL, 0, 0)
  `)
  for (const t of missingTables) insertSettings.run(t.id, t.lang ?? 'pt')
}

// ---- moedas: carrega o money_item_id legado para game_table_currencies ----
// Uma mesa pode ter várias moedas; a coluna antiga só comportava uma.
if (settingsCols.length) {
  const legacyMoney = db.prepare(`
    SELECT table_id, money_item_id FROM game_table_settings
    WHERE money_item_id IS NOT NULL AND money_item_id != ''
  `).all() as any[]
  const insertCurrency = db.prepare(`
    INSERT OR IGNORE INTO game_table_currencies (table_id, item_id, starting_amount)
    VALUES (?, ?, 0)
  `)
  for (const row of legacyMoney) insertCurrency.run(row.table_id, row.money_item_id)
}

// ---- starting_points: conserta o DEFAULT gravado no schema ----
// A coluna nasceu com DEFAULT 150 e o SQLite grava o default no schema da
// tabela, então o ALTER guardado acima nunca mais roda e toda mesa nova
// nascia com 150 pontos. 0 = "não configurado" é a semântica do painel de
// regras, então o default precisa ser 0 de verdade. SQLite não tem
// ALTER COLUMN ... SET DEFAULT: reconstruímos a tabela preservando as linhas.
if (settingsCols.length) {
  const spCol = (db.prepare(`PRAGMA table_info(game_table_settings)`).all() as any[]).find((c) => c.name === 'starting_points')
  if (spCol && String(spCol.dflt_value ?? '0') !== '0') {
    const rebuild = db.transaction(() => {
      db.exec(`
        CREATE TABLE game_table_settings_spfix (
          table_id TEXT NOT NULL,
          lang TEXT NOT NULL DEFAULT 'pt',
          turn_end_mode TEXT NOT NULL DEFAULT 'after_test',
          item_mode TEXT NOT NULL DEFAULT 'gm',
          reaction_mode TEXT NOT NULL DEFAULT 'gm',
          gm_adds_item INTEGER NOT NULL DEFAULT 1,
          money_item_id TEXT,
          starting_shop INTEGER NOT NULL DEFAULT 0,
          starting_points INTEGER NOT NULL DEFAULT 0,
          PRIMARY KEY (table_id, lang)
        )
      `)
      db.exec(`
        INSERT INTO game_table_settings_spfix
          (table_id, lang, turn_end_mode, item_mode, reaction_mode, gm_adds_item, money_item_id, starting_shop, starting_points)
        SELECT
          table_id, lang, turn_end_mode, item_mode, reaction_mode, gm_adds_item, money_item_id, starting_shop, starting_points
        FROM game_table_settings
      `)
      db.exec(`DROP TABLE game_table_settings`)
      db.exec(`ALTER TABLE game_table_settings_spfix RENAME TO game_table_settings`)
    })
    rebuild()
  }
}

// ---- item -> skill, resolvido por nome ----
// weapons.skill e' texto solto (GURPS: 'Shortsword', 'Axe', ...) e nada no
// codigo lia essa coluna a nao ser para escolher icone. Guardamos o id da
// pericia resolvido por (table_id, lang, name) e espelhamos em
// game_table_items, para o item ser legivel sem join.
//
// Sem FK declarada de proposito: game_table_skills tem PK composta
// (id, lang) e o SQLite recusa FOREIGN KEY contra 'id' isolado
// ("foreign key mismatch"). Mesmo caminho ja usado por
// game_table_items.currency_item_id.
const skillLinkAdds: { table: string; cols: { col: string; ddl: string }[] }[] = [
  { table: 'game_table_items', cols: [{ col: 'skill_id', ddl: 'TEXT' }] },
  { table: 'game_table_weapons', cols: [{ col: 'skill_id', ddl: 'TEXT' }] }
]
for (const { table, cols } of skillLinkAdds) {
  const existing = (db.prepare(`PRAGMA table_info(${table})`).all() as any[]).map((c) => c.name)
  if (!existing.length) continue
  for (const { col, ddl } of cols) {
    if (!existing.includes(col)) {
      db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`)
    }
  }
}

// 4 das 18 armas do seed citam uma pericia que nao existe com esse nome.
const skillAliases: Record<string, string> = {
  Axe: 'Axe or Mace',
  'Guns (Pistol)': 'Guns',
  Machado: 'Machado ou Maça',
  'Armas de Fogo (Pistola)': 'Armas de Fogo'
}

if ((db.prepare("PRAGMA table_info(game_table_skills)").all() as any[]).length) {
  const findSkillByName = db.prepare(`
    SELECT id FROM game_table_skills
    WHERE table_id IS ? AND lang = ? AND name = ?
    LIMIT 1
  `)
  const pendingWeapons = db.prepare(`
    SELECT w.id, w.item_id, w.lang, w.skill, i.table_id
    FROM game_table_weapons w
    LEFT JOIN game_table_items i ON i.id = w.item_id AND i.lang = w.lang
    WHERE w.skill_id IS NULL AND w.skill IS NOT NULL AND w.skill != ''
  `).all() as any[]
  const setWeaponSkill = db.prepare(`UPDATE game_table_weapons SET skill_id = ? WHERE id = ? AND lang = ?`)
  const setItemSkill = db.prepare(`UPDATE game_table_items SET skill_id = ? WHERE id = ? AND lang = ?`)

  // So preenche vazio: escolha manual feita no form nao e sobrescrita, e o
  // script pode rodar quantas vezes quiser.
  const resolveSkills = db.transaction(() => {
    let resolved = 0
    let unresolved = 0
    for (const w of pendingWeapons) {
      let skillId: string | undefined
      for (const candidate of [w.skill, skillAliases[w.skill]]) {
        if (!candidate) continue
        const row = findSkillByName.get(w.table_id, w.lang, candidate) as any
        if (row) {
          skillId = row.id
          break
        }
      }
      if (!skillId) {
        unresolved++
        continue
      }
      setWeaponSkill.run(skillId, w.id, w.lang)
      if (w.item_id) setItemSkill.run(skillId, w.item_id, w.lang)
      resolved++
    }
    return { resolved, unresolved }
  })
  const { resolved, unresolved } = resolveSkills()
  if (resolved || unresolved) {
    console.log(`🔗 weapon->skill: ${resolved} resolvida(s), ${unresolved} sem match`)
  }
}

console.log('✅ Full database migrated!')

// ---- USERS BASE (admin + player) sem conteúdo ----
// A migration cria apenas a modelagem + login de acesso dos dois usuários
// base; o conteúdo completo é inserido pelos scripts de seed (en/pt).
const baseUserStmt = db.prepare(`
  INSERT OR IGNORE INTO users (id, type, username, password, phone, email)
  VALUES (?, ?, ?, ?, ?, ?)
`)
baseUserStmt.run(adminId, 2, 'd3miurg0', '123456', '85999999999', 'd3miurg0@email.com')
baseUserStmt.run(playerOneId, 1, 'João Pedro', '123456', '85888888888', 'joao.pedro@email.com')

console.log('👤 Base users (admin + player) inserted!')

// ---- DIFFICULTY VOCABULARY: "Average" -> "Medium" ----
// O formulário de skill gravava `Average`, mas o catálogo (seed) sempre usou
// `Medium`. Duas palavras para a mesma faixa faziam o <select> abrir em branco
// ao editar uma skill existente, porque o `value` não tinha `<option>`.
// Idempotente: só reescreve o valor legado.
for (const table of ['game_table_skills', 'content_skills']) {
  const changed = db
    .prepare(`UPDATE ${table} SET predefinition_difficulty = 'Medium' WHERE predefinition_difficulty = 'Average'`)
    .run()
  if (changed.changes > 0) {
    console.log(`🎯 ${table}: ${changed.changes} skill(s) normalizada(s) Average -> Medium`)
  }
}

// npx ts-node src/infra/database/migrate.ts
// npx ts-node src/infra/database/seed.ts