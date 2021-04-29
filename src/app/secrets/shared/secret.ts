import { Entity } from "src/app/shared/entity";
import { FieldsBundle } from './../../shared/constants';

export class Secret implements Entity {
  constructor(public id: string, public type: string, public name: string, public content: any) {}
}

export const FormType = {
  login: [ FieldsBundle.title, FieldsBundle.user, FieldsBundle.password, FieldsBundle.site ],
  card: [ FieldsBundle.title, FieldsBundle.number, FieldsBundle.owner, FieldsBundle.cardexpires,
     FieldsBundle.cvv, FieldsBundle.pin ],
  identity: [ FieldsBundle.title, FieldsBundle.number, FieldsBundle.name, FieldsBundle.birthday,
     FieldsBundle.issued, FieldsBundle.expires ],
  bank: [ FieldsBundle.title, FieldsBundle.bank, FieldsBundle.holder, FieldsBundle.type, FieldsBundle.iban,
     FieldsBundle.login, FieldsBundle.password, FieldsBundle.site ],
  pin: [ FieldsBundle.title, FieldsBundle.pin ],
}