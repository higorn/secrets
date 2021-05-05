import { StorageService } from 'src/app/shared/storage.service';
import { TestBed } from '@angular/core/testing';

import { GoogleDriveSyncService } from './google-drive-sync.service';

describe('GoogleDriveSyncService', () => {
  let service: GoogleDriveSyncService;
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: spyStorage }],
    });
    service = TestBed.inject(GoogleDriveSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
