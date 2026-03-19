import { registerPlugin } from '@capacitor/core';

import type { AutofillPlugin } from './definitions';

const Autofill = registerPlugin<AutofillPlugin>('Autofill', {
  web: () => import('./web').then(m => new m.AutofillWeb()),
});

export * from './definitions';
export { Autofill };
