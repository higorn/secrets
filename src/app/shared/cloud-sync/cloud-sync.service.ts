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
  token: string;
  file: SyncFile
}

export interface DataMerger {
  merge(data: any): Observable<any>;
}

export abstract class CloudSyncService {
  abstract setup(file?: SyncFile): Observable<SyncFile>;
  abstract init(merger: DataMerger): void;
  abstract restore(file?: SyncFile): Observable<SyncFile[]>;
  abstract sync(merger: DataMerger): Observable<SyncFile>;
}
