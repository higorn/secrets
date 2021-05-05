import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveSyncService extends CloudSyncService {
  constructor() {
    super();
  }

  signIn(): Observable<any> {
    return of(null);
  }

  sync(): Observable<any> {
    return of(null);
  }
}
