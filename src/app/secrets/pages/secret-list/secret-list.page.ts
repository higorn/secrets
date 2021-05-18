import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss'],
})
export class SecretListPage implements OnInit {
  secrets: Observable<Secret[]>;
  loading = true;

  constructor(private repository: SecretRepository) {}

  ngOnInit(): void {
    this.loading = false;
    this.loadSecrets();
  }

  ionViewDidEnter() {
    this.loadSecrets();
  }

  loadSecrets() {
    if (!this.loading) this.secrets = this.repository.getAll();
  }

  refresh(event: any): void {
    this.repository.refresh().subscribe(() => {
      this.secrets = this.repository.getAll();
      event.target.complete()
    });
  }

  getIcon(type: string) {
    switch (type) {
      case 'web':
        return 'globe-outline';
      case 'mail':
        return 'mail-outline';
      case 'login':
        return 'key-outline';
      case 'card':
        return 'card-outline';
      case 'bank':
        return 'cash-outline';
      case 'identity':
        return 'id-card-outline';
      case 'pin':
        return 'key';
    }
  }
}
