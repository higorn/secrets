import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { BiometricService } from 'src/app/shared/biometric.service';
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
  title = 'Vault unseal';

  constructor(
    private router: Router,
    private vault: VaultService,
    private translate: TranslatorService,
    private plt: Platform,
    private biometric: BiometricService
  ) {
    this.plt.pause.subscribe(() => {
      this.vault.seal();
      this.router.navigate(['/start']);
    });
  }

  ngOnInit() {
    this.biometric.verifyIdentity();
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? 'text' : 'password';
  }

  unseal() {
    this.setCreds();
    this.vault.unseal(this.password).subscribe(() => (this.password = null));
    this.router.navigate(['/tabs/secrets']);
  }

  setCreds() {
    /*     NativeBiometric.setCredentials({
      username: 'secrets',
      password: this.password,
      server: 'www.secrets.com',
    }).then(); */
  }
}
