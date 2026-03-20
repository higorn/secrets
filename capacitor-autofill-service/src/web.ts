import { WebPlugin } from '@capacitor/core';

import type { AutofillPlugin } from './definitions';

export class AutofillWeb extends WebPlugin implements AutofillPlugin {
  constructor() {
    super();
  }

  isAvailable(): Promise<{ isAvailable: boolean }> {
    return new Promise<{ isAvailable: boolean }>((resolve) => resolve({ isAvailable: false }));
  }
  enable(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  disable(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  isEnabled(): Promise<{ isEnabled: boolean }> {
    throw new Error('Method not implemented.');
  }
}
