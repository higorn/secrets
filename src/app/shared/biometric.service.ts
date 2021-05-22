import { TranslatorService } from './translator.service';
import { Injectable } from '@angular/core';
import { AvailableResult, Credentials } from 'capacitor-native-biometric';
import { Observable, of, Subject } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

const { NativeBiometric } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  private verified = new Subject<Credentials>();
  private verified$ = this.verified.asObservable();

  constructor(private translator: TranslatorService, private plt: Platform) {}

  isAvailable(): Observable<boolean> {
    console.log('plts', this.plt.platforms())

    if (!this.plt.is('capacitor')) return of(false);

    const isAvailableObs = new Subject<boolean>();
    NativeBiometric.isAvailable().then(
      (result: AvailableResult) => isAvailableObs.next(result.isAvailable),
      (error) => isAvailableObs.next(false)
    );
    return isAvailableObs.asObservable();
  }

  verifyIdentity(): Observable<Credentials> {
    NativeBiometric.getCredentials({
      server: 'www.secrets.com',
    }).then((creds: Credentials) => this.verifyIdentiyWithCreds(creds));
    return this.verified$;
  }

  enableBiometric(password: string): Observable<Credentials> {
    NativeBiometric.getCredentials({ server: 'www.secrets.com' }).then(
      (creds: Credentials) => this.verifyIdentiyWithCreds(creds),
      (error) => this.verifyIdentiyWithCreds(this.createCredentials(password))
    );
    return this.verified$;
  }

  createCredentials(password: string) {
    const creds = {
      username: 'secrets',
      password: password,
      server: 'www.secrets.com',
    };
    NativeBiometric.setCredentials(creds);
    return creds;
  }

  removeCredentials(): void {
    NativeBiometric.deleteCredentials({
      server: 'www.secrets.com',
    }).then();
  }

  private verifyIdentiyWithCreds(creds: Credentials) {
    const text = this.getText();
    NativeBiometric.verifyIdentity({
      reason: text.reason,
      title: text.title,
      subtitle: text.subtitle,
      negativeButtonText: text.cancel,
    }).then(
      () => this.verified.next(creds),
      (error) => this.verified.next(null)
    );
  }

  private getText(): any {
    let text: any = {};
    this.translator
      .get('pwd-creation.biometric.reason')
      .subscribe((t) => (text.reason = t));
    this.translator
      .get('pwd-creation.biometric.title')
      .subscribe((t) => (text.title = t));
    this.translator
      .get('pwd-creation.biometric.subtitle')
      .subscribe((t) => (text.subtitle = t));
    this.translator
      .get('pwd-creation.biometric.description')
      .subscribe((t) => (text.description = t));
    this.translator
      .get('pwd-creation.biometric.cancel')
      .subscribe((t) => (text.cancel = t));
    return text;
  }
}
