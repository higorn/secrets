import { DateUtils } from './../../shared/date-utils';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { SecureRepository } from 'src/app/shared/repo/secure.repository';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { CloudSyncService } from './../../shared/cloud-sync/cloud-sync.service';
import { Secret } from './secret';

@Injectable({
  providedIn: 'root',
})
export class SecretRepository extends SecureRepository<Secret> {
  private cloudSyncService: CloudSyncService;

  constructor(
    private storageService: StorageService,
    private _vault: VaultService,
    private cloudSyncServiceProvider: CloudSyncServiceProvider,
  ) {
    super(storageService, _vault);
    const sub = this.cloudSyncServiceProvider.get().subscribe((cloudSyncService) => {
      cloudSyncService.init({ merge: (data) => this.merge(data) });
      this.cloudSyncService = cloudSyncService;
      sub.unsubscribe();
    });
  }

  getCollectionName(): string {
    return 'secrets';
  }

  getAll(): Observable<Secret[]> {
    return super.getAll().pipe(map((secrets) => secrets.filter(s => !s.removed)));
  }

  refresh(): Observable<any> {
    return this.cloudSyncService.sync({ merge: (data) => this.merge(data) })
  }

  private merge(data: any): Observable<any> {
    console.log('data to merge', data);
    const externalSecrets: Secret[] = data.secrets ? JSON.parse(this._vault.decode(data.secrets)) : [];
    return super.getAll().pipe(switchMap((currentSecrets) => {
      console.log('externalsecrets', externalSecrets);
      console.log('current secret', currentSecrets)
      const mergedSecrets = this.mergeSecrets(externalSecrets || [], currentSecrets || []);
      return this.saveAll(mergedSecrets).pipe(switchMap(() => this.storageService.exportData()))
    }));
  }

  mergeSecrets(secretsA: Secret[], secretsB: Secret[]): Secret[] {
    let mergedSecrets: Secret[] = [];
    secretsA.forEach(a => {
      const utcTime = DateUtils.getUtcTime();
      const b = secretsB.find(b => b.id === a.id);

      if (!a.modified) a.modified = utcTime
      if (b && !b.modified) b.modified = utcTime

      mergedSecrets.push(b && b.modified > a.modified ? b : a);
    })
    secretsB.forEach(b => {
      if (!b.modified) b.modified = DateUtils.getUtcTime()

      const a = secretsA.find(a => a.id === b.id);
      if (!a)
        mergedSecrets.push(b);
    })
    return mergedSecrets;
  }
}
