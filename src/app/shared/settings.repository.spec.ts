import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { StorageService } from 'src/app/shared/storage.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { MockStorageService } from 'src/app/testing/mock-storage-service';
import { DEFAULT_SETTINGS } from './settings';
import { SettingsRepository } from './settings.repository';

describe('SettingsRepository', () => {
  let service: SettingsRepository;
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
    service = TestBed.inject(SettingsRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create the settings when it does not exists', fakeAsync(() => {
    let createdSettings = {};
    spyTranslator.getLang.mockReturnValue('en');

    service.get().subscribe((settings) => (createdSettings = settings));
    tick();

    expect(createdSettings['language']).toBeTruthy();
  }));

  it('should save and retrieve the settings from the storage', fakeAsync(() => {
    const settings = DEFAULT_SETTINGS;
    let savedSettings = {};

    service.save(settings);
    service.get().subscribe((settings) => (savedSettings = settings));
    tick();

    expect(savedSettings).toEqual(settings);
  }));
});
