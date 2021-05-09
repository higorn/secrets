import { TestBed } from '@angular/core/testing';
import { SettingsService } from '../settings.service';

import { NullCloudSyncService } from './null-cloud-sync.service';

describe('NullCloudSyncService', () => {
  let service: NullCloudSyncService;
  const spySettings = {
    getCloudSync: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SettingsService, useValue: spySettings }
      ],
    });
    service = TestBed.inject(NullCloudSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
