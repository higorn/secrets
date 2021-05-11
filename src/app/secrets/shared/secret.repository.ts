import { CloudSync } from './../../shared/cloud-sync/cloud-sync.service';
import { Injectable } from '@angular/core';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { SecureRepository } from 'src/app/shared/repo/secure.repository';
import { SettingsService } from 'src/app/shared/settings.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { Secret } from './secret';

@Injectable({
  providedIn: 'root',
})
export class SecretRepository extends SecureRepository<Secret> {

  constructor(
    private storageService: StorageService,
    private _vault: VaultService,
    private cloudSyncServiceProvider: CloudSyncServiceProvider,
    private settings: SettingsService
  ) {
    super(storageService, _vault);
    this.dataChanged$.subscribe(() => {
      const sub1 = this.cloudSyncServiceProvider.get().subscribe((cloudSyncService) => {
        const sub2 = this.settings.getCloudSync().subscribe((cloudSync: CloudSync) => {
          const sub3 = cloudSyncService.sync({ file: cloudSync.file }).subscribe(() => {
            sub3.unsubscribe()
            sub2.unsubscribe()
            sub1.unsubscribe()
          })
        })
      })
    })
  }

  getCollectionName(): string {
    return 'secrets';
  }
}
