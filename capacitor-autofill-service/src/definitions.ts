export interface AutofillPlugin {
  isAvailable(): Promise<{ isAvailable: boolean }>;
  enable(): Promise<void>;
  disable(): Promise<void>;
  isEnabled(): Promise<{ isEnabled: boolean }>;
}
