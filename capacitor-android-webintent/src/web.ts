import { WebPlugin } from '@capacitor/core';

import type { AndroidLaunchIntent, AndroidWebIntentPlugin } from './definitions';

export class AndroidWebIntentWeb extends WebPlugin implements AndroidWebIntentPlugin {
  async getLaunchIntent(): Promise<AndroidLaunchIntent> {
    return { extras: {} };
  }

  async startViewUrl(): Promise<void> {
    // no-op on web
  }
}
