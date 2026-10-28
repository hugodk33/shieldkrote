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
    name: 'Disgusting Habits',
    costPoints: 5,
    description: 'The character behaves part of (or all the) time in a way repulsive to others. The worse your behavior, the greater the number of points. You can specify the behavior at character creation and estimate the bonus with the Master. Some examples: Sweaty odor, chronic itching and humming all the time could be worth -5 points each. Making bad taste jokes or spitting on the ground could be worth -10 points each. Habits worthy of a -15 point bonus are possible, but will be left to the imagination of those depraved enough to desire them. Subtract 1 point from all reaction tests made by people capable of observing your habit for each -5 points of bonus obtained with it.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Poverty',
    costPoints: 5,
    description: 'The character was born poor, relative to the average of his culture, or lost his money somehow. He will start with only a fraction of the money a character normally receives when created, and his income is limited.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Primitive',
    costPoints: 5,
    description: 'You belong to a culture with TL lower than that of the campaign and, therefore, have no knowledge (or pre-defined skill level) related to equipment with higher technology level than yours. You are only allowed to start with skills or equipment from your culture.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Social Stigma',
    costPoints: 5,
    description: 'You belong to a race, class or gender that your culture considers inferior. The "stigma" must be obvious to all who meet you. The bonus value depends on the penalty that will be used in reaction tests: Second-class Citizen: -5 points. Minority: -10 points. Foreigner/Barbarian: -15 points.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Age',
    costPoints: 3,
    description: 'Your character is over 50 years old at character creation. This means you must make a series of rolls to verify a possible reduction of your attribute values due to advanced age. Bonus: -3 points for each year above 50.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Bad Sight',
    costPoints: 10,
    description: 'The character can be either nearsighted or farsighted. If nearsighted, he won"t be capable of reading small letters at a distance greater than 30 cm. If farsighted, he will have great difficulties reading a book and his Dexterity will be subject to a -3 penalty.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Albinism',
    costPoints: 10,
    description: 'The Character has no natural pigmentation in his body; his hair and skin are white and his eyes are pink. An albino will always be remembered and is not capable of blending into a crowd. He receives 1 point of damage for each 30 minutes of exposure to direct sun.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Blindness',
    costPoints: 50,
    description: 'The character cannot see. As partial compensation, he could start with Acute Hearing and/or Acute Taste and Smell, paying only half the necessary points. Furthermore, he won"t be subject to any penalty for acting in the dark.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Color Blindness',
    costPoints: 10,
    description: 'The character is not capable of distinguishing any color. In day-to-day, this anomaly is no more than a nuisance. However, in situations that require color identification, the GM should impose appropriate difficulties.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Deafness',
    costPoints: 20,
    description: 'You cannot hear anything. Any information must be transmitted through writing or sign language. You will also be subject to a -3 penalty on your IQ attribute when learning any language other than your own.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Dwarfism',
    costPoints: 15,
    description: 'The character is a dwarf due to genetic reasons, abnormally short for his species. Determine your height normally and then reduce it to 60%. He also cannot have a Physical Appearance equal to average.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Epilepsy',
    costPoints: 30,
    description: 'The character is subject to seizures, during which his limbs become immobilized and he is incapable of speaking or thinking clearly. Whenever he is in a tension situation, he must make a HT test. Failure causes the seizure which will last 1D minutes.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Eunuch',
    costPoints: 5,
    description: 'The character (men only) lost his masculinity through an accident or hostile action. He will be immune to seduction and will be incapable of seducing others.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Obesity',
    costPoints: 10,
    description: 'The character will be extraordinarily fat for his race. Determine your weight normally and then increase it by 50%. This results in a -1 penalty on all reaction tests and his HT can never be greater than 15.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Gigantism',
    costPoints: 10,
    description: 'The character is a giant due to genetic issues, abnormally large for his species. Determine your height normally and then increase it by 20%. He will be subject to a -2 penalty on all reaction tests.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Hard of Hearing',
    costPoints: 10,
    description: 'The character is not deaf, but lost part of his hearing. He will be subject to a -4 penalty on all Hearing tests and language skills.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Hemophilia',
    costPoints: 30,
    description: 'The character is a hemophiliac. Any wound, no matter how small, won"t heal, unless bandaged, and the character will bleed until death. Any untreated wound will bleed at a rate equal to the number of damage points per minute.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Physical Disability',
    costPoints: 15,
    description: 'The character has a certain degree of reduction in his mobility. Maimed Leg: -15 points. Peg Leg: -25 points. No legs or paraplegic: -35 points.'
  },
  {
    id: disadvantagesIds.disadvantageLowPainThresholdId,
    table_id: mainGameTableId,
    name: 'Low Pain Threshold',
    costPoints: 10,
    description: 'The character is very sensitive to all types of pain. Double the "shock effect" due to any wound. He will always be subject to a -4 penalty when trying to resist torture.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Mutism',
    costPoints: 25,
    description: 'The character is not capable of speaking. All communication must be done through writing or sign language. A Mute character receives a +3 bonus on all Miming/Pantomime or Sign Language tests.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'No Sense of Smell/Taste',
    costPoints: 5,
    description: 'This is a rare disease... the character is not capable of smelling or tasting anything. He will, therefore, be incapable of detecting certain dangers that normal people quickly perceive.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'One Arm',
    costPoints: 20,
    description: 'The character lost one arm (or was born without it). Assume the lost arm is the left one if he is right-handed and vice-versa. He won"t be able to use a sword and shield simultaneously.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'One Eye',
    costPoints: 15,
    description: 'The character has only one good eye. His DX attribute will be subject to a -1 penalty in combat situations and/or those involving coordination between hands and eyes.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'One Hand',
    costPoints: 15,
    description: 'The character lost one of his hands. It can be replaced by an appropriate prosthesis. A mechanical prosthesis subjects the character to a -1 penalty on all reaction tests and his DX attribute will be reduced by 2 points.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Overweight',
    costPoints: 5,
    description: 'You don"t quite reach obesity — your weight is a little above the average for your race. Determine weight normally from the ST attribute and then increase it by 30%. This increases Encumbrance as in the case of Obesity.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Skinny',
    costPoints: 5,
    description: 'The character is excessively thin. After discovering your height, verify the "average" weight for that height and reduce it by 1/3. His HT attribute can never be greater than 14.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Stuttering',
    costPoints: 10,
    description: 'The character suffers from stuttering or another speech problem. He will be subject to a -2 penalty on all reaction tests where conversation is necessary.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Youth',
    costPoints: 2,
    description: 'The character is younger in age according to the standards of his culture. The difference can vary between 1 and 3 years and the bonus will be equal to -2 points per year.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Distractible',
    costPoints: 15,
    description: 'The classic disadvantage of eccentric geniuses. The character has difficulty paying attention to anything that isn"t of immediate interest. He will be subject to a -5 penalty on any IQ test, with exception of those linked to the work on which he is focused.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Addiction',
    costPoints: 5,
    description: 'The character is addicted to some drug that he needs to ingest daily or suffer the penalties of Recovery. The bonus depends on the type of drug: Cheap drugs: -5 points. Expensive drugs: -10 points. Highly addictive: -20 points.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Alcoholism',
    costPoints: 15,
    description: 'The character is addicted to alcohol. Alcohol is treated as an addiction. It is cheap, incapacitating and (normally) legal. Therefore it"s worth -10 points. But alcohol is treacherous, sometimes -15 or -20 if illegal.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Bad Temper',
    costPoints: 10,
    description: 'The character doesn"t have total control of his emotions. He must make a Will test in any tension situation. Failure means he lost his patience and must insult, attack or act in some way against the cause of his explosion.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Berserk',
    costPoints: 15,
    description: 'Like Bad Temper, but worse. The character tends to lose control of himself when subjected to some tension, proceeding to frantically attack whoever he thinks is the cause of his problem.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Bloodlust',
    costPoints: 10,
    description: 'The character desires to see his opponents dead. In a battle he will prefer killing blows, will fire one more time to be sure of having killed an opponent, will attack guards when this could be avoided.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Boastfulness',
    costPoints: 10,
    description: 'You like to intimidate people whenever possible with impunity. Represent this on your own account. As no one likes a braggart, your reaction tests will be subject to a -2 penalty.'
  },
  {
    id: disadvantagesIds.disadvantageCodeOfHonorId,
    table_id: mainGameTableId,
    name: 'Code of Honor',
    costPoints: 5,
    description: 'The character has pride in a set of principles that he follows all the time. A code of honor requires behavior that is "virile", "courageous" and "honorable".'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Combat Paralysis',
    costPoints: 15,
    description: 'This is the opposite situation of Combat Reflexes; the character tends to become paralyzed when he sees himself in combat. He must make a HT test (not IQ) whenever a physical injury seems imminent.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Compulsion',
    costPoints: 5,
    description: 'You have some habit (generally, but not always, an addiction) that you feel compelled to practice daily. You spend a good part of your time satisfying this tendency.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Compulsive Lying',
    costPoints: 15,
    description: 'The character lies constantly, for no other reason than the joy of lying. To be capable of telling the pure and simple truth, a compulsive liar needs to succeed on a test against Will-4.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Cowardice',
    costPoints: 10,
    description: 'The character is extremely careful regarding his physical well-being. Every time there is need to risk himself physically, he must make a Will test. If there is risk of life, the roll will be made with a -5 penalty.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Delusions',
    costPoints: 1,
    description: 'The character believes in something (or several) that simply isn"t (aren"t) true. This may lead others to think he is crazy. The value, in points, of the Delusion depends on its nature.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Dyslexia',
    costPoints: 5,
    description: 'You have a serious deficiency. You are incapable of learning to read or write; even simple maps and highway signs are beyond your comprehension.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Fanaticism',
    costPoints: 15,
    description: 'You intensely believe in a country, religion, etc., and this is more important than anything else. You must represent your fanaticism. Note that fanatics don"t need to be necessarily insane or perverse.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Gluttony',
    costPoints: 5,
    description: 'You like too much good food and drink. If given a chance, you will always overload yourself with extra provisions and will never lose a meal of your own free will.'
  },
  {
    id: disadvantagesIds.disadvantageGreedId,
    table_id: mainGameTableId,
    name: 'Greed',
    costPoints: 15,
    description: 'You have passion for money. Every time some patrimony is offered as payment for a lawful job, adventure loot, plunder or just bait, you will have to succeed on a Will test to resist temptation.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Credulity',
    costPoints: 10,
    description: 'You were born a sucker and your character is one of them. A credulous person believes everything he hears. To not believe a lie or an improbable truth, he must succeed on an IQ test modified according to the plausibility of the story.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Honesty',
    costPoints: 10,
    description: 'The character MUST obey the law always and give the best of himself so others do the same. He will be compulsive regarding the law. This is a disadvantage, because frequently it will limit your options.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Illiteracy',
    costPoints: 0,
    description: 'This is the normal condition in a low TL culture and in this case offers no bonus. In cultures with TL 5+, where the press is common, it is a disadvantage.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Impulsiveness',
    costPoints: 10,
    description: 'The character hates talking and thinking. He prefers action. When alone, he will act first and think later. Represent this characteristic! The character must try to avoid work, mainly hard work, at any cost.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Intolerance',
    costPoints: 5,
    description: 'You don"t like and don"t trust people who are different from you. A completely intolerant character (-10 points) will have a -3 penalty on his reaction tests in front of any person who doesn"t belong to your race and/or class.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Jealousy',
    costPoints: 10,
    description: 'The character has, automatically, a bad reaction in front of anyone who seems more intelligent, more attractive or in a better situation than him. He may also oppose any plan proposed by a "rival", and will hate if someone else is in evidence.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Kleptomania',
    costPoints: 15,
    description: 'The character feels compelled to steal, not necessarily valuable things, but anything he can take. Whenever there is a chance to steal, the character must make a Will test. Failure means he must try to steal the object.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Laziness',
    costPoints: 10,
    description: 'The character has a great aversion to physical work. Your chances of getting a raise or promotion in any job are reduced by half. If he works on his own account, his monthly income will fall to half.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Lechery',
    costPoints: 15,
    description: 'The character suffers from an uncontrollable desire for romance. In any contact with an attractive member of the opposite sex, the character must make a Will test. Failure means he must try a "pickup", using all the artifices and skills he is capable of.'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Megalomania',
    costPoints: 10,
    description: 'You believe you are the super-man, or that you were chosen for a great task, or that your destiny is to conquer. Start by adopting the Fanaticism disadvantage, being that you are fanatic about yourself!'
  },
  {
    id: crypto.randomUUID(),
    table_id: mainGameTableId,
    name: 'Miserliness',
    costPoints: 10,
    description: 'Similar to Greed except that the character is much more interested in what he already has. He must succeed on a Will test, every time he has to spend some money, and must always look for the best price.'
  },
  {
    id: disadvantagesIds.disadvantageOverconfidenceId,
    table_id: mainGameTableId,
    name: 'Overconfidence',
    costPoints: 10,
    description: 'You are too confident in your abilities. You will be subject to a -5 penalty on any test that involves self-doubt or caution. You tend to underestimate dangers and opponents.'
  }
]