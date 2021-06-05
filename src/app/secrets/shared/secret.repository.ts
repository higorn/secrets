import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { SecureRepository } from 'src/app/shared/repo/secure.repository';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { CloudSyncService } from './../../shared/cloud-sync/cloud-sync.service';
import { DateUtils } from './../../shared/date-utils';
import { Secret } from './secret';

@Injectable({
  providedIn: 'root',
})
export class SecretRepository extends SecureRepository<Secret> {
  protected dataChangesSource = new Subject<Secret[]>();
  dataChanges = this.dataChangesSource.asObservable();
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
    super.getAll().subscribe((secrets) => this.dataChangesSource.next(secrets ? secrets.filter(s => !s.removed) : []));
    return this.dataChanges;
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
      this.dataChangesSource.next(mergedSecrets);
      return this.saveAll(mergedSecrets).pipe(switchMap(() => this.storageService.exportData()))
    }));
  }

  mergeSecrets(secretsA: Secret[], secretsB: Secret[]): Secret[] {
    let mergedSecrets: Secret[] = [];
    secretsA.forEach(a => {
      const utcTime = DateUtils.getUtcTime();
      const b = secretsB.find(b => b.id === a.id);

      if (!b && a.removed) return;

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
