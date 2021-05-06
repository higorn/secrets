import { StorageService } from 'src/app/shared/storage.service';
import { TestBed } from '@angular/core/testing';

import { GoogleDriveSyncService } from './google-drive-sync.service';
import { HttpClient } from '@angular/common/http';
import { SettingsService } from './settings.service';
import { of } from 'rxjs';

describe('GoogleDriveSyncService', () => {
  let service: GoogleDriveSyncService;
  const spyStorage = {
    getItem: jest.fn(),
  };
  const spyHttp = {
    post: jest.fn(),
    put: jest.fn(),
  };
  const spySettings = {
    getCloudSync: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: spyStorage },
        { provide: HttpClient, useValue: spyHttp },
        { provide: SettingsService, useValue: spySettings },
      ],
    });

    spySettings.getCloudSync.mockReturnValue(of('none'));
    service = TestBed.inject(GoogleDriveSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
