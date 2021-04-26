import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { VaultService } from '../shared/vault.service';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  pwType = 'password';
  isPwVisible = false;
  loading = false;
  password: string;
  title = 'Vault unseal';

  constructor(
    private router: Router,
    private vault: VaultService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? "text" : "password";
  }

  // async unseal() {
  unseal() {
    console.log('pass', this.password);
    // this.loading = true; 
    // this.title = 'My secrets';
    // await this.presetLoading();
/*     this.vault.unseal(this.password).subscribe(() => {
      this.loading = false; 
      this.router.navigate(['/tabs/secrets'])
    }) */
    this.router.navigate(['/tabs/secrets'])
    this.vault.unseal(this.password);
  }

  private async presetLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();
  }
}
