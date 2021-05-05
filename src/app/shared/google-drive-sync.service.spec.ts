import { TestBed } from '@angular/core/testing';

import { GoogleDriveSyncService } from './google-drive-sync.service';

describe('GoogleDriveSyncService', () => {
  let service: GoogleDriveSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GoogleDriveSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
