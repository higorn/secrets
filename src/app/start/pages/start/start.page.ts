import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Credentials } from 'capacitor-native-biometric';
import { BiometricService } from 'src/app/shared/biometric.service';
import { SettingsService } from 'src/app/shared/settings.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { VaultService } from 'src/app/shared/vault.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  pwType = 'password';
  isPwVisible = false;
  password: string;

  constructor(
    private router: Router,
    private vault: VaultService,
    private translate: TranslatorService,
    private plt: Platform,
    private biometric: BiometricService,
    private settingsRepo: SettingsService
  ) {
    this.plt.pause.subscribe(() => {
      this.vault.seal();
      this.router.navigate(['/start']);
    });
  }

  ngOnInit() {
    this.biometric
      .verifyIdentity()
      .subscribe((creds) => this.unsealWithCreds(creds));
  }

  showSecret(): void {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? 'text' : 'password';
  }

  unsealWithPwd(): void {
    this.unseal(this.password);
  }

  private unsealWithCreds(creds: Credentials): void {
    this.unseal(creds.password);
  }

  private unseal(pass: string): void {
    this.vault.unseal(pass).subscribe(() => (this.password = null));
    this.router.navigate(['/tabs/secrets']);
  }
}
