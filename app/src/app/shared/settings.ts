export interface Settings {
  language: string;
  isFirstTime: boolean;
  biometric: boolean;
  autofil: boolean;
  theme: string;
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'en',
  isFirstTime: true,
  biometric: false,
  autofil: false,
  theme: 'system'
};
