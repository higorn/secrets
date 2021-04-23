import { Injectable } from '@angular/core';
import { Secret } from '../secrets/shared/secret';
import { CrudRepository } from './crud.repository';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SecretRepository extends CrudRepository<Secret> {

  constructor(private storageService: StorageService) {
    super(storageService);
  }

  getCollectionName(): string {
    return 'secrets';
  }
}
