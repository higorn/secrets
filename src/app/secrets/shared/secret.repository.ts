import { Injectable } from '@angular/core';
import { SecureRepository } from 'src/app/shared/secure.repository';
import { StorageService } from 'src/app/shared/storage.service';
import { Secret } from './secret';

@Injectable({
  providedIn: 'root'
})
export class SecretRepository extends SecureRepository<Secret> {

  constructor(private storageService: StorageService) {
    super(storageService);
  }

  getCollectionName(): string {
    return 'secrets';
  }
}
