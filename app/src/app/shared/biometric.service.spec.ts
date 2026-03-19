import { TranslatorService } from './translator.service';
import { TestBed } from '@angular/core/testing';

import { BiometricService } from './biometric.service';

describe('BiometricService', () => {
  let service: BiometricService;
  const spyTranslator = {
    get: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TranslatorService, useValue: spyTranslator }],
    });
    service = TestBed.inject(BiometricService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
