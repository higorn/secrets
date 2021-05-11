import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import 'capacitor-gapi';
import { Authentication, User } from 'capacitor-gapi/dist/esm/user';
import { from, Observable, of, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SettingsService } from '../settings.service';
import { StorageService } from '../storage/storage.service';
import { CloudSyncService, SyncFile, SyncOptions } from './cloud-sync.service';


@Injectable({
  providedIn: 'root',
})
export class GoogleDriveSyncService extends CloudSyncService {
  constructor(
    private storage: StorageService,
    private settings: SettingsService,
    private http: HttpClient
  ) {
    super();
  }

  setup(): Observable<SyncFile> {
    console.log('signIn...');
    return from(Plugins.Gapi.signIn()).pipe(switchMap((user: User) => {
      console.log('user', user);
      return this.sync({ token: user.authentication.accessToken, file: null });
    }))
  }

  restore(): Observable<SyncFile[]> {
    console.log('restoring...');
    return from(Plugins.Gapi.signIn()).pipe(switchMap((user: User) => {
      console.log('restoring user', user);
      return this.restoreFile(user.authentication.accessToken);
    }))
  }

  sync(opts: SyncOptions): Observable<SyncFile> {
    return this.storage.exportData().pipe(switchMap(data => {
      console.log('data', data);
      const payload = JSON.stringify(data);
      if (opts && opts.token)
        return this.sendFile(payload, opts.token, opts.file);

      return from(Plugins.Gapi.refresh()).pipe(switchMap((auth: Authentication) => {
        console.log('init2', auth)
        return this.sendFile(payload, auth.accessToken, opts.file);
      }))
    }))
  }

  private restoreFile(token: string): Observable<SyncFile[]> {
    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    return this.getFiles(header)
      .pipe(switchMap((files) => {
        console.log('files', files);
        const params = new HttpParams().set('alt', 'media')
        return this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${files[0].id}`,
          { headers: header, params: params }).pipe(map((data) => {
            console.log('file', data)
            this.storage.importData(data)
            return files;
          }))
      }))
  }

  private getFiles(header: HttpHeaders): Observable<SyncFile[]> {
    const params = new HttpParams()
      .set('q', 'name contains \'eSecrets\'')
    return this.http.get<any>('https://www.googleapis.com/drive/v3/files', { headers: header, params: params })
      .pipe(map(({ files }) => files))
/*       .pipe(switchMap(({ files }) => {
        return this.settings.getDbFileName().pipe(map((fileName) => {
          if (files.length === 0) return files;
          const filteredFiles = files.filter((f: SyncFile) => f.name === fileName)
          if (filteredFiles.length) return filteredFiles;
          if (files.length === 1) {
            this.settings.setDbFileName(files[0].name);
          } else if (files.length > 1) {
            console.log('Found more than one file')
          }
          return files
        }))
      })); */
  }

  private sendFile(payload: string, token: string, file: SyncFile): Observable<SyncFile> {
    const fileContent = new Blob([payload], { type: 'text/plain' });
    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    return file && file.id ? this.updateFile(header, fileContent, file.id) : this.createFile(header, fileContent)
/*     return this.getFiles(header)
      .pipe(switchMap((files) => {
          console.log('res get', files);
          if (files.length === 0) return this.createFile(header, metadata, file);
          else return this.updateFile(header, metadata, file, files[0].id);
        })
      ) */
  }

  private createFile(header: HttpHeaders, file: any): Observable<SyncFile> {
    const dt = new Date();
    const metadata = {
      name: 'eSecrets' + dt.getFullYear() + (dt.getMonth()+1) + dt.getDate()
        + dt.getHours() + dt.getMinutes() + dt.getSeconds() + '.db',
      mimeType: 'text/plain',
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

  // private updateFile(header: HttpHeaders, metadata: any, file: any, id: any): Observable<SyncFile> {
  private updateFile(header: HttpHeaders, file: any, id: any): Observable<SyncFile> {
    return this.http.patch<any>(
        `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=resumable`, {},
        // metadata,
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
