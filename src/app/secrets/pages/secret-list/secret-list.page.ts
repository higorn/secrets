import { Component, OnInit } from '@angular/core';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss']
})
export class SecretListPage implements OnInit {
  secrets = []

  constructor(
    private storage: SecretStorageService
  ) { }

  ngOnInit(): void {
    this.secrets = this.storage.getAll();
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
