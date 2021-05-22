import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Credentials } from 'capacitor-native-biometric';
import { Observable, Subscription, zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiometricService } from 'src/app/shared/biometric.service';
import { SettingsService } from 'src/app/shared/settings.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { VaultService } from 'src/app/shared/vault/vault.service';

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
  unlockFailed = false;
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
    private biometric: BiometricService,
    private settingsRepo: SettingsService,
    private loading: LoadingController,
  ) {
  }

  ngOnDestroy(): void {
    this.pauseSub && this.pauseSub.unsubscribe();
    this.biometricIsAvailableSub && this.biometricIsAvailableSub.unsubscribe();
    this.biometricSub && this.biometricSub.unsubscribe();
    this.unsealSub && this.unsealSub.unsubscribe();
    this.translateSub && this.translateSub.unsubscribe();
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.useBiometricIfPossible();
  }

  private useBiometricIfPossible() {
    this.biometricIsAvailableSub = this.isBiometricPossible().subscribe(
      (result) => {
        this.isBiometric = result;
        result && this.unlockWithBiometric();
      }
    );
  }

  private isBiometricPossible(): Observable<boolean> {
    return zip(
      this.biometric.isAvailable(),
      this.settingsRepo.isBiometricEnabled()
    ).pipe(map((results) => results.every((r) => r)));
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
    this.unseal(creds.password);
    this.biometricFailed = false;
  }

  private async unseal(pass: string): Promise<void> {
    await this.presentLoading();
    this.unsealSub = this.vault.unseal(pass).subscribe((isSuccess) => {
      this.password = null;
      this.loading.dismiss().then(() => {}, (err) => console.log(err))
      if (!isSuccess) {
        this.unlockFailed = true;
        return;
      }
      this.unlockFailed = false;
      this.router.navigate(['/tabs/secrets']);
    });
  }

  private async presentLoading(): Promise<any> {
    let message = 'Unsealing, please wait.';
    this.translateSub = this.translator
      .get('loading.unseal')
      .subscribe((msg) => (message = msg));
    const loading = await this.loading.create({
      message: message,
      duration: 5000,
    });
    return loading.present();
  }
}
