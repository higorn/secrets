import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudRepository } from './crud.repository';
import { Entity } from './entity';
import { StorageService } from './storage/storage.service';
import { VaultService } from './vault.service';

export abstract class SecureRepository<T extends Entity> extends CrudRepository<T> {

  constructor(
    private _storage: StorageService,
    private vault: VaultService
  ) {
    super(_storage);
  }

  abstract getCollectionName(): string;

  getAll(): Observable<T[]> {
    return this._storage.getItem(this.getCollectionName()).pipe(map(data => this.decode(data)));
  }
  saveAll(collection: T[]): Observable<T[]> {
    return this._storage.setItem(this.getCollectionName(), this.encode(collection))
  }

  private encode(collection: T[]): string {
    return this.vault.encode(JSON.stringify(collection));
  }
  private decode(data: any): T[] {
    if (!data) return data;
    return JSON.parse(this.vault.decode(data))
  }
}
