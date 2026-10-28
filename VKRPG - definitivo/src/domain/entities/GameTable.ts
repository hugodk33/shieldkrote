export class GameTable {
  constructor(
    public id: string,
    public narratorId: string,
    public title: string,
    public system: string,
    public intro: string,
    public modules?: string[]
  ) {}
}