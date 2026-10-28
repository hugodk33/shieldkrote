import * as skillsIds from './MainUUIDIds/uuidSkills'
import { mainGameTableId } from './MainUUIDIds/uuidGeral'

type SeedSkill = {
  id: string
  table_id: string
  name: string
  predefinition_type: string
  predefinition_difficulty: string
  description: string
}

export const  skills: SeedSkill[] = [
    {
        id: skillsIds.skillSwordsmanshipId,
        table_id: mainGameTableId,
        name: 'Espada',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'Uma perícia para lutar com espadas, incluindo técnicas de ataque e defesa.'
    },
    {
        id: skillsIds.skillBowsId,
        table_id: mainGameTableId,
        name: 'Arcos',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'Uma perícia para o uso de arcos e bestas, abrangendo mira, disparo e manutenção.'
    },
    {
        id: skillsIds.skillStealthId,
        table_id: mainGameTableId,
        name: 'Furtividade',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "A capacidade de se esconder e se mover silenciosamente. Um teste bem-sucedido indica que você pode se esconder em qualquer lugar, exceto em uma sala completamente vazia, ou se mover tão silenciosamente que ninguém te ouvirá, ou seguir alguém sem ser notado (para seguir alguém em uma multidão, use a perícia Perseguição). Modificadores: subtraia seu nível de Sobrecarga; -5 para se esconder em uma área sem esconderijos naturais; -5 para se mover silenciosamente se estiver correndo em vez de andando; -5 para enganar cães em vez de pessoas."
    },
    {
        id: skillsIds.skillTacticsId,
        table_id: mainGameTableId,
        name: 'Tática',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "A capacidade de planejar ações militares e prever as do inimigo. Normalmente ensinada apenas pelas forças armadas. Um teste de perícia bem-sucedido permite deduzir os planos militares do inimigo, a menos que eles sejam comandados por alguém com esta perícia. Nesse caso, o GM deve fazer um Contesto Rápido de Perícias entre os dois táticos. Se o personagem do jogador perder, fará uma conjectura incorreta sobre os planos do inimigo."
    },
    {
        id: skillsIds.skillMagicId,
        table_id: mainGameTableId,
        name: 'Magia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: 'Uma perícia para lançar feitiços e realizar rituais mágicos.'
    },
    {
        id: skillsIds.skillSingId,
        table_id: mainGameTableId,
        name: "Canto",
        predefinition_type: "Physical",
        predefinition_difficulty: "Easy",
        description: "O estudo desta perícia é baseado em HT, não em DX. Esta é a capacidade de cantar de forma agradável. Um sucesso em um teste de perícia significa que o público gostou da sua música. Modificadores: -2 se o público não entender o idioma em que você está cantando; +2 se você tiver a vantagem Voz Melódica."
    },
    {
        id: skillsIds.skillStrategyId,
        table_id: mainGameTableId,
        name: "Estratégia",
        predefinition_type: "Mental",
        predefinition_difficulty: "Hard",
        description: "A capacidade de planejar ações militares e prever as do inimigo. Normalmente ensinada apenas pelas forças armadas. Um teste de perícia bem-sucedido permite deduzir os planos militares do inimigo, a menos que eles sejam comandados por alguém com esta perícia. Nesse caso, o GM deve fazer um Contesto Rápido de Perícias entre os dois estrategistas. Se o personagem do jogador perder, fará uma conjectura incorreta sobre os planos do inimigo. A quantidade de informação obtida depende de quão bom foi o resultado do seu teste, mas não da qualidade dos planos do inimigo."
    },
    // Skills from var-skills.ts (translated to English)
    {
        id: skillsIds.skillAnimalTrainingId,
        table_id: mainGameTableId,
        name: 'Adestramento de Animais',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de adestrar e trabalhar com todos os tipos de animais. Para adestrar um animal, o adestrador deve ter sucesso em um teste de perícia a cada dia de treinamento. Uma falha significa que o animal não aprendeu nada. Uma falha crítica significa que o animal atacou o adestrador.'
    },
    {
        id: skillsIds.skillFalconryId,
        table_id: mainGameTableId,
        name: 'Falcoaria',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de caçar pequenos animais usando um falcão treinado. Um bom falconheiro conhece técnicas de caça e treinamento, além de saber cuidar de um falcão.'
    },
    {
        id: skillsIds.skillAnimalPackingId,
        table_id: mainGameTableId,
        name: 'Carregamento de Animais',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de carregar e descarregar animais rápida e eficientemente. Inclui a capacidade de avaliar corretamente os animais antes da compra, obter o melhor desempenho deles e selecionar as melhores rotas para caravanas.'
    },
    {
        id: skillsIds.skillRidingId,
        table_id: mainGameTableId,
        name: 'Cavalgar',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'Esta perícia é diferente para cada tipo de animal. Se você encontrar um animal de montaria com o qual não está familiarizado, use seu nível de perícia com o tipo de animal mais próximo. Modificadores: +5 se o animal conhece e gosta de você; -10 se o animal não for uma montaria "comum" ou não tiver sido treinado como tal.'
    },
    {
        id: skillsIds.skillTeamsterId,
        table_id: mainGameTableId,
        name: 'Carroceiro',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A perícia de conduzir juntas de animais, como uma carroça. Inclui a capacidade de engatar e cuidar dos animais, e avaliá-los antes da compra. Conduzir um grupo com mais de 4 animais, ou com animais desconhecidos, sujeita o personagem a uma penalidade de -2.'
    },
    {
        id: skillsIds.skillVeterinaryId,
        table_id: mainGameTableId,
        name: 'Veterinária',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de cuidar de animais feridos ou doentes. Esta é uma perícia Médica. Modificadores: +5 se o animal já conhece e confia em você; -2 ou pior se o animal for de um tipo com o qual você não está familiarizado.'
    },
    {
        id: skillsIds.skillArtistId,
        table_id: mainGameTableId,
        name: 'Artista',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de desenhar e pintar com beleza e precisão. Um sucesso em um teste de perícia pode significar que você fez um desenho bom o suficiente para ajudar a identificar uma pessoa, traçar um mapa fácil de seguir, ou mesmo pintar um quadro bom o suficiente para trocar por uma refeição.'
    },
    {
        id: skillsIds.skillBardId,
        table_id: mainGameTableId,
        name: 'Bardo',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de contar histórias e falar de forma improvisada. Um bom uso deste talento permitirá que você faça um bom discurso político, divirta um grupo de pessoas ao redor de uma fogueira, incite (ou acalme) uma revolta, ou tenha sucesso no papel de "bobo da corte".'
    },
    {
        id: skillsIds.skillDancingId,
        table_id: mainGameTableId,
        name: 'Dança',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de executar danças peculiares à sua própria cultura e aprender novos estilos rapidamente. Modificadores: -5 se a dança for desconhecida. Uma dança ficará familiar para você depois de executá-la com sucesso 3 vezes.'
    },
    {
        id: skillsIds.skillPoetryId,
        table_id: mainGameTableId,
        name: 'Poesia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de compor qualquer tipo de poesia conhecida em sua civilização com qualidade "boa", em qualquer idioma em que você seja fluente. Um teste de Poesia bem-sucedido significa que você compôs um bom poema em um tempo adequado.'
    },
    {
        id: skillsIds.skillSculptingId,
        table_id: mainGameTableId,
        name: 'Escultura',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de modelar uma imagem razoavelmente semelhante a um ser humano ou objeto, usando argila, madeira, marfim, ou o que estiver à mão. Para produzir uma escultura em metal, você precisa ter a perícia de forja.'
    },
    {
        id: skillsIds.skillWritingId,
        table_id: mainGameTableId,
        name: 'Escrita',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de escrever de forma clara e/ou divertida. Um sucesso em um teste de perícia significa que o trabalho é legível e preciso. Modificadores: -3 se você estiver com pressa; +3 se tiver tempo de sobra; -5 se estiver escrevendo sobre um assunto com o qual não está familiarizado.'
    },
    {
        id: skillsIds.skillAcrobaticsId,
        table_id: mainGameTableId,
        name: 'Acrobacia',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de realizar feitos acrobáticos e ginásticos, rolar, dar cambalhotas, etc. Um teste deve ser feito para cada truque que você tentar. Esta perícia pode ser conveniente em uma aventura; andar em corda bamba, pirâmides humanas e o trapézio têm aplicações práticas.'
    },
    {
        id: skillsIds.skillBreathControlId,
        table_id: mainGameTableId,
        name: 'Controle Respiratório',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: 'A capacidade de respirar da forma mais eficiente possível. Em um teste de perícia bem-sucedido, o personagem pode triplicar o tempo em que consegue prender a respiração, por qualquer motivo. Um sucesso também permite a recuperação de 1 ponto de fadiga em apenas dois minutos.'
    },
    {
        id: skillsIds.skillZeroGId,
        table_id: mainGameTableId,
        name: 'Gravidade Zero',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A perícia de lidar com um ambiente de gravidade zero (queda livre). Um teste é necessário quando você entra em queda livre pela primeira vez. Uma falha significa que você se sente enjoado, e um teste de HT bem-sucedido será necessário para evitar a asfixiação.'
    },
    {
        id: skillsIds.skillJumpingId,
        table_id: mainGameTableId,
        name: 'Salto',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'A perícia de fazer o melhor uso possível da sua força ao pular. Quando o personagem tenta um salto difícil, ele pode substituir seu nível de perícia de Salto por sua ST ou DX.'
    },
    {
        id: skillsIds.skillRunningId,
        table_id: mainGameTableId,
        name: 'Corrida',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: 'Esta perícia é baseada em HT, não em DX. Ela representa treinamento em corridas de curta e longa distância. Se você estudou este assunto, divida seu nível de perícia por 8 (não arredonde) e some o resultado ao seu parâmetro de Velocidade ao calcular seu Deslocamento.'
    },
    {
        id: skillsIds.skillDivingId,
        table_id: mainGameTableId,
        name: 'Mergulho',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de usar equipamento para respirar sob a água. Para evitar engolir água (o que resultaria em perda de 1 ponto de ST e risco de afogamento), você deve ter sucesso em um teste feito assim que entrar na água e em testes subsequentes feitos a cada 30 minutos.'
    },
    {
        id: skillsIds.skillSkiingId,
        table_id: mainGameTableId,
        name: 'Esqui',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de esquiar. Um teste de perícia é necessário quando você inicia uma descida, exceto em uma encosta muito fácil, e outro a cada 30 minutos. Uma falha significa que você cai. Em caso de falha crítica, você sofre 1D-1 pontos de dano a um membro escolhido aleatoriamente.'
    },
    {
        id: skillsIds.skillSwimmingId,
        table_id: mainGameTableId,
        name: 'Natação',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'Esta perícia é usada tanto para nadar (ou flutuar em casos de emergência) quanto para salvar uma vítima em afogamento. Veja Natação para regras completas sobre natação, afogamento e salvamento.'
    },
    {
        id: skillsIds.skillAxeMaceId,
        table_id: mainGameTableId,
        name: 'Machado ou Maça',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: 'Perícia no uso de qualquer arma pequena e desequilibrada, como um machado, um machadinho, uma maça, um picareta, etc.'
    },
    {
        id: skillsIds.skillAxeThrowingId,
        table_id: mainGameTableId,
        name: 'Arremesso de Machado',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: 'Perícia em arremessar qualquer machado de arremesso equilibrado, mas não um machado de guerra desequilibrado.'
    },
    // new skill
    {
        id: skillsIds.skillCombatSuitId,
        table_id: mainGameTableId,
        name: 'Traje de Combate',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de usar um traje blindado autopropulsado, incluindo o armamento correspondente.'
    },
    {
        id: skillsIds.skillMedicineId,
        table_id: mainGameTableId,
        name: 'Medicina',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia profissional genérica para tratar doentes, prescrever medicamentos e tratamentos, etc. Quando um GM exigir um teste de Competência ou de conhecimento médico geral, ele será feito contra esta perícia. Um médico tem a opção de adotar uma especialização."
    },
    {
        id: skillsIds.skillPerformanceId,
        table_id: mainGameTableId,
        name: 'Artes Cênicas',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de atuar, se apresentar e contar histórias para um público.'
    },
    {
        id: skillsIds.skillLanguageId,
        table_id: mainGameTableId,
        name: 'Idioma',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de falar, ler e escrever um idioma estrangeiro.'
    },
    {
        id: skillsIds.skillPressureSuitId,
        table_id: mainGameTableId,
        name: 'Traje Pressurizado',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: 'A capacidade de usar um traje pressurizado ou traje espacial para sobreviver em ambientes hostis.'
    },
    // Skills from pericias2 (var-skills.ts)
    {
        id: skillsIds.skillBeamWeaponsId,
        table_id: mainGameTableId,
        name: 'Armas de Feixe',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar qualquer tipo de Arma de Feixe — feixes iônicos, lasers, atordoadores, etc. Inclui tanto armas tipo pistola quanto tipo rifle, pois nenhuma sofre com recuo. Se sua IQ for 10 ou 11, adicione 1 ponto ao seu nível de perícia. Se for maior que 11, adicione 2 pontos. Os modificadores são os mesmos descritos para a perícia Armas de Fogo."
    },
    {
        id: skillsIds.skillBlackjackId,
        table_id: mainGameTableId,
        name: 'Cassetete',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta arma é útil apenas no combate corpo a corpo e, na maioria dos casos, é usada para ataques surpresa. Como causa dano básico muito pequeno, geralmente é usada para golpear a cabeça. Se você não deseja causar ferimentos graves, o atacante pode 'conter o golpe,' não usando toda a sua ST."
    },
    {
        id: skillsIds.skillGunsMusketId,
        table_id: mainGameTableId,
        name: 'Armas de Fogo (Mosquete)',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar armas de pólvora, incluindo mosquetes, pistolas e rifles. Adicione 1 ao seu nível de perícia se sua IQ for 10 ou 11, e 2 para IQ 12 ou superior. Os modificadores são os mesmos encontrados em Armas de Fogo, p. 51."
    },
    {
        id: skillsIds.skillBlowpipeId,
        table_id: mainGameTableId,
        name: 'Zarabatana',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de usar a zarabatana para lançar pequenos dardos (normalmente envenenados). Esses dardos não podem perfurar roupas normais, exceto em caso de um sucesso decisivo, e nunca penetram roupas ou armaduras. Se um dardo atingir a pele ou roupa leve, o veneno pode fazer efeito. Modificadores: -2 ou mais em caso de vento."
    },
    {
        id: skillsIds.skillBolasId,
        table_id: mainGameTableId,
        name: 'Boleadeiras',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de arremessar boleadeiras (uma tira de couro com dois ou mais pesos presos às suas pontas) para enredar a vítima. São usadas principalmente para deter animais em um rebanho, ou caçar pequenos animais selvagens ou aves. Também podem ser usadas em combate. É possível esquivar-se delas ou bloqueá-las, mas uma tentativa de aparar fará com que elas se enrolem automaticamente na arma usada. Exceção: se você aparar com sucesso usando uma arma de corte, as tiras serão cortadas, arruinando as boleadeiras."
    },
    {
        id: skillsIds.skillBowId,
        table_id: mainGameTableId,
        name: 'Arco',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de usar arcos em geral. Também cobre arcos compostos, embora alguém que nunca tenha visto um precise de um teste de IQ bem-sucedido para descobrir como usá-lo corretamente."
    },
    {
        id: skillsIds.skillBrawlingId,
        table_id: mainGameTableId,
        name: 'Briga',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a 'perícia' não científica de lutar com os punhos em combate corpo a corpo. Faça um teste de Briga sempre que atacar um oponente com as mãos ou os pés para ver se consegue acertá-lo. Adicione 1/10 do seu nível de perícia de Briga (arredondado para baixo) ao dano causado. É possível aparar duas vezes por turno (uma para cada mão) ao se defender com as mãos desarmadas, e seu parâmetro de Aparar será 2/3 do seu nível de perícia de Briga. Com esta perícia, você só pode aparar ataques de mãos, pés e armas usadas em combate corpo a corpo."
    },
    {
        id: skillsIds.skillBroadswordId,
        table_id: mainGameTableId,
        name: 'Espada Larga',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de lutar com espadas, incluindo técnicas de ataque e defesa."
    },
    {
        id: skillsIds.skillBucklerId,
        table_id: mainGameTableId,
        name: 'Broquel',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar um broquel, um pequeno escudo usado para defesa ativa."
    },
    {
        id: skillsIds.skillCrossbowId,
        table_id: mainGameTableId,
        name: 'Besta',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar bestas, incluindo bestas de balas ou de pedras. Se você tiver esta perícia, saberá como funcionam as máquinas do tipo máquina de cerco semelhantes a bestas, mas não terá habilidade especial no seu uso."
    },
    {
        id: skillsIds.skillFastDrawId,
        table_id: mainGameTableId,
        name: 'Saque Rápido',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Existe uma perícia separada para cada tipo de arma. Está disponível para as seguintes armas: Faca, Clava, Espada (de uma mão), Espada de Duas Mãos, Flecha (incluindo virotes de besta), Pistola, Rifle (incluindo metralhadoras de mão, etc.), pentes, carregadores rápidos. O GM pode adicionar uma nova perícia deste tipo para qualquer arma que possa ser sacada rapidamente, mas que seja significativamente diferente de todas as armas acima. Esta perícia é usada quando você quer deixar pronta uma arma que está em seu coldre, bainha, etc. Um sucesso significa que você deixou a arma pronta instantaneamente (isso não conta como manobra) e pode atacar com ela (ou carregar o arco) no mesmo turno. Uma falha significa que você deixou a arma pronta normalmente, mas não pode fazer mais nada neste turno. Uma falha crítica significa que você derrubou a arma."
    },
    {
        id: skillsIds.skillFencingId,
        table_id: mainGameTableId,
        name: 'Esgrima',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de usar armas de esgrimista (rapieira, espada leve de estocada e sabre). A rapieira é uma arma de estocada longa (alcance 2 hexágonos) e leve. A espada leve de estocada é uma arma de estocada leve, mais curta (alcance 1 hexágono), um tanto semelhante a um florete moderno com ponta. O sabre é uma arma leve de corte e estocada. Se você tiver uma dessas armas, um pequeno escudo e uma Sobrecarga não maior que Leve, seu Aparar será 2/3 do seu nível de perícia de Esgrima. Além disso, você pode aparar duas vezes por turno."
    },
    {
        id: skillsIds.skillFlailId,
        table_id: mainGameTableId,
        name: 'Mangual',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de usar armas desequilibradas com a cabeça presa ao cabo por uma corrente ou corda, como o mangual, a estrela da manhã ou o nunchaku. O mangual é difícil de usar, mas também difícil de defender. Qualquer tentativa de bloquear uma dessas armas sofre uma penalidade de -2. Qualquer tentativa de aparar sofre uma penalidade de -4. Facas e armas de Esgrima não podem aparar um Mangual."
    },
    {
        id: skillsIds.skillGunsId,
        table_id: mainGameTableId,
        name: 'Armas de Fogo',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar qualquer tipo de arma de cartucho do século XX. Adicione 1 ao seu nível de perícia se você tiver IQ 10 ou 11, e 2 para IQ 12+. Modificadores: Veja Familiaridade, p. 43. -2 para uma arma de tipo conhecido com a qual você não está familiarizado; -4 ou mais para uma arma em mau estado; -4 ou mais para um tipo de arma desconhecido."
    },
    {
        id: skillsIds.skillJudoId,
        table_id: mainGameTableId,
        name: 'Judô',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta perícia representa uma capacidade geral de quedas e chaves de imobilização, não uma escola específica de combate desarmado. Não é possível usar Judô se você estiver segurando algo nas mãos ou se sua Sobrecarga for maior que Leve. Usando Judô, você pode aparar com qualquer mão como se fosse uma arma, usando 2/3 do seu nível de perícia de Judô como seu Aparar."
    },
    {
        id: skillsIds.skillKarateId,
        table_id: mainGameTableId,
        name: 'Caratê',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta perícia não representa nenhuma escola específica de combate desarmado, mas uma capacidade geral de socos e chutes. Não há penalidade para o uso da mão esquerda. Qualquer mão usada deve estar vazia, e sua Sobrecarga deve ser Leve ou menor. Você pode aparar com qualquer mão como se fosse uma arma, usando 2/3 do seu nível de perícia de Caratê como seu Aparar."
    },
    {
        id: skillsIds.skillKnifeId,
        table_id: mainGameTableId,
        name: 'Faca',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "A perícia de usar, mas não arremessar, qualquer tipo de faca, adaga ou estilete."
    },
    {
        id: skillsIds.skillKnifeThrowingId,
        table_id: mainGameTableId,
        name: 'Arremesso de Faca',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "A capacidade de arremessar qualquer tipo de faca."
    },
    {
        id: skillsIds.skillLanceId,
        table_id: mainGameTableId,
        name: 'Lança de Justa',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de usar a lança de justa, uma arma semelhante a uma lança normal, com 3,5m de comprimento ou mais, usada a cavalo. Não é comum aparar em combate com lanças; você deve Bloquear ou Esquivar de ataques inimigos."
    },
    {
        id: skillsIds.skillLassoId,
        table_id: mainGameTableId,
        name: 'Laço',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de arremessar o laço. É usado principalmente para laçar animais. Você pode tentar laçar uma parte específica do corpo, ou escolher uma aleatoriamente na Tabela de Locais de Acerto. Faça um Contesto Rápido de ST se o laço pegou um braço ou o tronco. Se o laçador vencer, a vítima fica imobilizada; se perder, perdeu a corda."
    },
    {
        id: skillsIds.skillNetId,
        table_id: mainGameTableId,
        name: 'Rede',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de usar a rede como arma em uma luta. É possível esquivar-se de uma rede, mas não bloqueá-la ou apará-la. No caso de um arremesso bem-sucedido, a vítima fica enredada e incapaz de se mover ou atacar até que a rede seja removida. Para remover uma rede, você precisa de três sucessos, não necessariamente consecutivos, em testes de DX."
    },
    {
        id: skillsIds.skillPolearmId,
        table_id: mainGameTableId,
        name: 'Arma de Haste',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Perícia no uso de armas de haste muito longas e desequilibradas, incluindo o bardiche, a alabarda, o bill, e centenas de variações do tipo."
    },
    {
        id: skillsIds.skillShieldId,
        table_id: mainGameTableId,
        name: 'Escudo',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar um escudo de tipo medieval ou aqueles usados por tropas de choque. Esta perícia é necessária para atacar com o Escudo. No entanto, a defesa passiva oferecida pelo escudo (1 a 4 pontos) protege quem o carrega, mesmo que não saiba usá-lo. A defesa ativa de um escudo (Bloqueio) é 1/2 do seu nível de perícia de Escudo."
    },
    {
        id: skillsIds.skillShortswordId,
        table_id: mainGameTableId,
        name: 'Espada Curta',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de usar qualquer tipo de arma equilibrada de 30 a 60cm de comprimento, incluindo o cutelo, o gládio e o bastão curto."
    },
    {
        id: skillsIds.skillSlingId,
        table_id: mainGameTableId,
        name: 'Funda',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de usar a funda ou a funda de bastão."
    },
    {
        id: skillsIds.skillSpearId,
        table_id: mainGameTableId,
        name: 'Lança',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de usar (mas não arremessar) qualquer tipo de lança, dardo, tridente, baioneta, pique, ou arma comprida, leve e pontiaguda."
    },
    {
        id: skillsIds.skillSpearThrowerId,
        table_id: mainGameTableId,
        name: 'Propulsor de Lança',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Este dispositivo, e a perícia em seu uso, é diferente da perícia Arremesso de Lança, mas o nível padrão de uma é igual ao da outra -4. Um Propulsor de Lança é uma haste longa e plana com um entalhe e uma alça em uma das extremidades. Ele aumenta a força com que um dardo ou arma semelhante é arremessado, aumentando a ST efetiva do usuário (para alcance e dano) em 5 pontos."
    },
    {
        id: skillsIds.skillSpearThrowingId,
        table_id: mainGameTableId,
        name: 'Arremesso de Lança',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Perícia em arremessar qualquer tipo de lança, dardo, etc."
    },
    {
        id: skillsIds.skillFastReloadId,
        table_id: mainGameTableId,
        name: 'Recarga Rápida',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de carregar rapidamente uma arma de fogo. Não é o mesmo que Saque Rápido, mas você poderia, usando as perícias certas, recarregar muito rapidamente sacando um carregador rápido ou um pente do seu cinto ou bolso e colocando-o na arma."
    },
    {
        id: skillsIds.skillStaffId,
        table_id: mainGameTableId,
        name: 'Bastão',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de usar o Bastão ou qualquer vara ou haste improvisada como um Bastão. Este é um tipo de arma empunhada com as duas mãos. Seu Aparar será 2/3 do seu nível de perícia."
    },
    {
        id: skillsIds.skillTwoHandedAxeMaceId,
        table_id: mainGameTableId,
        name: 'Machado de Duas Mãos ou Maça',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Perícia no uso de qualquer arma longa, pesada e desequilibrada, como o machado de batalha ou a marreta."
    },
    {
        id: skillsIds.skillTwoHandedSwordId,
        table_id: mainGameTableId,
        name: 'Espada de Duas Mãos',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de manejar uma arma de lâmina longa (1m a 1,5m) com as duas mãos. Observe que o cimitarra é usado com esta perícia quando empunhado com as duas mãos, mas com a perícia Espada Larga quando empunhado com uma mão."
    },
    {
        id: skillsIds.skillWhipId,
        table_id: mainGameTableId,
        name: 'Chicote',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de usar um chicote como arma. Os chicotes vêm em vários comprimentos. Em termos de jogo, um chicote de 1m de comprimento tem alcance de 1m. O tempo necessário para preparar novamente um chicote depende do seu comprimento: 0 turnos para um chicote de 1m; 1 turno para um chicote de 2m; 2 turnos para um chicote de 3m ou mais."
    },
    {
        id: skillsIds.skillArmouryId,
        table_id: mainGameTableId,
        name: 'Arsenal',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de construir e reparar armas e armaduras no nível de tecnologia apropriado. Um teste bem-sucedido é necessário para descobrir o que está errado com uma arma (a menos que seja óbvio). Um segundo sucesso permite ao personagem repará-la. O GM deve determinar um período razoável para cada tentativa de reparo. Modificadores: -4 se a arma for desconhecida; -4 se você não tiver as ferramentas apropriadas (-5 no NT 9+)."
    },
    {
        id: skillsIds.skillSmithId,
        table_id: mainGameTableId,
        name: 'Ferreiro',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de trabalhar manualmente com ferro e outros metais não preciosos. Para este trabalho é necessária uma forja, mas com os materiais adequados, um ferreiro pode construir uma em cerca de 30 dias. Modificador: -1 para cada ponto de ST abaixo de 13."
    },
    {
        id: skillsIds.skillCarpentryId,
        table_id: mainGameTableId,
        name: 'Carpintaria',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de fabricar objetos de madeira. Um teste de perícia bem-sucedido permite uma hora de trabalho de carpintaria competente. Uma falha significa que o resultado do trabalho foi ruim. Modificadores: +5 se você estiver sendo supervisionado ou auxiliado por alguém com nível de perícia 15+; -5 se você não tiver boas ferramentas."
    },
    {
        id: skillsIds.skillCookingId,
        table_id: mainGameTableId,
        name: 'Culinária',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de preparar uma refeição agradável a partir de ingredientes brutos. Em qualquer sociedade 'ao ar livre', esta perícia incluirá a capacidade de limpar a caça, ou seja, preparar um animal recém-abatido para cozinhar."
    },
    {
        id: skillsIds.skillJewelerId,
        table_id: mainGameTableId,
        name: 'Joalheiro',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de trabalhar com metais preciosos de todos os tipos, fabricar joias, decorar armas e assim por diante. Uma forja é necessária (veja Ferreiro, acima) para trabalhar o metal. Um joalheiro pode identificar qualquer metal precioso, ou determinar o valor de qualquer adorno precioso, se obtiver sucesso em um teste de perícia."
    },
    {
        id: skillsIds.skillLeatherworkingId,
        table_id: mainGameTableId,
        name: 'Trabalho em Couro',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de trabalhar com couro para fazer cintos, selas, armaduras, etc. Alguém com esta perícia pode fazer novos objetos ou reparar os usados. Com um teste de perícia bem-sucedido, pode determinar o valor de um objeto de couro."
    },
    {
        id: skillsIds.skillMechanicId,
        table_id: mainGameTableId,
        name: 'Mecânica',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de diagnosticar e resolver problemas mecânicos comuns, geralmente, mas nem sempre, no motor de um veículo."
    },
    {
        id: skillsIds.skillPotteryId,
        table_id: mainGameTableId,
        name: 'Cerâmica',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de trabalhar com vários tipos de cerâmica. Um oleiro pode fazer potes e outros utensílios de barro. Com um teste de perícia bem-sucedido, pode identificar argila apropriada (para tijolos ou utensílios domésticos); determinar a origem ou o valor de um objeto de cerâmica; etc."
    },
    {
        id: skillsIds.skillWoodworkingId,
        table_id: mainGameTableId,
        name: 'Marcenaria',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de realizar trabalhos 'finos' em madeira; construção de móveis, entalhes decorativos, etc. Com um teste de perícia bem-sucedido, um marceneiro pode determinar a origem e o valor justo de uma escultura em madeira, ou identificar o tipo de madeira usada."
    },
    {
        id: skillsIds.skillMimePantomimeId,
        table_id: mainGameTableId,
        name: 'Mímica/Pantomima',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de se comunicar por meio de gestos simples improvisados. Indivíduos surdos e/ou mudos têm um bônus de +3 ao usar esta perícia. Um teste de Mímica/Pantomima bem-sucedido permite comunicar uma ideia simples a outra pessoa, ou entender uma comunicada por outra."
    },
    {
        id: skillsIds.skillSignLanguageId,
        table_id: mainGameTableId,
        name: 'Linguagem de Sinais',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é qualquer uma das verdadeiras linguagens de gestos. Uma das mais conhecidas é a Língua de Sinais Americana (Ameslan). Outros exemplos poderiam ser a linguagem de uma raça alienígena sem fala, um código de sinais usado por espiões ou revolucionários, etc. Uma linguagem de sinais é complexa, estilizada e pode comunicar praticamente qualquer conceito."
    },
    {
        id: skillsIds.skillTelegraphyId,
        table_id: mainGameTableId,
        name: 'Telegrafia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de enviar e receber código Morse, realizar pequenos reparos em sistemas telegráficos e reconhecer outros operadores de telégrafo pelo seu 'pulso', ou seja, sua forma característica de enviar uma mensagem. Esta perícia normalmente é encontrada entre os níveis de tecnologia 5 e 7."
    },
    {
        id: skillsIds.skillSurgeryId,
        table_id: mainGameTableId,
        name: 'Cirurgia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Esta perícia é usada quando alguém tenta operar um personagem para curar doenças, ferimentos ou disfunções orgânicas. Um cirurgião pode opcionalmente se especializar em uma parte específica do corpo."
    },
    {
        id: skillsIds.skillClimbingId,
        table_id: mainGameTableId,
        name: 'Escalada',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de escalar montanhas, muros de pedra, árvores, paredes de prédios e qualquer outra coisa que apareça em seu caminho. Modificadores: +3 se você tiver a vantagem Dupla Articulação; menos o seu nível de Sobrecarga."
    },
    {
        id: skillsIds.skillFishingId,
        table_id: mainGameTableId,
        name: 'Pesca',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de pescar (com uma rede, anzol e linha, ou qualquer outro método usado pela sua cultura). Se você tiver o equipamento apropriado e houver peixes para serem pegos, um teste de perícia bem-sucedido permitirá pegá-los. Quando nenhum material de pesca estiver disponível, você pode improvisar."
    },
    {
        id: skillsIds.skillNaturalistId,
        table_id: mainGameTableId,
        name: 'Naturalismo',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta perícia compreende o conhecimento de animais, plantas e da natureza em suas diversas formas. É o tipo de conhecimento que se esperaria de um bom professor de biologia do século XX. Um teste de perícia bem-sucedido permite identificar uma planta e sua aplicação, ou informa algo sobre um animal e seus hábitos."
    },
    {
        id: skillsIds.skillNavigationId,
        table_id: mainGameTableId,
        name: 'Navegação',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de saber sua posição (na Terra, não no espaço) pelas estrelas, correntes oceânicas, etc. Um teste de perícia bem-sucedido dirá onde você está, no mar ou em terra. Observe que, se você não tiver a perícia e estiver tentando um teste no nível padrão, não poderá usar sua perícia de Marinaria se não estiver realmente no mar!"
    },
    {
        id: skillsIds.skillSeamanshipId,
        table_id: mainGameTableId,
        name: 'Marinaria',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de tripular uma embarcação de longo alcance. Você precisará tripular um navio (ou capitaneá-lo!). Modificadores: penalidades padrão relacionadas ao NT."
    },
    {
        id: skillsIds.skillSurvivalId,
        table_id: mainGameTableId,
        name: 'Sobrevivência',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de 'viver da terra', encontrar água e boa comida, evitar perigos, construir abrigos, etc. Cada tipo de terreno exige uma perícia diferente."
    },
    {
        id: skillsIds.skillTrackingId,
        table_id: mainGameTableId,
        name: 'Rastreamento',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de seguir um rastro deixado por um homem ou animal. Faça um teste de Rastreamento para encontrar uma pista e outro a cada 5 minutos de deslocamento. Modificadores: -5 se o rastro tiver mais de um dia; -10 se tiver mais de uma semana; +5 se estiver seguindo um homem; +10 se estiver seguindo um grupo de homens."
    },
    {
        id: skillsIds.skillAccountingId,
        table_id: mainGameTableId,
        name: 'Contabilidade',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de manter os livros de uma empresa atualizados, examinar as condições de um negócio, etc., sendo principalmente útil como meio de conseguir um emprego. No entanto, um teste de Contabilidade bem-sucedido (exigindo cerca de 2 horas de estudo) pode dizer se os registros de uma empresa estão corretos."
    },
    {
        id: skillsIds.skillComputerOperationId,
        table_id: mainGameTableId,
        name: 'Operação de Computador',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de operar um computador, extrair dados, executar programas existentes, jogar videogames, etc. Não é o mesmo que programação (que é uma perícia separada e mais difícil). Modificadores: -3 ou mais no caso de um computador ou programa estranho. Esta perícia só está disponível no NT 7+."
    },
    {
        id: skillsIds.skillElectronicsOperationId,
        table_id: mainGameTableId,
        name: 'Operação de Eletrônicos',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta perícia permite o uso de equipamento eletrônico dentro de uma especialidade conhecida. Não há necessidade de testes de perícia para uso diário normal do equipamento. Eles são necessários apenas em situações de emergência, casos de uso 'anormal' do equipamento, ou uso de equipamento complexo por pessoas inexperientes."
    },
    {
        id: skillsIds.skillHeraldryId,
        table_id: mainGameTableId,
        name: 'Heráldica',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de desenhar e reconhecer brasões, cores e símbolos de clãs, e outros emblemas. Se for bem-sucedido em um teste de perícia, um arauto pode reconhecer um cavaleiro ou nobre pelo estandarte ou escudo carregado e descrevê-lo adequadamente em termos heráldicos."
    },
    {
        id: skillsIds.skillLawId,
        table_id: mainGameTableId,
        name: 'Direito',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Modificadores: +4 se o personagem estiver lidando com o Direito de uma área específica. Um teste de perícia bem-sucedido permite lembrar, deduzir ou elaborar uma resposta a uma pergunta sobre a lei. Lembre-se, no entanto, de que poucas questões legais têm uma resposta precisa."
    },
    {
        id: skillsIds.skillAgronomyId,
        table_id: mainGameTableId,
        name: 'Agronomia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a ciência do cultivo de plantas. Um agrônomo poderia responder perguntas ou resolver problemas relacionados à agricultura e à pecuária. Um fazendeiro experiente é um agrônomo, saiba ele a palavra ou não."
    },
    {
        id: skillsIds.skillAlchemyId,
        table_id: mainGameTableId,
        name: 'Alquimia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Esta é a ciência das transmutações mágicas."
    },
    {
        id: skillsIds.skillAnthropologyId,
        table_id: mainGameTableId,
        name: 'Antropologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo da cultura e da evolução humana. Um antropólogo conhece os costumes de grupos de seres humanos primitivos (e não tão primitivos) (ou outras criaturas inteligentes que estuda). Testes de Antropologia poderiam ser usados para explicar, ou até prever, os rituais e costumes estranhos que um viajante possa encontrar."
    },
    {
        id: skillsIds.skillArchaeologyId,
        table_id: mainGameTableId,
        name: 'Arqueologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo das civilizações antigas. Um arqueólogo se sente em casa com escavações, cacos de cerâmica, inscrições, etc. No caso de um teste de perícia bem-sucedido, um arqueólogo pode responder perguntas sobre história antiga, identificar artefatos e idiomas mortos, etc."
    },
    {
        id: skillsIds.skillArchitectureId,
        table_id: mainGameTableId,
        name: 'Arquitetura',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de projetar edifícios e inferir a forma de edifícios a partir de sua função e vice-versa. Um teste de Arquitetura bem-sucedido permitiria tirar conclusões sobre um edifício desconhecido, encontrar uma sala ou passagem secreta, etc."
    },
    {
        id: skillsIds.skillAstronavigationId,
        table_id: mainGameTableId,
        name: 'Astronavegação',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta perícia diz respeito à navegação espacial e interestelar. Existe uma perícia diferente para cada tipo de propulsão mais rápida que a luz. Cada uma dessas perícias pode ter seu nível padrão definido por outra com uma penalidade de até -4, dependendo de quão diferentes são os sistemas de propulsão."
    },
    {
        id: skillsIds.skillAstronomyId,
        table_id: mainGameTableId,
        name: 'Astronomia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo das estrelas e outros corpos celestes. Um astrônomo poderia resolver problemas relacionados ao Sol, aos planetas do sistema solar, meteoritos e assim por diante. No NT 4 e abaixo, esta perícia se funde com a Astrologia."
    },
    {
        id: skillsIds.skillBiochemistryId,
        table_id: mainGameTableId,
        name: 'Bioquímica',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Este é o estudo da química dos seres vivos. Um bioquímico é um especialista nas reações químicas que sustentam a vida."
    },
    {
        id: skillsIds.skillBotanyId,
        table_id: mainGameTableId,
        name: 'Botânica',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo das plantas. Um botânico pode identificar plantas, fazer suposições sobre o habitat e as propriedades de uma planta desconhecida, etc."
    },
    {
        id: skillsIds.skillChemistryId,
        table_id: mainGameTableId,
        name: 'Química',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo da matéria. Um químico pode identificar elementos e compostos simples. Com o equipamento apropriado, pode realizar análises e sínteses complexas."
    },
    {
        id: skillsIds.skillComputerProgrammingId,
        table_id: mainGameTableId,
        name: 'Programação de Computador',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de escrever programas de computador."
    },
    {
        id: skillsIds.skillCriminologyId,
        table_id: mainGameTableId,
        name: 'Criminologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Este é o estudo do crime e do comportamento criminoso."
    },
    {
        id: skillsIds.skillEconomicsId,
        table_id: mainGameTableId,
        name: 'Economia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo do dinheiro, do câmbio e das transações bancárias. Um economista poderia responder perguntas sobre investimentos, programas econômicos, etc. Também poderia prever os efeitos locais de mudanças econômicas."
    },
    {
        id: skillsIds.skillEcologyId,
        table_id: mainGameTableId,
        name: 'Ecologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo das relações entre os seres vivos, ou de todo o ambiente. Esta ciência não existe em NT abaixo de 6. Use Naturalismo em vez dela. Um ecologista poderia dizer quais criaturas são vitais para um ambiente e quais não são."
    },
    {
        id: skillsIds.skillElectronicsId,
        table_id: mainGameTableId,
        name: 'Eletrônica',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a engenharia eletrônica, a capacidade de projetar e construir dispositivos eletrônicos. Um teste bem-sucedido poderia determinar a finalidade de um dispositivo desconhecido, diagnosticar uma falha, realizar um reparo, projetar novos sistemas, ou improvisar um dispositivo para resolver um problema."
    },
    {
        id: skillsIds.skillEngineeringMechanicalId,
        table_id: mainGameTableId,
        name: 'Engenharia (Mecânica)',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a perícia de projetar e construir mecanismos complexos. Um teste bem-sucedido permite determinar a finalidade de um mecanismo desconhecido, diagnosticar um problema elétrico ou mecânico, fazer um reparo, projetar um novo mecanismo, ou improvisar um dispositivo para resolver um problema."
    },
    {
        id: skillsIds.skillForensicsId,
        table_id: mainGameTableId,
        name: 'Perícia Forense',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a ciência geral da criminologia 'de laboratório': calcular trajetórias de balas, análise química ou microscópica de pistas, etc. Dependendo da situação, o GM pode permitir o uso de Química ou outro campo de estudo apropriado como padrão para Perícia Forense."
    },
    {
        id: skillsIds.skillGeneticsId,
        table_id: mainGameTableId,
        name: 'Genética',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Este é o estudo da hereditariedade. Um geneticista pode identificar doenças genéticas, sabe como cruzar animais para desenvolver certas características, etc. A especialidade Engenharia Genética passa a existir no NT 9+."
    },
    {
        id: skillsIds.skillGeologyId,
        table_id: mainGameTableId,
        name: 'Geologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a ciência que estuda a Terra. Um geólogo estuda minérios, rochas, petróleo, conhece terremotos, vulcões e fósseis. Em uma campanha, poderia encontrar água usando sua 'sensibilidade de campo' como na perícia Sobrevivência."
    },
    {
        id: skillsIds.skillHistoryId,
        table_id: mainGameTableId,
        name: 'História',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo do passado registrado (em oposição à arqueologia, que estuda o passado pré-histórico). Um historiador pode responder perguntas sobre história e pode ter permissão (a critério do GM) para testar se se lembra de um paralelo histórico útil."
    },
    {
        id: skillsIds.skillLinguisticsId,
        table_id: mainGameTableId,
        name: 'Linguística',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Este é o estudo dos princípios nos quais as línguas se baseiam. Um linguista pode identificar uma língua desconhecida a partir de um fragmento de texto escrito ou falado, se for bem-sucedido em um teste de perícia."
    },
    {
        id: skillsIds.skillLiteratureId,
        table_id: mainGameTableId,
        name: 'Literatura',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo das grandes obras literárias. Um estudante de literatura teria conhecimento de poesia antiga, volumes empoeirados, filosofia, crítica, etc. Isso pode ser útil para encontrar pistas de tesouros escondidos, continentes submersos, segredos que o homem não deveria conhecer e coisas semelhantes."
    },
    {
        id: skillsIds.skillMathematicsId,
        table_id: mainGameTableId,
        name: 'Matemática',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Isso representa conhecimento geral de matemática. Embora existam dezenas de especialidades, é improvável que a diferença entre elas afete o jogo. Um matemático pode fazer testes de perícia para responder qualquer tipo de problema relacionado à matemática."
    },
    {
        id: skillsIds.skillMetallurgyId,
        table_id: mainGameTableId,
        name: 'Metalurgia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo dos metais e suas propriedades. Um metalúrgico pode identificar metais ou ligas e resolver problemas relacionados aos metais, sua mineração e refino."
    },
    {
        id: skillsIds.skillMeteorologyId,
        table_id: mainGameTableId,
        name: 'Meteorologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Este é o estudo do clima e a capacidade de prevê-lo. O GM sempre faz testes de perícia de Meteorologia pelo jogador. Um bom resultado significa que ele dirá a verdade, enquanto uma falha significa uma resposta aleatória ou uma mentira."
    },
    {
        id: skillsIds.skillNuclearPhysicsId,
        table_id: mainGameTableId,
        name: 'Física Nuclear',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Este é o estudo dos processos nucleares. Um físico nuclear poderia responder perguntas sobre o interior do sol, armas nucleares e/ou usinas de energia nuclear."
    },
    {
        id: skillsIds.skillOccultismId,
        table_id: mainGameTableId,
        name: 'Ocultismo',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Este é o estudo do inexplicável e/ou sobrenatural. Um ocultista tem conhecimento intenso de misticismo, doutrinas mágicas primitivas, rituais antigos, obsessões, etc. Lembre-se de que um ocultista não precisa necessariamente acreditar no material que estuda."
    },
    {
        id: skillsIds.skillPhysicsId,
        table_id: mainGameTableId,
        name: 'Física',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo da matéria, da energia e das forças fundamentais da natureza."
    },
    {
        id: skillsIds.skillPhysiologyId,
        table_id: mainGameTableId,
        name: 'Fisiologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: "Este é o estudo do corpo humano e suas funções. Um fisiologista sabe onde estão localizados os músculos, ossos e órgãos e como funcionam."
    },
    {
        id: skillsIds.skillProspectingId,
        table_id: mainGameTableId,
        name: 'Prospecção',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a geologia aplicada: a capacidade de descobrir minerais valiosos por meio de inspeção local. A prospecção de longa distância, usando mapas e instrumentos, requer a perícia Geologia. Um prospectador está sujeito a uma penalidade de -1 em uma nova área de um tipo familiar."
    },
    {
        id: skillsIds.skillPsychologyId,
        table_id: mainGameTableId,
        name: 'Psicologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo do comportamento. Um psicólogo lida com a mente humana (e possivelmente outros tipos também). Um teste de Psicologia bem-sucedido pode prever, em termos gerais, o comportamento de um indivíduo ou pequeno grupo em uma situação definida."
    },
    {
        id: skillsIds.skillResearchId,
        table_id: mainGameTableId,
        name: 'Pesquisa',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta perícia também pode ter seu nível padrão definido por qualquer perícia científica (sujeito a uma penalidade de -2), se você estiver pesquisando material relacionado a ela. Pesquisa é a capacidade geral de conduzir uma investigação em uma biblioteca ou arquivo. Um teste de Pesquisa bem-sucedido em um lugar apropriado permitirá descobrir alguma informação útil."
    },
    {
        id: skillsIds.skillTheologyId,
        table_id: mainGameTableId,
        name: 'Teologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo da religião. Um teólogo tem conhecimento dos credos religiosos antigos e modernos, história das religiões, etc. Você deve considerar ter esta perícia, especializada em sua própria religião, se seu personagem for um padre ou santo."
    },
{
        id: skillsIds.skillZoologyId,
        table_id: mainGameTableId,
        name: 'Zoologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o estudo dos animais. Um zoólogo pode identificar animais, ter uma boa ideia sobre sua dieta natural, hábitos e habitat, e prever seu comportamento."
    },
    {
        id: skillsIds.skillActingId,
        table_id: mainGameTableId,
        name: 'Atuação',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de simular humores, emoções e vozes, e mentir de forma convincente por um período de tempo. Não é o mesmo que Disfarce ou Artes Cênicas. Um teste de perícia bem-sucedido permite fingir pensar ou sentir algo que você não sente. Modificadores: +1 para cada ponto de IQ que você tem acima da pessoa que está tentando enganar."
    },
    {
        id: skillsIds.skillAdministrationId,
        table_id: mainGameTableId,
        name: 'Administração',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de dirigir uma grande organização. É principalmente útil para ganhar dinheiro ou se qualificar para cargos altos. Um administrador treinado (nível 15+) recebe um bônus de +2 ao lidar com um burocrata e, em um teste de perícia bem-sucedido, pode prever a melhor maneira de lidar com uma burocracia."
    },
    {
        id: skillsIds.skillAreaKnowledgeId,
        table_id: mainGameTableId,
        name: 'Conhecimento da Área',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Este é o conhecimento das pessoas, política e geografia de uma determinada área. Normalmente, um personagem terá Conhecimento da Área apenas da área que considera sua 'base', seja uma simples fazenda ou um sistema solar inteiro."
    },
    {
        id: skillsIds.skillCarousingId,
        table_id: mainGameTableId,
        name: 'Farra',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta perícia é 'comprada' com base no seu atributo HT, não DX. É a capacidade de participar de atividades sociais, festas, etc. Um teste de Farra bem-sucedido, feito nas circunstâncias certas, dá um bônus de +2 em um pedido de ajuda ou informação."
    },
    {
        id: skillsIds.skillDiplomacyId,
        table_id: mainGameTableId,
        name: 'Diplomacia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de negociar, fazer acordos e se dar bem com os outros. Um teste de Diplomacia pode substituir qualquer teste de reação em uma situação em que o combate não seja iminente. Um teste bem-sucedido permite prever os possíveis resultados de um curso de ação durante a negociação."
    },
    {
        id: skillsIds.skillFastTalkId,
        table_id: mainGameTableId,
        name: 'Lábia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de persuadir os outros a fazerem coisas contra seu bom senso. Não é ensinada (pelo menos intencionalmente) nas escolas; é aprendida enquanto se trabalha como vendedor, golpista, advogado, etc."
    },
    {
        id: skillsIds.skillGamblingId,
        table_id: mainGameTableId,
        name: 'Jogos de Azar',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia em jogos de azar. Um teste de Jogos de Azar bem-sucedido pode dizer, entre outras coisas, se o jogo é justo ou não, identificar um apostador entre um grupo de estranhos, ou avaliar as chances em uma situação complicada."
    },
    {
        id: skillsIds.skillLeadershipId,
        table_id: mainGameTableId,
        name: 'Liderança',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de coordenar um grupo de pessoas em uma situação tensa ou perigosa. Algum nível de liderança é necessário para conseguir um cargo em uma organização militar ou paramilitar."
    },
    {
        id: skillsIds.skillMerchantId,
        table_id: mainGameTableId,
        name: 'Mercador',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de negociar, comprar e vender mercadorias. Envolve talento para vendas, compreensão das práticas comerciais e psicologia. Em um teste de perícia bem-sucedido, um Mercador pode avaliar mercadorias, descobrir onde um determinado artigo é comprado ou vendido, etc."
    },
    {
        id: skillsIds.skillSexAppealId,
        table_id: mainGameTableId,
        name: 'Atrativo Sexual',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Baseada em HT, não em IQ. Esta é a capacidade de impressionar o sexo oposto. Só pode ser estudada no tempo livre (máximo 3 horas por dia), a menos que você faça parte de um harém ou algo semelhante. O Atrativo Sexual tem tanto a ver com sua atitude quanto com sua aparência."
    },
    {
        id: skillsIds.skillTeachingId,
        table_id: mainGameTableId,
        name: 'Ensino',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de ensinar outras pessoas. Para ensinar alguém, você precisa conhecer a perícia estudada em um nível mais alto que seu aluno. Para fins de jogo, qualquer pessoa com nível 12+ deve conseguir atuar como professor na maioria das situações."
    },
    {
        id: skillsIds.skillCamouflageId,
        table_id: mainGameTableId,
        name: 'Camuflagem',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a perícia de usar elementos naturais e/ou tinta para se disfarçar e esconder sua posição, equipamento, etc. Para determinar se a camuflagem foi bem feita, deve ser feito um Contesto Rápido de Perícias (Visão vs. Camuflagem)."
    },
    {
        id: skillsIds.skillDemolitionId,
        table_id: mainGameTableId,
        name: 'Demolição',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de explodir coisas. Toda vez que você usar explosivos, um teste de Demolição é necessário. Leva de 15 a 60 minutos para instalar adequadamente os explosivos e detoná-los. Um teste de perícia bem-sucedido significa que tudo correu bem. Uma falha significa que você cometeu um erro."
    },
    {
        id: skillsIds.skillDetectLiesId,
        table_id: mainGameTableId,
        name: 'Detectar Mentiras',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de saber se alguém está mentindo ou não. Não é o mesmo que Interrogatório; Detectar Mentiras funciona em situações informais e sociais. Quando você pede para usar esta perícia, o GM fará um Contesto Rápido entre seu Detectar Mentiras e o IQ do alvo."
    },
    {
        id: skillsIds.skillDisguiseId,
        table_id: mainGameTableId,
        name: 'Disfarce',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de fazer você parecer outra pessoa, por meio do uso de roupas, maquiagem, etc. Leva de 30 a 60 minutos para preparar um bom disfarce. Faça um Contesto Rápido de Perícias (geralmente Disfarce vs. IQ) para cada pessoa ou grupo que seu disfarce precisa enganar."
    },
    {
        id: skillsIds.skillEscapeId,
        table_id: mainGameTableId,
        name: 'Fuga',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de se libertar de cordas, algemas e restrições semelhantes. A primeira tentativa de fuga leva 1 minuto; cada tentativa subsequente leva 10 minutos. Modificadores: quanto mais cuidadosamente você estiver amarrado, maior a penalidade que o GM aplicará."
    },
    {
        id: skillsIds.skillForgeryId,
        table_id: mainGameTableId,
        name: 'Falsificação',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de falsificar uma nota promissória, passaporte ou outro documento semelhante. Não é ensinada, exceto por organizações de espionagem e o submundo, embora você possa sempre estudá-la por conta própria. Um teste de perícia é necessário toda vez que um documento falsificado que você está usando é inspecionado."
    },
    {
        id: skillsIds.skillHoldoutId,
        table_id: mainGameTableId,
        name: 'Ocultamento',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de esconder objetos em seu corpo ou em outras pessoas (normalmente com a cooperação delas). É também a capacidade de encontrar tais objetos escondidos por outros."
    },
    {
        id: skillsIds.skillIntelligenceAnalysisId,
        table_id: mainGameTableId,
        name: 'Análise da Informação',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "A capacidade de analisar e interpretar informações secretas (normalmente militares) para avaliar os planos e recursos do inimigo."
    },
    {
        id: skillsIds.skillInterrogationId,
        table_id: mainGameTableId,
        name: 'Interrogatório',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de interrogar um prisioneiro. Só é ensinada nos serviços secretos, forças policiais, prisões, unidades militares e no submundo."
    },
    {
        id: skillsIds.skillLipReadingId,
        table_id: mainGameTableId,
        name: 'Leitura Labial',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de ver o que os outros estão dizendo. Para isso, você deve estar a uma distância inferior a 6 metros, ou usar magia ou binóculos para aproximação visual. Cada teste bem-sucedido permite captar uma frase da conversa."
    },
    {
        id: skillsIds.skillLockpickingId,
        table_id: mainGameTableId,
        name: 'Arrombamento',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de abrir fechaduras, cadeados e cofres sem ter a chave ou a combinação. Cada tentativa leva 1 minuto. Se você conseguir abrir a fechadura, cada ponto da sua margem de sucesso reduz o tempo gasto em 5 segundos."
    },
    {
        id: skillsIds.skillPickpocketId,
        table_id: mainGameTableId,
        name: 'Punga',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de tirar uma carteira, faca, etc. de alguém, ou 'plantar' algo nele. Modificadores: +5 se a vítima estiver distraída; +10 se estiver dormindo ou bêbada; até -5 para itens em um bolso interno."
    },
    {
        id: skillsIds.skillPoisonId,
        table_id: mainGameTableId,
        name: 'Venefício',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Este é o conhecimento prático geral de venenos. Um teste bem-sucedido permite reconhecer uma planta venenosa no campo, destilar veneno em uma forma útil, reconhecer veneno pelo sabor em comida ou bebida, identificar veneno observando seus efeitos, ou saber o antídoto apropriado."
    },
    {
        id: skillsIds.skillScroungingId,
        table_id: mainGameTableId,
        name: 'Captação',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de encontrar, recuperar ou improvisar objetos úteis que outros não conseguem localizar. Cada tentativa leva uma hora. O captador não precisa roubar seu achado — apenas o localiza e depois o obtém pelos meios que forem necessários."
    },
    {
        id: skillsIds.skillShadowingId,
        table_id: mainGameTableId,
        name: 'Perseguição',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de seguir outra pessoa em uma multidão sem ser notado. (Use Rastreamento e Furtividade quando estiver no campo.) Faça um Contesto entre sua Perseguição e a Visão da vítima a cada 10 minutos."
    },
    {
        id: skillsIds.skillSleightOfHandId,
        table_id: mainGameTableId,
        name: 'Prestidigitação',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de 'embolsar' objetos pequenos, fazer truques com moedas e cartas, etc. Cada sucesso em um teste de perícia permite realizar um pequeno 'truque de mágica'. Uma falha significa que você estragou o truque."
    },
    {
        id: skillsIds.skillStreetwiseId,
        table_id: mainGameTableId,
        name: 'Manhas de Rua',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de se dar bem com 'más companhias'. Um teste de perícia bem-sucedido pode permitir descobrir onde qualquer tipo de atividade ilegal está acontecendo; quais policiais ou burocratas locais podem ser subornados e por quanto; como contatar o submundo local, etc."
    },
    {
        id: skillsIds.skillTrapsId,
        table_id: mainGameTableId,
        name: 'Armadilhas',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de construir armadilhas e dispositivos de detecção e como neutralizá-los. Um teste de Armadilhas bem-sucedido permite detectar uma armadilha, se você estiver procurando por ela; desarmar uma armadilha após a detecção; rearmá-la depois de passar; ou (com material apropriado) construir uma nova."
    },
    {
        id: skillsIds.skillUnderwaterDemolitionId,
        table_id: mainGameTableId,
        name: 'Demolição Subaquática',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Medium',
        description: "Perícia em preparar e detonar uma carga explosiva debaixo d'água. Caso contrário, igual a Demolição (acima). Se um engenheiro de demolição estiver usando o nível padrão desta perícia, o teste serve apenas para avaliar a preparação da carga."
    },
    {
        id: skillsIds.skillVentriloquismId,
        table_id: mainGameTableId,
        name: 'Ventriloquismo',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: "Esta é a capacidade de disfarçar e 'lançar' sua voz a uma curta distância. Um teste de perícia bem-sucedido permite lançar sua voz bem o suficiente para enganar seu público. Modificadores: +5 se você tiver um boneco ou cúmplice para distrair a atenção do público."
    },
    {
        id: skillsIds.skillCyclingId,
        table_id: mainGameTableId,
        name: 'Ciclismo',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de andar de bicicleta sem cair. Você também pode fazer um teste de rolagem com penalidade de -5 para tentar consertar uma bicicleta quebrada, supondo que ferramentas e peças de reposição estejam disponíveis."
    },
    {
        id: skillsIds.skillBoatingId,
        table_id: mainGameTableId,
        name: 'Barcos',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a perícia de manusear canoas, barcos a remo, pequenos barcos a vela, etc. Por definição, um teste de rolagem é necessário ao entrar no barco (para evitar cair na água) e outro para colocar o barco em movimento. O GM pode exigir novos testes sempre que surgir perigo."
    },
    {
        id: skillsIds.skillDrivingId,
        table_id: mainGameTableId,
        name: 'Dirigir',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de dirigir um tipo específico de veículo (uma especialização é necessária). Modificadores: -2 para um veículo de tipo conhecido com o qual você não está familiarizado; -2 ou mais para um veículo em mau estado; -2 ou mais para condições ruins de direção."
    },
    {
        id: skillsIds.skillMotorcycleId,
        table_id: mainGameTableId,
        name: 'Motocicleta',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Easy',
        description: "Esta é a capacidade de pilotar uma motocicleta. Uma especialização é necessária em scooters/motocicletas leves ou motocicletas médias/pesadas. Modificadores: -2 para uma motocicleta desconhecida de tipo conhecido; -4 ou mais para uma motocicleta em mau estado."
    },
    {
        id: skillsIds.skillPilotingId,
        table_id: mainGameTableId,
        name: 'Pilotagem',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de pilotar um tipo específico de aeronave ou espaçonave. Uma especialização é necessária. O nível padrão usa IQ, pois a inteligência é necessária para entender os controles em uma emergência. Mas quando a perícia é aprendida normalmente, é baseada em DX como outras perícias físicas."
    },
    {
        id: skillsIds.skillPowerboatId,
        table_id: mainGameTableId,
        name: 'Barcos a Motor',
        predefinition_type: 'Physical',
        predefinition_difficulty: 'Medium',
        description: "Esta é a capacidade de dirigir todos os tipos de pequenas embarcações motorizadas. Ao usar o nível padrão desta perícia, um teste de DX ou Barcos é necessário ao entrar no barco (para evitar cair na água). Todas as situações perigosas exigem outra rolagem."
    },
    {
        id: skillsIds.skillMeditationId,
        table_id: mainGameTableId,
        name: 'Meditação',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Hard',
        description: 'A capacidade de acalmar a mente e alcançar a paz interior. Pode ser usada para resistir a ataques mentais e recuperar fadiga de esforço mental.'
    },
    {
        id: skillsIds.skillThaumatologyId,
        table_id: mainGameTableId,
        name: 'Taumatologia',
        predefinition_type: 'Mental',
        predefinition_difficulty: 'Very Hard',
        description: 'O estudo acadêmico da magia, incluindo sua teoria, história e princípios subjacentes. Fornece conhecimento de todas as faculdades mágicas.'
    }
]
