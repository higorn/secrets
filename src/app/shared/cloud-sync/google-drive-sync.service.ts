import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleAuth } from 'capacitor-googleauth-plugin';
import { Authentication, User } from 'capacitor-googleauth-plugin/dist/esm/user';
import { from, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SettingsService } from '../settings.service';
import { StorageService } from '../storage/storage.service';
import { CloudSync, CloudSyncService, DataMerger, SyncFile, SyncOptions } from './cloud-sync.service';


@Injectable({
  providedIn: 'root',
})
export class GoogleDriveSyncService extends CloudSyncService {
  private syncLocked = false;
  constructor(
    private storage: StorageService,
    private settings: SettingsService,
    private http: HttpClient
  ) {
    super();
  }

  init(merger: DataMerger): void {
    const sub = this.storage.dataChanged$.subscribe(() => {
      if (this.syncLocked) return;
      const sub1 = this.settings.getCloudSync().subscribe((cloudSync: CloudSync) => {
        sub1.unsubscribe()
        if (cloudSync.provider !== 'google-drive' || this.syncLocked) return;
        this.syncLocked = true;
        const sub2 = from(GoogleAuth.refresh()).subscribe((auth: Authentication) => {
          sub2.unsubscribe()
          const sub3 = this.doSync({ token: auth.accessToken, file: cloudSync.file }, merger).subscribe(() => {
            sub3.unsubscribe()
            this.syncLocked = false;
          }, (error) => {
            sub3.unsubscribe()
            console.error('Error on do sync:', error)
            this.syncLocked = false
          })
        }, (error) => {
          sub2.unsubscribe()
          console.error('Error on refresh token:', error)
          this.syncLocked = false
        })
      })
    })
  }

  setup(file?: SyncFile): Observable<SyncFile> {
    console.log('signIn...');
    return from(GoogleAuth.signIn()).pipe(switchMap((user: User) => {
      console.log('user', user);
      return this.storage.exportData().pipe(switchMap(data => {
        console.log('data', data);
        const payload = JSON.stringify(data);
        return this.sendFile(payload, user.authentication.accessToken, file);
      }))
    }))
  }

  sync(merger: DataMerger): Observable<any> {
    return this.settings.getCloudSync().pipe(switchMap((cloudSync: CloudSync) => {
      return from(GoogleAuth.refresh()).pipe(switchMap((auth: Authentication) => {
        this.syncLocked = true;
        return this.doSync({ token: auth.accessToken, file: cloudSync.file }, merger).pipe(tap(() => {
          this.syncLocked = false;
        }))
      }))
    }))
  }

  private doSync(opts: SyncOptions, merger: DataMerger): Observable<any> {
    return this.getFileContent(opts.token, opts.file.id).pipe(switchMap((data) => {
        console.log('file', data)
        return merger.merge(data).pipe(switchMap((mergedData) => {
          console.log('data', mergedData);
          const payload = JSON.stringify(mergedData);
          return this.sendFile(payload, opts.token, opts.file);
        }))
      }))
  }

  restore(file?: SyncFile): Observable<SyncFile[]> {
    console.log('restoring...');
    return from(GoogleAuth.signIn()).pipe(switchMap((user: User) => {
      console.log('restoring user', user);
      return this.restoreFile(user.authentication.accessToken, file);
    }))
  }

  private restoreFile(token: string, file: SyncFile): Observable<SyncFile[]> {
    if (file) {
      return this.getFileContent(token, file.id).pipe(map((data) => {
          console.log('file', data)
          this.storage.importData(data)
          return [file];
        }))
    }
    return this.getFiles(token)
      .pipe(switchMap((files) => {
        console.log('files', files);
        if (files.length > 1 || files.length === 0) return of(files);
        return this.getFileContent(token, files[0].id).pipe(map((data) => {
            console.log('file', data)
            this.storage.importData(data)
            return files;
          }))
      }))
  }

  private getFileContent(token: string, fileId: string): Observable<any> {
    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    const params = new HttpParams().set('alt', 'media');
    return this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${fileId}`,
      { headers: header, params: params });
  }

  private getFiles(token: string): Observable<SyncFile[]> {
    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    const params = new HttpParams()
      .set('q', 'name contains \'eSecrets\'')
      .set('spaces', 'appDataFolder')
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files', { headers: header, params: params })
      .pipe(map(({ files }) => files))
  }

  private sendFile(payload: string, token: string, file: SyncFile): Observable<SyncFile> {
    const fileContent = new Blob([payload], { type: 'text/plain' });
    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    return file && file.id ? this.updateFile(header, fileContent, file.id) : this.createFile(header, fileContent)
  }

  private createFile(header: HttpHeaders, file: any): Observable<SyncFile> {
    const dt = new Date();
    const metadata = {
      name: 'eSecrets' + dt.getFullYear() + (dt.getMonth()+1) + dt.getDate()
        + dt.getHours() + dt.getMinutes() + dt.getSeconds() + '.db',
      mimeType: 'text/plain',
      parents: ['appDataFolder']
    };
    return this.http.post<any>(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
        metadata,
        { headers: header, observe: 'response' }
      ).pipe(switchMap((res: HttpResponse<void>) => (
          this.uploadFile(res, file, header)
            .pipe(tap((res) => console.log('created', res)))
          )
        )
      )
  }

  private updateFile(header: HttpHeaders, file: any, id: any): Observable<SyncFile> {
    return this.http.patch<any>(
        `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=resumable`, {},
        { headers: header, observe: 'response' }
      ).pipe(switchMap((res: HttpResponse<void>) => (
          this.uploadFile(res, file, header)
            .pipe(tap((res) => console.log('updated', res)))
          )
        )
      )
  }

  private uploadFile(res: HttpResponse<void>, file: any, header: HttpHeaders): Observable<SyncFile> {
    return this.http.put<any>(res.headers.get('location'), file, { headers: header });
  }
}
