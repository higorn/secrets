import { Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Credentials } from 'capacitor-native-biometric';
import { Subscription } from 'rxjs';
import { TranslatorService } from '../../../shared/translator.service';
import { BiometricService } from '../../../shared/biometric.service';
import { VaultService } from '../../../shared/vault.service';
import { SettingsService } from '../../../shared/settings.service';

@Component({
  selector: 'app-password-creation',
  templateUrl: './password-creation.page.html',
  styleUrls: ['./password-creation.page.scss'],
})
export class PasswordCreationPage implements OnInit, OnDestroy {
  pwType = 'password';
  isPwVisible = false;
  password: string;
  opts = {
    initialSlide: 0,
    speed: 400,
  };
  private biometricIsAvailableSub: Subscription;
  private biometricEnableSub: Subscription;
  private unsealSub: Subscription;
  private translateSub: Subscription;

  constructor(
    private translator: TranslatorService,
    private biometric: BiometricService,
    private alertController: AlertController,
    private vault: VaultService,
    private router: Router,
    private settings: SettingsService,
    private loading: LoadingController
  ) {}

  ngOnDestroy(): void {
    this.biometricIsAvailableSub && this.biometricIsAvailableSub.unsubscribe();
    this.biometricEnableSub && this.biometricEnableSub.unsubscribe();
    this.unsealSub && this.unsealSub.unsubscribe();
    this.translateSub && this.translateSub.unsubscribe();
  }

  ngOnInit() {}

  showSecret(): void {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? 'text' : 'password';
  }

  createPwd(): void {
    this.biometricIsAvailableSub = this.biometric.isAvailable().subscribe(
      (isAvailable) => {
        if (isAvailable) {
          this.askForBiometric();
          return;
        }
        this.unsealVault(this.password);
      },
      (error) => {
        this.unsealVault(this.password);
      }
    );
  }

  async askForBiometric() {
    const text = this.getTextForAlert();
    const alert = await this.alertController.create({
      header: text.title,
      message: text.message,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => this.unsealVault(this.password),
        },
        {
          text: text.yes,
          handler: () => this.enableBiometric(),
        },
      ],
    });
    await alert.present();
  }

  private getTextForAlert(): any {
    let text: any = {};
    this.translator
      .get('pwd-creation.askbio.title')
      .subscribe((t) => (text.title = t));
    this.translator
      .get('pwd-creation.askbio.message')
      .subscribe((t) => (text.message = t));
    this.translator
      .get('pwd-creation.askbio.no')
      .subscribe((t) => (text.cancel = t));
    this.translator
      .get('pwd-creation.askbio.yes')
      .subscribe((t) => (text.yes = t));
    return text;
  }

  private enableBiometric(): void {
    this.settings.enableBiometric();
    this.biometricEnableSub = this.biometric
      .enableBiometric(this.password)
      .subscribe((creds: Credentials) => {
        this.unsealVault(creds.password);
      });
  }

  private async unsealVault(pass: string): Promise<void> {
    this.settings.set('isFirstTime', false);
    await this.presentLoading();
    this.unsealSub = this.vault.unseal(pass).subscribe(() => {
      this.password = null;
      this.loading.dismiss();
      this.router.navigate(['/cloud-sync']);
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
