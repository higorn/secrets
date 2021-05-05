import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { Injectable } from '@angular/core';
import { Observable, of, zip } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';

declare var gapi: any;

@Injectable({
  providedIn: 'root',
})
export class GoogleDriveSyncService extends CloudSyncService {
  constructor(private storage: StorageService) {
    super();
    this.init();
  }

  async init() {
    console.log('init1');
    const gAuth = await this.getAuth();
    console.log('init2', gAuth);
    gAuth.isSignedIn.listen(this.updateSigninStatus);
    this.updateSigninStatus(gAuth.isSignedIn.get());
  }

  private getAuth(): Promise<any> {
    return new Promise((resolve, reject) => {
      gapi.load(
        'client:auth2',
        async () => {
          await gapi.client.init({
            apiKey: environment.gapi.API_KEY,
            clientId: environment.gapi.CLIENT_ID,
            discoveryDocs: environment.gapi.DISCOVERY_DOCS,
            scope: environment.gapi.SCOPES,
          });
          resolve(gapi.auth2.getAuthInstance());
        },
        reject
      );
    });
  }

  private updateSigninStatus(isSignedIn) {
    console.log('signin st', isSignedIn);
    if (isSignedIn) {
      this.sync();
    }
  }

  signIn(): Observable<any> {
    console.log('signIn...');
    gapi.auth2.getAuthInstance().signIn();
    return of(null);
  }

  sync(): Observable<any> {
    zip(
      this.storage.getItem('secrets'),
      this.storage.getItem('settings'),
      this.storage.getItem('vault')
    ).subscribe((data) => {
      const payload = JSON.stringify({
        secrets: data[0],
        settings: data[1],
        vault: data[2],
      });
      this.sendFile(payload);
    });
    return of(null);
  }
  sendFile(payload: string) {
    var fileContent = payload;
    var file = new Blob([fileContent], { type: 'text/plain' });
    var metadata = {
      name: 'e-Secrets.db', // Filename at Google Drive
      mimeType: 'text/plain', // mimeType at Google Drive
      // 'parents': ['### folder ID ###'], // Folder ID at Google Drive
    };

    var accessToken = gapi.auth.getToken().access_token; // Here gapi is used for retrieving the access token.
    var form = new FormData();
    form.append(
      'metadata',
      new Blob([JSON.stringify(metadata)], { type: 'application/json' })
    );
    form.append('file', file);

    var xhr = new XMLHttpRequest();
    xhr.open(
      'post',
      'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id'
    );
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'json';
    xhr.onload = () => {
      console.log(xhr.response.id); // Retrieve uploaded file ID.
    };
    xhr.send(form);
  }
}
