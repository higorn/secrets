import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { rejects } from 'node:assert';
import { from, Observable, of, zip } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { environment } from 'src/environments/environment';
import { SettingsService } from './settings.service';
import { StorageService } from './storage.service';

declare const gapi: any;

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
    this.settings.getCloudSync().subscribe((cloudSync) => {
      console.log('cloud sync', cloudSync)
      cloudSync === 'google-drive' && this.init().subscribe(file => console.log('file updated', file.id));
    });
  }

  init(): Observable<any> {
    console.log('init1');
    // const gAuth = await this.getAuth();
    return from(this.getAuth()).pipe(switchMap(gAuth => {
      console.log('init2', gAuth);
/*       gAuth.isSignedIn.listen((isSignedIn) =>
        this.updateSigninStatus(isSignedIn)
      ); */
      return this.updateSigninStatus(gAuth.isSignedIn.get());
    }))
  }

  private getAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load('client:auth2', async () => {
          await gapi.client.init({
            apiKey: environment.gapi.API_KEY,
            clientId: environment.gapi.CLIENT_ID,
            discoveryDocs: environment.gapi.DISCOVERY_DOCS,
            scope: environment.gapi.SCOPES,
          });
          resolve(gapi.auth2.getAuthInstance());
        },
        (error) => {
          // console.error('gapi.load', error);
          console.log('gapi.load', error);
          reject(error);
        }
      );
    });
  }

  private updateSigninStatus(isSignedIn): Observable<any> {
    console.log('signin st', isSignedIn);
    if (isSignedIn) {
      this.settings.setCloudSync('google-drive');
      return this.sync();
    } else return from(gapi.auth2.getAuthInstance().signIn()).pipe(switchMap(authRes => {
      console.log('back from login', authRes)
      this.settings.setCloudSync('google-drive');
      return this.sync();
    }));
  }

  signIn(): Observable<any> {
    console.log('signIn...');
    return this.init();
  }

  sync(): Observable<any> {
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
        return this.sendFile(payload);
      })
    )
  }

  private sendFile(payload: string): Observable<any> {
    const file = new Blob([payload], { type: 'text/plain' });
    const metadata = {
      name: 'e-Secrets.db',
      mimeType: 'text/plain',
    };

    const accessToken = gapi.auth.getToken().access_token;
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
