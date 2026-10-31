export const pericias = [
    {
      nome: "Adestramento de Animais",
      tipo: 'mental',
      dificuldade: 'difícil',
      preDefinido: [['IQ' , 6]],
      preRequisito: null,
      descricao: "Esta é a habilidade de treinar e trabalhar com todos os tipos de animais. Para treinar um animal, o adestrador deve ser bem sucedido em um teste de habilidade em cada dia de treinamento. Uma falha significa que o animal não aprendeu nada. Uma falha crítica significa que o animal atacou o adestrador. O tempo que se leva para adestrar um animal depende da sua inteligência e afabilidade. Veja o cap. Animais, na pág. 140."
    },
    {
        nome: "Falcoaria",
        tipo: 'mental',
        dificuldade: 'média',
        preDefinido: [['IQ' , 6] , ['Adestramento de Animais' , 6] ],
        preRequisito: "Adestramento de Animais",
        descricao: "Esta é a habilidade de caçar pequenos animais usando um falcão treinado. Um bom falcoeiro conhecerá técnicas de caça e treinamento, além de saber como cuidar de um falcão (veja a coluna lateral na pág. 142). Descobrir um ninho de falcão na primavera exige uma semana de busca e um sucesso em um teste de falcoaria. O ninho terá 1D-3 filhotes."
    },
    {
        nome: "Carregamento",
        tipo: 'mental',
        dificuldade: 'difícil',
        preDefinido: [['IQ' , 6] , ['Adestramento de Animais' , 6] ],
        preRequisito: null,
        descricao: "Esta é a habilidade de carregar e descarregar animais com rapidez e eficiência. Ela inclui a habilidade de avaliar corretamente os animais antes da compra, conseguir deles o melhor rendimento possível e selecionar as melhores rotas para as récuas. Sempre haverá demanda de peritos neste assunto em áreas comerciais com NT menor que 6. O ganho será sempre da ordem do salário de um comandante de mercenários. Se uma caravana não tiver no mínimo um mestre-carregador (NH 15+), sua velocidade diminuirá em 20%. O exército americano usou milhares de animais de carga na Segunda Guerra Mundial e teria usado muitos mais, mas não encontrou o número necessário de bons carregadores, e 4 anos de guerra não foram suficientes para treiná-los. Em cenários com NT mais elevado, esta perícia é substituída pela Fretagem, que é menos complexa (Mental/Média) por não exigir a familiaridade com animais."
    },
    {
        nome: "Cavalgar",
        tipo: 'física',
        dificuldade: 'média',
        preDefinido: [['DX' , 5] , ['Adestramento de Animais' , 3] ],
        preRequisito: null,
        descricao: "Esta perícia é diferente para cada tipo de animal (em outras palavras, você precisa escolher um animal no qual deseja se especializar). Se você encontrar um tipo de montaria com o qual não está familiarizado, deverá usar seu nível de habilidade com o tipo de animal mais próximo. Se souber como montar a cavalo, por exemplo, você estaria submetido a um redutor de -3 numa tentativa de cavalgar um camelo, -6 para um golfinho e 0 para uma mula. Você deve fazer um teste de habilidade ao tentar montar um animal pela primeira vez e repeti-lo toda vez que alguma coisa assustá-lo ou provocá-lo (por ex., um salto). Modificadores: +5 se o animal o conhece e gosta de você; -10 se o animal não for uma criatura “comum” de montaria ou não tiver sido treinado como tal."
    },
    {
        nome: "Carreiro",
        tipo: 'mental',
        dificuldade: 'média',
        preDefinido: [['DX' , 5] , ['Adestramento de Animais' , 3] ],
        preRequisito: null,
        descricao: "Esta é a perícia na condução de juntas de animais, como um carroção. Ela inclui a habilidade de atrelar e cuidar dos animais, e de avaliá-los antes de uma compra. Conduzir um grupo com mais de 4 animais, ou um grupo com animais desconhecidos, submete o NH do personagem a um redutor de -2. Cada espécie de animal exige uma perícia diferente. O nível pré-definido em cada uma delas é igual ao nível em qualquer uma das outras -3. Cavalos e mulas são cobertos pela mesma perícia. Quando um carroção ou uma carga (um canhão, p.ex.) for movimentado a galope (mais de 30 km/h ou 10 hexes/turno), o condutor deverá fazer um teste de Carreiro a cada 10 segundos, com um redutor que pode ir até -5 devido a um terreno ruim. Uma falha numa jogada significa que a carga foi derrubada. Isto equivale a uma queda de 5 metros (dano igual a 5D-10) para cada homem ou animal envolvido. O condutor precisará ser bem sucedido em testes de Adestramento de Animais para conseguir acalmar os animais. Jogue também 2 dados para cada animal. Um resultado igual a 12 significa uma perna quebrada. O tempo requerido para reacomodar a carga dependerá do que está sendo transportado, do terreno e do clima."
    },
    {
        nome: "Veterinária",
        tipo: 'mental',
        dificuldade: 'difícil',
        preDefinido: [['Medicina' , 5] , ['Adestramento de Animais' , 3] ],
        preRequisito: null,
        descricao: "Esta é a habilidade em cuidar de animais feridos ou doentes. Tratase de uma perícia Médica (veja pág. 56). Modificadores: +5 se o animal já o conhece e confia em você; -2 ou pior se o animal for de um tipo com o qual você não está familiarizado. É permitida uma Especialização opcional (pág. 43)."
    },
    {
        nome: "Artista",
        tipo: 'mental',
        dificuldade: 'difícil',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Esta é a habilidade de desenhar e pintar com beleza e precisão. Um sucesso num teste desta perícia poderia significar (por exemplo) que você fez um desenho bom o suficiente para ajudar na identificação de uma pessoa, desenhar um mapa fácil de seguir ou mesmo pintar um quadro bom o suficiente para trocar por uma refeição. (No último caso, o GM não deverá permitir que o teste seja feito contra o nível pré-definido para a perícia de um personagem que não a tem efetivamente. Sua inteligência pode lhe permitir fazer um desenho acurado, mas nunca bonito.)"
    },
    {
        nome: "Trovador",
        tipo: 'mental',
        dificuldade: 'média',
        preDefinido: [['IQ' , 5] , ['Atuação' , 2]],
        preRequisito: null,
        descricao: "Esta é a habilidade de contar histórias e falar de improviso. O bom uso deste talento permitirá (por exemplo) que você faça um bom discurso político; entretenha um grupo de pessoas ao redor de uma fogueira; incite (ou acalme) um tumulto ou tenha sucesso no papel de “bobo da corte”. Modificadores: +2 se você tiver a vantagem Voz Melodiosa e qualquer bônus devido ao seu Carisma, se o tiver. Se você tentar representar em um idioma que não seja o seu, subtraia 1 de seu NH para cada ponto abaixo de 12 em seu nível de proficiência naquela língua — por exemplo, se você estiver se apresentando em francês e seu NH com esta língua é 8, você estará submetido a um redutor de -4 em sua perícia como Trovador."
    },
    {
        nome: "Dança",
        tipo: 'física',
        dificuldade: 'média',
        preDefinido: [['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a capacidade de executar danças peculiares à sua própria cultura e de aprender novos estilos rapidamente. Modificadores: -5 se a dança for desconhecida. Uma dança ser-lhe-á familiar depois que você conseguir executá-la com sucesso por 3 vezes. Note que algumas deficiências físicas tornam esta perícia completamente impossível!"
    },
    {
        nome: "Poesia",
        tipo: 'mental',
        dificuldade: 'média',
        preDefinido: [['IQ' , 5] , ['Língua' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de compor qualquer tipo de poesia conhecido em sua civilização com “boa” qualidade, em qualquer língua em que você tenha fluência. Um teste de Poesia bem sucedido significa que você compôs um bom poema, num espaço de tempo adequado (determinado pelo GM). Uma falha significa que você não foi capaz de apresentar boas rimas, ou (pelo motivo que for) sua audiência simplesmente não gostou de seu trabalho. Modificadores: -3 (ou pior) se você estiver muito pressionado pelo tempo; +3 (ou mais) se tiver bastante tempo; as mesmas penalidades para língua estrangeira já vistas para “Trovador”."
    },
    {
        nome: "Escultura",
        tipo: 'física',
        dificuldade: 'média',
        preDefinido: [['DX' , 5] , ['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de moldar uma imagem razoavelmente semelhante a um ser humano ou um objeto, usando argila, madeira, marfim ou o que lhe venha às mãos. Para se produzir uma escultura em metal é necessário ter habilidade com forjaria. O tempo necessário é decidido pelo GM. O uso principal da escultura é como meio de vida, mas ela pode ser muito útil para aventureiros. Modificadores: -5 se as ferramentas apropriadas não estiverem disponíveis; -5 se o personagem não estiver familiarizado com o material; -5 se o material for difícil de trabalhar (por ex., mármore)."
    },
    {
        nome: "Canto",
        tipo: 'física',
        dificuldade: 'fácil',
        preDefinido: [['HT' , 4] ],
        preRequisito: null,
        descricao: "O estudo desta perícia está baseado em HT, e não DX. Esta é a habilidade de cantar de modo agradável. Um sucesso em um teste de habilidade significa que a audiência gostou de sua canção. Modificadores: -2 se audiência não entender a língua em que você está cantando; +2 se você tiver a vantagem de Voz Melodiosa."
    },
    {
        nome: "Escrita",
        tipo: 'mental',
        dificuldade: 'média',
        preDefinido: [['IQ' , 5] ],
        preRequisito: null,
        descricao: "Esta é a habilidade de escrever de maneira clara e/ou divertida. Um sucesso em um teste de habilidade significa que o trabalho é legível e acurado. Modificadores: -3 se você estava com pressa; +3 se tinha bastante tempo à disposição; -5 se você estava escrevendo sobre um assunto com o qual não está familiarizado. Esta é a perícia que mais se presta para ganhar o sustento e/ou escrever para o GURPS, mas pode ser de utilidade em uma aventura ... ou depois dela. O relatório de um espião, militar ou detetive particular será muito mais útil se estiver bem escrito!"
    },
    {
        nome: "Acrobacia",
        tipo: 'física',
        dificuldade: 'difícil',
        preDefinido: [['DX' , 6] ],
        preRequisito: null,
        descricao: "Esta é a habilidade de realizar proezas acrobáticas e ginásticas, rolar, tomar tombos, etc. Deve-se fazer um teste para cada truque que você tenta. Esta perícia pode ser conveniente em uma aventura; andar na corda bamba, pirâmides humanas e trapézio, todos têm aplicações práticas. Um teste de Acrobacia pode ser substituído por um teste de DX em qualquer tentativa de saltar, rolar, evitar ser Projetado para Trás e assim por diante. No esforço de se Esquivar de um golpe, um personagem pode tentar uma Esquiva Acrobática (v. pág. 108), um salto ou um rolamento que evite o ataque de uma maneira vistosa. Um sucesso em um teste de Acrobacia reduzirá a distância efetiva de qualquer queda em 5 metros (v. pág. 131). O GM pode aplicar os redutores que achar convenientes quando se tratar de uma proeza particularmente difícil"
    },
    {
        nome: "Controle da Respiração",
        tipo: 'mental',
        dificuldade: 'muito difícil',
        preDefinido: [ ],
        preRequisito: null,
        descricao: "Esta é a habilidade de respirar com a maior eficiência possível. No caso de um sucesso em um teste de habilidade o personagem pode triplicar o tempo que ele é capaz de prender a respiração por qualquer razão (por ex., debaixo d’água). Um sucesso em um teste de habilidade também possibilitará a recuperação de 1 ponto de fadiga em apenas dois minutos (isto não pode ser associado a operações mágicas que recuperam o corpo da fadiga). Normalmente, esta perícia não é conhecida fora das civilizações orientais; o GM poderá torná-la disponível em um cenário futurista."
    },
    {
        nome: "Gravidade Zero",
        tipo: 'mental',
        dificuldade: 'médio',
        preDefinido: [['DX' , 5],['HT' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia de lidar com um ambiente de gravidade zero (queda livre). É necessário um teste quando você entra pela primeira vez em queda livre. Uma falha significa que você se sente enjoado, e será necessário um sucesso em um novo teste de HT para evitar uma sufocação. Trate este caso como se fosse afogamento (v. Natação, pág. 91). Um novo teste será exigido toda vez que o personagem tentar alguma manobra complicada em queda livre. As falhas não o deixarão enjoado; significarão apenas que a tentativa fracassou."
    },
    {
        nome: "Salto",
        tipo: 'física',
        dificuldade: 'fácil',
        preDefinido: [['DX' , 4],['IQ' , 6]],
        preRequisito: null,
        descricao: "Esta é a perícia de fazer o melhor uso possível de sua força quando você salta. Quando o personagem tenta um salto difícil, ele poderá substituir seu NH em Salto por sua ST ou DX."
    },
    {
        nome: "Corrida",
        tipo: 'física',
        dificuldade: 'difícil',
        preDefinido: [ ],
        preRequisito: null,
        descricao: "Esta perícia está baseada em HT, não DX. Ela representa o treino em corridas de curta e longa distância. Se você estudou este assunto, divida o seu NH por 8 (não arredonde) e some o resultado a seu parâmetro Velocidade quando for calcular seu Deslocamento. (Isto afeta o movimento em terra somente). Exemplo: Se seu NH for igual a 18, seu parâmetro Velocidade deverá ser acrescido de 2,25 pontos antes de calcular seu parâmetro Deslocamento. Veja pág. 88."
    },
    {
        nome: "Mergulho",
        tipo: 'mental',
        dificuldade: 'média',
        preDefinido: [['IQ' , 5] , ["Natação" , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em usar equipamentos para respirar debaixo d’água. Para evitar a ingestão de água (o que acarretaria na perda de 1 ponto de ST e em risco de afogamento), é necessário ter êxito no teste feito logo que você entra na água e nos subsqüentes, feitos a cada 30 minutos. Um sucesso no teste da perícia (e neste caso não é lícito usar os níveis pré-definidos), também lhe permitirá notar problemas com o equipamento, se você checá-lo antes de usar."
    },
    {
        nome: "Esqui",
        tipo: 'física',
        dificuldade: 'difícil',
        preDefinido: [['DX' , 6]],
        preRequisito: null,
        descricao: "Esta é a capacidade de esquiar. Um teste de habilidade é requerido quando você começa uma descida, exceto em uma rampa muito fácil, e outro a cada 30 minutos. Uma falha significa que você cai. No caso de uma falha crítica, você sofrerá 1D-1 pontos de dano em um membro escolhido aleatoriamente, e receberá a lesão incapacitante até que o ferimento sare. Se você tiver sofrido 5 pontos de dano, o membro estará na verdade quebrado."
    },
    {
        nome: "Natação",
        tipo: 'física',
        dificuldade: 'fácil',
        preDefinido: [['ST' , 5],['DX' , 4]],
        preRequisito: null,
        descricao: "Esta perícia é usada tanto para nadar (ou boiar em casos de emergência), como para salvar uma vítima de afogamento. Veja Natação (pág. 91), para as regras completas sobre natação, afogamento e salvamento de vidas."
    },
    {
        nome: "Machado ou Maça",
        tipo: 'física',
        dificuldade: 'média',
        preDefinido: [['DX' , 5]],
        preRequisito: null,
        descricao: "Habilidade no uso de qualquer arma pequena e desbalanceada como um machado, machadinha, maça, picareta etc..."
    },
    {
        nome: "Arremesso de Machado",
        tipo: 'física',
        dificuldade: 'fácil',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "Habilidade no arremesso de qualquer machado de arremesso equilibrado, mas não um machado de guerra desbalanceado"
    },
    {
        nome: "Traje de Combate",
        tipo: 'mental',
        dificuldade: 'media',
        preDefinido: [['IQ' , 5],['DX' , 5],['Traje Pressurizado' , 3]],
        preRequisito: null,
        descricao: "Esta é a habilidade em usar um traje blindado auto-propelido, incluindo o armamento correspondente."
    },
        {
        nome: "Armas de Feixe",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade no uso de qualquer tipo de Arma de Feixes Iônicos, laser, atordoadores, etc. Ela inclui tanto armas do tipo pistola, com o fuzil, visto que nenhum deles sofre recuo. Se sua IQ for igual a 10 ou 11, some 1 ponto ao seu NH. Se for maior do que 11, some 2 pontos. Os modificadores são iguais aos descritos para a perícia Armas de Fogo"
    },
    {
        nome: "Armas de Feixe",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "Esta arma só é útil em combates de perto e, na maioria dos casos, é usada em ataques de supresa. Como ela provoca um dano básico muito pequeno, costuma ser usada para golpear a cabeça. Se não desejar provocar uma lesão muito séria, o atacante poderá “bater de leve” (v. pág. 122), não fazendo uso de sua ST total"
    },
    {
        nome: "Armas de Pólvora",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de armas de pólvora, incluindo mosquetões, pistolas e fuzis. Adicione 1 a seu NH, se sua IQ for igual a 10 ou 11, e 2 para o caso de IQ maior ou igual a 12. Os modificadores são iguais aos encontrados em Armas de Fogo, pág 51."
    },
    {
        nome: "Zarabatana",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['DX' , 6]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso da zarabatana, para lançar pequenos dardos (normalmente envenenados). Estes dardos não são capazes de furar as roupas normais, a não ser no caso de um sucesso decisivo, e nunca penetram na roupa ou numa armadura. Se um dardo atinge a pele ou roupa leve, o veneno poderá ter efeito. Modificadores: -2 ou mais no caso de vento"
    },
    {
        nome: "Boleadeiras",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 6]],
        preRequisito: null,
        descricao: "Esta é a perícia no lançamento de boleadeiras (uma tira de couro com dois ou mais pesos atados a suas pontas) para enredar a vítima. São usadas principalmente para parar animais numa tropa, ou na caça de pequenos animais selvagens ou pássaros. Podem também ser usadas em combate. É possível se esquivar ou bloqueá-las, mas uma tentativa de apará-las fará com que elas se enrolem automaticamente na arma usada para tal. Exceção: Uma manobra bem sucedida de aparar com uma arma cortante, cortará as tiras, arruinando as boleadeiras."
    },
    {
        nome: "Arco",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['DX' , 6]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de arcos em geral. Ela cobre também os arcos compostos, apesar de que uma pessoa que nunca tenha visto um antes precisará de um sucesso em um teste de IQ para descobrir como usá-lo corretamente"
    },
    {
        nome: "Briga",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a “perícia”, nada científica, de “sair-no-tapa” num combate de perto. Faça um teste de Briga sempre que atacar o adversário com as mãos ou pés para ver se consegue atingi-lo. Some 1/10 de seu NH em Briga (arredondado para baixo) ao dano provocado. É possível aparar duas vezes por turno (um para cada mão) quando você se defende com as mãos limpas, e seu parâmetro Aparar será igual a 2/3 de seu NH em Briga. Com esta perícia só é possível aparar ataques de mãos, pés e armas usadas em combate de perto."
    },
    {
        nome: "Espada de Lâmina Larga",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5] , ['Espada Curta' , 2]],
        preRequisito: null,
        descricao: "Esta é a “perícia”, nada científica, de “sair-no-tapa” num combate de perto. Faça um teste de Briga sempre que atacar o adversário com as mãos ou pés para ver se consegue atingi-lo. Some 1/10 de seu NH em Briga (arredondado para baixo) ao dano provocado. É possível aparar duas vezes por turno (um para cada mão) quando você se defende com as mãos limpas, e seu parâmetro Aparar será igual a 2/3 de seu NH em Briga. Com esta perícia só é possível aparar ataques de mãos, pés e armas usadas em combate de perto."
    },
    {
        nome: "Broquel",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4] , ['Escudo' , 2]],
        preRequisito: null,
        descricao: "Esta é a “perícia”, nada científica, de “sair-no-tapa” num combate de perto. Faça um teste de Briga sempre que atacar o adversário com as mãos ou pés para ver se consegue atingi-lo. Some 1/10 de seu NH em Briga (arredondado para baixo) ao dano provocado. É possível aparar duas vezes por turno (um para cada mão) quando você se defende com as mãos limpas, e seu parâmetro Aparar será igual a 2/3 de seu NH em Briga. Com esta perícia só é possível aparar ataques de mãos, pés e armas usadas em combate de perto."
    },
    {
        nome: "Besta",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4] , ['Escudo' , 2]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de bestas, incluindo as bestas de balas ou de pedras. Se você tiver esta perícia, saberá como funcionam as máquinas do tipo da besta usadas para sitiar castelos, mas não terá nenhuma habilidade especial no seu uso."
    },
    {
        nome: "Sacar Rápido",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: null,
        preRequisito: null,
        descricao: "Existe uma perícia independente para cada tipo de arma. Ela está disponível para as seguintes armas: Faca, Cassetete, Espada (uma só mão), Espada de Duas Mãos, Flecha (inclusive os virotes de besta), Pistola, Fuzil (incluindo metralhadoras de mão, etc...), pentes, municiador rápido. O GM pode acrescentar uma nova perícia deste tipo para qualquer arma que possa ser sacada rapidamente, mas seja significativamente diferente de todas as armas acima. Esta perícia é usada quando você deseja preparar uma arma que está em seu coldre, bainha, etc... Um sucesso significa que você preparou a arma instantaneamente (isto não conta como manobra) e pode atacar com ela (ou carregar o arco) no mesmo turno. Uma falha significa que você preparou a arma normalmente, mas não pode fazer mais nada neste turno (se era uma flecha você a deixou cair). Uma falha crítica significa que você deixou a arma cair (ou, no caso de flechas, toda a aljava). A vantagem Reflexos em Combate dá um bônus de +1 em testes de Sacar Rápido."
    },
    {
        nome: "Esgrima",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a capacidade de usar as armas dos esgrimistas (rapieira, espadim e sabre). A rapieira é uma arma perfurante longa (alcance 2 hexágonos) e leve. O espadim é uma arma leve, perfurante, mais curta (alcance 1 hexágono) relativamente parecida com um florete moderno com uma ponta. O sabre é uma arma leve, cortante e perfurante. Se você tiver uma arma destas, um escudo pequeno e uma Carga não maior do que leve, seu Aparar será 2/3 de seu NH em Esgrima (arredondado para baixo). Além disso, você pode aparar duas vezes por turno. Se você estiver em Defesa Total, poderá aparar qualquer número de ataques em uma rodada. Muitos esgrimistas carregam uma adaga como segunda arma. Ela também pode aparar (apara 3 ataques por rodada), mas apenas com a habilidade normal do esgrimista em aparar com uma Faca. A única desvantagem do aparar do esgrimista é que suas armas são muito leves e podem quebrar quando usadas para aparar"
    },
    {
        nome: "Mangual",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['DX' , 6]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de armas desbalanceadas, com a cabeça ligada ao cabo por uma corrente ou corda, tal como o mangual, morningstar ou o nunchaku. O mangual é difícil de se usar, mas difícil de se oferecer defesa também. Qualquer tentativa de bloquear uma destas armas está submetida a um redutor de -2. Qualquer tentativa de aparar tem um redutor de -4. Facas e armas de Esgrima não podem aparar um Mangual. Defesas de artes marciais podem aparar um mangual, mas com um redutor de -4."
    },
    {
        nome: "Armas de Fogo",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de qualquer tipo de arma de cartucho do séc. XX. Some 1 a seu nível de habilidade, se tiver IQ igual a 10 ou 11, e 2 para IQ 12+. Modificadores: Veja Familiaridade, (pág. 43). -2 para uma arma de um tipo conhecido com a qual não se está familiarizado (ex.: calibre . 22 quando se está acostumado com calibre 38); - 4 ou mais para uma arma em más condições; - 4 ou mais para uma arma de tipo desconhecido (ex.: um fuzil quando se está acostumado a atirar com pistolas). Todos os modificadores descritos para armas de projétil, devem ser aplicados."
    },
    {
        nome: "Judô",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta perícia representa uma habilidade geral em tombos e chaves e não uma escola específica de combate desarmado. Não é possível usar Judô se tiver alguma coisa nas mãos ou se sua Carga for maior do que Leve. Usando Judô, será possível aparar com qualquer uma das mãos como se ela fosse uma arma, usando 2/3 de seu NH em Judô como seu Aparar. A chance de se machucar ao aparar uma arma com as mãos também é menor (v. pág. 101)."
    },
    {
        nome: "Caratê",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta perícia não representa nenhuma escola específica de combate desarmado e sim uma habilidade geral com socos e chutes. Não existe penalidade para o uso da mão esquerda. Qualquer mão que venha a ser usada deverá estar vazia, e sua Carga deve ser Leve ou menos. É possível aparar com qualquer uma das mãos como se ela fosse uma arma, usando 2/3 de seu NH em Caratê como seu Aparar."
    },
    {
        nome: "Faca",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "A perícia no uso, mas não no arremesso, de qualquer tipo de faca, adaga ou estilete."
    },
    {
        nome: "Arremesso de Faca",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4]],
        preRequisito: null,
        descricao: "A habilidade de arremessar qualquer espécie de faca."
    },
    {
        nome: "Lança de Justa",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 6] , ['Lança' , 3]],
        preRequisito: "Cavalgar",
        descricao: "Esta é a perícia no uso da lança de justa, uma arma parecida com uma lança normal, com um comprimento maior ou igual a 3,5 m, usada a cavalo. Não é comum aparar em um combate com lanças de justa; é preciso Bloquear ou se Esquivar dos ataques do inimigo."
    },
    {
        nome: "Laço (Reata)",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a perícia no arremesso do laço ou reata. Ela é usada principalmente para laçar animais. Pode-se tentar laçar uma parte específica do corpo, ou escolher uma aleatoriamente na Tabela de Partes do Corpo. Faça uma Disputa Rápida de ST, se o laço tiver prendido um braço ou o tronco do adversário. Se o laçador vencer, a vítima estará imobilizada, mas se ele perder, terá perdido a corda. Se a cabeça tiver sido laçada, a vítima estará submetida a um redutor de -5 na Disputa de ST. Se um pé tiver sido laçado, a vítima terá que ser bem sucedida em um teste de DX para permanecer em pé (DX - 4 se a vítima estava correndo quando foi laçada) e não haverá necessidade de disputa de ST. Se o teste de DX resultar em falha, a vítima sofrerá 1D - 4 pontos de dano devido à queda (1D-2 se a vítima estava correndo)."
    },
    {
        nome: "Rede",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a perícia no uso da rede como uma arma em uma luta. É possível se esquivar de uma rede, mas não bloquear nem aparar. No caso de um arremesso bem sucedido, a vítima estará envolvida e incapaz de se mover ou atacar até a rede ser removida. Para remover uma rede você precisa de três sucessos, não necessariamente consecutivos, em testes de DX. Modificadores: - 4 quando se tem as duas mãos livres; -6 quando se tem uma só mão livre, ou no caso de animais. Se ocorrerem três falhas consecutivas, a vítima estará tão embaraçada, que será necessário cortar a rede para libertá-la. Uma rede para animais pesa 9 kg e pode ser arremessada a uma distância de (ST/2) metros mais 1/5 do NH com a rede (arredondado para baixo)."
    },
    {
        nome: "Armas de Haste",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5]],
        preRequisito: null,
        descricao: "Perícia no uso de armas de haste muito longas e desbalanceadas, incluindo a acha d’armas, a alabarda, a bisarma e as centenas de variações do tipo."
    },
    {
        nome: "Escudo",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4] , ['Broquel' , 2]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de um escudo do tipo medieval ou daqueles usados pelas tropas de choque. Esta perícia é necessária para atacar com o Escudo. No entanto a defesa passiva oferecida pelo escudo (1 a 4 pontos) protege quem o carrega, mesmo que ele não saiba como usá-lo. A defesa ativa de um escudo (no Bloqueio) é 1/2 de seu NH com o Escudo. Logo, você será capaz de bloquear muito melhor se tiver estudado a perícia do que se usar seu nível pré-definido. O atributo DX de uma pessoa média é 10, ou seja o nível prédefinido de sua habilidade com o Escudo é 6 e seu Bloqueio será 3. Veja também"
    },
    {
        nome: "Espadas Curtas",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5] , ['Espada de Lâmina Larga' , 2]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de qualquer tipo de arma balanceada com 30 a 60cm de comprimento, incluindo o terçado, o gládio e o bastão."
    },
    {
        nome: "Funda",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['DX' , 6]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso da funda ou fustíbalo."
    },
    {
        nome: "Lança",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5] , ['Bastão' , 2]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso (mas não arremesso) de qualquer tipo de lança, dardo, tridente, baioneta, pique ou arma longa, leve e pontuda."
    },
    {
        nome: "Arremessador de Lança",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 4] , ['Arremesso de Lança' , 4]],
        preRequisito: null,
        descricao: "Este aparelho, e a perícia em sua utilização, são diferentes da perícia Arremesso de Lanças, mas o nível pré-definido de uma é igual ao da outra - 4. Um Arremessador de Lança é uma vara longa e chata com um entalhe e uma alça em uma das pontas. Ela aumenta a força com que um dardo, ou outra arma similar, é arremessado, aumentando a ST efetiva de quem usa (para determinação de alcance e dano provocado) em 5 pontos. É necessário um turno para colocar a lança no arremessador depois que ambos estão à mão e prontos. Modificadores: -5 em lugares apertados (precisa de um espaço aéreo vazio pelo menos até 2 m além da altura do atirador para uso eficaz)."
    },
    {
        nome: "Arremesso de Lança",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4] , ['Arremessador de Lança' , 4]],
        preRequisito: null,
        descricao: "Habilidade no arremesso de qualquer tipo de lança, dardo, etc."
    },
    {
        nome: "Rapidez de Recarga",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a habilidade em carregar rapidamente uma arma de fogo. Não é a mesma coisa que Sacar Rápido, mas você poderia, usando as perícias certas, recarregar muito rapidamente sacando um municiador rápido ou um pente de seu cinto ou bolso e colocando na arma."
    },
    {
        nome: "Bastão",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['DX' , 5] , ['Lança' , 2]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso do Bastão ou de qualquer haste ou vara improvisada como Bastão. Este é um tipo de arma empunhada com as duas mãos. Seu Aparar será 2/3 de seu nível de habilidade."
    },
    {
        nome: "Machado de Duas Mãos/Maça",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5]],
        preRequisito: null,
        descricao: "Habilidade na utilização de qualquer arma longa, pesada e não balanceada como, por exemplo, o machado de batalha ou a marreta."
    },
    {
        nome: "Espadas de Duas Mãos",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia no manuseio de uma arma de lâmina longa (1m a 1,5m) com as duas mãos. Note que a cimitarra é usada com esta perícia quando empunhada com as duas mãos, mas com o NH em Espadas de Lâmina Larga quando empunhada com apenas uma."
    },
    {
        nome: "Chicote",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a habilidade em usar um chicote como uma arma. Existem chicotes de vários comprimentos. Em termos de jogo, um chicote com 1 m de comprimento tem um alcance de 1 m. Na verdade, ele deveria ter 1,20 m de comprimento. O tempo necessário para re-preparar um chicote depende de seu comprimento: 0 turnos para um chicote de 1 m; 1 turno para um chicote de 2 m; 2 turnos para um chicote de 3 m ou mais. Os chicotes podem ter até 6,5 m de comprimento. É impossível atingir um alvo a 1 m de distância, ou menos, com um chicote de 2 m de comprimento."
    },
    {
        nome: "Chicote",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a habilidade em usar um chicote como uma arma. Existem chicotes de vários comprimentos. Em termos de jogo, um chicote com 1 m de comprimento tem um alcance de 1 m. Na verdade, ele deveria ter 1,20 m de comprimento. O tempo necessário para re-preparar um chicote depende de seu comprimento: 0 turnos para um chicote de 1 m; 1 turno para um chicote de 2 m; 2 turnos para um chicote de 3 m ou mais. Os chicotes podem ter até 6,5 m de comprimento. É impossível atingir um alvo a 1 m de distância, ou menos, com um chicote de 2 m de comprimento."
    },
    {
        nome: "Armeiro",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Ferreiro' , 3]],
        preRequisito: null,
        descricao: "Esta é a habilidade na construção e conserto de armas e armaduras no nível tecnológico apropriado. É necessário um sucesso em um teste para descobrir qual o problema com a arma (a menos que ele seja óbvio). Um segundo sucesso permitirá que o personagem a conserte. O GM deve determinar um período de tempo razoável para cada tentativa de conserto. Modificadores: -4 se a arma não for familiar; -4 se não tiver as ferramentas apropriadas (-5 em NT 9+)."
    },
    {
        nome: "Ferreiro",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Joalheiro' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade de trabalhar manualmente com ferro e outros metais não-preciosos. Para este trabalho é necessário uma forja, mas dispondo do material adequado, um ferreiro é capaz de construir uma em mais ou menos 30 dias. Modificador: -1 para cada ponto de ST abaixo de 13"
    },
    {
        nome: "Carpintaria",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4] , ['DX' , 4]],
        preRequisito: null,
        descricao: "Esta é a perícia na fabricação de objetos de madeira. Um sucesso em uma jogada de teste permite a realização de uma hora de trabalho competente de carpintaria. Uma falha significa que o resultado do trabalho foi ruim. Modificadores: +5 se você estiver sendo supervisionado ou assistido por alguém com NH 15+; -5 se não tiver boas ferramentas."
    },
    {
        nome: "Culinária",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade no preparo de uma refeição agradável, a partir da matéria prima (não apenas água, calor e lataria). Em qualquer sociedade “ao ar livre”, esta perícia incluirá a habilidade de limpar a caça, ou seja, preparar um animal recém abatido para o cozimento."
    },
    {
        nome: "Joalheiro",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Ferreiro' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade no trabalho com metais preciosos de todos os tipos, fabricação de jóias, decoração de armas e assim por diante. É necessário uma forja (veja Ferreiro, acima) para trabalhar o metal. Um joalheiro é capaz de identificar qualquer metal precioso, ou determinar o valor de qualquer bugiganga preciosa, se conseguir um sucesso em um teste de habilidade."
    },
    {
        nome: "Trabalhos em Couro",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4] , ['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia em se trabalhar com couro para fazer cintos, selas, armaduras, etc... Alguém que tenha esta perícia será capaz de fabricar objetos novos ou consertar usados. Com um sucesso em um teste de habilidade, ele é capaz de determinar o valor de um objeto de couro."
    },
    {
        nome: "Mecânica",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Engenheria' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade em diagnosticar e resolver problemas mecânicos comuns, geralmente, mas nem sempre, no motor de um veículo. "
    },
    {
        nome: "Cerâmica",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia no trabalho com vários tipos de cerâmica. Um oleiro é capaz de fazer potes e outros utensílios de argila. Com um sucesso em um teste de habilidade, ele será capaz de identificar a argila apropriada (para tijolos ou utensílios domésticos); determinar a origem ou o valor de um objeto de cerâmica; etc..."
    },
    {
        nome: "Marcenaria",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5] , ['Carpintaria' , 3]],
        preRequisito: null,
        descricao: "Esta é a perícia na execução de trabalhos “finos” em madeira; construção de móveis, entalhes decorativos, etc. Com um sucesso em um teste de habilidade, um marceneiro é capaz de determinar a origem e o valor justo de um entalhe em madeira, ou identificar o tipo de madeira usado"
    },
    {
        nome: "Mímica",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 5] , ['Linguagem de Sinais' , 0]],
        preRequisito: null,
        descricao: "Esta é a habilidade de se comunicar através de simples sinais improvisados com as mãos. Indivíduos surdos e/ou mudos têm um bônus de +3 no uso desta perícia. Um sucesso em um teste de Mímica/ Pantomima permitir-lhe-á comunicar uma idéia simples para uma outra pessoa, ou entender uma comunicada por outrem. "
    },
    {
        nome: "Linguagem de Sinais",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é qualquer uma das verdadeiras linguagens de gestos. Uma das mais conhecidas é a American Sign Language (Ameslan). Outros exemplos poderiam ser a língua de uma raça alienígena sem fala, um código de sinais usado por espiões ou revolucionários, etc. Uma linguagem de sinais é complexa, estilizada e pode comunicar praticamente qualquer conceito. O conhecimento de uma linguagem de sinais não implica no entendimento das outras, mas você será capaz de perceber que algum tipo de linguagem está sendo usado, se for bem sucedido em um teste de IQ. Indivíduos mudos e/ou surdos receberão um bônus de +3 em testes de Linguagem de Sinais"
    },
    {
        nome: "Telegrafia",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a habilidade de enviar e receber em código Morse, realizar pequenos reparos em sistemas de telegrafia e reconhecer outros operadores de telégrafo pela sua “caligrafia”, i.e., a sua maneira característica de enviar uma mensagem. Esta perícia é encontrada normalmente entre os níveis tecnológicos 5 e 7. A partir do nível 8, os seres humanos raramente enviam (eles mesmos) mensagens em código. Eles usam um computador para isto."
    },
    {
        nome: "Medicina",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['Veterinária' , 5] , ['Primeiros Socorros' , 11] , ['IQ' , 7]],
        preRequisito: null,
        descricao: "Esta é a habilidade profissional genérica de socorrer doentes, prescrever medicamentos e tratamentos, etc. Quando um GM exigir um teste de Competência ou do conhecimento médico geral, ele será feito contra esta perícia. Um médico tem a opção de adotar uma especialização."
    },
    {
        nome: "Cirurgia",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: [['Veterinária' , 5] , ['Medicina' , 5] , ['Fisiologia' , 8] , ['Primeiro Socorros' , 12]],
        preRequisito: "Medicina",
        descricao: "Esta perícia é usada quando alguém tenta operar um personagem para curar doenças, ferimentos ou disfunções do organismo. Um cirurgião pode, opcionalmente, se especializar em uma determinada parte do organismo."
    },
    {
        nome: "Escalada",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['DX' , 5] , ['ST' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em escalar montanhas, muros de pedra, árvores, paredes de edifícios e qualquer outra coisa que apareça em seu caminho. Modificadores: +3 se você tiver a vantagem de ter Ultra-flexibilidade das Juntas; menos seu nível de Carga"
    },
    {
        nome: "Pescaria",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade em pegar um peixe (com uma rede, anzol e linha ou qualquer outro método usado pela sua cultura). Se você tiver o equipamento apropriado e peixes para serem apanhados, um sucesso em um teste de habilidade os trará a você. Quando não há material de pesca à disposição, pode-se improvisar. Modificadores: -2 ou pior, dependendo das circunstâncias, devido a um equipamento inadequado (fisgar um tubarão com um alfinete entortado é muito difícil)."
    },
    {
        nome: "Naturalista",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Esta perícia compreende o conhecimento dos animais, das plantas e da natureza em suas várias formas. É o tipo de conhecimento que se esperaria de um bom professor de biologia do século XX. Um sucesso em um teste de habilidade permitirá a identificação de uma planta e sua aplicação, ou lhe dirá algo sobre um animal e seus hábitos. Modificadores: +3 se estiver em território conhecido; até -5 se estiver num ambiente muito estranho."
    },
    {
        nome: "Navegação",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['Astronomia' , 5] , ['Marinhagem' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em saber qual a sua posição (na Terra e não no espaço) pelas estrelas, correntes oceânicas, etc. Um sucesso em um teste de habilidade dirá onde você está, no mar ou em terra. Note que, se você não tiver a perícia e estiver tentando um teste com o nível pré-definido, você não poderá usar seu NH em Marinhagem se não estiver de fato no mar! Obs.: Se você tem esta perícia, seu nível de habilidade não será afetado por um NT mais baixo."
    },
    {
        nome: "Marinhagem",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Esta é a capacidade de tripular uma nave de longo-curso. Você precisará tripular um navio (ou capitaneá-lo!). Modificadores: os redutores padrão relacionados com o NT "
    },
    {
        nome: "Sobrevivência",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Naturalista' , 3] , ['Sobrevivência' , 3]],
        preRequisito: null,
        descricao: "Esta é a perícia em “viver da terra”, encontrar água e comida de boa qualidade, evitar os perigos, construir abrigos, etc... Cada tipo de terreno exige uma perícia diferente"
    },
    {
        nome: "Rastreamento",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Naturalista' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em seguir o rastro deixado por um homem ou animal. Faça um teste de Rastreamento para achar uma pista e mais um a cada 5 minutos de viagem. Modificadores: -5 se a pista tiver mais de uma dia; -10 se tiver mais de uma semana; +5 se estiver seguindo um homem; +10 se estiver seguindo um grupo de homens. O terreno também influi (exemplos: -3 no deserto; -5 sobre terreno rochoso; -10 nas ruas de uma cidade. Todos os bônus de Visão devem ser levados em conta.)."
    },
    {
        nome: "Contabilidade",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 10] , ['Comércio' , 5] , ['Matemática' , 5]],
        preRequisito: "Alfabetização",
        descricao: "Esta é a capacidade de manter atualizados os livros de uma empresa, examinar as condições de um negócio, etc., sendo útil principalmente como um meio de conseguir um emprego. No entanto, um sucesso num teste de Contabilidade (que exigirá mais ou menos 2 horas de estudo) poderá lhe dizer se os registros de uma empresa estão corretos (o que pode ser importante de vez em quando). Modificadores: -5 se você só puder dar uma olhada apressada nos números; +5 se você tiver o dia todo; + 5 se você tiver a vantagem Talento para Matemática."
    },
    {
        nome: "Operação de Computadores",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Esta é a capacidade de operar um computador, extrair dados, executar programas já existentes, jogar video-games, etc... Isto não é a mesma coisa que programação (que é uma perícia à parte e mais difícil). Modificadores: -3 ou mais no caso de um computador ou um programa estranhos. Esta perícia está disponível apenas em NT 7+. Personagens oriundos de NTs mais baixos não podem usar esta perícia como condicionada, a menos que tenham tido tempo para se familiarizar com os computadores."
    },
    {
        nome: "Operação de Aparelhos Eletrônicos",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Eletrônica Adequada' , 3]],
        preRequisito: null,
        descricao: "Esta perícia permite a utilização de equipamento eletrônico dentro de uma especialidade conhecida. Não há necessidade de testes de habilidade para a utilização normal diária do equipamento. Eles são necessários apenas nas situações de emergência, nos casos de uso “anormal” do equipamento ou na utilização de equipamentos complexos por pessoas inexperientes."
    },
    {
        nome: "Heraldica",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Trato Social' , 3]],
        preRequisito: null,
        descricao: "Esta é a perícia em projetar e reconhecer escudos de armas, cores e divisas de um clã e outros emblemas. Se tiver sucesso em um teste de habilidade, um heráldico será capaz de reconhecer um cavaleiro ou um nobre pelo estandarte ou escudo que está sendo conduzido e descrevê-los apropriadamente em termos de heráldica. Poderá também criar brasões dignos e atraentes para novos nobres (sem conflitar com os padrões existentes). A heráldica é também importante em cenários de ficção científica."
    },
    {
        nome: "Jurisprudência",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Modificadores: +4 se o personagem estiver lidando com a Jurisprudência de uma área específica. Um sucesso em um teste de habilidade permitirlhe-á lembrar, deduzir ou conceber uma resposta para uma pergunta sobre a lei. Lembre-se, no entanto, que poucas perguntas legais têm uma resposta precisa (até mesmo um especialista será vago ou ambíguo em seus conselhos). Muitos advogados se especializam numa área particular (exs.: marcas e patentes, contratos, defesa criminal)."
    },
    {
        nome: "Agronomia",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a ciência do cultivo de vegetais. Um agrônomo poderia responder a perguntas ou resolver problemas relacionados com a agricultura e a pecuária. Um fazendeiro experiente é um agrônomo, quer ele conheça a palavra, quer não."
    },
    {
        nome: "Alquimia",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a ciência das transmutações mágicas."
    },
    {
        nome: "Antropologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo da cultura e evolução da humanidade. Um antropólogo conhece os costumes dos grupos primitivos (e não-tão-primitivos) de seres humanos (ou de outras criaturas inteligentes que eles estudem). Os testes de Antropologia poderiam ser usados para explicar, ou até predizer, os rituais e costumes estranhos que um viajante poderia encontrar."
    },
    {
        nome: "Arqueologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo das civilizações antigas. Um arqueólogo se sente em casa com escavações, cacos de louça de barro, inscrições, etc. No caso de um sucesso em um teste de habilidade, um arqueólogo é capaz de responder perguntas sobre história antiga, identificar artefatos e línguas mortas, etc. Às vezes um arqueólogo terá informações relacionadas com o ocultismo (ex.: Segredos Antigos e Coisas que Não Estão Destinadas ao Conhecimento Humano)."
    },
    {
        nome: "Arquitetura",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia no projeto de edifícios e a inferência da forma dos edifícios a partir de sua função e vice-versa. Um sucesso em um teste de Arquitetura lhe permitiria tirar conclusões sobre um edifício desconhecido, encontrar um aposento ou passagem secreta, etc. Modificadores: -2 se o edifício for de um tipo desconhecido; -5 se for alienígena."
    },
    {
        nome: "Astronavegação",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['Navegação' , 5] , ['Astronomia' , 4] , ['Matemática' , 4]],
        preRequisito: null,
        descricao: "Esta perícia está relacionada com a navegação espacial e interestelar. Existe uma perícia diferente para cada tipo de propulsão mais rápida do que a luz. Cada uma destas perícias pode ter seu nível pré-definido por uma outra com um redutor que pode ir até -4, dependendo de quão diferentes são os sistemas de propulsão. Os modificadores e conseqüências das falhas ficam por conta do GM, visto que esta perícia pode ser definida de maneira muito diferente em universos diferentes. (Além disso, em alguns cenários de Ficção Científica a perícia poderia não ser Média.)"
    },
    {
        nome: "Astronomia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo das estrelas e outros corpos siderais. Um astrônomo seria capaz de resolver problemas relacionados com o Sol, os planetas do sistema solar, meteoritos e assim por diante. Em NT 4 e abaixo, esta perícia se confunde com a Astrologia, combinando o conhecimento das estrelas e constelações com uma grande quantidade de mitologia e previsão do futuro."
    },
    {
        nome: "Bioquímica",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: [['Química' , 6]],
        preRequisito: "Química",
        descricao: "Este é o estudo da química dos seres vivos. Um bioquímico é um especialista nas reações químicas que sustentam a vida."
    },
    {
        nome: "Botânica",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Agronomia' , 5]],
        preRequisito: null,
        descricao: "Este é o estudo das plantas. Um botânico seria capaz de identificar plantas, fazer suposições quanto ao habitat e propriedades de uma planta desconhecida, etc..."
    },
    {
        nome: "Química",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo da matéria. Um químico seria capaz de identificar os elementos, compostos simples (não necessariamente medicamentos ou substâncias mágicas, etc.). De posse do equipamento adequado ele seria capaz de realizar análises e sínteses complexas."
    },
    {
        nome: "Programação de Computadores",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: "Operação de Computadores",
        descricao: "Este é o estudo da matéria. Um químico seria capaz de identificar os elementos, compostos simples (não necessariamente medicamentos ou substâncias mágicas, etc.). De posse do equipamento adequado ele seria capaz de realizar análises e sínteses complexas."
    },
    {
        nome: "Criminologia",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Este é o estudo da matéria. Um químico seria capaz de identificar os elementos, compostos simples (não necessariamente medicamentos ou substâncias mágicas, etc.). De posse do equipamento adequado ele seria capaz de realizar análises e sínteses complexas."
    },
    {
        nome: "Ecônomia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 4] , ['Comércio' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo do dinheiro, câmbio e transações bancárias. Um economista poderia responder a questões sobre investimentos, programas econômicos, etc. Ele seria capaz também de predizer os efeitos locais de mudanças econômicas (introdução de novos materiais ou técnicas, destruição de uma usina elétrica ou mercado e situações similares)."
    },
    {
        nome: "Ecologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Naturalista' , 3]],
        preRequisito: null,
        descricao: "Este é o estudo das relações entre os seres vivos, ou de todo o ambiente. Esta ciência não existe em NT abaixo de 6. Use Naturalista em seu lugar. Um ecologista seria capaz de dizer (por exemplo) quais criaturas são vitais para um ambiente e quais não; se o homem seria capaz de se adaptar a um ambiente novo; que efeito uma determinada mudança poderia ter sobre o meio-ambiente ou que papel uma certa criatura desempenha em seu habitat."
    },
    {
        nome: "Eletrônica",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: "Matemática",
        descricao: "Esta é a engenharia eletrônica, a habilidade de projetar e construir aparelhos eletrônicos. Um teste bem sucedido permitiria, p.ex., determinar o propósito de um dispositivo desconhecido, diagnosticar uma falha, realizar um conserto, projetar novos sistemas, desenvolver um artifício para resolver um problema"
    },
    {
        nome: "Engenharia Mecânica",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: "Matemática",
        descricao: "Esta é a perícia no projeto e construção de mecanismos complexos. Um sucesso em um teste permitirá (por exemplo) determinar o propósito de um mecanismo desconhecido, diagnosticar um problema elétrico ou mecânico, fazer um reparo, projetar um novo mecanismo, improvisar um aparelho para resolver um problema. "
    },
    {
        nome: "Técnicas Judiciais",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['Criminologia' , 4]],
        preRequisito: null,
        descricao: "Esta é a ciência geral da criminologia “laboratorial”: cálculo da trajetória de balas, análise química ou microscópica de pistas, etc. Dependendo da situação o GM poderá permitir o uso de Química ou outro campo de estudo apropriado como nível pré-definido para Técnicas Judiciais em uma investigação particular."
    },
    {
        nome: "Genética",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: [['Bioquímica' , 5] , ['Fisiologia' , 5]],
        preRequisito: null,
        descricao: "Este é o estudo da hereditariedade. Um geneticista seria capaz de identificar doenças genéticas, saberia como cruzar os animais a fim de desenvolver determinadas características além de impedir que as moscasdas-frutas devastem seu laboratório. A especialidade Engenharia Genética passa a existir em NT9+."
    },
    {
        nome: "Geologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Prospecção' , 5]],
        preRequisito: null,
        descricao: "Esta é a ciência que estuda a Terra. Um geólogo estuda os minérios, rochas, petróleo, conhece terremotos, vulcões e fósseis. Em Campanha, ele seria capaz de achar água usando sua “sensibilidade para o campo” como na Perícia Sobrevivência"
    },
    {
        nome: "História",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Arqueologia' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo do passado registrado (em oposição à arqueologia que estuda o passado pré-histórico). Um historiador seria capaz de dirimir dúvidas sobre história e poderia ter permissão para (a critério do GM) fazer um teste para ver se lembra de um paralelo histórico útil: - “Bom, Aníbal enfrentou uma situação parecida com esta uma vez e fez o seguinte...”."
    },
    {
        nome: "Lingüística",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Este é o estudo dos princípios nos quais as línguas estão baseadas. Um lingüista seria capaz de identificar um idioma pouco conhecido a partir de um fragmento de um texto escrito ou falado, se for bem sucedido em seu teste de habilidade. Adicione 1/10 de seu NH nesta perícia (arredondado para baixo), se você a tiver estudado, ao seu nível de habilidade em qualquer língua que porventura venha a aprender."
    },
    {
        nome: "Literatura",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo das grandes obras literárias. Um estudante de literatura teria conhecimento dos domínios da poesia antiga, volumes empoeirados, filosofia, crítica, etc. Isto pode ser útil para achar pistas de tesouros escondidos, continentes submersos, segredos para os quais os homens não estão preparados e coisas similares. O trabalho em questão deve estar escrito em uma língua conhecida pelo personagem. Modificadores: -5 se ele for analfabeto (tradição oral)"
    },
    {
        nome: "Matemática",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Isto representa o conhecimento geral de matemática. Apesar de existirem dezenas de especialidades, é pouco provável que a diferença entre elas afete o jogo. Um matemático pode fazer testes de habilidade para responder qualquer tipo de problema relacionado com matemática. Se o problema for simplesmente um cálculo ou avaliação, o GM poderá estipular um modificador devido aos recursos de computação disponíveis."
    },
    {
        nome: "Metalografia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['Ferreiro' , 8],['Joalheiro' , 8] , ['Armeiro' , 8] , ['Química' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo dos metais e suas propriedades. Um metalógrafo seria capaz de identificar metais ou ligas e resolver problemas relacionados aos metais, sua mineração e refino."
    },
    {
        nome: "Metereologia",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Este é o estudo do clima e a possibilidade de predizê-lo. O GM sempre faz testes de habilidade em Metereologia para o jogador. Um bom resultado significa que ele dirá a verdade, enquanto uma falha implicará em uma resposta aleatória ou uma mentira."
    },
    {
        nome: "Física Nuclear",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: [['IQ' , 5]],
        preRequisito: [["Matemática" , 15] , ["Matemática" , 15]],
        descricao: "Este é o estudo dos processos nucleares. Um físico nuclear seria capaz de responder perguntas sobre o interior do sol, armas e/ou usinas nucleares."
    },
    {
        nome: "Ocultismo",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo do inexplicável e/ou sobrenatural. Um ocultista tem um conhecimento muito intenso de misticismo, doutrinas mágicas primitivas, rituais antigos, obsessões, etc... Lembre-se que um ocultista não tem que necessariamente acreditar no material que ele estuda. Em mundos onde a magia é comum, o “ocultismo” deverá ser substituído pelo conhecimento profissional dos magos."
    },
    {
        nome: "Física",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo do inexplicável e/ou sobrenatural. Um ocultista tem um conhecimento muito intenso de misticismo, doutrinas mágicas primitivas, rituais antigos, obsessões, etc... Lembre-se que um ocultista não tem que necessariamente acreditar no material que ele estuda. Em mundos onde a magia é comum, o “ocultismo” deverá ser substituído pelo conhecimento profissional dos magos."
    },
    {
        nome: "Fisiologia",
        tipo: 'Mental',
        dificuldade: 'Very Hard',
        preDefinido: [['IQ' , 7]],
        preRequisito: null,
        descricao: "Este é o estudo do corpo humano e suas funções. Um fisiologista sabe onde estão localizados e como funcionam os músculos, ossos e órgãos."
    },
    {
        nome: "Prospecção",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Geologia' , 4]],
        preRequisito: null,
        descricao: "Esta é a geologia aplicada: a habilidade de descobrir minerais valiosos através da inspeção local. A prospecção à distância, com o uso de mapas e instrumentos, exige o conhecimento de Geologia. Um prospector estará submetido a um redutor de -1 em uma área nova de tipo familiar, e -2 ou mais em uma área de um tipo com o qual ele não está familiarizado, até que ele fique ali por tempo suficiente (um mês de trabalho)."
    },
    {
        nome: "Psicologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo do comportamento. Um psicólogo lida com a mente humana (e possivelmente com outros tipos também). Um sucesso em um teste de Psicologia pode predizer, em termos gerais, o comportamento de um indivíduo ou grupo pequeno em uma situação definida, principalmente em uma situação de tensão. Modificadores: +3 se o psicólogo conhecer bem o paciente; +3 se o psicólogo tiver a vantagem da Empatia e se encontrar com o paciente; +3 se o paciente sofrer de um desvio bem conhecido, i.e., sofrer de uma fobia ou outro problema mental."
    },
    {
        nome: "Pesquisa",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Escrita' , 3]],
        preRequisito: null,
        descricao: "Esta perícia pode também ter seu nível pré-definido por qualquer perícia científica (submetida a um redutor de -2), se você estiver pesquisando material relacionado com ela. Pesquisa é a capacidade geral de fazer uma investigação em uma biblioteca ou arquivo. Um sucesso em um teste de Pesquisa num lugar apropriado permitirá que você descubra algum fragmento de informação útil, se for algo para ser descoberto."
    },
    {
        nome: "Teologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Este é o estudo da religião. Um teólogo tem conhecimentos sobre credos religiosos antigos e modernos, história das religiões, etc. Você deveria considerar a hipótese de ter esta perícia, com especialização em sua própria religião, se seu personagem for um sacerdote ou santo."
    },
    {
        nome: "Zoologia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Esta é o estudo dos animais. Um zoólogo é capaz de identificar animais, ter uma boa idéia sobre sua dieta natural, seus hábitos e habitat, e prever seu comportamento."
    },
    {
        nome: "Dissimulação",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6] , ['Trovador' , 5] , ['Atuação' , 2]],
        preRequisito: null,
        descricao: "Esta é a habilidade de simular estados de ânimo, emoções e vozes e de mentir convincentemente por um período de tempo. Não é a mesma coisa que Disfarce e Atuação. Um sucesso em um teste de habilidade lhe permitirá fingir que pensa ou sente alguma coisa que você não sente. Modificadores: +1 para cada ponto de IQ que você tem a mais do que a pessoa que está tentando enganar (ou o mais inteligente do grupo) e -1 para cada ponto de IQ que a vítima tiver a mais do que você."
    },
    {
        nome: "Administração",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6] , ['Comércio' , 3]],
        preRequisito: null,
        descricao: "Esta é a habilidade de dirigir uma grande organização. Ela é útil principalmente para ganhar dinheiro ou se qualificar para ocupar altos postos. Um administrador treinado (nível maior ou igual a 15) receberá um bônus de +2 quando estiver lidando com um burocrata e, no caso de um sucesso em um teste de habilidade, será capaz de prognosticar qual a melhor forma de lidar com uma burocracia."
    },
    {
        nome: "Conhecimento do Terreno",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Esta é a familiaridade com o povo, política e geografia de uma determinada área. Normalmente um personagem terá Conhecimento do Terreno apenas da área que ele considera sua “base”, seja isto uma simples fazenda ou todo um sistema solar. O GM poderá permitir que os personagens estudem Conhecimento do Terreno para outros lugares, se houver informação disponível. Os espiões, por exemplo, tentarão adquirir um Conhecimento do Terreno detalhado dos lugares onde irão operar."
    },
    {
        nome: "Boemia",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['HT' , 4]],
        preRequisito: null,
        descricao: "Esta perícia é “comprada” com base no seu atributo HT e não DX. É a habilidade em participar de atividades sociais, festas, etc... Um sucesso em um teste de Boemia, feito sob as circunstâncias adequadas, lhe dará um bônus de +2 num pedido de ajuda ou informação, ou apenas numa reação geral. Uma falha significa que, de alguma maneira, você fez papel de bobo; há um redutor de -2 para qualquer teste de reação daquelas pessoas com quem você já farreou. Se você bebe em lugares impróprios, uma falha pode acarretar noutros perigos. Modificadores: de acordo com o GM, mas até +3 por pagar bebida ou outras diversões para seus companheiros de farra."
    },
    {
        nome: "Diplomacia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Esta é a habilidade em negociar, fazer acordos e conviver com os outros. Um teste de Diplomacia pode ser substituído por qualquer teste de reação numa situação em que não haja iminência de combate (v. Testes de Influência, pág. 93). Um teste bem sucedido lhe permitirá predizer os possíveis resultados de um curso de ação enquanto está negociando, ou escolher a melhor abordagem a fazer. Se você tiver um NH maior ou igual a 20 (especialista) em Diplomacia, receberá um bônus de +2 em todos os testes de reação. Modificadores: +2 se tiver a vantagem de Voz Melodiosa."
    },
    {
        nome: "Lábia",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Dissimulação' , 5]],
        preRequisito: null,
        descricao: "Esta é a capacidade de persuadir os outros a fazerem coisas contra seu bom-senso. Ela não é ensinada (pelo menos intencionalmente) nas escolas; ela é aprendida enquanto se trabalha como vendedor, vigarista, advogado, etc. Se seu NH em Lábia for maior ou igual a 20 (especialista), você receberá um bônus de +2 em todos os testes de reação em que conseguir falar. O GM pode exigir que o jogador dê detalhes da história que ele está contando, ao invés de simplesmente permitir que diga “Estou usando minha Lábia”."
    },
    {
        nome: "Jogo",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Matemática' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade com jogos de azar. Um sucesso em um teste de Jogo poderá lhe dizer, entre outras coisas, se o jogo é limpo ou não, identificar um jogador em meio a um grupo de estranhos, ou avaliar as chances em uma situação complicada. Quando estiver jogando contra a casa, faça somente seu teste de habilidade (com um modificador, se o GM disser que a chance é pequena). "
    },
    {
        nome: "Liderança",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['ST' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia na coordenação de um grupo de pessoas em uma situação de tensão ou perigo. É necessário algum nível de liderança para conseguir um posto numa organização militar ou paramilitar. É preciso um sucesso em um teste de Liderança para conduzir os NPCs a uma situação de perigo (os jogadores poderão decidir por seus personagens, se eles o seguirão ou não). "
    },
    {
        nome: "Comércio",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a perícia no trato comercial, comprando e vendendo mercadorias. Ela envolve um talento para vendas, compreensão das práticas comerciais e psicologia. No caso de um sucesso em um teste de habilidade, um Comerciante será capaz (entre outras coisas) de, em termos de sua cultura, avaliar um bem, descobrir onde um determinado artigo é comprado ou vendido, descobrir o valor local de mercado de qualquer artigo, etc. Modificadores: -3 se o artigo for ilegal, a menos que ele tenha Manha num nível 12+, ou seja especializado neste tipo de material. "
    },
    {
        nome: "Sex-Appeal",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['HT' , 3]],
        preRequisito: null,
        descricao: "Baseada em HT e não IQ. Esta é a capacidade de impressionar o sexo oposto. Ela pode ser estudada somente nas horas de folga (um máximo de 3 horas por dia), a menos que você faça parte de um harém ou coisa parecida. O Sex Appeal tem tanto a ver com suas atitudes, quanto com a aparência. Se não desejar “seduzir” alguém para obter o que quer, você não terá, nem desejará, este talento. Modificador: +2 se tiver a Vantagem da Voz Melodiosa. Dobre todas as Desvantagens relacionadas com a aparência física."
    },
    {
        nome: "Estratégia",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Tática' , 6] , ['Estratégia' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade de planejar ações militares e prever as do inimigo. Normalmente é ensinada apenas por militares. Um sucesso em um teste de habilidade lhe permitirá deduzir os planos militares do inimigo, a menos que eles sejam liderados por alguém que tenha esta perícia. Neste caso, o GM deverá fazer uma Disputa de Habilidades entre os 2 estrategistas. Se o personagem do jogador perder, ele fará uma conjectura errada (i.e., o GM lhe dará informações erradas) acerca dos planos inimigos. A quantidade de informação conseguida dependerá de quão bom foi o seu resultado no teste, mas não da qualidade dos planos do inimigo. Uma malta uivante usa estratégia — apenas não o sabe e por isso é fácil de prever."
    },
    {
        nome: "Tática",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Estratégia' , 6]],
        preRequisito: null,
        descricao: "Esta é a habilidade de planejar ações militares e prever as do inimigo. Normalmente é ensinada apenas por militares. Um sucesso em um teste de habilidade lhe permitirá deduzir os planos militares do inimigo, a menos que eles sejam liderados por alguém que tenha esta perícia. Neste caso, o GM deverá fazer uma Disputa de Habilidades entre os 2 estrategistas. Se o personagem do jogador perder, ele fará uma conjectura errada (i.e., o GM lhe dará informações erradas) acerca dos planos inimigos. A quantidade de informação conseguida dependerá de quão bom foi o seu resultado no teste, mas não da qualidade dos planos do inimigo. Uma malta uivante usa estratégia — apenas não o sabe e por isso é fácil de prever."
    },
    {
        nome: "Pedagogia",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "É a habilidade em ensinar outras pessoas. Para poder ensinar alguém, você precisa conhecer a perícia que está sendo estudada num nível maior do que o de seu aluno. Para fins de jogo, qualquer um com um nível maior ou igual a 12 deveria poder agir como um professor na maioria das situações. Se for vital para a aventura que um assunto difícil seja ensinado a alguém, deverá ser exigido um teste. Se houver alguma barreira de língua, o GM também deverá fazer testes para verificar se o professor e o aluno estão se comunicando convenientemente."
    },
    {
        nome: "Camuflagem",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4] , ['Sobrevivência' , 2]],
        preRequisito: null,
        descricao: "Esta é a perícia no uso de elementos naturais e/ou pintura para se disfarçar e esconder sua posição, equipamento, etc. Para determinar se a camuflagem foi bem feita, deve-se fazer uma Disputa de Habilidades (Visão vs. Camuflagem). Dependendo das circunstâncias, a camuflagem poderá esconder seu objetivo inteiramente ou apenas tornar indistinto o seu contorno, para fazê-lo mais difícil de atingir (redutor de -1 no NH do atacante)."
    },
    {
        nome: "Demolição",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['Engenharia' , 3]],
        preRequisito: null,
        descricao: "Esta é a habilidade de explodir coisas. Toda vez que você for usar explosivos, será necessário um teste de Demolição. São necessários de 15 a 60 minutos para instalar explosivos de maneira adequada e detonálos. Um sucesso em um teste de habilidade significa que tudo foi bem. Uma falha indicará que você cometeu um engano; quanto pior o resultado do teste, pior o erro. Um resultado muito ruim com uma carga perto de você poderá mandá-lo pelos ares. Modificadores: -3 para um equipamento desconhecido; -2 se estiver com pressa; +2 se você tiver todo o tempo do mundo."
    },
    {
        nome: "Detecção de Mentiras",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Psicologia' , 4]],
        preRequisito: null,
        descricao: "Esta é a capacidade de dizer se alguém está mentindo ou não. Não é a mesma coisa que Interrogatório; a Detecção de Mentiras funciona em situações informais e sociais. Quando você pedir para usar esta perícia, o GM fará uma Disputa Rápida de Habilidades entre sua Detecção de Mentiras e a IQ de seu alvo (ou Lábia, ou Dissimulação). Se você vencer, o GM lhe dirá se ele estava mentindo. Se você perder, o GM mentirá acerca da veracidade do que lhe diziam, ou dirá apenas “Você não tem como saber”."
    },
    {
        nome: "Disfarce",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6] , ['Psicologia' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade de se fazer parecer com uma outra pessoa, através do uso de roupas, maquiagem, etc. São necessários 30 a 60 minutos para preparar um bom disfarce. Faça uma Disputa Rápida de Habilidades (normalmente Disfarce vs. IQ) para cada pessoa (ou grupo) que seu disfarce precisa enganar. Pessoas com perícias profissionais na área de Poderes Legais ou espionagem podem usar estas perícias no lugar de IQ, quando estiverem tentando desmascarar um impostor. Modificadores: +2 se você tiver todos aqueles pós e pinturas à disposição (não ajuda no caso de um teste com nível pré-definido): -1 a -5 (a cargo do GM) para se disfarçar em alguém muito diferente de você. Se tiver uma aparência muito díspar, ela também diminuirá seu NH efetivo em 1 a 5 pontos (opção do GM). Grupos grandes de pessoas poderão requerer vários testes de habilidade (novamente opção do GM)."  
    },
    {
        nome: "Disfarce",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6] , ['Psicologia' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade de se fazer parecer com uma outra pessoa, através do uso de roupas, maquiagem, etc. São necessários 30 a 60 minutos para preparar um bom disfarce. Faça uma Disputa Rápida de Habilidades (normalmente Disfarce vs. IQ) para cada pessoa (ou grupo) que seu disfarce precisa enganar. Pessoas com perícias profissionais na área de Poderes Legais ou espionagem podem usar estas perícias no lugar de IQ, quando estiverem tentando desmascarar um impostor. Modificadores: +2 se você tiver todos aqueles pós e pinturas à disposição (não ajuda no caso de um teste com nível pré-definido): -1 a -5 (a cargo do GM) para se disfarçar em alguém muito diferente de você. Se tiver uma aparência muito díspar, ela também diminuirá seu NH efetivo em 1 a 5 pontos (opção do GM). Grupos grandes de pessoas poderão requerer vários testes de habilidade (novamente opção do GM)."  
    },
    {
        nome: "Fuga",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em se soltar de cordas, algemas e atilhos semelhantes. A primeira tentativa de escapar leva 1 minuto; cada tentativa subseqüente levará 10 minutos. Modificadores: Quanto mais cuidadosamente você estiver preso, maior será o redutor que o GM aplicará ao teste: No caso de algemas modernas, por exemplo, o redutor seria igual a -5. Se você tiver a vantagem “Ultra-flexibilidade das Juntas” (pág. 20), terá um bônus de +3 nesta perícia."  
    },
    {
        nome: "Falsificação",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['DX' , 8] , ['Artista' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de falsificar uma cédula, passaporte ou outro documento similar. Ela não é ensinada a não ser por organizações de espionagem e pelo submundo, apesar de que você sempre pode estudála sozinho. Será necessário um teste de habilidade toda vez que um documento falsificado que você está usando for inspecionado (a menos que você consiga um sucesso decisivo na primeira tentativa)."  
    },
    {
        nome: "Ocultamento",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 5] , ['Prestidigitação' , 8]],
        preRequisito: null,
        descricao: "Esta é a habilidade de esconder objetos em seu corpo ou no de outras pessoas (normalmente com a cooperação delas). É também a habilidade de encontrar estes objetos escondidos por outrem."  
    },
    {
        nome: "Serviço Secreto",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "A capacidade de analisar e interpretar informações secretas (normalmente militares) a fim de avaliar os planos e recursos do inimigo."  
    },
    {
        nome: "Interrogatório",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a capacidade de interrogar um prisioneiro. Só é ensinada nos serviços secretos, polícias, penitenciárias, unidades militares e submundo."  
    },
    {
        nome: "Leitura Labial",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['Visão' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de ver o que os outros estão dizendo. Para realizála é necessário estar a uma distância menor do que 6 metros, ou usar magia ou binóculos para fazer uma aproximação visual. Cada teste bem sucedido permitirá que você capte uma frase da conversa (presumindo, é claro, que você entende o idioma que está sendo falado). "  
    },
    {
        nome: "Arrombamento",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de abrir fechaduras, cadeados e cofres sem ter a chave ou a combinação. Cada tentativa gasta 1 minuto. Se você for bem sucedido e conseguir abrir o cadeado/fechadura, cada ponto da sua margem de sucesso diminuirá 5 segundos do tempo gasto. (Uma casaforte, um cofre ou uma fechadura desafiadora podem exigir mais tempo, segundo a vontade do Mestre.) Note que se a fechadura tiver uma armadilha ou alarme ligado a ela, será necessário um teste de Armadilhas para ver se você consegue evitá-lo. Modificadores: -3 se você tiver apenas equipamento improvisado ao invés de gazuas verdadeiras; -5 se estiver escuro (trabalhando só com o tato); até +5 devido a equipamento de boa qualidade em cenários com NT alto. Informação “de dentro” dá bônus segundo critério do GM."  
    },
    {
        nome: "Punga",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: [['DX' , 6] , ['Prestidigitação' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade de tirar uma carteira, faca, etc., de alguém, ou “plantar” alguma coisa nele. Modificadores: +5 se a vítima estiver distraída; + 10 se ela estiver adormecida ou bêbada; até -5 para valores em um bolso interno e até -10 para um anel ou jóia similar."  
    },
    {
        nome: "Venefício",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: [['IQ' , 6] , ['Química' , 4] , ['Medicina' , 3]],
        preRequisito: null,
        descricao: "Tem também como nível pré-definido Culinária-3 ou Trato Social3 na cultura adequada. Este é o conhecimento prático geral de venenos. Um teste bem sucedido permitir-lhe-á (entre outras coisas) reconhecer no campo uma planta portadora de veneno, destilar o veneno em uma forma útil, reconhecer um veneno pelo seu sabor em comida ou bebida, identificar um veneno pela observação de seus efeitos (bônus de +3 se for você a vítima), conhecer o antídoto adequado, reconhecer ou destilar o antídoto a partir de suas fontes. Note que cada uma destas proezas exige um teste separado. Modificadores: Olfato e Paladar apurados ajudarão na identificação do veneno."  
    },
    {
        nome: "Captação",
        tipo: 'Mental',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade em encontrar, recuperar ou improvisar objetos úteis que outros não são capazes de localizar. Cada tentativa leva uma hora. O parasita não rouba necessariamente seu butim — ele apenas o localiza (de algum modo) e depois o obtém pelos meios que forem necessários. Note que se o parasita encontrar alguma coisa que está “presa”, ele deverá decidir sobre como tentará se apoderar dela, e talvez venha a ser necessário um teste de alguma outra perícia. Modificadores: Os que o GM achar necessários devido à raridade do objeto procurado."  
    },
    {
        nome: "Sombra",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6] , ['Furtividade' , 4]],
        preRequisito: null,
        descricao: "Esta é a habilidade de seguir uma outra pessoa em uma multidão sem ser notado. (Use Rastreamento e Furtividade quando estiver no campo.) Faça uma Disputa entre sua Sombra e a Visão da vítima a cada 10 minutos. Se ela vencer, você a terá perdido de vista. Se vencer por mais de 5 pontos, você terá sido visto. Modificadores: -2 ou mais (decisão do GM) se sua aparência for ímpar e -3 se a vítima o conhecer."  
    },
    {
        nome: "Prestidigitação",
        tipo: 'Physical',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a habilidade de “empalmar” pequenos objetos, fazer truques com moedas e cartas, etc. Cada sucesso em um teste de habilidade permitir-lhe-á fazer um pequeno “truque de mágica”. Uma falha significa que você errou o truque. Modificadores: -3 se a pessoa que você quer enganar tiver Visão Aguçada ou conhecer Prestidigitação; +3 se a iluminação for deficiente; +3 se você tiver um cúmplice para distrair a atenção da vítima; +5 se você tiver se preparado antecipadamente (cartas na manga, etc...)."  
    },
    {
        nome: "Furtividade",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em se esconder e mover silenciosamente. Um sucesso em uma jogada de teste indicará que você é capaz de se esconder em qualquer lugar, menos num aposento completamente vazio, ou se movimentar tão quietamente que ninguém irá escutá-lo, ou seguir alguém sem ser notado (para seguir alguém no meio de uma multidão use a perícia Sombra já descrita). Modificadores: menos seu nível de Carga; -5 para se esconder em uma área sem “esconderijos” naturais; -5 para se mover silenciosamente se você estiver correndo ao invés de andar; -5 para enganar cães ao invés de pessoas."  
    },
    {
        nome: "Manha",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de conviver bem com “má-companhia”. Um sucesso em um teste desta perícia pode (entre outras coisas) permitir que você descubra onde qualquer tipo de “ato” ilegal está ocorrendo; quais policiais ou burocratas locais podem ser comprados e por quanto; como contatar o submundo local, etc. Note que se você pertencer a uma organização com bons contatos (Sindicato dos Assassinos, Irmandade, polícia, Illuminati, etc...), poderá ser capaz de conseguir esta informação perguntando a um contato. “Manha” é uma medida de sua capacidade de fazer seus próprios contatos quando necessário."  
    },
    {
        nome: "Armadilhas",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['DX' , 5] , ['Arrombamento' , 3]],
        preRequisito: null,
        descricao: "Esta é a perícia na construção de armadilhas e aparelhos de detecção e como anulá-los. Um sucesso em um teste de Armadilhas possibilitará (entre outras coisas) a detecção de uma armadilha, se você estiver procurando por isso; desarmar uma armadilha depois de descoberta, rearmá-la depois de passar; ou (tendo o material apropriado) construir uma nova. Lembre-se que uma armadilha pode ser qualquer coisa variando entre um poço com estacas e um elaborado sistema de segurança. Tempo: O mesmo que para Arrombamento (pág. 67). Modificadores: Infinitamente variável. Quanto mais sofisticada a armadilha, mais difícil será vê-la e desarmá-la. Note que uma armadilha pode ser (por exemplo) fácil de achar, mas difícil de desarmar. Isto tudo fica por conta do GM ou do autor da aventura. Os modificadores de Visão ajudam a achar as armadilhas, mas não a desarmá-las. É importante salientar que, se você não tem esta perícia, o GM deveria fazer um teste de DX (nível pré-definido da perícia) somente para desarmar a armadilha e NÃO para detectar ou construir uma."  
    },
    {
        nome: "Demolição Subaquática",
        tipo: 'Mental',
        dificuldade: 'Medium',
        preDefinido: [['Demolição' , 2]],
        preRequisito: ['Mergulho' ,'Demolição'],
        descricao: "Habilidade na preparação e detonação de uma carga explosiva debaixo d’água. De resto, igual à Demolição (acima). Se um engenheiro de demolição estiver usando o nível pré-definido nesta perícia, o teste só servirá para avaliar a preparação da carga. Se a instalação da carga exigir trabalho sob a água, ele terá que jogar contra o nível pré-definido de Mergulho, ou encontrar alguém para posicionar os explosivos, pois seu treinamento em Demolição não envolve instruções sobre mergulho."  
    },
    {
        nome: "Ventriloquismo",
        tipo: 'Mental',
        dificuldade: 'Hard',
        preDefinido: null,
        preRequisito: null,
        descricao: "Esta é a habilidade em disfarcar e “lançar” sua voz a uma pequena distância. Um sucesso em um teste de habilidade permitirá que você lance sua voz bem o suficiente para enganar sua audiência. Modificadores: +5 se você tiver um boneco ou cúmplice para distrair a atenção da audiência (é mais fácil “ver” uma face falar do que é acreditar que a voz vem de um objeto imóvel); -3 se a audiência tiver motivos para suspeitar."  
    },
    {
        nome: "Ciclismo",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['DX' , 4] , ['Motociclismo' , 0]],
        preRequisito: null,
        descricao: "Esta é a habilidade em andar de bicicleta sem cair. Pode-se também fazer uma jogada de teste com redutor de -5 para tentar consertar uma bicicleta avariada, admitindo-se que as ferramentas e partes sobressalentes estão à disposição."  
    },
    {
        nome: "Remo",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['DX' , 5] , ['Motonáutica' , 3]],
        preRequisito: null,
        descricao: "Esta é a perícia no trato com canoas, barcos a remos, pequenos barcos a vela, etc. Por definição, é necessário uma jogada de teste quando se entra no bote (para evitar cair n’água) e outra para pôr o bote em movimento. O GM pode exigir novos testes sempre que surgir um perigo. Modificadores: -5 se o barco não for de um tipo familiar (se você já tiver esta perícia, um dia de experiência, será suficiente para se familiarizar com o novo tipo); o mau tempo imporá um redutor de -3 ou pior."  
    },
    {
        nome: "Condução",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['DX' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade em conduzir um tipo específico de veículo (é necessário uma especialização — pág. 43). Modificadores: -2 para um veículo de um tipo conhecido com o qual não se está familiarizado (ex.: de hidramático para câmbio manual); -2 ou mais para um veículo em mau estado; -2 ou mais para más condições de condução; -4 ou mais para um veículo de um tipo desconhecido (ex.: Modelo T quando se está acostumado a veículos de NT 7, ou um carro de corrida quando se está acostumado com um stock car). Note que a perícia necessária para conduzir uma parelha não é Condução, mas sim Carreiro"  
    },
    {
        nome: "Motociclismo",
        tipo: 'Physical',
        dificuldade: 'Easy',
        preDefinido: [['IQ' , 5] , ['DX' , 5] , ['Ciclismo' , 5]],
        preRequisito: null,
        descricao: "Esta é a habilidade de conduzir uma motocicleta. É necessário se especializar em lambretas/motos leves, ou em motos médias e pesadas. Modificadores: -2 para uma moto não familiar de um tipo conhecido (ex.: Uma Harley quando sua moto é uma Shogun); -4 ou mais para uma moto em mau estado; -2 ou mais para uma estrada em más condições; -4 ou mais para uma moto de um tipo desconhecido (ex.: uma moto de um nível tecnológico diferente); +3 se a moto tiver side-car."  
    },
    {
        nome: "Pilotagem",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 6]],
        preRequisito: null,
        descricao: "Esta é a habilidade de pilotar um tipo específico de aeronave ou espaçonave. É necessário uma especialização (pág.43). O nível prédefinido usa IQ, pois é preciso inteligência para entender os controles em uma emergência. Mas quando a perícia é aprendida normalmente, ela está baseada em DX como as outras perícias físicas."  
    },
    {
        nome: "Motonáutica",
        tipo: 'Physical',
        dificuldade: 'Medium',
        preDefinido: [['IQ' , 5] , ['DX' , 5] , ['Remo' , 3]],
        preRequisito: null,
        descricao: "Esta é a habilidade para dirigir todos os tipos de pequenas embarcações motorizadas (v. Remo/Vela e Marinhagem para embarcações não motorizadas). Quando se está usando o nível pré-definido desta perícia é necessário fazer um teste de DX ou Remo/Vela quando se entra no barco (para evitar cair na água). Todas as situações de perigo exigem uma outra jogada. Modificadores: -4 se o barco for de um tipo não familiar; mau tempo imporá um redutor de -3 ou pior."  
    }
]
