export interface Settings {
  language: string;
  isFirstTime: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  isFirstTime: true,
};
