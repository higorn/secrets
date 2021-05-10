import { Observable } from 'rxjs';

export abstract class CloudSyncService {
  abstract setup(): Observable<any>;
  abstract restore(): Observable<any>;
  abstract sync(): Observable<any>;
}
