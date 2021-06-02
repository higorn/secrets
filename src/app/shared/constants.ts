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
  cctype: {
    name: 'cctype',
    type: 'select',
    options: {
      label: 'Type',
      selectopts: [
        'debit', 'credit'
      ],
      copyable: true,
    },
  },
  ccbrand: {
    name: 'ccbrand',
    type: 'select',
    options: {
      label: 'Brand',
      selectopts: [
        'visa', 'master', 'american', 'elo', 'hiper', 'hipercard', 'other'
      ],
      copyable: true,
    },
  },
  ccname: {
    name: 'ccname',
    type: 'input',
    options: {
      type: 'text',
      label: 'Owner',
      copyable: true,
      autocomplete: 'cc-name|cc-given-name',
    },
  },
  ccnumber: {
    name: 'ccnumber',
    type: 'input',
    options: {
      type: 'number',
      label: 'Number',
      copyable: true,
      autocomplete: 'number',
    },
  },
  ccexp: {
    name: 'ccexp',
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
  cccsc: {
    name: 'cccsc',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'CSC',
      copyable: true,
      autocomplete: 'cvv',
    },
  },
  ccpin: {
    name: 'ccpin',
    type: 'input',
    secret: true,
    options: {
      type: 'password',
      label: 'PIN',
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
  fullname: {
    name: 'fullname',
    type: 'input',
    options: {
      type: 'text',
      label: 'Full Name',
      copyable: true,
      autocomplete: 'name|fullname|surname',
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
  mail: {
    name: 'mail',
    type: 'input',
    options: {
      type: 'email',
      label: 'Email',
      copyable: true,
      autocomplete: 'email',
    },
  },
  phone: {
    name: 'phone',
    type: 'input',
    options: {
      type: 'tel',
      label: 'Phone',
      copyable: true,
      autocomplete: 'tel|tel-local'
    }
  },
  address1: {
    name: 'address1',
    type: 'input',
    options: {
      type: 'text',
      label: 'Street, number',
      copyable: true,
      autocomplete: 'street-address|address-line1|address-level1'
    }
  },
  address2: {
    name: 'address2',
    type: 'input',
    options: {
      type: 'text',
      label: 'Apartment',
      copyable: true,
      autocomplete: 'address-line2|address-level2'
    }
  },
  postalcode: {
    name: 'postalcode',
    type: 'input',
    options: {
      type: 'text',
      label: 'Postal code',
      copyable: true,
      autocomplete: 'postal-code|address-line3|address-level3'
    }
  },
  city: {
    name: 'city',
    type: 'input',
    options: {
      type: 'text',
      label: 'City',
      copyable: true,
      autocomplete: 'city|address-line4|address-level4'
    }
  },
  state: {
    name: 'state',
    type: 'input',
    options: {
      type: 'text',
      label: 'State',
      copyable: true,
      autocomplete: 'state|region|province'
    }
  },
  country: {
    name: 'country',
    type: 'input',
    options: {
      type: 'text',
      label: 'Contry',
      copyable: true,
      autocomplete: 'country|country-name'
    }
  },
  note: {
    name: 'note',
    type: 'textarea',
    options: {
      label: 'Note',
      rows: '5',
      copyable: true,
    }
  }
};
