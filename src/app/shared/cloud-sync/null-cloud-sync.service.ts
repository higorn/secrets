import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SettingsService } from '../settings.service';
import { CloudSyncService } from './cloud-sync.service';

@Injectable({
  providedIn: 'root'
})
export class NullCloudSyncService extends CloudSyncService {

  constructor(
    private settings: SettingsService,
  ) {
    super();
  }

  setup(): Observable<any> {
    return of(this.settings.setCloudSync('none'));
  }
  restore(): Observable<any> {
    throw new Error('Method not implemented.');
  }
  sync(): Observable<any> {
    throw new Error('Method not implemented.');
  }
}
