import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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
  private dataChangesSource = new Subject<Secret[]>();
  private dataChanges = this.dataChangesSource.asObservable();
  private cloudSyncService: CloudSyncService;
  private data: Secret[];

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
    if (!this.data) {
      super.getAll().subscribe((secrets) => {
        this.data = secrets || []
        this.dataChangesSource.next(this.data)
      });
      return this.dataChanges.pipe((map((secrets) => secrets ? secrets.filter(s => !s.removed) : [])));
    }
    setTimeout(() => this.dataChangesSource.next(this.data))
    return this.getData();
  }

  private getData(): Observable<Secret[]> {
    return this.dataChanges.pipe((map((secrets) => secrets ? secrets.filter(s => !s.removed) : [])));
  }

  saveAll(data: Secret[]): Observable<Secret[]> {
    this.data = data;
    super.saveAll(data).subscribe(() => {
      this.dataChangesSource.next(data);
    });
    return this.getData();
  }

  removeAll(items: Secret[]): Observable<void> {
    const toRemove = this.data.filter(ci => items.some(i => i.id === ci.id));
    console.log('to remove', toRemove)
    toRemove.forEach(i => {
      i.removed = true;
      i.modified = DateUtils.getUtcTime()
    })
    return this.saveAll(this.data).pipe(map(() => {}));
  }

  getById(id: string): Observable<Secret> {
    return of(this.data && this.data.find((item) => item.id === id));
  }

  save(item: Secret): Observable<Secret[]> {
    const collection = this.data || [];
    const curr = collection.find((i) => i.id === item.id);
    if (curr) this.update(curr, item);
    else collection.push(item);
    return this.saveAll(collection);
  }

  update(currItem: Secret, newItem: Secret): void {
    Object.keys(newItem).forEach((key) => (currItem[key] = newItem[key]));
  }

  remove(item: Secret): Observable<Secret[]> {
    return this.saveAll(this.data.filter((i) => i.id !== item.id));
  }

  refresh(): Observable<any> {
    return this.cloudSyncService.sync({ merge: (data) => this.merge(data) })
  }

  private merge(data: any): Observable<any> {
    console.log('data to merge', data);
    const decodedData = data.secrets ? this._vault.decode(data.secrets) : '[]';
    const externalSecrets: Secret[] = JSON.parse(decodedData);
    const currentSecrets = this.data;
    console.log('externalsecrets', externalSecrets);
    console.log('current secret', currentSecrets)
    const mergedSecrets = this.mergeSecrets(externalSecrets || [], currentSecrets || []);
    return this.saveAll(mergedSecrets).pipe(switchMap(() => this.storageService.exportData()))
  }

  mergeSecrets(secretsA: Secret[], secretsB: Secret[]): Secret[] {
    let mergedSecrets: Secret[] = [];
    secretsA.forEach(a => {
      const utcTime = DateUtils.getUtcTime();
      const b = secretsB.find(b => b.id === a.id);

      // if (!b && a.removed) return;
      if (a.removed) return;

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
