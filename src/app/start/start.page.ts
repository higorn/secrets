import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private vault: VaultService
  ) { }

  ngOnInit() {
  }

  showSecret() {
    this.isPwVisible = !this.isPwVisible;
    this.pwType = this.isPwVisible ? "text" : "password";
  }

  unseal() {
    this.vault.unseal(this.password);
    this.router.navigate(['/tabs/secrets'])
  }
}
