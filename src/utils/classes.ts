export class MenuClass {
  constructor(
    public name: string,
    public icon?: string,
    public link?: string,
    public subMenus?: MenuClass[]
  ) {}
}

export class ErrorTable<T> {
  constructor(public message: string, public item?: T) {}
}
