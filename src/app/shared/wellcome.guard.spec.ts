import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { SettingsService } from './settings.service';

import { WellcomeGuard } from './wellcome.guard';

describe('WellcomeGuard', () => {
  let guard: WellcomeGuard;
  const spyRouter = {
    parseUrl: jest.fn(),
  };
  const spySettingsRepo = {
    get: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: spyRouter },
        { provide: SettingsService, useValue: spySettingsRepo },
      ],
    });
    guard = TestBed.inject(WellcomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
