import { registerPlugin } from '@capacitor/core';

import type { AndroidWebIntentPlugin } from './definitions';

const AndroidWebIntent = registerPlugin<AndroidWebIntentPlugin>('AndroidWebIntent', {
  web: () => import('./web').then((m) => new m.AndroidWebIntentWeb()),
});

export * from './definitions';
export { AndroidWebIntent };
