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
  password: string;

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

  async unseal() {
    console.log('pass', this.password);
    await this.presetLoading();
    this.vault.unseal(this.password).subscribe(() => {
      this.router.navigate(['/tabs/secrets'])
    })
  }

  private async presetLoading() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      duration: 3000
    });
    await loading.present();
  }
}
