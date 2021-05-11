import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SettingsService } from '../settings.service';
import { CloudSyncService } from './cloud-sync.service';
import { CloudSyncServiceProvider } from './cloud-sync.service.provider';
import { GoogleDriveSyncService } from './google-drive-sync.service';
import { NullCloudSyncService } from './null-cloud-sync.service';

@Injectable({
  providedIn: 'root'
})
export class CloudSyncServiceFatcory extends CloudSyncServiceProvider {

  constructor(
    private injector: Injector,
    private settings: SettingsService
  ) {
    super();
  }

  getByName(name: string): CloudSyncService {
    switch(name) {
      case 'google-drive':
        return this.injector.get(GoogleDriveSyncService)
      default:
        return this.injector.get(NullCloudSyncService)
    }
  }

  get(): Observable<CloudSyncService> {
    return this.settings.getCloudSync().pipe(map(cloudSync => this.getByName(cloudSync.provider)))
  }
}
