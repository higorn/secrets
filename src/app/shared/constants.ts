export const FieldsBundle = {
  title: {
    name: 'title',
    type: 'input',
    options: {
      type: 'text',
      label: 'Title',
      autofocus: true
    }
  },
  user: {
    name: 'user',
    type: 'input',
    options: {
      type: 'text',
      label: 'User name',
      autocomplete: 'email|username'
    }
  },
  name: {
    name: 'name',
    type: 'input',
    options: {
      type: 'text',
      label: 'Name',
      autocomplete: 'name'
    }
  },
  password: {
    name: 'password',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'Password',
    }
  },
  site: {
    name: 'site',
    type: 'input',
    options: {
      type: 'text',
      label: 'Web site',
    }
  },
  number: {
    name: 'number',
    type: 'input',
    options: {
      type: 'number',
      label: 'Number',
      autocomplete: 'number'
    }
  },
  owner: {
    name: 'owner',
    type: 'input',
    options: {
      type: 'text',
      label: 'Owner',
      autocomplete: 'name'
    }
  },
  birthday: {
    name: 'birthday',
    type: 'date',
    options: {
      type: 'date',
      label: 'Birthday',
      labelPosition: 'default'
    }
  },
  issued: {
    name: 'issued',
    type: 'date',
    options: {
      type: 'date',
      label: 'Issued',
      labelPosition: 'default'
    }
  },
  expires: {
    name: 'expires',
    type: 'date',
    options: {
      type: 'date',
      label: 'Expires',
      labelPosition: 'default',
      min: '2021',
      max: '2100'
    }
  },
  cardexpires: {
    name: 'expires',
    type: 'date',
    options: {
      type: 'date',
      label: 'Expires',
      labelPosition: 'default',
      format: 'MM/YY',
      min: '2021',
      max: '2100'
    }
  },
  cvv: {
    name: 'cvv',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'CVV',
      autocomplete: 'cvv'
    }
  },
  pin: {
    name: 'pin',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'PIN',
    }
  },
  bank: {
    name: 'bank',
    type: 'input',
    options: {
      type: 'text',
      label: 'Bank',
    }
  },
  holder: {
    name: 'holder',
    type: 'input',
    options: {
      type: 'text',
      label: 'Holder',
      autocomplete: 'name'
    }
  },
  type: {
    name: 'type',
    type: 'input',
    options: {
      type: 'text',
      label: 'Type',
    }
  },
  iban: {
    name: 'iban',
    type: 'input',
    options: {
      type: 'text',
      label: 'IBAN',
    }
  },
  login: {
    name: 'login',
    type: 'input',
    options: {
      type: 'text',
      label: 'Login',
      autocomplete: 'email|username'
    }
  },
}