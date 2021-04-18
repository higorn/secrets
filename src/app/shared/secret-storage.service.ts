import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Secret } from '../add-secret/shared/secret';

@Injectable({
  providedIn: 'root'
})
export class SecretStorageService {
  private secrets;

  constructor(private storageService: StorageService) {
      this.secrets = this.storageService.get('secrets') || [];
   }

  getAll(): Secret[] {
    return this.secrets;
  }

  create(secret: Secret) {
    this.secrets.push(secret);
    this.storageService.set('secrets', this.secrets);
  }
}
