import { TranslatorService } from './translator.service';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AvailableResult, Credentials } from 'capacitor-native-biometric';
import { Observable, Subject } from 'rxjs';

const { NativeBiometric } = Plugins;

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  private verified = new Subject<Credentials>();
  private verified$ = this.verified.asObservable();

  constructor(private translator: TranslatorService) {}

  isAvailable(): Observable<boolean> {
    const isAvailableObs = new Subject<boolean>();
    NativeBiometric.isAvailable().then(
      (result: AvailableResult) => isAvailableObs.next(result.isAvailable),
      (error) => isAvailableObs.error('Biometric not available')
    );
    return isAvailableObs.asObservable();
  }

  verifyIdentity(): Observable<Credentials> {
    NativeBiometric.getCredentials({
      server: 'www.secrets.com',
    }).then((creds: Credentials) => this.verifyIdentiyWithCreds(creds));
    return this.verified$;
  }

  removeCredentials(): void {
    NativeBiometric.deleteCredentials({
      server: 'www.secrets.com',
    }).then();
  }

  enableBiometric(password: string): Observable<Credentials> {
    NativeBiometric.getCredentials({ server: 'www.secrets.com' }).then(
      (creds: Credentials) => this.verifyIdentiyWithCreds(creds),
      (error) => this.verifyIdentiyWithCreds(this.createCredentials(password))
    );
    return this.verified$;
  }

  private createCredentials(password: string) {
    const creds = {
      username: 'secrets',
      password: password,
      server: 'www.secrets.com',
    };
    NativeBiometric.setCredentials(creds).then();
    return creds;
  }

  private verifyIdentiyWithCreds(creds: Credentials) {
    const text = this.getText();
    NativeBiometric.verifyIdentity({
      reason: text.reason,
      title: text.title,
      subtitle: text.subtitle,
      negativeButtonText: text.cancel,
    }).then(() => {
      this.verified.next(creds);
    });
  }

  private getText(): any {
    let text: any = {};
    this.translator
      .get('wellcome.step2.biometric.reason')
      .subscribe((t) => (text.reason = t));
    this.translator
      .get('wellcome.step2.biometric.title')
      .subscribe((t) => (text.title = t));
    this.translator
      .get('wellcome.step2.biometric.subtitle')
      .subscribe((t) => (text.subtitle = t));
    this.translator
      .get('wellcome.step2.biometric.description')
      .subscribe((t) => (text.description = t));
    this.translator
      .get('wellcome.step2.biometric.cancel')
      .subscribe((t) => (text.cancel = t));
    return text;
  }
}
