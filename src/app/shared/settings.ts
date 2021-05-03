export interface Settings {
  language: string;
  isFirstTime: boolean;
  biometric: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  isFirstTime: true,
  biometric: false,
};
