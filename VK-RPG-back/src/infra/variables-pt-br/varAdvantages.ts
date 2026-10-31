import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import * as advantagesIds from "./MainUUIDIds/uuidAdvantages"

type SeedModifierGameTableAdvantages = {
  id: string
  table_id: string
  name: string
  costPoints: number
  description: string
}

export const advantages: SeedModifierGameTableAdvantages[] = [
  {
    id: advantagesIds.advantageCombatReflexesId,
    table_id: mainGameTableId,
    name: 'Reflexos de Combate',
    costPoints: 15,
    description: 'Sem penalidade por surpresa e reação de combate mais rápida.'
  },
  {
    id: advantagesIds.advantageVeryFitId,
    table_id: mainGameTableId,
    name: 'Muito em Forma',
    costPoints: 10,
    description: '+2 de Fadiga, recuperação mais rápida.'
  },
  {
    id: advantagesIds.advantageMageryId,
    table_id: mainGameTableId,
    name: 'Magia 1',
    costPoints: 25,
    description: 'Acesso básico ao lançamento de magias e rituais.'
  },
  // Additional GURPS advantages from var-advantages.ts
  {
    id: advantagesIds.advantageAbsoluteDirectionId,
    table_id: mainGameTableId,
    name: 'Direção Absoluta',
    costPoints: 5,
    description: 'O personagem sempre sabe onde fica o Norte e sempre consegue refazer um trajeto percorrido nos últimos 30 dias. +3 de bônus na perícia de Navegação. Funciona no subsolo, debaixo d\'água e em outros planetas.'
  },
    {
        id: advantagesIds.advantageFlexibilityId,
        table_id: mainGameTableId,
        name: 'Flexibilidade',
        costPoints: 5,
        description: 'O personagem tem um corpo flexível e bem condicionado. +3 de bônus nas perícias de Escalada e Fuga.'
    },
    {
        id: crypto.randomUUID(),
        table_id: mainGameTableId,
        name: 'Dupla Articulação',
        costPoints: 5,
        description: 'O corpo do personagem é extraordinariamente flexível. Ele recebe um bônus igual a +3 em qualquer tentativa de Fuga ou de se soltar de cordas, algemas ou outros meios semelhantes de restrição de movimento, e também em testes de Mecânica.'
    },
  {
    id: advantagesIds.advantageEideticMemoryId,
    table_id: mainGameTableId,
    name: 'Memória Eidética',
    costPoints: 30,
    description: 'O personagem é capaz de lembrar de tudo que viu ou ouviu. Primeiro nível (30 pontos): Todos os pontos em perícias mentais contam em dobro. Segundo nível (60 pontos): Todos os pontos em perícias mentais contam em quadruplo.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Empatia',
    costPoints: 15,
    description: 'O personagem tem uma \'sensibilidade\' para com as outras pessoas. Quando ele conhece alguém pela primeira vez, o mestre dirá o que o personagem \'sente\' a respeito daquela pessoa. Excelente para identificar impostores e determinar lealdade.'
  },
  {
    id: advantagesIds.advantageHighPainThresholdId,
    table_id: mainGameTableId,
    name: 'Alto Limiar de Dor',
    costPoints: 10,
    description: 'O personagem não sente dor com a mesma intensidade. Ele não ficará atordoado, e seu DX não estará sujeito à penalidade normal aplicada no turno seguinte se ferido em combate.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Imunidade',
    costPoints: 10,
    description: 'Seu corpo resiste naturalmente aos microorganismos que causam doenças. Você nunca contrai uma doença ou infecção \'natural\'. Você não pode adquirir esta vantagem a menos que seu HT inicial seja 12 ou maior.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Intuição',
    costPoints: 15,
    description: 'O personagem costuma acertar em suas conjecturas. O mestre soma seu IQ ao número de escolhas \'corretas\', subtrai o número de escolhas \'incorretas\' e faz um teste. Um sucesso fará com que ele indique ao personagem uma opção favorável.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Talento para Idiomas',
    costPoints: 2,
    description: 'Você aprende idiomas rapidamente. Some o nível de Talento para Idiomas ao seu atributo IQ sempre que estiver aprendendo um idioma. Custo: 2 pontos por ponto de bônus.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Poderes de Autoridade Legal',
    costPoints: 5,
    description: 'Você é um agente da lei, com todos os direitos, poderes e restrições que acompanham o cargo. Custo: 5 pontos para jurisdição local, 10 pontos para nacional/internacional, 15 pontos para privilégios especiais.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Calculadora Relâmpago',
    costPoints: 5,
    description: 'O personagem é capaz de realizar operações matemáticas instantaneamente de cabeça. O jogador pode usar uma calculadora a qualquer momento, para calcular o que desejar.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Alfabetização',
    costPoints: 10,
    description: 'Saber ler e escrever em um mundo onde a maioria das pessoas não sabe é uma vantagem que vale 10 pontos. Ser analfabeto em um mundo onde a maioria das pessoas sabe ler é uma desvantagem que vale -10 pontos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Longevidade',
    costPoints: 5,
    description: 'Sua expectativa de vida é naturalmente longa. Você só falhará nos testes de envelhecimento se obtiver um resultado igual a 17 ou 18. Um personagem com esta vantagem não receberá nenhum ponto ao assumir a desvantagem Idade.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Sorte',
    costPoints: 15,
    description: 'Uma vez por hora de jogo, você pode fazer até três testes de algo e escolher o melhor resultado. Custo: 15 pontos. Sorte Extraordinária (30 pontos): Pode ser usada a cada 30 minutos em vez de uma hora.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Aptidão Mágica',
    costPoints: 15,
    description: 'Você tem um bônus no aprendizado de todas as operações mágicas. Ao aprender qualquer operação mágica, você o fará como se sua Inteligência fosse igual a (IQ + Aptidão). Custo: 15 pontos para o primeiro nível; 10 pontos para cada nível seguinte, até um máximo de 3 níveis.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Resistência à Magia',
    costPoints: 2,
    description: 'Você tem maior chance de não ser afetado pela maioria dos tipos de magia. Seu nível de Resistência à Magia é subtraído da perícia de quem executa a operação contra você. Custo: 2 pontos por nível.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Talento Matemático',
    costPoints: 10,
    description: 'Esta vantagem garante um bônus de +3 em qualquer teste de perícia com perícias matemáticas ou relacionadas à computação (exceto Operação de Computador) e um bônus de +2 naquelas relacionadas a Engenharia em NT6+.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Patente Militar',
    costPoints: 5,
    description: 'Você tem uma patente militar que confere certos privilégios e autoridade. Custo: 5 pontos por nível.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Talento Musical',
    costPoints: 1,
    description: 'Você tem um talento natural para música e instrumentos musicais. Seu nível de perícia musical deve ser somado ao seu atributo IQ ao estudar Canto ou qualquer instrumento musical. Custo: 1 ponto por ponto de bônus.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Visão Noturna',
    costPoints: 10,
    description: 'Seus olhos se adaptam rapidamente à escuridão. Você é capaz de enxergar muito bem se houver qualquer luz. Sempre que o mestre exigir uma penalidade por causa da escuridão, exceto no caso de escuridão total, essa penalidade não se aplicará a você.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Visão Periférica',
    costPoints: 15,
    description: 'O personagem tem um campo de visão extraordinariamente amplo. Ele pode atacar tanto à direita quanto à esquerda, assim como à sua frente. Ele terá um ângulo de visão maior para ataques à distância.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Resistência Psíquica',
    costPoints: 2,
    description: 'A Resistência Psíquica interfere em todos os usos de poderes psíquicos feitos contra você. Seu nível de resistência é subtraído da perícia efetiva de qualquer tentativa psíquica em que você seja o alvo. Custo: 2 pontos por nível.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Cura Rápida',
    costPoints: 5,
    description: 'Esta vantagem só está disponível para personagens cujo atributo HT seja maior ou igual a 10. Quem a possui se recuperará rapidamente de todos os tipos de ferimentos. Some 5 ao seu HT efetivo ao fazer testes de recuperação.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Força de Vontade',
    costPoints: 4,
    description: 'O personagem tem muito mais determinação do que a pessoa média. Seu nível de Vontade é somado ao seu atributo IQ sempre que ele faz um teste de Vontade. Custo: 4 pontos por ponto de bônus.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Tenacidade',
    costPoints: 5,
    description: 'Sua pele e sua carne são mais resistentes do que as do ser humano médio. Seu próprio corpo possui Resistência a Danos. Essa RAD é subtraída do dano causado por qualquer golpe antes da multiplicação.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Passado Incomum',
    costPoints: 10,
    description: 'Esta é uma vantagem tipo \'depósito\' para passados incomuns que proporcionam benefícios especiais. O mestre determina o custo com base em quão incomum é o passado.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Voz',
    costPoints: 10,
    description: 'O personagem tem uma voz clara, atraente e ressonante. Ele recebe um bônus permanente igual a +2 em perícias como Bardo, Diplomacia, Atuação, Política, Manipulação Social, Atração Sexual e Canto.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Riqueza',
    costPoints: 5,
    description: 'A riqueza pode ser uma vantagem verdadeiramente maravilhosa. O custo em pontos depende do nível de riqueza e da ambientação da campanha. Veja a p. 16 para detalhes.'
  }
]
