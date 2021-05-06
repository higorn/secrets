import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root'
})
export class NullCloudSyncService extends CloudSyncService {

  constructor(
    private settings: SettingsService,
  ) {
    super();
  }

  signIn(): Observable<any> {
    return of(this.settings.setCloudSync('none'));
  }
  sync(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
