import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslatorService } from '../shared/translator.service';
import { VaultService } from '../shared/vault.service';

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
    private plt: Platform
  ) {
    this.plt.pause.subscribe(() => {
      this.vault.seal();
      this.router.navigate(['/start']);
    });
  }

  ngOnInit() {}

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? 'text' : 'password';
  }

  unseal() {
    this.vault.unseal(this.password).subscribe(() => (this.password = null));
    this.router.navigate(['/tabs/secrets']);
  }
}
