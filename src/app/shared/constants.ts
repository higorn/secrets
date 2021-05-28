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
  username: {
    name: 'username',
    type: 'input',
    options: {
      type: 'text',
      label: 'User name',
      copyable: true,
      autocomplete: 'email|username',
    },
  },
  mail: {
    name: 'mail',
    type: 'input',
    options: {
      type: 'email',
      label: 'Email',
      copyable: true,
      autocomplete: 'email|username',
    },
  },
  name: {
    name: 'name',
    type: 'input',
    options: {
      type: 'text',
      label: 'Name',
      copyable: true,
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
      copyable: true,
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
      copyable: true,
      autocomplete: 'number',
    },
  },
  cardnumber: {
    name: 'cardnumber',
    type: 'input',
    options: {
      type: 'number',
      label: 'Number',
      copyable: true,
      autocomplete: 'number',
    },
  },
  cardowner: {
    name: 'cardowner',
    type: 'input',
    options: {
      type: 'text',
      label: 'Owner',
      copyable: true,
      autocomplete: 'name',
    },
  },
  cardexpires: {
    name: 'cardexpires',
    type: 'date',
    options: {
      type: 'date',
      label: 'Expires',
      copyable: true,
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
      copyable: true,
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
      copyable: true,
    },
  },
  pin: {
    name: 'pin',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'PIN',
      copyable: true,
    },
  },
  birthday: {
    name: 'birthday',
    type: 'date',
    options: {
      type: 'date',
      label: 'Birthday',
      labelPosition: 'default',
      copyable: true,
    },
  },
  issued: {
    name: 'issued',
    type: 'date',
    options: {
      type: 'date',
      label: 'Issued',
      labelPosition: 'default',
      copyable: true,
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
      copyable: true,
    },
  },
  bank: {
    name: 'bank',
    type: 'input',
    options: {
      type: 'text',
      label: 'Bank',
      copyable: true,
    },
  },
  holder: {
    name: 'holder',
    type: 'input',
    options: {
      type: 'text',
      label: 'Holder',
      autocomplete: 'name',
      copyable: true,
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
      copyable: true,
    },
  },
  login: {
    name: 'login',
    type: 'input',
    options: {
      type: 'text',
      label: 'Login',
      copyable: true,
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
      copyable: true,
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
