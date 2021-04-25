import { Injectable } from '@angular/core';
import { SecureRepository } from 'src/app/shared/secure.repository';
import { StorageService } from 'src/app/shared/storage.service';
import { VaultService } from 'src/app/shared/vault.service';
import { Secret } from './secret';

@Injectable({
  providedIn: 'root'
})
export class SecretRepository extends SecureRepository<Secret> {

  constructor(
    private storageService: StorageService,
    private _vault: VaultService
  ) {
    super(storageService, _vault);
    // this._vault.unseal('secret');
  }

  getCollectionName(): string {
    return 'secrets';
  }
}
