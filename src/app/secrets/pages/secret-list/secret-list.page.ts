import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { SecretRepository } from 'src/app/shared/secret.repository';
import { Secret } from '../../shared/secret';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss']
})
export class SecretListPage implements OnInit {
  secrets: Observable<Secret[]>;

  constructor(
    private repository: SecretRepository,
    private plt: Platform
  ) {
    this.plt.ready().then(() => {
      this.loadSecrets()
    })
  }

  ngOnInit(): void {
  }

  loadSecrets() {
    this.repository.dataChanged$.subscribe(() => this.secrets = this.repository.getAll());
  }

  getIcon(type: string) {
    switch (type) {
      case 'login': return 'log-in-outline'
      case 'card': return 'card-outline'
      case 'id': return 'id-card-outline'
      case 'pin': return 'key'
    }
  }
}
