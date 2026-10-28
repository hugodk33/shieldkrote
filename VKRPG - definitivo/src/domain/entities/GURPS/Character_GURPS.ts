export class Character {
  constructor(
    public id: string,
    public character_id: string,
    public name: string,
    public bio: string,
    public backstory: string,
    public points: number,
    public hp: number,
    public st: number,
    public dx: number,
    public iq: number,
    public ht: number,
    public fatigue: number,
    public encumbrance: string,
  ) {}
}