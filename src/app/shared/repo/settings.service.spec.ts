import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { TranslatorService } from 'src/app/shared/translator.service';
import { MockStorageService } from 'src/app/testing/mock-storage-service';
import { DEFAULT_SETTINGS } from '../settings';
import { SettingsService } from '../settings.service';
import { StorageService } from '../storage/storage.service';

describe('SettingsRepository', () => {
  let service: SettingsService;
  const mockStorageService = new MockStorageService();
  const spyTranslator = {
    getLang: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: mockStorageService },
        { provide: TranslatorService, useValue: spyTranslator },
      ],
    });
    service = TestBed.inject(SettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create the settings when it does not exists', fakeAsync(() => {
    let createdSettings = {};
    spyTranslator.getLang.mockReturnValue('en');

    service.getAll().subscribe((settings) => (createdSettings = settings));
    tick();

    expect(createdSettings['language']).toBeTruthy();
  }));

  it('should save and retrieve the settings from the storage', fakeAsync(() => {
    const settings = DEFAULT_SETTINGS;
    let savedSettings = {};

    service.save(settings);
    service.getAll().subscribe((settings) => (savedSettings = settings));
    tick();

    expect(savedSettings).toEqual(settings);
  }));

  it('should get an specific item in the settings', fakeAsync(() => {
    let isFirstTime;

    service.isFirstTime().subscribe((val) => (isFirstTime = val));
    tick();

    expect(isFirstTime).toBe(true);
  }));

  it('should set an specifig item in the settings', fakeAsync(() => {
    let isFirstTime = true;

    service.setFirstTime(false).subscribe();
    tick();
    service.isFirstTime().subscribe((val) => (isFirstTime = val));
    tick();

    expect(isFirstTime).toBe(false);
  }));

  it('should get the biometric option', fakeAsync(() => {
    let isEnabled = true;

    service
      .isBiometricEnabled()
      .subscribe((_isEnabled) => (isEnabled = _isEnabled));
    tick();

    expect(isEnabled).toBe(false);
  }));

  it('should enable biometric', fakeAsync(() => {
    let isEnabled = true;

    service
      .isBiometricEnabled()
      .subscribe((_isEnabled) => (isEnabled = _isEnabled));
    tick();

    expect(isEnabled).toBe(false);

    service.enableBiometric();
    tick();

    service
      .isBiometricEnabled()
      .subscribe((_isEnabled) => (isEnabled = _isEnabled));
    tick();

    expect(isEnabled).toBe(true);
  }));

  it('should disable biometric', fakeAsync(() => {
    let isEnabled;

    service
      .isBiometricEnabled()
      .subscribe((_isEnabled) => (isEnabled = _isEnabled));
    tick();

    expect(isEnabled).toBe(true);

    service.disableBiometric();
    tick();

    service
      .isBiometricEnabled()
      .subscribe((_isEnabled) => (isEnabled = _isEnabled));
    tick();

    expect(isEnabled).toBe(false);
  }));
});
