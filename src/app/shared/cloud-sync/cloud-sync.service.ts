import { Observable } from 'rxjs';

export interface SyncFile {
  id: string;
  name: string;
}

export interface CloudSync {
  provider: string;
  file: SyncFile;
}

export interface SyncOptions {
  token?: string;
  file: SyncFile
}

export abstract class CloudSyncService {
  abstract setup(file?: SyncFile): Observable<SyncFile>;
  abstract restore(file?: SyncFile): Observable<SyncFile[]>;
  abstract sync(options: SyncOptions): Observable<SyncFile>;
}
