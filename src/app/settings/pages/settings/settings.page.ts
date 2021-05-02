import { BiometricService } from 'src/app/shared/biometric.service';
import { VaultService } from '../../../shared/vault.service';
import { StorageService } from 'src/app/shared/storage.service';
import { Subscription } from 'rxjs';
import { TranslatorService } from 'src/app/shared/translator.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { SettingsService } from 'src/app/shared/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  settings: any = {};
  private settingsSubscription: Subscription;

  constructor(
    private repository: SettingsService,
    private translator: TranslatorService,
    private storage: StorageService,
    private alertController: AlertController,
    private vaultService: VaultService,
    private biometric: BiometricService
  ) {}

  ngOnDestroy(): void {
    this.settingsSubscription && this.settingsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  inViewDidEnter() {
    this.loadSettings();
  }

  private loadSettings() {
    this.settingsSubscription = this.repository
      .getAll()
      .subscribe((settins) => (this.settings = settins));
  }

  changeLanguage(): void {
    this.translator.setLang(this.settings.language);
    this.repository.save(this.settings);
  }

  wipe(): void {
    this.presentConfirmation();
  }

  async presentConfirmation() {
    const text = this.getTextForAlert();
    const alert = await this.alertController.create({
      header: text.title,
      message: text.message,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: text.yes,
          handler: () => {
            this.wipeData();
          },
        },
      ],
    });
    await alert.present();
  }

  private wipeData() {
    this.storage.removeItem('secrets');
    this.storage.removeItem('settings');
    this.vaultService.reset().subscribe(() => {
      this.storage.clear();
    });
    this.biometric.removeCredentials();
  }

  private getTextForAlert() {
    let text: any = {};
    this.translator
      .get('settings.wipe.title')
      .subscribe((t) => (text.title = t));
    this.translator
      .get('settings.wipe.message')
      .subscribe((t) => (text.message = t));
    this.translator
      .get('settings.wipe.cancel')
      .subscribe((t) => (text.cancel = t));
    this.translator.get('settings.wipe.yes').subscribe((t) => (text.yes = t));
    return text;
  }
}
