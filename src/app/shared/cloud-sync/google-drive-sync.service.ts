import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import 'capacitor-gapi';
import { Authentication, User } from 'capacitor-gapi/dist/esm/user';
import { from, Observable, of, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { StorageService } from '../storage/storage.service';
import { CloudSyncService } from './cloud-sync.service';


@Injectable({
  providedIn: 'root',
})
export class GoogleDriveSyncService extends CloudSyncService {
  constructor(
    private storage: StorageService,
    private http: HttpClient
  ) {
    super();
  }

  setup(): Observable<any> {
    console.log('signIn...');
    return from(Plugins.Gapi.signIn()).pipe(switchMap((user: User) => {
      console.log('user', user);
      return this.sync(user.authentication.accessToken).pipe(map((_) => 'google-drive'))
    }))
  }

  restore(): Observable<any> {
    console.log('restoring...');
    return from(Plugins.Gapi.signIn()).pipe(switchMap((user: User) => {
      console.log('restoring user', user);
      return this.restoreFile(user.authentication.accessToken).pipe(map((_) => 'google-drive'))
    }))
  }

  sync(token?: string): Observable<any> {
    return zip(
      this.storage.getItem('secrets'),
      this.storage.getItem('settings'),
      this.storage.getItem('vault')
    ).pipe(switchMap((data) => {
        const payload = JSON.stringify({
          secrets: data[0],
          settings: data[1],
          vault: data[2],
        });
        if (token)
          return this.sendFile(payload, token);

        return from(Plugins.Gapi.refresh()).pipe(switchMap((auth: Authentication) => {
          console.log('init2', auth)
          return this.sendFile(payload, auth.accessToken);
        }))
      })
    )
  }

  private restoreFile(token: string): Observable<any> {
    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    return this.getFiles(header)
      .pipe(switchMap(({ files }) => {
        console.log('files', files);
        const params = new HttpParams().set('alt', 'media')
        return this.http.get<any>(`https://www.googleapis.com/drive/v3/files/${files[0].id}`,
          { headers: header, params: params }).pipe(map((file) => {
            console.log('file', file)
            this.storage.setItem('secrets', file.secrets)
            this.storage.setItem('settings', file.settings)
            this.storage.setItem('vault', file.vault)
            return true;
          }))
      }))
  }

  private getFiles(header: HttpHeaders): Observable<any> {
    const params = new HttpParams()
      .set('q', 'name="e-Secrets.db"')
      .set('fields', 'files(id)');
    return this.http.get('https://www.googleapis.com/drive/v3/files', { headers: header, params: params });
  }

  private sendFile(payload: string, token: string): Observable<any> {
    const file = new Blob([payload], { type: 'text/plain' });
    const metadata = {
      name: 'e-Secrets.db',
      mimeType: 'text/plain',
    };

    const header = new HttpHeaders({ Authorization: 'Bearer ' + token });
    return this.getFiles(header)
      .pipe(switchMap(({ files }) => {
          console.log('res get', files);
          if (files.length === 0) return this.createFile(header, metadata, file);
          else return this.updateFile(header, metadata, file, files[0].id);
        })
      )
  }

  private createFile(header: HttpHeaders, metadata: any, file: any): Observable<any> {
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

  private updateFile(header: HttpHeaders, metadata: any, file: any, id: any): Observable<any> {
    return this.http.patch<any>(
        `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=resumable`,
        metadata,
        { headers: header, observe: 'response' }
      ).pipe(switchMap((res: HttpResponse<void>) => (
          this.uploadFile(res, file, header)
            .pipe(tap((res) => console.log('updated', res)))
          )
        )
      )
  }

  private uploadFile(res: HttpResponse<void>, file: any, header: HttpHeaders): Observable<Object> {
    return this.http.put(res.headers.get('location'), file, { headers: header });
  }
}
