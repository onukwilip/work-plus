export class MenuClass {
  constructor(
    public name: string,
    public icon?: string,
    public link?: string,
    public subMenus?: MenuClass[]
  ) {}
}
