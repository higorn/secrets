import { StorageService } from './storage.service';
import { Injectable } from '@angular/core';
import { Secret } from '../secrets/shared/secret';

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

  get(id: string): Secret {
    return this.secrets.find(s => s.id === id);
  }

  save(secret: Secret) {
    const s = this.get(secret.id);
    if (s) {
      s.name = secret.name;
      s.content = secret.content;
    } else
      this.secrets.push(secret);
    this.storageService.set('secrets', this.secrets);
  }
}
