import { Entity } from 'src/app/shared/entity';
import { FieldsBundle } from './../../shared/constants';

export class Secret implements Entity {
  constructor(
    public id: string,
    public type: string,
    public name: string,
    public content: any,
    public modified?: number 
  ) {}
}

export const FormType = {
  web: [
    FieldsBundle.title,
    FieldsBundle.user,
    FieldsBundle.password,
    FieldsBundle.site,
  ],
  mail: [
    FieldsBundle.title,
    FieldsBundle.mail,
    FieldsBundle.password,
    FieldsBundle.site,
  ],
  login: [FieldsBundle.title, FieldsBundle.login, FieldsBundle.password],
  card: [
    FieldsBundle.title,
    FieldsBundle.cardnumber,
    FieldsBundle.cardowner,
    FieldsBundle.cardexpires,
    FieldsBundle.cvv,
    FieldsBundle.cardpin,
  ],
  identity: [
    FieldsBundle.title,
    FieldsBundle.number,
    FieldsBundle.name,
    FieldsBundle.birthday,
    FieldsBundle.issued,
    FieldsBundle.expires,
  ],
  bank: [
    FieldsBundle.title,
    FieldsBundle.bank,
    FieldsBundle.holder,
    FieldsBundle.type,
    FieldsBundle.iban,
    FieldsBundle.cardpin,
    FieldsBundle.login,
    FieldsBundle.internetbankpassword,
    FieldsBundle.banksite,
  ],
  pin: [FieldsBundle.title, FieldsBundle.pin],
};
