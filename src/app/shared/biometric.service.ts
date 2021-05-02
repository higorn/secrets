import { Subject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AvailableResult } from 'capacitor-native-biometric';

const { NativeBiometric } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  private verified = new Subject<string>();
  private verified$ = this.verified.asObservable();

  constructor() {}

  verifyIdentity(): Observable<string> {
    NativeBiometric.deleteCredentials({
      server: 'www.secrets.com',
    }).then();
    NativeBiometric.isAvailable().then((result: AvailableResult) => {
      if (result.isAvailable) {
        NativeBiometric.getCredentials({
          server: 'www.secrets.com',
        }).then(
          (creds) => {
            console.log('creds', creds);
          },
          (error) => {
            console.log('erro', error);
          }
        );
      }
    });
    return of('');
  }
}
