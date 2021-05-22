import { Component, OnInit } from '@angular/core';
import { Filesystem } from '@capacitor/filesystem';
import { WebIntent } from '@ionic-native/web-intent/ngx';
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

  constructor(
    private repository: SecretRepository,
    private webIntent: WebIntent
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.loadSecrets();
  }

  ionViewDidEnter() {
    this.webIntent.getIntent().then((intent) => {
      console.log('intent', intent);
      if (intent.extras && intent.extras['android.intent.extra.SUBJECT'] === 'Chrome Passwords') {
        const uri = intent.extras['android.intent.extra.STREAM']
        Filesystem.readFile({ path: uri }).then(({ data }) => {
          console.log('data', data);
          console.log('data decoded', atob(data));
        })
      }
    })
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
