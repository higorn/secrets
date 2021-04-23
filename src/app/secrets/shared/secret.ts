import { Entity } from "src/app/shared/entity";

export class Secret implements Entity {
  constructor(public id: string, public type: string, public name: string, public content: any) {}
}