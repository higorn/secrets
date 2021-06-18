import { Entity } from 'src/app/shared/entity';
import { FieldsBundle } from './../../shared/constants';

export class Secret implements Entity {
  constructor(
    public id: string,
    public type: string,
    public name: string,
    public content: any,
    public modified?: number,
    public imported?: string,
    public category?: string,
    public folder?: string,
    public removed?: boolean,
    public trash?: boolean,
    public pristine?: boolean,
  ) {
    this.pristine = pristine === undefined || pristine === null ? true : pristine;
  }
}

export const FormType = {
  password: [
    FieldsBundle.title,
    FieldsBundle.username,
    FieldsBundle.password,
    FieldsBundle.site,
  ],
  card: [
    FieldsBundle.title,
    FieldsBundle.ccnumber,
    FieldsBundle.ccname,
    FieldsBundle.cctype,
    FieldsBundle.ccbrand,
    FieldsBundle.ccexp,
    FieldsBundle.cccsc,
    FieldsBundle.ccpin,
    FieldsBundle.country,
  ],
  bank: [
    FieldsBundle.title,
    FieldsBundle.bank,
    FieldsBundle.holder,
    FieldsBundle.type,
    FieldsBundle.iban,
    FieldsBundle.ccpin,
    FieldsBundle.login,
    FieldsBundle.internetbankpassword,
    FieldsBundle.banksite,
    FieldsBundle.country,
  ],
  identity: [
    FieldsBundle.title,
    FieldsBundle.number,
    FieldsBundle.fullname,
    FieldsBundle.birthday,
    FieldsBundle.issued,
    FieldsBundle.expires,
  ],
  info: [
    FieldsBundle.title,
    FieldsBundle.fullname,
    FieldsBundle.birthday,
    FieldsBundle.mail,
    FieldsBundle.phone,
    FieldsBundle.address1,
    FieldsBundle.address2,
    FieldsBundle.postalcode,
    FieldsBundle.city,
    FieldsBundle.state,
    FieldsBundle.country,

  ],
  note: [
    FieldsBundle.title,
    FieldsBundle.note
  ]
};
