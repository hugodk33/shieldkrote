import { characterGalarhornId, characterLyraId, characterKaelId } from "./MainUUIDIds/uuidCharacters"

type SeedPeculiarity = {
    id: string
    character_id: string
    name: string
    costPoints: number
    effect: string
}

export const peculiarities: SeedPeculiarity[] = [
    {
        id: crypto.randomUUID(),
        character_id: characterGalarhornId,
        name: 'Mau Gênio',
        costPoints: -5,
        effect: '-2 em rolagens de reação quando provocado.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterGalarhornId,
        name: 'Coruja Noturna',
        costPoints: -5,
        effect: 'Dormir à noite é mais difícil, +1 de vigilância depois da meia-noite.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterGalarhornId,
        name: 'Ossos Frágeis',
        costPoints: -10,
        effect: '+1 na rolagem de ferimentos por quedas e traumas contusos.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Curioso',
        costPoints: -5,
        effect: 'Não resiste a investigar mistérios.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Limiar de Dor Baixo',
        costPoints: -10,
        effect: 'Baixa tolerância a ferimentos.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Pacifismo (Matador Relutante)',
        costPoints: -5,
        effect: 'Evita tirar vidas sempre que possível.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Coleciona livros raros',
        costPoints: -1,
        effect: 'Gasta moedas sobrando em tomos raros.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Fala consigo mesma enquanto estuda',
        costPoints: -1,
        effect: 'Pode chamar atenção em lugares silenciosos.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Prefere chá a cerveja',
        costPoints: -1,
        effect: 'Não gosta da cultura de tavernas.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Mantém diários detalhados',
        costPoints: -1,
        effect: 'Gasta tempo escrevendo em vez de descansar.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterLyraId,
        name: 'Dorme muito pouco',
        costPoints: -1,
        effect: 'Propenso a fadiga por falta de descanso.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Ganância',
        costPoints: -15,
        effect: 'Tem dificuldade em ignorar tesouros valiosos.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Segredo',
        costPoints: -10,
        effect: 'Procurado por uma grande guilda de ladrões.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Excesso de Confiança',
        costPoints: -5,
        effect: 'Frequentemente assume riscos desnecessários.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Lança moedas quando fica nervoso',
        costPoints: -1,
        effect: 'O hábito de ficar inquieto pode revelar ansiedade.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Nunca recusa uma aposta',
        costPoints: -1,
        effect: 'É fácil de provocar para apostas arriscadas.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Não gosta de guardas',
        costPoints: -1,
        effect: 'Atitude hostil em relação às autoridades.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Coleciona ganzuas',
        costPoints: -1,
        effect: 'Acumula as ferramentas da profissão.'
    },
    {
        id: crypto.randomUUID(),
        character_id: characterKaelId,
        name: 'Sempre traça uma rota de fuga',
        costPoints: -1,
        effect: 'Mapeia instintivamente as saídas em qualquer construção.'
    }
]
