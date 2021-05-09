import { Observable } from 'rxjs';

export abstract class CloudSyncService {
  abstract signIn(): Observable<any>;
  abstract sync(): Observable<any>;
}
