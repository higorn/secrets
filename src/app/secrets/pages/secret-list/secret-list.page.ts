import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Secret } from 'src/app/add-secret/shared/secret';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';

@Component({
  selector: 'app-secret-list',
  templateUrl: 'secret-list.page.html',
  styleUrls: ['secret-list.page.scss']
})
export class SecretListPage implements OnInit {
  secrets = []

  constructor(
    private storage: SecretStorageService,
     private router: Router
  ) { }

  ngOnInit(): void {
    this.secrets = this.storage.getAll();
  }


  onClick(secret: Secret) {
    this.router.navigate(['/tabs/secrets', secret.name])
  }
}
