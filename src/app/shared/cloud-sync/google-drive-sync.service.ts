import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import "capacitor-gapi";
import { from, Observable, zip } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SettingsService } from '../settings.service';
import { StorageService } from '../storage/storage.service';
import { CloudSyncService } from './cloud-sync.service';


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

  signIn(): Observable<any> {
    console.log('signIn...');
    return from(Plugins.Gapi.signIn()).pipe(switchMap((user) => {
      console.log('user', user);
      this.settings.setCloudSync('google-drive');
      return this.sync(user.authentication.accessToken)
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

        return from(Plugins.Gapi.refresh()).pipe(switchMap((auth) => {
          console.log('init2', auth)
          return this.sendFile(payload, auth.accessToken);
        }))
      })
    )
  }

  private sendFile(payload: string, token?: string): Observable<any> {
    const file = new Blob([payload], { type: 'text/plain' });
    const metadata = {
      name: 'e-Secrets.db',
      mimeType: 'text/plain',
    };

    const accessToken = token
    const header = new HttpHeaders({ Authorization: 'Bearer ' + accessToken });

    const params = new HttpParams()
      .set('q', 'name="e-Secrets.db"')
      .set('fields', 'files(id)');
    return this.http.get('https://www.googleapis.com/drive/v3/files', { headers: header, params: params })
      .pipe(switchMap((res) => {
          console.log('res get', res);
          if (res['files'].length === 0) return this.createFile(header, metadata, file);
          else return this.updateFile(header, metadata, file, res['files'][0].id);
        })
      )
  }

  private createFile(header: HttpHeaders, metadata: any, file: any): Observable<any> {
    return this.http.post<any>(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable',
        metadata,
        { headers: header, observe: 'response' }
      ).pipe(switchMap((res) => (
          this.http.put(res.headers.get('location'), file, { headers: header })
            .pipe(tap((res) => {
              console.log('created', res);
            }))
          )
        )
      )
  }

  private updateFile(header: HttpHeaders, metadata: any, file: any, id: any): Observable<any> {
    return this.http.patch(
        `https://www.googleapis.com/upload/drive/v3/files/${id}?uploadType=resumable`,
        metadata,
        { headers: header, observe: 'response' }
      ).pipe(switchMap((res) => (
          this.http.put(res.headers.get('location'), file, { headers: header })
            .pipe(tap((res) => {
              console.log('updated', res);
            }))
          )
        )
      )
  }
}
