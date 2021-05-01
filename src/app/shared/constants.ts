export const FieldsBundle = {
  title: {
    name: 'title',
    type: 'input',
    options: {
      type: 'text',
      label: 'Title',
      placeholder: 'Give this secret a title',
      autofocus: true,
    },
  },
  user: {
    name: 'user',
    type: 'input',
    options: {
      type: 'text',
      label: 'User name',
      autocomplete: 'email|username',
    },
  },
  mail: {
    name: 'mail',
    type: 'input',
    options: {
      type: 'email',
      label: 'Email',
      autocomplete: 'email|username',
    },
  },
  name: {
    name: 'name',
    type: 'input',
    options: {
      type: 'text',
      label: 'Name',
      autocomplete: 'name',
    },
  },
  password: {
    name: 'password',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'Password',
    },
  },
  site: {
    name: 'site',
    type: 'input',
    options: {
      type: 'text',
      label: 'Web site',
    },
  },
  number: {
    name: 'number',
    type: 'input',
    options: {
      type: 'number',
      label: 'Number',
      autocomplete: 'number',
    },
  },
  cardnumber: {
    name: 'cardnumber',
    type: 'input',
    options: {
      type: 'number',
      label: 'Number',
      autocomplete: 'number',
    },
  },
  cardowner: {
    name: 'cardowner',
    type: 'input',
    options: {
      type: 'text',
      label: 'Owner',
      autocomplete: 'name',
    },
  },
  cardexpires: {
    name: 'cardexpires',
    type: 'date',
    options: {
      type: 'date',
      label: 'Expires',
      labelPosition: 'default',
      format: 'MM/YY',
      min: '2021',
      max: '2100',
    },
  },
  cvv: {
    name: 'cvv',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'CVV',
      autocomplete: 'cvv',
    },
  },
  cardpin: {
    name: 'cardpin',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'PIN',
    },
  },
  pin: {
    name: 'pin',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'PIN',
    },
  },
  birthday: {
    name: 'birthday',
    type: 'date',
    options: {
      type: 'date',
      label: 'Birthday',
      labelPosition: 'default',
    },
  },
  issued: {
    name: 'issued',
    type: 'date',
    options: {
      type: 'date',
      label: 'Issued',
      labelPosition: 'default',
    },
  },
  expires: {
    name: 'expires',
    type: 'date',
    options: {
      type: 'date',
      label: 'Expires',
      labelPosition: 'default',
      min: '2021',
      max: '2100',
    },
  },
  bank: {
    name: 'bank',
    type: 'input',
    options: {
      type: 'text',
      label: 'Bank',
    },
  },
  holder: {
    name: 'holder',
    type: 'input',
    options: {
      type: 'text',
      label: 'Holder',
      autocomplete: 'name',
    },
  },
  type: {
    name: 'type',
    type: 'input',
    options: {
      type: 'text',
      label: 'Type',
    },
  },
  iban: {
    name: 'iban',
    type: 'input',
    options: {
      type: 'text',
      label: 'IBAN',
    },
  },
  login: {
    name: 'login',
    type: 'input',
    options: {
      type: 'text',
      label: 'Login',
      autocomplete: 'email|username',
    },
  },
  internetbankpassword: {
    name: 'internetbankpassword',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'Password',
    },
  },
  banksite: {
    name: 'banksite',
    type: 'input',
    options: {
      type: 'text',
      label: 'Web site',
    },
  },
};
