export class User {
  constructor(
    public id: string,
    public type: number,
    public username: string,
    public password: string,
    public phone: string,
    public email: string
  ) {}
}
export class PublicUser {
  constructor(
    public id: string,
    public type: number,
    public username: string,
    public phone: string,
    public email: string
  ) {}
}