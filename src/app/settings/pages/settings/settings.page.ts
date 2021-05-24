import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AutofillService } from 'src/app/shared/autofill/autofill.service';
import { BiometricService } from 'src/app/shared/biometric.service';
import { ImportService } from 'src/app/shared/import.service';
import { SettingsService } from 'src/app/shared/settings.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { ImportComponent } from '../../components/import/import.component';
import { BiometricCredentialsComponent } from './../../components/biometric-credentials/biometric-credentials.component';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {
  settings: any = {};
  isBiometricAvailable = false;
  isAutofillAvailable = false;
  isImportAvailable = false;
  toggleClicked = false;
  private settingsSubscription: Subscription;

  constructor(
    private service: SettingsService,
    private translator: TranslatorService,
    private storage: StorageService,
    private alertController: AlertController,
    private vaultService: VaultService,
    private biometric: BiometricService,
    private autofill: AutofillService,
    private modal: ModalController,
    private importService: ImportService,
  ) {}

  ngOnDestroy(): void {
    this.settingsSubscription && this.settingsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.loadSettings();
    this.isImportAvailable = this.importService.isAvailable();
  }

  inViewDidEnter() {
    this.loadSettings();
  }

  private loadSettings() {
    this.settingsSubscription = this.service.getAll().subscribe((settings) => {
      this.settings = settings
      this.autofill.isAvailable().subscribe((isAvailable) => {
        this.isAutofillAvailable = isAvailable;
        isAvailable && this.autofill.isEnabled().subscribe((isEnabled) => this.settings.autofill = isEnabled)
      });
      this.toggleDarkTheme(this.settings.theme === 'dark');
    });
    this.biometric.isAvailable().subscribe((isAvailable) => (this.isBiometricAvailable = isAvailable));
  }

  changeLanguage(): void {
    this.translator.setLang(this.settings.language);
    this.service.save(this.settings);
  }

  onToggleClick(): void {
    this.toggleClicked = true;
  }

  toggleBiometric(): void {
    if (!this.toggleClicked) return;
    this.service.save(this.settings);
    this.settings.biometric && this.enableBiometric();
    this.toggleClicked = false;
  }

  private async enableBiometric(): Promise<void> {
    const modal = await this.modal.create({
      component: BiometricCredentialsComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data.password) {
      this.biometric.createCredentials(data.password);
      return;
    }
    this.settings.biometric = false;
    this.service.save(this.settings);
  }

  toggleAutofill(): void {
    console.log('autofill', this.settings.autofill);
    this.settings.autofill ? this.autofill.enable() : this.autofill.disable();
  }

  changeTheme(): void {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    prefersDark.addEventListener('change', (mediaQuery) => this.toggleDarkTheme(mediaQuery.matches));
    this.toggleDarkTheme(this.settings.theme === 'dark');
    this.service.save(this.settings);
  }

  private toggleDarkTheme(shouldAdd) {
    console.log('theme', shouldAdd)
    document.body.classList.toggle('dark', shouldAdd);
  }

  async import(): Promise<void> {
    const modal = await this.modal.create({
      component: ImportComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    console.log('dta', data);
    data && data.import && this.importService.openBrowser().subscribe();
  }

  wipe(): void {
    this.confirmWipe();
  }

  async confirmWipe() {
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
    this.isBiometricAvailable && this.biometric.removeCredentials();
  }

  private getTextForAlert() {
    let text: any = {};
    this.translator.get('settings.wipe.title').subscribe((t) => (text.title = t));
    this.translator.get('settings.wipe.message').subscribe((t) => (text.message = t));
    this.translator.get('settings.wipe.cancel').subscribe((t) => (text.cancel = t));
    this.translator.get('settings.wipe.yes').subscribe((t) => (text.yes = t));
    return text;
  }
}
