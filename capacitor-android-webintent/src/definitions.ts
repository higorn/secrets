export interface AndroidWebIntentPlugin {
  /**
   * Returns the Activity's current Intent action and stringified extras (Android only).
   */
  getLaunchIntent(): Promise<AndroidLaunchIntent>;

  /**
   * Starts ACTION_VIEW for the given URL (Android only).
   */
  startViewUrl(options: { url: string }): Promise<void>;
}

export interface AndroidLaunchIntent {
  action?: string;
  extras?: Record<string, string>;
}
