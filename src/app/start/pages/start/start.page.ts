import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, Platform } from '@ionic/angular';
import { Credentials } from 'capacitor-native-biometric';
import { Subscription, zip, Observable, Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { BiometricService } from 'src/app/shared/biometric.service';
import { SettingsService } from 'src/app/shared/settings.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { VaultService } from 'src/app/shared/vault.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit, OnDestroy {
  pwType = 'password';
  isPwVisible = false;
  isBiometric = false;
  biometricFailed = false;
  password: string;
  private pauseSub: Subscription;
  private biometricIsAvailableSub: Subscription;
  private biometricSub: Subscription;
  private unsealSub: Subscription;
  private translateSub: Subscription;

  constructor(
    private router: Router,
    private vault: VaultService,
    private translator: TranslatorService,
    private plt: Platform,
    private biometric: BiometricService,
    private settingsRepo: SettingsService,
    private zone: NgZone,
    private loading: LoadingController
  ) {
    this.plt.pause.subscribe(() => {
      console.log('pause');
      this.zone.run(() => {
        this.vault.seal();
        this.router.navigate(['/start']);
        this.isBiometricPossible().subscribe(
          (result) => (this.isBiometric = result)
        );
      });
    });
  }

  ngOnDestroy(): void {
    this.pauseSub && this.pauseSub.unsubscribe();
    this.biometricIsAvailableSub && this.biometricIsAvailableSub.unsubscribe();
    this.biometricSub && this.biometricSub.unsubscribe();
    this.unsealSub && this.unsealSub.unsubscribe();
    this.translateSub && this.translateSub.unsubscribe();
  }

  ngOnInit() {
    this.useBiometricIfPossible();
  }

  private isBiometricPossible(): Observable<boolean> {
    return zip(
      this.biometric.isAvailable(),
      this.settingsRepo.isBiometricEnabled()
    ).pipe(map((results) => results.every((r) => r)));
  }

  private useBiometricIfPossible() {
    this.biometricIsAvailableSub = this.isBiometricPossible().subscribe(
      (result) => {
        this.isBiometric = result;
        result && this.unlockWithBiometric();
      }
    );
  }

  showSecret(): void {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? 'text' : 'password';
  }

  unlockWithPwd(): void {
    this.unseal(this.password);
  }

  unlockWithBiometric(): void {
    this.biometricSub = this.biometric.verifyIdentity().subscribe((creds) => {
      if (creds) {
        this.unsealWithCreds(creds);
        return;
      }
      this.biometricFailed = true;
    });
  }

  private unsealWithCreds(creds: Credentials): void {
    console.log('biometric success');
    this.unseal(creds.password);
    this.biometricFailed = false;
  }

  private unseal(pass: string): void {
    this.presentLoading().then(() => {
      this.unsealSub = this.vault.unseal(pass).subscribe(() => {
        this.password = null;
        this.loading.dismiss();
        this.router.navigate(['/tabs/secrets']);
      });
    });
  }

  private async presentLoading(): Promise<any> {
    let message = 'Unsealing, please wait.';
    this.translateSub = this.translator
      .get('loading.unseal')
      .subscribe((msg) => (message = msg));
    const loading = await this.loading.create({
      message: message,
      duration: 10000,
    });
    return loading.present();
  }
}
