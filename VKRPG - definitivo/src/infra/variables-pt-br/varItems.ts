import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import * as itemsIds from "./MainUUIDIds/uuidItems"

/* =====================================================================
   SEED ITEMS (novo modelo GURPS)
   ----------------------------------------------------------------
   NÃO guardamos dano final de arma. A arma guarda PARÂMETROS:
     damage_source  -> como o dano é derivado (st_swing/st_thrust/fixed/...)
     damage_modifier-> inteiro somado à base (ex: SW+1 -> +1)
     damage_dice    -> só p/ dano fixo (ex: '2d')
     damage_type    -> tipo de dano GURPS (cut/imp/cr/pi/...)
   A engine combina com ST/THR/SW do personagem via gurps_damage_table.

   tech_level = Nível Tecnológico GURPS da peça ('TL0'..'TL9'), exibido
   no front ao lado dos demais dados do item.
   ===================================================================== */

type SeedItem = {
  id: string
  table_id: string
  name: string
  kind: string
  category: string
  weight_lb: number
  cost: number
  dimensions: string
  description: string
  quality: string
  condition: string
  tech_level?: string
}

type SeedWeapon = {
  id: string
  item_id: string
  skill: string
  min_st: number | null
  rated_st: number | null
  handedness: number
  reach: string
  parry: string
  block: string | null
  fit: string
}

type SeedAttack = {
  id: string
  weapon_id: string
  name: string
  usage: string | null
  damage_source: string
  damage_modifier: number
  damage_dice: string | null
  damage_type: string
  armor_penetration: number
  accuracy: number | null
  range: string
  recoil: number | null
  shots: number | null
}

type SeedArmor = {
  id: string
  item_id: string
  dr: number
  flex: number
  locations: string
  fit: string
}

export const items: SeedItem[] = [
  /* ============================ ARMAS BRANCAS CLÁSSICAS ============================ */
  {
    id: itemsIds.shortSwordId, table_id: mainGameTableId, name: 'Espada Curta',
    kind: 'weapon', category: 'Melee', weight_lb: 3, cost: 400,
    dimensions: '90cm', description: 'Uma espada curta de aço equilibrada para combate corpo a corpo rápido.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.handAxeId, table_id: mainGameTableId, name: 'Machado de Mão',
    kind: 'weapon', category: 'Melee', weight_lb: 2, cost: 40,
    dimensions: '45cm', description: 'Um machado versátil de uma mão.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.daggerId, table_id: mainGameTableId, name: 'Adaga',
    kind: 'weapon', category: 'Melee', weight_lb: 1, cost: 20,
    dimensions: '25cm', description: 'Uma lâmina pequena para combate corpo a corpo rápido e arremesso.',
    quality: 'fine', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.fineDaggerId, table_id: mainGameTableId, name: 'Adaga Fina',
    kind: 'weapon', category: 'Melee', weight_lb: 1, cost: 80,
    dimensions: '25cm', description: 'Uma adaga extremamente afiada, equilibrada para golpes precisos.',
    quality: 'very_fine', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.throwingKnifeId, table_id: mainGameTableId, name: 'Faca de Arremesso',
    kind: 'weapon', category: 'Ranged', weight_lb: 0.5, cost: 15,
    dimensions: '20cm', description: 'Uma faca leve projetada para precisão no arremesso.',
    quality: 'fine', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.lancaId, table_id: mainGameTableId, name: 'Lança',
    kind: 'weapon', category: 'Melee', weight_lb: 4, cost: 40,
    dimensions: '2m', description: 'Uma lança de haste longa, usada com uma ou duas mãos e hábil para arremesso.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.lancaCombateId, table_id: mainGameTableId, name: 'Lança de Combate',
    kind: 'weapon', category: 'Melee', weight_lb: 8, cost: 60,
    dimensions: '3m', description: 'Uma longa lança de infantaria, empunhada com as duas mãos para perfurar formações.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.machadoBatalhaId, table_id: mainGameTableId, name: 'Machado de Batalha',
    kind: 'weapon', category: 'Melee', weight_lb: 5, cost: 60,
    dimensions: '70cm', description: 'Um machado pesado de uma mão, capaz de partir escudos e armaduras.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.machadoArremessoId, table_id: mainGameTableId, name: 'Machado de Arremesso',
    kind: 'weapon', category: 'Ranged', weight_lb: 2, cost: 35,
    dimensions: '40cm', description: 'Um machado leve e equilibrado, feito para ser lançado contra o inimigo.',
    quality: 'standard', condition: 'worn', tech_level: 'TL1'
  },
  {
    id: itemsIds.machadoGrandeId, table_id: mainGameTableId, name: 'Machado Grande',
    kind: 'weapon', category: 'Melee', weight_lb: 8, cost: 100,
    dimensions: '1m', description: 'Um machado de duas mãos devastador, que derruba o que encontra.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.espadaLongaId, table_id: mainGameTableId, name: 'Espada Longa',
    kind: 'weapon', category: 'Melee', weight_lb: 3, cost: 500,
    dimensions: '1m', description: 'A espada de cavaleiro por excelência: equilíbrio entre corte e estocada.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.espadaBastardaId, table_id: mainGameTableId, name: 'Espada Bastarda',
    kind: 'weapon', category: 'Melee', weight_lb: 5, cost: 650,
    dimensions: '1.2m', description: 'Uma espada de cabo longo, empunhada com uma ou duas mãos conforme a necessidade.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.montanteId, table_id: mainGameTableId, name: 'Montante',
    kind: 'weapon', category: 'Melee', weight_lb: 7, cost: 800,
    dimensions: '1.7m', description: 'Uma espada de duas mãos gigantesca, criada para romper linhas de batalha.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.rapieiraId, table_id: mainGameTableId, name: 'Rapieira',
    kind: 'weapon', category: 'Melee', weight_lb: 3, cost: 500,
    dimensions: '1.1m', description: 'Uma lâmina fina e leve de esgrima, veloz nos duelos de estocada.',
    quality: 'fine', condition: 'new', tech_level: 'TL4'
  },
  {
    id: itemsIds.sabreId, table_id: mainGameTableId, name: 'Sabre',
    kind: 'weapon', category: 'Melee', weight_lb: 3, cost: 300,
    dimensions: '1m', description: 'Uma lâmina curva de cavalaria, feita para cortes rápidos montado a cavalo.',
    quality: 'standard', condition: 'new', tech_level: 'TL4'
  },
  {
    id: itemsIds.macaId, table_id: mainGameTableId, name: 'Maça',
    kind: 'weapon', category: 'Melee', weight_lb: 5, cost: 50,
    dimensions: '70cm', description: 'Uma maça de guerra com cabeça metálica, eficaz contra armaduras de placas.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.marteloGuerraId, table_id: mainGameTableId, name: 'Martelo de Guerra',
    kind: 'weapon', category: 'Melee', weight_lb: 5, cost: 80,
    dimensions: '70cm', description: 'Um martelo pesado que concentra todo o impacto em um único ponto.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.alabardaId, table_id: mainGameTableId, name: 'Alabarda',
    kind: 'weapon', category: 'Melee', weight_lb: 9, cost: 150,
    dimensions: '2.2m', description: 'Uma arma de haste com lâmina, ponta e gancho: corte, estocada e derrubada.',
    quality: 'standard', condition: 'worn', tech_level: 'TL3'
  },
  {
    id: itemsIds.facaCombateId, table_id: mainGameTableId, name: 'Faca de Combate',
    kind: 'weapon', category: 'Melee', weight_lb: 1, cost: 40,
    dimensions: '30cm', description: 'Uma faca tática de lâmina larga, feita para combate moderno.',
    quality: 'standard', condition: 'new', tech_level: 'TL5'
  },
  {
    id: itemsIds.facaoId, table_id: mainGameTableId, name: 'Facão',
    kind: 'weapon', category: 'Melee', weight_lb: 2, cost: 40,
    dimensions: '45cm', description: 'Uma lâmina pesada de mato, também útil em combate e no trabalho.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.facaCacaId, table_id: mainGameTableId, name: 'Faca de Caça',
    kind: 'weapon', category: 'Melee', weight_lb: 0.75, cost: 25,
    dimensions: '28cm', description: 'Uma faca curta de caçador, prática para esfolar e para defesa pessoal.',
    quality: 'standard', condition: 'worn', tech_level: 'TL5'
  },
  {
    id: itemsIds.punhalId, table_id: mainGameTableId, name: 'Punhal',
    kind: 'weapon', category: 'Melee', weight_lb: 0.5, cost: 30,
    dimensions: '22cm', description: 'Uma lâmina estreita e pontuda, feita para achar as frestas da armadura.',
    quality: 'fine', condition: 'new', tech_level: 'TL4'
  },

  /* ============================ ARMAS DE PROJÉTIL PRIMITIVAS ============================ */
  {
    id: itemsIds.bestaId, table_id: mainGameTableId, name: 'Besta',
    kind: 'weapon', category: 'Ranged', weight_lb: 6, cost: 150,
    dimensions: '80cm', description: 'Uma besta de arco curto, lenta de recarregar mas devastadora contra armaduras.',
    quality: 'standard', condition: 'worn', tech_level: 'TL3'
  },
  {
    id: itemsIds.arcoLongoId, table_id: mainGameTableId, name: 'Arco Longo',
    kind: 'weapon', category: 'Ranged', weight_lb: 3, cost: 200,
    dimensions: '1.8m', description: 'Um arco longo de teixo, exigente em força e recompensador em alcance.',
    quality: 'standard', condition: 'new', tech_level: 'TL2'
  },

  /* ============================ ARMAS DE FOGO ============================ */
  {
    id: itemsIds.pistolId, table_id: mainGameTableId, name: 'Pistola (.45)',
    kind: 'weapon', category: 'Ranged', weight_lb: 2.4, cost: 600,
    dimensions: '22cm', description: 'Uma pistola pesada que dispara munição .45 ACP.',
    quality: 'standard', condition: 'new', tech_level: 'TL7'
  },
  {
    id: itemsIds.pistola9mmId, table_id: mainGameTableId, name: 'Pistola Semiautomática (9mm)',
    kind: 'weapon', category: 'Ranged', weight_lb: 2, cost: 600,
    dimensions: '20cm', description: 'Uma pistola semiautomática de carregador amplo que dispara munição 9mm.',
    quality: 'standard', condition: 'new', tech_level: 'TL8'
  },
  {
    id: itemsIds.revolver38Id, table_id: mainGameTableId, name: 'Revólver (.38)',
    kind: 'weapon', category: 'Ranged', weight_lb: 2, cost: 400,
    dimensions: '22cm', description: 'Um revólver de tambor simples e confiável que dispara munição .38.',
    quality: 'standard', condition: 'worn', tech_level: 'TL6'
  },
  {
    id: itemsIds.revolver357Id, table_id: mainGameTableId, name: 'Revólver Magnum (.357)',
    kind: 'weapon', category: 'Ranged', weight_lb: 3, cost: 700,
    dimensions: '28cm', description: 'Um revólver de cano longo com munição .357 Magnum, forte e barulhento.',
    quality: 'fine', condition: 'new', tech_level: 'TL7'
  },
  {
    id: itemsIds.espingarda12Id, table_id: mainGameTableId, name: 'Espingarda Calibre 12',
    kind: 'weapon', category: 'Ranged', weight_lb: 8, cost: 500,
    dimensions: '100cm', description: 'Uma espingarda de bombeamento calibre 12, devastadora a curta distância.',
    quality: 'standard', condition: 'worn', tech_level: 'TL6'
  },
  {
    id: itemsIds.mosqueteId, table_id: mainGameTableId, name: 'Mosquete',
    kind: 'weapon', category: 'Ranged', weight_lb: 10, cost: 250,
    dimensions: '1.5m', description: 'Um mosquete de pederneira, lento de recarregar mas de pólvora negra potente.',
    quality: 'standard', condition: 'worn', tech_level: 'TL4'
  },
  {
    id: itemsIds.bacamarteId, table_id: mainGameTableId, name: 'Bacamarte',
    kind: 'weapon', category: 'Ranged', weight_lb: 8, cost: 200,
    dimensions: '90cm', description: 'Uma arma de cano curto e boca larga que espalha estilhaços a curta distância.',
    quality: 'standard', condition: 'worn', tech_level: 'TL4'
  },
  {
    id: itemsIds.submetralhadoraId, table_id: mainGameTableId, name: 'Submetralhadora (9mm)',
    kind: 'weapon', category: 'Ranged', weight_lb: 6, cost: 1200,
    dimensions: '65cm', description: 'Uma submetralhadora compacta de tiro rápido, ideal em espaços fechados.',
    quality: 'standard', condition: 'new', tech_level: 'TL8'
  },
  {
    id: itemsIds.fuzilFerrolhoId, table_id: mainGameTableId, name: 'Fuzil de Ferrolho',
    kind: 'weapon', category: 'Ranged', weight_lb: 9, cost: 500,
    dimensions: '1.1m', description: 'Um fuzil de ferrolho robusto, preciso e usado em caçadas e guerras.',
    quality: 'standard', condition: 'worn', tech_level: 'TL6'
  },
  {
    id: itemsIds.fuzilAssaltoId, table_id: mainGameTableId, name: 'Fuzil de Assalto',
    kind: 'weapon', category: 'Ranged', weight_lb: 8, cost: 1500,
    dimensions: '100cm', description: 'Um fuzil de assalto seletivo, o padrão da infantaria moderna.',
    quality: 'standard', condition: 'new', tech_level: 'TL8'
  },
  {
    id: itemsIds.riflePrecisaoId, table_id: mainGameTableId, name: 'Rifle de Precisão',
    kind: 'weapon', category: 'Ranged', weight_lb: 15, cost: 3000,
    dimensions: '120cm', description: 'Um fuzil de precisão com luneta, feito para eliminar alvos a longa distância.',
    quality: 'fine', condition: 'new', tech_level: 'TL7'
  },
  {
    id: itemsIds.metralhadoraLeveId, table_id: mainGameTableId, name: 'Metralhadora Leve',
    kind: 'weapon', category: 'Ranged', weight_lb: 22, cost: 4000,
    dimensions: '1.2m', description: 'Uma metralhadora leve de fita, capaz de manter fogo de supressão contínuo.',
    quality: 'standard', condition: 'worn', tech_level: 'TL8'
  },

  /* ============================ ARMAS DE ARREMESSO / CAMPESTRES ============================ */
  {
    id: itemsIds.recurveBowId, table_id: mainGameTableId, name: 'Arco Recurvo',
    kind: 'weapon', category: 'Ranged', weight_lb: 4, cost: 225,
    dimensions: '1.2m', description: 'Um arco recurvo com alcance excelente para um arqueiro.',
    quality: 'fine', condition: 'new', tech_level: 'TL2'
  },
  {
    id: itemsIds.wizardStaffId, table_id: mainGameTableId, name: 'Cajado de Mago',
    kind: 'weapon', category: 'Melee', weight_lb: 4, cost: 7,
    dimensions: '1.8m', description: 'Um cajado de madeira finamente trabalhado, imbuído de energia mágica latente.',
    quality: 'fine', condition: 'worn', tech_level: 'TL3'
  },

  /* ============================ ESCUDOS ============================ */
  {
    id: itemsIds.mediumShieldId, table_id: mainGameTableId, name: 'Escudo Médio',
    kind: 'shield', category: 'Shield', weight_lb: 15, cost: 60,
    dimensions: '90cm', description: 'Um escudo de madeira reforçado com faixas de metal.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.escudoPequenoId, table_id: mainGameTableId, name: 'Broquel',
    kind: 'shield', category: 'Shield', weight_lb: 8, cost: 40,
    dimensions: '40cm', description: 'Um escudo pequeno e leve, segurado no punho para aparar golpes rápidos.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.escudoGrandeId, table_id: mainGameTableId, name: 'Escudo Grande',
    kind: 'shield', category: 'Shield', weight_lb: 20, cost: 90,
    dimensions: '1.1m', description: 'Um escudo grande que protege da cabeça aos joelhos.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.escudoTorreId, table_id: mainGameTableId, name: 'Escudo Torre',
    kind: 'shield', category: 'Shield', weight_lb: 45, cost: 150,
    dimensions: '1.5m', description: 'Um enorme escudo de cerco, uma parede móvel contra flechas e golpes.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },

  /* ============================ ARMADURAS ============================ */
  {
    id: itemsIds.leatherArmorId, table_id: mainGameTableId, name: 'Armadura de Couro',
    kind: 'armor', category: 'Armor', weight_lb: 15, cost: 100,
    dimensions: 'Torso', description: 'Armadura de couro leve que protege sem limitar os movimentos.',
    quality: 'standard', condition: 'worn', tech_level: 'TL1'
  },
  {
    id: itemsIds.galhornLeatherArmorId, table_id: mainGameTableId, name: 'Armadura de Couro Reforçada',
    kind: 'armor', category: 'Armor', weight_lb: 18, cost: 120,
    dimensions: 'Torso', description: 'Armadura de couro resistente que oferece proteção moderada.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.leatherBracersId, table_id: mainGameTableId, name: 'Braceleiras de Couro',
    kind: 'armor', category: 'Armor', weight_lb: 2, cost: 30,
    dimensions: 'Arms', description: 'Protetores de antebraço de couro para proteção adicional.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.leatherBootsId, table_id: mainGameTableId, name: 'Botas de Couro',
    kind: 'armor', category: 'Armor', weight_lb: 3, cost: 40,
    dimensions: 'Legs', description: 'Botas de couro resistentes que protegem os pés e as pernas inferiores.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.kaelLeatherArmorId, table_id: mainGameTableId, name: 'Armadura de Couro Furtiva',
    kind: 'armor', category: 'Armor', weight_lb: 12, cost: 100,
    dimensions: 'Torso', description: 'Armadura de couro leve otimizada para furtividade e mobilidade.',
    quality: 'fine', condition: 'good', tech_level: 'TL1'
  },
  {
    id: itemsIds.acolchoadaId, table_id: mainGameTableId, name: 'Vestimenta Acolchoada (Gambeson)',
    kind: 'armor', category: 'Armor', weight_lb: 10, cost: 60,
    dimensions: 'Torso, Arms', description: 'Camada de tecido acolchoado que amortece golpes e serve de base para outras armaduras.',
    quality: 'standard', condition: 'worn', tech_level: 'TL1'
  },
  {
    id: itemsIds.cotaMalhaId, table_id: mainGameTableId, name: 'Cota de Malha',
    kind: 'armor', category: 'Armor', weight_lb: 25, cost: 300,
    dimensions: 'Torso, Arms', description: 'Malha de anéis de ferro entrelaçados, flexível e eficaz contra cortes.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.cotaEscamasId, table_id: mainGameTableId, name: 'Cota de Escamas',
    kind: 'armor', category: 'Armor', weight_lb: 25, cost: 250,
    dimensions: 'Torso', description: 'Escamas metálicas costuradas sobre couro, baratas e resistentes.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.peitoralAcoId, table_id: mainGameTableId, name: 'Peitoral de Aço',
    kind: 'armor', category: 'Armor', weight_lb: 20, cost: 500,
    dimensions: 'Torso', description: 'Uma placa de peito de aço polido que protege os órgãos vitais.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.armaduraPlacasId, table_id: mainGameTableId, name: 'Armadura de Placas',
    kind: 'armor', category: 'Armor', weight_lb: 45, cost: 1600,
    dimensions: 'Torso, Arms, Legs', description: 'A armadura completa do cavaleiro: placas articuladas que cobrem quase todo o corpo.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.elmoAcoId, table_id: mainGameTableId, name: 'Elmo de Aço',
    kind: 'armor', category: 'Armor', weight_lb: 5, cost: 100,
    dimensions: 'Head', description: 'Um elmo fechado de aço que protege o crânio e o rosto.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.manoplasAcoId, table_id: mainGameTableId, name: 'Manoplas de Aço',
    kind: 'armor', category: 'Armor', weight_lb: 2, cost: 80,
    dimensions: 'Hands', description: 'Um par de manoplas articuladas de aço para proteger as mãos.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.caneleirasId, table_id: mainGameTableId, name: 'Caneleiras de Aço',
    kind: 'armor', category: 'Armor', weight_lb: 5, cost: 100,
    dimensions: 'Legs', description: 'Placas de aço que protegem as canelas e os joelhos.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.coleteBalisticoId, table_id: mainGameTableId, name: 'Colete à Prova de Balas',
    kind: 'armor', category: 'Armor', weight_lb: 6, cost: 500,
    dimensions: 'Torso', description: 'Um colete de fibras balísticas que absorve o impacto de projéteis.',
    quality: 'standard', condition: 'new', tech_level: 'TL8'
  },
  {
    id: itemsIds.coleteTaticoId, table_id: mainGameTableId, name: 'Colete Tático',
    kind: 'armor', category: 'Armor', weight_lb: 12, cost: 1200,
    dimensions: 'Torso', description: 'Um colete tático com placas de cerâmica e bolsas para carregadores.',
    quality: 'fine', condition: 'new', tech_level: 'TL8'
  },

  /* ============================ VESTUÁRIO ============================ */
  {
    id: itemsIds.robesId, table_id: mainGameTableId, name: 'Vestes',
    kind: 'armor', category: 'Clothing', weight_lb: 6, cost: 30,
    dimensions: 'Full Body', description: 'Vestes de mago simples mas duráveis, encantadas para conforto.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.tunicaLinhoId, table_id: mainGameTableId, name: 'Túnica de Linho',
    kind: 'equipment', category: 'Clothing', weight_lb: 2, cost: 15,
    dimensions: 'Full Body', description: 'Uma túnica simples de linho, confortável para o dia a dia.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.roupasCamponesId, table_id: mainGameTableId, name: 'Roupas de Camponês',
    kind: 'equipment', category: 'Clothing', weight_lb: 3, cost: 10,
    dimensions: 'Full Body', description: 'Roupas rústicas de tecido grosso, marcadas pelo trabalho no campo.',
    quality: 'cheap', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.mantoNobreId, table_id: mainGameTableId, name: 'Manto Nobre',
    kind: 'equipment', category: 'Clothing', weight_lb: 4, cost: 200,
    dimensions: 'Full Body', description: 'Um manto bordado com fios de ouro, símbolo de riqueza e status.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.roupasMercadorId, table_id: mainGameTableId, name: 'Roupas de Mercador',
    kind: 'equipment', category: 'Clothing', weight_lb: 3, cost: 40,
    dimensions: 'Full Body', description: 'Roupas práticas e bem-feitas, adequadas para viagens de negócios.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.vestimentaCouroId, table_id: mainGameTableId, name: 'Vestimenta de Couro',
    kind: 'equipment', category: 'Clothing', weight_lb: 4, cost: 50,
    dimensions: 'Full Body', description: 'Roupas de couro resistentes, comuns entre aventureiros e batedores.',
    quality: 'standard', condition: 'good', tech_level: 'TL4'
  },
  {
    id: itemsIds.chapeuAbaId, table_id: mainGameTableId, name: 'Chapéu de Aba Larga',
    kind: 'equipment', category: 'Clothing', weight_lb: 0.5, cost: 10,
    dimensions: 'Head', description: 'Um chapéu de aba larga que protege do sol e da chuva.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.botasMontariaId, table_id: mainGameTableId, name: 'Botas de Montaria',
    kind: 'equipment', category: 'Clothing', weight_lb: 3, cost: 40,
    dimensions: 'Legs', description: 'Botas altas de couro, feitas para cavalgar e caminhar longas distâncias.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.luvasCouroId, table_id: mainGameTableId, name: 'Luvas de Couro',
    kind: 'equipment', category: 'Clothing', weight_lb: 0.5, cost: 10,
    dimensions: 'Hands', description: 'Luvas simples de couro que protegem as mãos do frio e do atrito.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.capaInvernoId, table_id: mainGameTableId, name: 'Capa de Inverno',
    kind: 'equipment', category: 'Clothing', weight_lb: 4, cost: 50,
    dimensions: 'Shoulders', description: 'Uma capa forrada de lã, indispensável nas estradas frias.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.trajesFormaisId, table_id: mainGameTableId, name: 'Trajes Formais',
    kind: 'equipment', category: 'Clothing', weight_lb: 3, cost: 300,
    dimensions: 'Full Body', description: 'Um traje social elegante, adequado a banquetes e recepções.',
    quality: 'fine', condition: 'new', tech_level: 'TL6'
  },

  /* ============================ EQUIPAMENTO ============================ */
  {
    id: itemsIds.spellbookId, table_id: mainGameTableId, name: 'Grimório',
    kind: 'equipment', category: 'Equipment', weight_lb: 3, cost: 400,
    dimensions: '30cm', description: 'Um tomo encadernado em couro contendo rituais arcanos e anotações.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.potionBeltId, table_id: mainGameTableId, name: 'Cinto de Poções',
    kind: 'equipment', category: 'Equipment', weight_lb: 2, cost: 25,
    dimensions: 'Waist', description: 'Um cinto com bolsos pequenos para carregar poções e reagentes.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.lockpickSetId, table_id: mainGameTableId, name: 'Kit de Gazuas',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.5, cost: 50,
    dimensions: '10cm', description: 'Um conjunto profissional de gazuas para abrir fechaduras.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.cintoUtilidadesId, table_id: mainGameTableId, name: 'Cinto de Utilidades',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 30,
    dimensions: 'Waist', description: 'Um cinto com vários compartimentos para ferramentas e bugigangas.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.mochilaId, table_id: mainGameTableId, name: 'Mochila',
    kind: 'equipment', category: 'Equipment', weight_lb: 3, cost: 60,
    dimensions: '50cm', description: 'Uma mochila de tecido grosso com tiras, feita para carregar equipamento.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.cantilId, table_id: mainGameTableId, name: 'Cantil',
    kind: 'equipment', category: 'Equipment', weight_lb: 3, cost: 10,
    dimensions: '20cm', description: 'Um cantil que carrega água limpa para as jornadas.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.sacoDormirId, table_id: mainGameTableId, name: 'Saco de Dormir',
    kind: 'equipment', category: 'Equipment', weight_lb: 5, cost: 25,
    dimensions: '1.8m', description: 'Um saco de dormir acolchoado que torna o descanso no mato suportável.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.cordaCanhamoId, table_id: mainGameTableId, name: 'Corda de Cânhamo',
    kind: 'equipment', category: 'Equipment', weight_lb: 5, cost: 20,
    dimensions: '10m', description: 'Dez metros de corda de cânhamo resistente, útil em escaladas.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.lanternaOleoId, table_id: mainGameTableId, name: 'Lanterna a Óleo',
    kind: 'equipment', category: 'Equipment', weight_lb: 2, cost: 20,
    dimensions: '25cm', description: 'Uma lanterna a óleo que ilumina um bom raio por horas.',
    quality: 'standard', condition: 'worn', tech_level: 'TL3'
  },
  {
    id: itemsIds.tochaId, table_id: mainGameTableId, name: 'Tocha',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 3,
    dimensions: '40cm', description: 'Um pedaço de madeira com piche na ponta, ilumina e queima.',
    quality: 'cheap', condition: 'new', tech_level: 'TL1'
  },
  {
    id: itemsIds.pederneiraId, table_id: mainGameTableId, name: 'Pederneira e Isqueiro',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.5, cost: 5,
    dimensions: '8cm', description: 'Um kit de pedra e aço para acender fogo em qualquer lugar.',
    quality: 'standard', condition: 'worn', tech_level: 'TL2'
  },
  {
    id: itemsIds.peDeCabraId, table_id: mainGameTableId, name: 'Pé de Cabra',
    kind: 'equipment', category: 'Equipment', weight_lb: 5, cost: 20,
    dimensions: '80cm', description: 'Uma barra de ferro com gancho, para forçar portas e mover pedras.',
    quality: 'standard', condition: 'worn', tech_level: 'TL3'
  },
  {
    id: itemsIds.barracaId, table_id: mainGameTableId, name: 'Barraca',
    kind: 'equipment', category: 'Equipment', weight_lb: 10, cost: 80,
    dimensions: '2m', description: 'Uma barraca de lona com estacas e cordas para abrigar duas pessoas.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.mapaId, table_id: mainGameTableId, name: 'Mapa Regional',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.5, cost: 25,
    dimensions: '60cm', description: 'Um mapa de couro com estradas, rios e pequenos povoados.',
    quality: 'standard', condition: 'worn', tech_level: 'TL3'
  },
  {
    id: itemsIds.bussolaId, table_id: mainGameTableId, name: 'Bússola',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.5, cost: 50,
    dimensions: '8cm', description: 'Uma bússola magnética que sempre aponta o norte.',
    quality: 'fine', condition: 'new', tech_level: 'TL4'
  },
  {
    id: itemsIds.lunetaId, table_id: mainGameTableId, name: 'Luneta',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 75,
    dimensions: '35cm', description: 'Uma luneta de latão que aproxima objetos distantes.',
    quality: 'fine', condition: 'new', tech_level: 'TL4'
  },
  {
    id: itemsIds.relogioBolsoId, table_id: mainGameTableId, name: 'Relógio de Bolso',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.5, cost: 150,
    dimensions: '6cm', description: 'Um relógio mecânico de bolso com corrente, marca as horas com rigor.',
    quality: 'fine', condition: 'new', tech_level: 'TL5'
  },
  {
    id: itemsIds.kitFerramentasId, table_id: mainGameTableId, name: 'Kit de Ferramentas',
    kind: 'equipment', category: 'Equipment', weight_lb: 10, cost: 200,
    dimensions: '40cm', description: 'Uma caixa com chaves, alicates e limas para reparos diversos.',
    quality: 'standard', condition: 'good', tech_level: 'TL5'
  },
  {
    id: itemsIds.kitPrimeirosSocorrosId, table_id: mainGameTableId, name: 'Kit de Primeiros Socorros',
    kind: 'equipment', category: 'Equipment', weight_lb: 2, cost: 50,
    dimensions: '25cm', description: 'Uma bolsa com ataduras, antisséptico e material de sutura.',
    quality: 'standard', condition: 'new', tech_level: 'TL6'
  },
  {
    id: itemsIds.lanternaEletricaId, table_id: mainGameTableId, name: 'Lanterna Elétrica',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 20,
    dimensions: '20cm', description: 'Uma lanterna de pilhas com facho de luz branca e forte.',
    quality: 'standard', condition: 'new', tech_level: 'TL6'
  },
  {
    id: itemsIds.binoculosId, table_id: mainGameTableId, name: 'Binóculos',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 100,
    dimensions: '18cm', description: 'Binóculos de campo que aproximam alvos distantes com nitidez.',
    quality: 'standard', condition: 'new', tech_level: 'TL6'
  },
  {
    id: itemsIds.radioId, table_id: mainGameTableId, name: 'Rádio Comunicador',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 200,
    dimensions: '15cm', description: 'Um rádio portátil que transmite voz por ondas de rádio.',
    quality: 'standard', condition: 'new', tech_level: 'TL7'
  },

  /* ============================ ITENS ARCANOS ============================ */
  {
    id: itemsIds.arcanistStaffId, table_id: mainGameTableId, name: 'Cajado Arcano',
    kind: 'weapon', category: 'Melee', weight_lb: 4, cost: 60,
    dimensions: '1.8m', description: 'Um cajado talhado em madeira anciã, zumbindo com a carga arcanã armazenada.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.arcaneDaggerId, table_id: mainGameTableId, name: 'Adaga Arcana',
    kind: 'weapon', category: 'Melee', weight_lb: 0.75, cost: 300,
    dimensions: '28cm', description: 'Uma adaga gravada com runas que brilham quando o portador canaliza magia.',
    quality: 'very_fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.arcaneFocusCrystalId, table_id: mainGameTableId, name: 'Cristal de Foco Arcano',
    kind: 'equipment', category: 'Equipment', weight_lb: 0.25, cost: 200,
    dimensions: '5cm', description: 'Um cristal do tamanho de um punho que ancora a projeção de feitiços e brilha fracamente na presença de magia.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.shadowAmuletId, table_id: mainGameTableId, name: 'Amuleto das Sombras',
    kind: 'equipment', category: 'Clothing', weight_lb: 0.2, cost: 150,
    dimensions: 'Neck', description: 'Um amuleto enevoado que abafa os passos e oculta a presença mágica do portador.',
    quality: 'fine', condition: 'good', tech_level: 'TL3'
  },
  {
    id: itemsIds.smokeBombPouchId, table_id: mainGameTableId, name: 'Bolsas de Bomba de Fumaça',
    kind: 'equipment', category: 'Equipment', weight_lb: 1, cost: 60,
    dimensions: 'Waist', description: 'Um bolso cheio de pequenos grãos que estouram em fumaça ocultadora.',
    quality: 'standard', condition: 'good', tech_level: 'TL3'
  },

  /* ============================ POÇÕES E CONSUMÍVEIS ============================ */
  {
    id: itemsIds.elixirMinorHealingId, table_id: mainGameTableId, name: 'Elixir de Cura Menor',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 120,
    dimensions: '12cm', description: 'Um elixir vermelho brilhante que alivia feridas e restaura a energia gasta.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.pocaoCuraId, table_id: mainGameTableId, name: 'Poção de Cura',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 120,
    dimensions: '12cm', description: 'Um frasco de líquido azul que fecha feridas em instantes.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.pocaoCuraMaiorId, table_id: mainGameTableId, name: 'Poção de Cura Maior',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 400,
    dimensions: '12cm', description: 'Um frasco de luz dourada que restaura até os ferimentos mais graves.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.antidotoId, table_id: mainGameTableId, name: 'Antídoto',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 100,
    dimensions: '10cm', description: 'Uma mistura amarga que neutraliza venenos comuns no organismo.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.pocaoFuriaId, table_id: mainGameTableId, name: 'Poção de Fúria',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 150,
    dimensions: '10cm', description: 'Um líquido rubro que incendeia o sangue e aumenta a agressividade.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.elixirForcaId, table_id: mainGameTableId, name: 'Elixir da Força',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 200,
    dimensions: '10cm', description: 'Um elixir denso que tonifica os músculos e amplia a força por um tempo.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.pocaoVelocidadeId, table_id: mainGameTableId, name: 'Poção de Velocidade',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 250,
    dimensions: '10cm', description: 'Um frasco de líquido incolor que aguça os reflexos do bebedor.',
    quality: 'fine', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.oleoLaminaId, table_id: mainGameTableId, name: 'Óleo de Lâmina',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 60,
    dimensions: '10cm', description: 'Um óleo viscoso que cobre a lâmina com uma fina camada de veneno adormecido.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.balsamoRestauradorId, table_id: mainGameTableId, name: 'Bálsamo Restaurador',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 80,
    dimensions: '10cm', description: 'Uma pasta medicinal que acelera a cicatrização quando aplicada na pele.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.racaoViagemId, table_id: mainGameTableId, name: 'Ração de Viagem',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.5, cost: 2,
    dimensions: '15cm', description: 'Farinha, carne seca e frutas desidratadas para uma refeição na estrada.',
    quality: 'standard', condition: 'new', tech_level: 'TL2'
  },
  {
    id: itemsIds.odreVinhoId, table_id: mainGameTableId, name: 'Odre de Vinho',
    kind: 'equipment', category: 'Consumable', weight_lb: 4, cost: 10,
    dimensions: '30cm', description: 'Um odre de couro cheio de vinho, bom para aquecer os ânimos.',
    quality: 'standard', condition: 'good', tech_level: 'TL2'
  },
  {
    id: itemsIds.flechasId, table_id: mainGameTableId, name: 'Flechas',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.1, cost: 2,
    dimensions: '80cm', description: 'Flechas de haste de madeira com ponta de ferro e penas.',
    quality: 'standard', condition: 'new', tech_level: 'TL2'
  },
  {
    id: itemsIds.virotesBestaId, table_id: mainGameTableId, name: 'Virotes de Besta',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.1, cost: 2,
    dimensions: '30cm', description: 'Virotes curtos e grossos, feitos para os disparos de uma besta.',
    quality: 'standard', condition: 'new', tech_level: 'TL3'
  },
  {
    id: itemsIds.polvoraNegraId, table_id: mainGameTableId, name: 'Pólvora Negra',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.1, cost: 5,
    dimensions: '10cm', description: 'Um saco de pólvora negra, o combustível das armas de fogo antigas.',
    quality: 'standard', condition: 'new', tech_level: 'TL4'
  },
  {
    id: itemsIds.cartuchos12Id, table_id: mainGameTableId, name: 'Cartuchos Calibre 12',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.1, cost: 3,
    dimensions: '7cm', description: 'Cartuchos de escumadeira para espingarda calibre 12.',
    quality: 'standard', condition: 'new', tech_level: 'TL6'
  },
  {
    id: itemsIds.municao9mmId, table_id: mainGameTableId, name: 'Munição 9mm',
    kind: 'equipment', category: 'Consumable', weight_lb: 0.02, cost: 1,
    dimensions: '3cm', description: 'Cartuchos 9mm para pistolas e submetralhadoras.',
    quality: 'standard', condition: 'new', tech_level: 'TL8'
  },
  {
    id: itemsIds.granadaFumacaId, table_id: mainGameTableId, name: 'Granada de Fumaça',
    kind: 'equipment', category: 'Consumable', weight_lb: 1, cost: 60,
    dimensions: '12cm', description: 'Uma granada que libera uma densa cortina de fumaça ao detonar.',
    quality: 'standard', condition: 'new', tech_level: 'TL7'
  },
  {
    id: itemsIds.granadaFragmentacaoId, table_id: mainGameTableId, name: 'Granada de Fragmentação',
    kind: 'equipment', category: 'Consumable', weight_lb: 1, cost: 80,
    dimensions: '12cm', description: 'Uma granada de estilhaços letal dentro de um raio de alguns metros.',
    quality: 'standard', condition: 'new', tech_level: 'TL7'
  }
]

export const weapons: SeedWeapon[] = [
  {
    id: itemsIds.shortSwordWeaponId, item_id: itemsIds.shortSwordId,
    skill: 'Espada Curta', min_st: 7, rated_st: null, handedness: 1,
    reach: '1', parry: '0', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.handAxeWeaponId, item_id: itemsIds.handAxeId,
    skill: 'Machado', min_st: 11, rated_st: null, handedness: 1,
    reach: '1', parry: '0U', block: null, fit: 'normal'
  },
  {
    id: itemsIds.daggerWeaponId, item_id: itemsIds.daggerId,
    skill: 'Faca', min_st: 5, rated_st: null, handedness: 1,
    reach: 'C', parry: '-1', block: null, fit: 'normal'
  },
  {
    id: itemsIds.mediumShieldWeaponId, item_id: itemsIds.mediumShieldId,
    skill: 'Escudo', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: '3', fit: 'normal'
  },
  {
    id: itemsIds.pistolWeaponId, item_id: itemsIds.pistolId,
    skill: 'Armas de Fogo (Pistola)', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.recurveBowWeaponId, item_id: itemsIds.recurveBowId,
    skill: 'Arco', min_st: 7, rated_st: 10, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.wizardStaffWeaponId, item_id: itemsIds.wizardStaffId,
    skill: 'Bastão', min_st: 5, rated_st: null, handedness: 2,
    reach: 'C,1', parry: '2', block: null, fit: 'normal'
  },
  {
    id: itemsIds.arcanistStaffWeaponId, item_id: itemsIds.arcanistStaffId,
    skill: 'Bastão', min_st: 6, rated_st: null, handedness: 2,
    reach: 'C,1', parry: '2', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.arcaneDaggerWeaponId, item_id: itemsIds.arcaneDaggerId,
    skill: 'Faca', min_st: 5, rated_st: null, handedness: 1,
    reach: 'C', parry: '0', block: null, fit: 'normal'
  },
  // ---- lanças ----
  {
    id: itemsIds.lancaWeaponId, item_id: itemsIds.lancaId,
    skill: 'Lança', min_st: 9, rated_st: null, handedness: 1,
    reach: '1', parry: '0', block: null, fit: 'normal'
  },
  {
    id: itemsIds.lancaCombateWeaponId, item_id: itemsIds.lancaCombateId,
    skill: 'Lança', min_st: 11, rated_st: null, handedness: 2,
    reach: '2,3', parry: '0', block: null, fit: 'normal'
  },
  // ---- machados ----
  {
    id: itemsIds.machadoBatalhaWeaponId, item_id: itemsIds.machadoBatalhaId,
    skill: 'Machado', min_st: 11, rated_st: null, handedness: 1,
    reach: '1', parry: '0U', block: null, fit: 'normal'
  },
  {
    id: itemsIds.machadoArremessoWeaponId, item_id: itemsIds.machadoArremessoId,
    skill: 'Machado', min_st: 11, rated_st: null, handedness: 1,
    reach: '1', parry: '0', block: null, fit: 'normal'
  },
  {
    id: itemsIds.machadoGrandeWeaponId, item_id: itemsIds.machadoGrandeId,
    skill: 'Machado de Duas Mãos', min_st: 12, rated_st: null, handedness: 2,
    reach: '1,2', parry: '0U', block: null, fit: 'normal'
  },
  // ---- espadas ----
  {
    id: itemsIds.espadaLongaWeaponId, item_id: itemsIds.espadaLongaId,
    skill: 'Espada Longa', min_st: 10, rated_st: null, handedness: 1,
    reach: '1', parry: '0', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.espadaBastardaWeaponId, item_id: itemsIds.espadaBastardaId,
    skill: 'Espada de Duas Mãos', min_st: 11, rated_st: null, handedness: 2,
    reach: '1,2', parry: '0', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.montanteWeaponId, item_id: itemsIds.montanteId,
    skill: 'Espada de Duas Mãos', min_st: 12, rated_st: null, handedness: 2,
    reach: '1,2', parry: '0', block: null, fit: 'normal'
  },
  {
    id: itemsIds.rapieiraWeaponId, item_id: itemsIds.rapieiraId,
    skill: 'Esgrima', min_st: 9, rated_st: null, handedness: 1,
    reach: '1,2', parry: '0F', block: null, fit: 'tailored'
  },
  {
    id: itemsIds.sabreWeaponId, item_id: itemsIds.sabreId,
    skill: 'Sabre', min_st: 9, rated_st: null, handedness: 1,
    reach: '1', parry: '0', block: null, fit: 'normal'
  },
  // ---- maças e martelos ----
  {
    id: itemsIds.macaWeaponId, item_id: itemsIds.macaId,
    skill: 'Machado ou Maça', min_st: 11, rated_st: null, handedness: 1,
    reach: '1', parry: '0U', block: null, fit: 'normal'
  },
  {
    id: itemsIds.marteloGuerraWeaponId, item_id: itemsIds.marteloGuerraId,
    skill: 'Machado ou Maça', min_st: 11, rated_st: null, handedness: 1,
    reach: '1', parry: '0U', block: null, fit: 'normal'
  },
  // ---- armas de haste ----
  {
    id: itemsIds.alabardaWeaponId, item_id: itemsIds.alabardaId,
    skill: 'Armas de Haste', min_st: 12, rated_st: null, handedness: 2,
    reach: '2,3', parry: '0U', block: null, fit: 'normal'
  },
  // ---- facas ----
  {
    id: itemsIds.facaCombateWeaponId, item_id: itemsIds.facaCombateId,
    skill: 'Faca', min_st: 6, rated_st: null, handedness: 1,
    reach: 'C', parry: '-1', block: null, fit: 'normal'
  },
  {
    id: itemsIds.facaoWeaponId, item_id: itemsIds.facaoId,
    skill: 'Faca', min_st: 6, rated_st: null, handedness: 1,
    reach: 'C', parry: '-1', block: null, fit: 'normal'
  },
  {
    id: itemsIds.facaCacaWeaponId, item_id: itemsIds.facaCacaId,
    skill: 'Faca', min_st: 5, rated_st: null, handedness: 1,
    reach: 'C', parry: '-1', block: null, fit: 'normal'
  },
  {
    id: itemsIds.punhalWeaponId, item_id: itemsIds.punhalId,
    skill: 'Faca', min_st: 5, rated_st: null, handedness: 1,
    reach: 'C', parry: '-1', block: null, fit: 'normal'
  },
  // ---- projéteis primitivos ----
  {
    id: itemsIds.bestaWeaponId, item_id: itemsIds.bestaId,
    skill: 'Besta', min_st: 7, rated_st: 7, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.arcoLongoWeaponId, item_id: itemsIds.arcoLongoId,
    skill: 'Arco', min_st: 11, rated_st: 11, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'tailored'
  },
  // ---- armas de fogo ----
  {
    id: itemsIds.pistola9mmWeaponId, item_id: itemsIds.pistola9mmId,
    skill: 'Armas de Fogo (Pistola)', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.revolver38WeaponId, item_id: itemsIds.revolver38Id,
    skill: 'Armas de Fogo (Revólver)', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.revolver357WeaponId, item_id: itemsIds.revolver357Id,
    skill: 'Armas de Fogo (Revólver)', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.espingarda12WeaponId, item_id: itemsIds.espingarda12Id,
    skill: 'Armas de Fogo (Espingarda)', min_st: 10, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.mosqueteWeaponId, item_id: itemsIds.mosqueteId,
    skill: 'Armas de Fogo (Mosquete)', min_st: 11, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.bacamarteWeaponId, item_id: itemsIds.bacamarteId,
    skill: 'Armas de Fogo (Mosquete)', min_st: 10, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.submetralhadoraWeaponId, item_id: itemsIds.submetralhadoraId,
    skill: 'Armas de Fogo (Submetralhadora)', min_st: 9, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.fuzilFerrolhoWeaponId, item_id: itemsIds.fuzilFerrolhoId,
    skill: 'Armas de Fogo (Fuzil)', min_st: 10, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.fuzilAssaltoWeaponId, item_id: itemsIds.fuzilAssaltoId,
    skill: 'Armas de Fogo (Fuzil)', min_st: 9, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.riflePrecisaoWeaponId, item_id: itemsIds.riflePrecisaoId,
    skill: 'Armas de Fogo (Fuzil)', min_st: 11, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  {
    id: itemsIds.metralhadoraLeveWeaponId, item_id: itemsIds.metralhadoraLeveId,
    skill: 'Armas de Fogo (Metralhadora)', min_st: 12, rated_st: null, handedness: 2,
    reach: 'C', parry: 'No', block: null, fit: 'normal'
  },
  // ---- escudos ----
  {
    id: itemsIds.escudoPequenoWeaponId, item_id: itemsIds.escudoPequenoId,
    skill: 'Escudo', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: '1', fit: 'normal'
  },
  {
    id: itemsIds.escudoGrandeWeaponId, item_id: itemsIds.escudoGrandeId,
    skill: 'Escudo', min_st: null, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: '3', fit: 'normal'
  },
  {
    id: itemsIds.escudoTorreWeaponId, item_id: itemsIds.escudoTorreId,
    skill: 'Escudo', min_st: 10, rated_st: null, handedness: 1,
    reach: 'C', parry: 'No', block: '4', fit: 'normal'
  }
]

export const weaponAttacks: SeedAttack[] = [
  // Espada Curta: Swing SW+1 CUT | Thrust THR IMP
  {
    id: itemsIds.shortSwordSwingId, weapon_id: itemsIds.shortSwordWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.shortSwordThrustId, weapon_id: itemsIds.shortSwordWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  // Machado de Mão: Swing SW+2 CUT | Thrust THR-1 IMP
  {
    id: itemsIds.handAxeSwingId, weapon_id: itemsIds.handAxeWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 2,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.handAxeThrustId, weapon_id: itemsIds.handAxeWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: -1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  // Adaga: Swing SW-3 CUT | Thrust THR IMP
  {
    id: itemsIds.daggerSwingId, weapon_id: itemsIds.daggerWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: -3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.daggerThrustId, weapon_id: itemsIds.daggerWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Escudo Médio: Bash base SW-2 CR
  {
    id: itemsIds.mediumShieldBashId, weapon_id: itemsIds.mediumShieldWeaponId,
    name: 'Golpe de Escudo', usage: null, damage_source: 'st_swing', damage_modifier: -2,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Pistola (.45): dano fixo 2d+1 PI
  {
    id: itemsIds.pistolShotId, weapon_id: itemsIds.pistolWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 1,
    damage_dice: '2d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 2, range: '150/1600', recoil: 3, shots: 7
  },
  // Arco Recurvo: baseado no Rated ST (THR @ rated_st) IMP
  {
    id: itemsIds.recurveBowShotId, weapon_id: itemsIds.recurveBowWeaponId,
    name: 'Disparo', usage: null, damage_source: 'rated_st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: 2, range: '150/200', recoil: null, shots: 1
  },
  // Cajado de Mago: Swing SW+1 CR | Thrust THR+1 CR
  {
    id: itemsIds.wizardStaffSwingId, weapon_id: itemsIds.wizardStaffWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C,1', recoil: null, shots: null
  },
  {
    id: itemsIds.wizardStaffThrustId, weapon_id: itemsIds.wizardStaffWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Cajado do Arcanista: Swing SW+2 CR | Thrust THR+1 CR
  {
    id: itemsIds.arcanistStaffSwingId, weapon_id: itemsIds.arcanistStaffWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 2,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C,1', recoil: null, shots: null
  },
  {
    id: itemsIds.arcanistStaffThrustId, weapon_id: itemsIds.arcanistStaffWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // Adaga Arcana: Swing SW-3 CUT | Thrust THR+1 IMP
  {
    id: itemsIds.arcaneDaggerSwingId, weapon_id: itemsIds.arcaneDaggerWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: -3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.arcaneDaggerThrustId, weapon_id: itemsIds.arcaneDaggerWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },

  // ================== LANÇAS ==================
  {
    id: itemsIds.lancaThrust1Id, weapon_id: itemsIds.lancaWeaponId,
    name: 'Estocada (1 mão)', usage: 'one-hand', damage_source: 'st_thrust', damage_modifier: 2,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '1', recoil: null, shots: null
  },
  {
    id: itemsIds.lancaThrust2Id, weapon_id: itemsIds.lancaWeaponId,
    name: 'Estocada (2 mãos)', usage: 'two-hand', damage_source: 'st_thrust', damage_modifier: 3,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  {
    id: itemsIds.lancaThrowId, weapon_id: itemsIds.lancaWeaponId,
    name: 'Arremesso', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: 2, range: 'STx2/STx3', recoil: null, shots: 1
  },
  {
    id: itemsIds.lancaCombateThrustId, weapon_id: itemsIds.lancaCombateWeaponId,
    name: 'Estocada', usage: 'two-hand', damage_source: 'st_thrust', damage_modifier: 3,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '2,3', recoil: null, shots: null
  },
  // ================== MACHADOS ==================
  {
    id: itemsIds.machadoBatalhaSwingId, weapon_id: itemsIds.machadoBatalhaWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.machadoArremessoSwingId, weapon_id: itemsIds.machadoArremessoWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.machadoArremessoThrowId, weapon_id: itemsIds.machadoArremessoWeaponId,
    name: 'Arremesso', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: 2, range: 'STx2/STx3', recoil: null, shots: 1
  },
  {
    id: itemsIds.machadoGrandeSwingId, weapon_id: itemsIds.machadoGrandeWeaponId,
    name: 'Golpe', usage: 'two-hand', damage_source: 'st_swing', damage_modifier: 3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  // ================== ESPADAS ==================
  {
    id: itemsIds.espadaLongaSwingId, weapon_id: itemsIds.espadaLongaWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.espadaLongaThrustId, weapon_id: itemsIds.espadaLongaWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 2,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.espadaBastardaSwing1Id, weapon_id: itemsIds.espadaBastardaWeaponId,
    name: 'Golpe (1 mão)', usage: 'one-hand', damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: '1', recoil: null, shots: null
  },
  {
    id: itemsIds.espadaBastardaSwing2Id, weapon_id: itemsIds.espadaBastardaWeaponId,
    name: 'Golpe (2 mãos)', usage: 'two-hand', damage_source: 'st_swing', damage_modifier: 2,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  {
    id: itemsIds.espadaBastardaThrustId, weapon_id: itemsIds.espadaBastardaWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 2,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  {
    id: itemsIds.montanteSwingId, weapon_id: itemsIds.montanteWeaponId,
    name: 'Golpe', usage: 'two-hand', damage_source: 'st_swing', damage_modifier: 3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  {
    id: itemsIds.montanteThrustId, weapon_id: itemsIds.montanteWeaponId,
    name: 'Estocada', usage: 'two-hand', damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  {
    id: itemsIds.rapieiraThrustId, weapon_id: itemsIds.rapieiraWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '1,2', recoil: null, shots: null
  },
  {
    id: itemsIds.rapieiraSwingId, weapon_id: itemsIds.rapieiraWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: -1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.sabreSwingId, weapon_id: itemsIds.sabreWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.sabreThrustId, weapon_id: itemsIds.sabreWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  // ================== MAÇAS E MARTELOS ==================
  {
    id: itemsIds.macaSwingId, weapon_id: itemsIds.macaWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 3,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  {
    id: itemsIds.marteloGuerraSwingId, weapon_id: itemsIds.marteloGuerraWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: 3,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'Melee', recoil: null, shots: null
  },
  // ================== ARMAS DE HASTE ==================
  {
    id: itemsIds.alabardaSwingId, weapon_id: itemsIds.alabardaWeaponId,
    name: 'Golpe', usage: 'two-hand', damage_source: 'st_swing', damage_modifier: 4,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: '2,3', recoil: null, shots: null
  },
  {
    id: itemsIds.alabardaThrustId, weapon_id: itemsIds.alabardaWeaponId,
    name: 'Estocada', usage: 'two-hand', damage_source: 'st_thrust', damage_modifier: 3,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: '2,3', recoil: null, shots: null
  },
  // ================== FACAS ==================
  {
    id: itemsIds.facaCombateSwingId, weapon_id: itemsIds.facaCombateWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: -1,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.facaCombateThrustId, weapon_id: itemsIds.facaCombateWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.facaoSwingId, weapon_id: itemsIds.facaoWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: -2,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.facaoThrustId, weapon_id: itemsIds.facaoWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.facaCacaSwingId, weapon_id: itemsIds.facaCacaWeaponId,
    name: 'Golpe', usage: null, damage_source: 'st_swing', damage_modifier: -3,
    damage_dice: null, damage_type: 'cut', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.facaCacaThrustId, weapon_id: itemsIds.facaCacaWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.punhalThrustId, weapon_id: itemsIds.punhalWeaponId,
    name: 'Estocada', usage: null, damage_source: 'st_thrust', damage_modifier: -1,
    damage_dice: null, damage_type: 'imp', armor_penetration: 1,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  // ================== PROJÉTEIS PRIMITIVOS ==================
  {
    id: itemsIds.bestaShotId, weapon_id: itemsIds.bestaWeaponId,
    name: 'Disparo', usage: null, damage_source: 'rated_st_thrust', damage_modifier: 4,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: 4, range: '250/300', recoil: null, shots: 1
  },
  {
    id: itemsIds.arcoLongoShotId, weapon_id: itemsIds.arcoLongoWeaponId,
    name: 'Disparo', usage: null, damage_source: 'rated_st_thrust', damage_modifier: 0,
    damage_dice: null, damage_type: 'imp', armor_penetration: 0,
    accuracy: 3, range: '225/300', recoil: null, shots: 1
  },
  // ================== ARMAS DE FOGO ==================
  {
    id: itemsIds.pistola9mmShotId, weapon_id: itemsIds.pistola9mmWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 2,
    damage_dice: '2d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 2, range: '150/1850', recoil: 2, shots: 15
  },
  {
    id: itemsIds.revolver38ShotId, weapon_id: itemsIds.revolver38WeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: -1,
    damage_dice: '2d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 2, range: '130/1500', recoil: 2, shots: 6
  },
  {
    id: itemsIds.revolver357ShotId, weapon_id: itemsIds.revolver357WeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: -1,
    damage_dice: '3d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 2, range: '175/2000', recoil: 3, shots: 6
  },
  {
    id: itemsIds.espingarda12ShotId, weapon_id: itemsIds.espingarda12WeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 1,
    damage_dice: '1d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 3, range: '40/800', recoil: 1, shots: 5
  },
  {
    id: itemsIds.mosqueteShotId, weapon_id: itemsIds.mosqueteWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 0,
    damage_dice: '4d', damage_type: 'pi+', armor_penetration: 0,
    accuracy: 2, range: '100/1200', recoil: 4, shots: 1
  },
  {
    id: itemsIds.bacamarteShotId, weapon_id: itemsIds.bacamarteWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 2,
    damage_dice: '1d', damage_type: 'pi+', armor_penetration: 0,
    accuracy: 1, range: '20/200', recoil: 3, shots: 1
  },
  {
    id: itemsIds.submetralhadoraShotId, weapon_id: itemsIds.submetralhadoraWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: -1,
    damage_dice: '3d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 3, range: '160/1900', recoil: 2, shots: 30
  },
  {
    id: itemsIds.fuzilFerrolhoShotId, weapon_id: itemsIds.fuzilFerrolhoWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 0,
    damage_dice: '6d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 5, range: '800/3500', recoil: 4, shots: 5
  },
  {
    id: itemsIds.fuzilAssaltoShotId, weapon_id: itemsIds.fuzilAssaltoWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 0,
    damage_dice: '5d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 5, range: '500/3500', recoil: 2, shots: 30
  },
  {
    id: itemsIds.riflePrecisaoShotId, weapon_id: itemsIds.riflePrecisaoWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 2,
    damage_dice: '6d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 6, range: '1000/4200', recoil: 3, shots: 5
  },
  {
    id: itemsIds.metralhadoraLeveShotId, weapon_id: itemsIds.metralhadoraLeveWeaponId,
    name: 'Disparo', usage: null, damage_source: 'fixed', damage_modifier: 2,
    damage_dice: '6d', damage_type: 'pi', armor_penetration: 0,
    accuracy: 5, range: '800/3800', recoil: 2, shots: 100
  },
  // ================== ESCUDOS ==================
  {
    id: itemsIds.escudoPequenoBashId, weapon_id: itemsIds.escudoPequenoWeaponId,
    name: 'Golpe de Escudo', usage: null, damage_source: 'st_swing', damage_modifier: -3,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.escudoGrandeBashId, weapon_id: itemsIds.escudoGrandeWeaponId,
    name: 'Golpe de Escudo', usage: null, damage_source: 'st_swing', damage_modifier: -2,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  },
  {
    id: itemsIds.escudoTorreBashId, weapon_id: itemsIds.escudoTorreWeaponId,
    name: 'Golpe de Escudo', usage: null, damage_source: 'st_swing', damage_modifier: -1,
    damage_dice: null, damage_type: 'cr', armor_penetration: 0,
    accuracy: null, range: 'C', recoil: null, shots: null
  }
]

export const armors: SeedArmor[] = [
  { id: itemsIds.leatherArmorDefId, item_id: itemsIds.leatherArmorId, dr: 2, flex: 0, locations: 'torso', fit: 'normal' },
  { id: itemsIds.galhornLeatherArmorDefId, item_id: itemsIds.galhornLeatherArmorId, dr: 2, flex: 0, locations: 'torso', fit: 'tailored' },
  { id: itemsIds.leatherBracersDefId, item_id: itemsIds.leatherBracersId, dr: 2, flex: 0, locations: 'arms', fit: 'normal' },
  { id: itemsIds.leatherBootsDefId, item_id: itemsIds.leatherBootsId, dr: 2, flex: 0, locations: 'legs,feet', fit: 'normal' },
  { id: itemsIds.kaelLeatherArmorDefId, item_id: itemsIds.kaelLeatherArmorId, dr: 2, flex: 0, locations: 'torso', fit: 'tailored' },
  { id: itemsIds.robesDefId, item_id: itemsIds.robesId, dr: 0, flex: 1, locations: 'full_body', fit: 'loose' },
  { id: itemsIds.mediumShieldDefId, item_id: itemsIds.mediumShieldId, dr: 6, flex: 0, locations: 'arm', fit: 'normal' },
  // ---- escudos ----
  { id: itemsIds.escudoPequenoDefId, item_id: itemsIds.escudoPequenoId, dr: 4, flex: 0, locations: 'arm', fit: 'normal' },
  { id: itemsIds.escudoGrandeDefId, item_id: itemsIds.escudoGrandeId, dr: 7, flex: 0, locations: 'arm', fit: 'normal' },
  { id: itemsIds.escudoTorreDefId, item_id: itemsIds.escudoTorreId, dr: 9, flex: 0, locations: 'arm', fit: 'normal' },
  // ---- armaduras ----
  { id: itemsIds.acolchoadaDefId, item_id: itemsIds.acolchoadaId, dr: 1, flex: 1, locations: 'torso,arms', fit: 'normal' },
  { id: itemsIds.cotaMalhaDefId, item_id: itemsIds.cotaMalhaId, dr: 4, flex: 1, locations: 'torso,arms', fit: 'normal' },
  { id: itemsIds.cotaEscamasDefId, item_id: itemsIds.cotaEscamasId, dr: 4, flex: 0, locations: 'torso', fit: 'normal' },
  { id: itemsIds.peitoralAcoDefId, item_id: itemsIds.peitoralAcoId, dr: 5, flex: 0, locations: 'torso', fit: 'normal' },
  { id: itemsIds.armaduraPlacasDefId, item_id: itemsIds.armaduraPlacasId, dr: 7, flex: 0, locations: 'torso,arms,legs', fit: 'tailored' },
  { id: itemsIds.elmoAcoDefId, item_id: itemsIds.elmoAcoId, dr: 5, flex: 0, locations: 'skull', fit: 'normal' },
  { id: itemsIds.manoplasAcoDefId, item_id: itemsIds.manoplasAcoId, dr: 4, flex: 0, locations: 'hands', fit: 'normal' },
  { id: itemsIds.caneleirasDefId, item_id: itemsIds.caneleirasId, dr: 4, flex: 0, locations: 'legs', fit: 'normal' },
  { id: itemsIds.coleteBalisticoDefId, item_id: itemsIds.coleteBalisticoId, dr: 8, flex: 1, locations: 'torso', fit: 'normal' },
  { id: itemsIds.coleteTaticoDefId, item_id: itemsIds.coleteTaticoId, dr: 12, flex: 0, locations: 'torso', fit: 'tailored' }
]
