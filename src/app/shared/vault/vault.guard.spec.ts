import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { VaultGuard } from './vault.guard';
import { VaultService } from './vault.service';

describe('VaultGuard', () => {
  let guard: VaultGuard;
  const spyVaultService = {
    unseal: jest.fn(),
    isSealed: jest.fn(),
  }
  const spyRouter = {
    parseUrl: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: spyRouter },
        { provide: VaultService, useValue: spyVaultService }
      ]
    });
    guard = TestBed.inject(VaultGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
