import { characterGalarhornId, characterLyraId, characterKaelId } from "./MainUUIDIds/uuidCharacters"

type SeedPeculiarity = {
  id: string
  character_id: string
  name: string
  costPoints: number
  effect: string
}

export const  peculiarities: SeedPeculiarity[] = [
  {
    id: crypto.randomUUID(),
    character_id: characterGalarhornId,
    name: 'Bad Temper',
    costPoints: -5,
    effect: '-2 reaction rolls when provoked.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterGalarhornId,
    name: 'Night Owl',
    costPoints: -5,
    effect: 'Harder to sleep at night, +1 alertness after midnight.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterGalarhornId,
    name: 'Fragile Bones',
    costPoints: -10,
    effect: '+1 injury roll from falls and blunt trauma.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Curious',
    costPoints: -5,
    effect: 'Cannot resist investigating mysteries.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Low Pain Threshold',
    costPoints: -10,
    effect: 'Poor tolerance for injury.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Pacifism (Reluctant Killer)',
    costPoints: -5,
    effect: 'Avoids taking lives whenever possible.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Collects rare books',
    costPoints: -1,
    effect: 'Spends spare coin on rare tomes.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Talks to herself while studying',
    costPoints: -1,
    effect: 'May draw attention in quiet places.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Prefers tea over ale',
    costPoints: -1,
    effect: 'Dislikes tavern culture.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Keeps detailed journals',
    costPoints: -1,
    effect: 'Spends time writing instead of resting.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterLyraId,
    name: 'Sleeps very little',
    costPoints: -1,
    effect: 'Prone to fatigue from lack of rest.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Greed',
    costPoints: -15,
    effect: 'Has difficulty ignoring valuable treasures.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Secret',
    costPoints: -10,
    effect: 'Wanted by a major thieves guild.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Overconfidence',
    costPoints: -5,
    effect: 'Often takes unnecessary risks.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Flips coins when nervous',
    costPoints: -1,
    effect: 'Fidgeting habit may reveal anxiety.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Never refuses a wager',
    costPoints: -1,
    effect: 'Easily baited into risky bets.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Dislikes guards',
    costPoints: -1,
    effect: 'Hostile attitude toward law enforcement.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Collects lockpicks',
    costPoints: -1,
    effect: 'Hoards tools of the trade.'
  },
  {
    id: crypto.randomUUID(),
    character_id: characterKaelId,
    name: 'Always plans an escape route',
    costPoints: -1,
    effect: 'Reflexively maps exits in any building.'
  }
]