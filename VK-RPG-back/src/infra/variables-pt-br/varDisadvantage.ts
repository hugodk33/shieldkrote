import { mainGameTableId } from "./MainUUIDIds/uuidGeral"
import * as disadvantagesIds from "./MainUUIDIds/uuidDisadvantages"

type SeedModifierGameTableDisadvantage = {
  id: string
  table_id: string
  name: string
  costPoints: number
  description: string
}

export const disadvantages: SeedModifierGameTableDisadvantage[] = [
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Hábitos Repugnantes',
    costPoints: 5,
    description: 'O personagem se comporta parte do tempo (ou o tempo todo) de maneira repulsiva aos outros. Pior for o comportamento, maior o número de pontos. Você pode especificar o comportamento na criação do personagem e estimar o bônus com o mestre. Alguns exemplos: cheiro de suor, coceira crônica e tararear o tempo todo poderiam valer -5 pontos cada. Fazer piadas de mau gosto ou cuscar no chão poderiam valer -10 pontos cada. Hábitos dignos de um bônus de -15 pontos são possíveis, mas ficarão por conta da imaginação daqueles depravados o bastante para desejá-los. Subtraia 1 ponto de todos os testes de reação feitos por pessoas capazes de observar seu hábito para cada -5 pontos de bônus obtidos com ele.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Pobreza',
    costPoints: 5,
    description: 'O personagem nasceu pobre, em relação à média de sua cultura, ou perdeu o dinheiro de alguma forma. Ele começará com apenas uma fração do dinheiro que um personagem normalmente recebe na criação, e sua renda é limitada.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Primitivo',
    costPoints: 5,
    description: 'Você pertence a uma cultura com NT inferior ao da campanha e, portanto, não possui conhecimento (ou nível de perícia pré-definido) relacionado a equipamentos de nível tecnológico superior ao seu. Você só pode começar com perícias ou equipamentos de sua cultura.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Estigma Social',
    costPoints: 5,
    description: 'Você pertence a uma raça, classe ou gênero que sua cultura considera inferior. O "estigma" deve ser óbvio para todos que encontrarem você. O valor do bônus depende da penalidade que será usada nos testes de reação: Cidadão de segunda classe: -5 pontos. Minoria: -10 pontos. Estrangeiro/Barbárico: -15 pontos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Idade',
    costPoints: 3,
    description: 'Seu personagem tem mais de 50 anos na criação do personagem. Isso significa que você deve fazer uma série de testes para verificar uma possível redução dos valores de seus atributos devido à idade avançada. Bônus: -3 pontos por ano acima de 50.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Visão Ruim',
    costPoints: 10,
    description: 'O personagem pode ser miope ou hipermétrope. Se for miope, não será capaz de ler letras pequenas a uma distância maior que 30 cm. Se for hipermétrope, terá grandes dificuldades para ler um livro e sua Destreza estará sujeita a uma penalidade de -3.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Albinismo',
    costPoints: 10,
    description: 'O personagem não possui pigmentação natural em seu corpo; seu cabelo e sua pele são brancos e seus olhos são rosados. Um albino sempre será notado e não consegue se misturar a uma multidão. Ele recebe 1 ponto de dano a cada 30 minutos de exposição ao sol direto.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Cegueira',
    costPoints: 50,
    description: 'O personagem não consegue enxergar. Como compensação parcial, ele poderia começar com Audição Aguda e/ou Paladar e Olfato Agudos, pagando apenas metade dos pontos necessários. Além disso, não estará sujeito a nenhuma penalidade por agir no escuro.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Daltonismo',
    costPoints: 10,
    description: 'O personagem não é capaz de distinguir nenhuma cor. No dia a dia, essa anomalia não passa de um incômodo. No entanto, em situações que exigem identificação de cores, o mestre deve impor dificuldades apropriadas.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Surdez',
    costPoints: 20,
    description: 'Você não consegue ouvir nada. Qualquer informação deve ser transmitida por escrito ou em linguagem de sinais. Você também estará sujeito a uma penalidade de -3 em seu atributo IQ ao aprender qualquer idioma diferente do seu.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Nanismo',
    costPoints: 15,
    description: 'O personagem é um anão por razões genéticas, anormalmente baixo para sua espécie. Determine sua altura normalmente e depois reduza-a em 60%. Ele também não pode ter Aparência Física igual à média.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Epilepsia',
    costPoints: 30,
    description: 'O personagem está sujeito a convulsões, durante as quais seus membros ficam imobilizados e ele é incapaz de falar ou pensar claramente. Sempre que estiver em uma situação de tensão, ele deve fazer um teste de HT. Uma falha provoca a convulsão, que durará 1D minutos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Eunuco',
    costPoints: 5,
    description: 'O personagem (apenas homens) perdeu sua masculinidade através de um acidente ou ação hostil. Ele será imune à sedução e será incapaz de seduzir os outros.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Obesidade',
    costPoints: 10,
    description: 'O personagem será extraordinariamente gordo para sua raça. Determine seu peso normalmente e depois aumente-o em 50%. Isso resulta em uma penalidade de -1 em todos os testes de reação e seu HT nunca pode ser maior que 15.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Gigantismo',
    costPoints: 10,
    description: 'O personagem é um gigante por questões genéticas, anormalmente grande para sua espécie. Determine sua altura normalmente e depois aumente-a em 20%. Ele estará sujeito a uma penalidade de -2 em todos os testes de reação.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Dificuldade de Audição',
    costPoints: 10,
    description: 'O personagem não é surdo, mas perdeu parte da audição. Ele estará sujeito a uma penalidade de -4 em todos os testes de Audição e perícias de idiomas.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Hemofilia',
    costPoints: 30,
    description: 'O personagem é hemofílico. Qualquer ferimento, por menor que seja, não cicatrizará a menos que seja enfaixado, e o personagem sangrará até a morte. Qualquer ferimento não tratado sangrará a uma taxa igual ao número de pontos de dano por minuto.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Deficiência Física',
    costPoints: 15,
    description: 'O personagem tem certo grau de redução em sua mobilidade. Perna Amputada: -15 pontos. Perna de Pau: -25 pontos. Sem pernas ou paraplégico: -35 pontos.'
  },
  {
    id: disadvantagesIds.disadvantageLowPainThresholdId,
    table_id: mainGameTableId,
    name: 'Baixo Limiar de Dor',
    costPoints: 10,
    description: 'O personagem é muito sensível a todos os tipos de dor. Dobre o "efeito de choque" devido a qualquer ferimento. Ele estará sempre sujeito a uma penalidade de -4 ao tentar resistir à tortura.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Mudez',
    costPoints: 25,
    description: 'O personagem não é capaz de falar. Toda a comunicação deve ser feita por escrito ou em linguagem de sinais. Um personagem mudo recebe um bônus de +3 em todos os testes de Mímica/Pantomima ou Linguagem de Sinais.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Sem Olfato/Paladar',
    costPoints: 5,
    description: 'Esta é uma doença rara... o personagem não é capaz de sentir cheiro nem gosto de nada. Ele será, portanto, incapaz de detectar certos perigos que as pessoas normais percebem rapidamente.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Um Braço Só',
    costPoints: 20,
    description: 'O personagem perdeu um braço (ou nasceu sem ele). Considere que o braço perdido é o esquerdo se ele for destro, e vice-versa. Ele não poderá usar espada e escudo simultaneamente.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Um Olho Só',
    costPoints: 15,
    description: 'O personagem tem apenas um olho bom. Seu atributo AG estará sujeito a uma penalidade de -1 em situações de combate e/ou aquelas que envolvam coordenação entre mãos e olhos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Uma Mão Só',
    costPoints: 15,
    description: 'O personagem perdeu uma de suas mãos. Ela pode ser substituída por uma prótese apropriada. Uma prótese mecânica sujeita o personagem a uma penalidade de -1 em todos os testes de reação e seu atributo AG será reduzido em 2 pontos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Sobrepeso',
    costPoints: 5,
    description: 'Você não chega exatamente à obesidade — seu peso está um pouco acima da média para sua raça. Determine o peso normalmente a partir do atributo ST e depois aumente-o em 30%. Isso aumenta a Sobrecarga como no caso da Obesidade.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Esquelético',
    costPoints: 5,
    description: 'O personagem é excessivamente magro. Depois de descobrir sua altura, verifique o peso "médio" para essa altura e reduza-o em 1/3. Seu atributo HT nunca pode ser maior que 14.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Gagueira',
    costPoints: 10,
    description: 'O personagem sofre de gagueira ou de outro problema de fala. Ele estará sujeito a uma penalidade de -2 em todos os testes de reação onde a conversa for necessária.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Juventude',
    costPoints: 2,
    description: 'O personagem é mais jovem em idade segundo os padrões de sua cultura. A diferença pode variar entre 1 e 3 anos e o bônus será igual a -2 pontos por ano.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Distraível',
    costPoints: 15,
    description: 'A desvantagem clássica dos gênios excêntricos. O personagem tem dificuldade em prestar atenção em qualquer coisa que não seja de interesse imediato. Ele estará sujeito a uma penalidade de -5 em qualquer teste de IQ, com exceção daqueles ligados ao trabalho em que ele está focado.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Vício',
    costPoints: 5,
    description: 'O personagem é viciado em alguma droga que precisa ingerir diariamente ou sofrerá as penalidades da abstinência. O bônus depende do tipo de droga: Drogas baratas: -5 pontos. Drogas caras: -10 pontos. Altamente viciante: -20 pontos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Alcoolismo',
    costPoints: 15,
    description: 'O personagem é viciado em álcool. O álcool é tratado como um vício. Ele é barato, incapacitante e (normalmente) legal. Portanto, vale -10 pontos. Mas o álcool é traiçoeiro, às vezes -15 ou -20 se ilegal.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Mau Gênio',
    costPoints: 10,
    description: 'O personagem não tem controle total de suas emoções. Ele deve fazer um teste de Vontade em qualquer situação de tensão. Uma falha significa que ele perdeu a paciência e deve insultar, atacar ou agir de alguma forma contra a causa de sua explosão.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Fúria Sanguinária',
    costPoints: 15,
    description: 'Como o Mau Gênio, porém pior. O personagem tende a perder o controle de si mesmo quando submetido a alguma tensão, passando a atacar freneticamente quem ele acredita ser a causa de seu problema.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Sede de Sangue',
    costPoints: 10,
    description: 'O personagem deseja ver seus adversários mortos. Em uma batalha ele prefere golpes mortais, disparará mais uma vez para se certificar de ter matado um adversário e atacará guardas quando isso pudesse ser evitado.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Fanfarronice',
    costPoints: 10,
    description: 'Você gosta de intimidar as pessoas sempre que possível, com impunidade. Represente isso por sua conta. Como ninguém gosta de um fanfarrão, seus testes de reação estarão sujeitos a uma penalidade de -2.'
  },
  {
    id: disadvantagesIds.disadvantageCodeOfHonorId,
    table_id: mainGameTableId,
    name: 'Código de Honra',
    costPoints: 5,
    description: 'O personagem tem orgulho em um conjunto de princípios que segue o tempo todo. Um código de honra exige comportamento "viril", "corajoso" e "honroso".'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Paralisia de Combate',
    costPoints: 15,
    description: 'Esta é a situação oposta aos Reflexos de Combate; o personagem tende a ficar paralisado quando se vê em combate. Ele deve fazer um teste de HT (não de IQ) sempre que um ferimento físico parecer iminente.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Compulsão',
    costPoints: 5,
    description: 'Você tem algum hábito (geralmente, mas nem sempre, um vício) do qual se sente compelido a praticar diariamente. Você passa boa parte do seu tempo satisfazendo essa tendência.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Mentira Compulsiva',
    costPoints: 15,
    description: 'O personagem mente constantemente, sem outra razão além do prazer de mentir. Para ser capaz de dizer a pura e simples verdade, um mentiroso compulsivo precisa ter sucesso em um teste contra Vontade-4.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Covardia',
    costPoints: 10,
    description: 'O personagem é extremamente cuidadoso em relação ao seu bem-estar físico. Toda vez que houver necessidade de se arriscar fisicamente, ele deve fazer um teste de Vontade. Se houver risco de vida, o teste será feito com uma penalidade de -5.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Delírios',
    costPoints: 1,
    description: 'O personagem acredita em algo (ou vários) que simplesmente não é (não são) verdade. Isso pode levar os outros a pensar que ele é louco. O valor, em pontos, do Delírio depende de sua natureza.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Dislexia',
    costPoints: 5,
    description: 'Você tem uma deficiência séria. Você é incapaz de aprender a ler ou escrever; até mesmo mapas simples e placas de estrada estão além da sua compreensão.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Fanatismo',
    costPoints: 15,
    description: 'Você acredita intensamente em um país, religião etc., e isso é mais importante do que qualquer outra coisa. Você deve representar seu fanatismo. Note que fanáticos não precisam ser necessariamente insanos ou perversos.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Gula',
    costPoints: 5,
    description: 'Você gosta demais de boa comida e bebida. Se lhe derem a chance, você sempre se empanturrará de provisões extras e nunca perderá uma refeição por vontade própria.'
  },
  {
    id: disadvantagesIds.disadvantageGreedId,
    table_id: mainGameTableId,
    name: 'Ganância',
    costPoints: 15,
    description: 'Você tem paixão por dinheiro. Sempre que algum patrimônio for oferecido como pagamento por um trabalho lícito, saque de uma aventura, pilhagem ou apenas isca, você terá que ter sucesso em um teste de Vontade para resistir à tentação.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Credulidade',
    costPoints: 10,
    description: 'Você nasceu trouxa e seu personagem é um deles. Uma pessoa credula acredita em tudo que ouve. Para não acreditar em uma mentira ou em uma verdade improvável, ele deve ter sucesso em um teste de IQ modificado de acordo com a plausibilidade da história.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Honestidade',
    costPoints: 10,
    description: 'O personagem DEVE obedecer à lei sempre e dar o melhor de si para que os outros façam o mesmo. Ele será compulsivo em relação à lei. Esta é uma desvantagem, porque frequentemente limitará suas opções.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Analfabetismo',
    costPoints: 0,
    description: 'Esta é a condição normal em uma cultura de NT baixo e, nesse caso, não oferece bônus. Em culturas com NT 5+, onde a imprensa é comum, é uma desvantagem.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Impulsividade',
    costPoints: 10,
    description: 'O personagem odeia conversar e pensar. Ele prefere a ação. Quando estiver sozinho, agirá primeiro e pensará depois. Represente essa característica! O personagem deve tentar evitar trabalho, principalmente trabalho duro, a qualquer custo.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Intolerância',
    costPoints: 5,
    description: 'Você não gosta e não confia em pessoas que são diferentes de você. Um personagem completamente intolerante (-10 pontos) terá uma penalidade de -3 em seus testes de reação diante de qualquer pessoa que não pertença à sua raça e/ou classe.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Ciúme',
    costPoints: 10,
    description: 'O personagem tem, automaticamente, uma má reação diante de qualquer pessoa que pareça mais inteligente, mais atraente ou em situação melhor do que ele. Ele também pode se opor a qualquer plano proposto por um "rival", e odiará se outra pessoa estiver em destaque.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Cleptomania',
    costPoints: 15,
    description: 'O personagem se sente compelido a roubar, não necessariamente coisas valiosas, mas qualquer coisa que ele possa levar. Sempre que houver chance de roubar, o personagem deve fazer um teste de Vontade. Uma falha significa que ele deve tentar roubar o objeto.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Preguiça',
    costPoints: 10,
    description: 'O personagem tem uma grande aversão ao trabalho físico. Suas chances de conseguir um aumento ou promoção em qualquer emprego são reduzidas pela metade. Se ele trabalhar por conta própria, sua renda mensal cairá pela metade.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Devassidão',
    costPoints: 15,
    description: 'O personagem sofre de um desejo incontrolável por romance. Em qualquer contato com um membro atraente do sexo oposto, o personagem deve fazer um teste de Vontade. Uma falha significa que ele deve tentar uma cantada, usando todos os artifícios e perícias de que é capaz.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Megalomania',
    costPoints: 10,
    description: 'Você acredita que é o super-homem, ou que foi escolhido para uma grande tarefa, ou que seu destino é conquistar. Comece adotando a desvantagem Fanatismo, sendo que você é fanático por si mesmo!'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Mesquinhez',
    costPoints: 10,
    description: 'Semelhante à Ganância, exceto que o personagem está muito mais interessado no que já possui. Ele deve ter sucesso em um teste de Vontade toda vez que tiver que gastar algum dinheiro, e deve sempre procurar o melhor preço.'
  },
  {
    id: disadvantagesIds.disadvantageOverconfidenceId,
    table_id: mainGameTableId,
    name: 'Autoconfiança',
    costPoints: 10,
    description: 'Você é confiante demais em suas habilidades. Você estará sujeito a uma penalidade de -5 em qualquer teste que envolva dúvida em si mesmo ou cautela. Você tende a subestimar perigos e adversários.'
  }
]
