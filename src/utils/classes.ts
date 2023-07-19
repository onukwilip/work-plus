import { CreateOrderSectionNames } from "../../types";

export class MenuClass {
  constructor(
    public name: string,
    public icon?: string,
    public link?: string,
    public subMenus?: MenuClass[]
  ) {}
}

export class ErrorTable<T> {
  constructor(public date: Date, public message: string, public item?: T) {}
}

export class CreateOrderSectionsClass<T> {
  constructor(
    public name: CreateOrderSectionNames,
    public Component: React.FC | React.FC<any>,
    public props: T
  ) {}
}
