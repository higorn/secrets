import { Injectable } from '@angular/core';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync.service.provider';
import { SecureRepository } from 'src/app/shared/secure.repository';
import { StorageService } from 'src/app/shared/storage.service';
import { VaultService } from 'src/app/shared/vault.service';
import { Secret } from './secret';

@Injectable({
  providedIn: 'root',
})
export class SecretRepository extends SecureRepository<Secret> {

  constructor(
    private storageService: StorageService,
    private _vault: VaultService,
    private cloudSyncServiceProvider: CloudSyncServiceProvider,
  ) {
    super(storageService, _vault);
    this.dataChanged$.subscribe(() => {
      const sub1 = this.cloudSyncServiceProvider.get().subscribe((cloudSync) => {
        const sub2 = cloudSync.sync().subscribe(() => {
          sub2.unsubscribe()
          sub1.unsubscribe()
        })
      })
    })
  }

  getCollectionName(): string {
    return 'secrets';
  }
}
