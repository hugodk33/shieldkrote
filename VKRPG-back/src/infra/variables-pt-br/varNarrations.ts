import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import { narration1, narration2, narration3, narration4, narration5, narration6, narration7, narration8, narration9 } from "./MainUUIDIds/uuidNarrations"
import { scenes } from "./varScenes"

type SeedNarration= {
  id: string
  table_id: string
  scene_id: string
  title: string
  narration: string
  moment: number
}

export const  narrations: SeedNarration[] = [
  {
    id: narration1,
    table_id: mainGameTableId,
    scene_id: scenes[0].id,
    title: 'Encontro na Taberna do Caneco Sombrio',
    narration: 'O grupo se reúne num canto sombrio da taberna do Caneco Sombrio, onde um agente da guilda encapuzado desliza um pergaminho sobre a mesa. Três pessoas desapareceram do Beco dos Ferreiros nas últimas duas semanas. A guarda da cidade não tem nenhuma pista. Pagamento: 200 moedas de ouro na conclusão.',
    moment: 0
  },
  {
    id: narration2,
    table_id: mainGameTableId,
    scene_id: scenes[1].id,
    title: 'O Beco',
    narration: 'O Beco dos Ferreiros fede a pedra úmida e à fumaça das forjas próximas. Uma névoa densa adere aos seixos enquanto o grupo se espalha para procurar pistas. Um pedaço rasgado de tecido fica preso num gancho de ferro pontiagudo — bordado com um símbolo que o agente da guilda descreveu.',
    moment: 0
  },
  {
    id: narration3,
    table_id: mainGameTableId,
    scene_id: scenes[1].id,
    title: 'Emboscada!',
    narration: 'Antes que o grupo possa examinar o tecido mais de perto, botas pesadas ecoam nas duas extremidades do beco. Duas figuras emergem da névoa — Thorne Black e Riven Kael, com lâminas em punho. É uma armadilha.',
    moment: 1
  },
  {
    id: narration4,
    table_id: mainGameTableId,
    scene_id: scenes[2].id,
    title: 'Rumo às Profundezas',
    narration: 'Atrás de uma pedra solta na parede do beco, o grupo descobre uma escadaria oculta que serpenteia rumo à escuridão. O ar fica denso e úmido, carregando o cheiro de terra antiga e magia esquecida. Ecos fracos sugerem que os túneis não estão tão abandonados quanto parecem.',
    moment: 0
  },
  {
    id: narration5,
    table_id: mainGameTableId,
    scene_id: scenes[2].id,
    title: 'A Travessia Subterrânea',
    narration: 'O túnel se abre numa ampla câmara sustentada por pilares de pedra em ruínas. Uma estreita ponte de pedra atravessa um abismo escuro lá embaixo. Glifos estranhos brilham fracamente nas paredes — de origem nem anã nem humana.',
    moment: 1
  },
  {
    id: narration6,
    table_id: mainGameTableId,
    scene_id: scenes[3].id,
    title: 'O Templo Revelado',
    narration: 'Além dos túneis estende-se um vasto templo subterrâneo, cuja arquitetura é antiga e alheia. No centro, um cristal pulsante paira sobre um altar — a fonte dos desaparecimentos. Selene Voss está diante dele, entoando um cântico numa língua desconhecida.',
    moment: 0
  },
  {
    id: narration7,
    table_id: mainGameTableId,
    scene_id: scenes[1].id,
    title: 'A Escadaria Oculta',
    narration: 'Os emboscadores desaparecem na névoa, deixando o beco a vibra em silêncio. Testando a pedra solta atrás da banca da forja, Kael encontra a fresta de uma escadaria oculta que serpenteia rumo ao escuro — degraus gastos, ossos antigos e uma corrente de ar fria trazendo o cheiro de terra ancestral. O símbolo no degrau corresponde àquele que o agente da guilda descreveu.',
    moment: 2
  },
  {
    id: narration8,
    table_id: mainGameTableId,
    scene_id: scenes[2].id,
    title: 'A Perseguição nos Túneis',
    narration: 'Algo se move nos túneis atrás deles. Pedra range contra pedra e a brutamontes da travessia avança cambaleante, com a respiração roncando no escuro. O grupo precisa alcançar o cofre do templo antes que o túnel os encurrale.',
    moment: 2
  },
  {
    id: narration9,
    table_id: mainGameTableId,
    scene_id: scenes[3].id,
    title: 'O Cristal se Estilhaça',
    narration: 'A sílaba final deixa os lábios de Selene e o cristal irrompe em violeta. O grupo carrega através da onda de magia — o altar racha, o cântico se interrompe, e a falsa maga rosna enquanto seu ritual se desfaz em fumaça.',
    moment: 1
  }
]
