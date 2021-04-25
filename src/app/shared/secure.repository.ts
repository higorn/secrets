import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudRepository } from './crud.repository';
import { Entity } from './entity';
import { StorageService } from './storage.service';
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
    // return this._storage.getItem(this.getCollectionName()).pipe(map(data => this.decode(data)));
    return this._storage.getItem(this.getCollectionName());
  }
  saveAll(collection: T[]): Observable<T[]> {
    // return this._storage.setItem(this.getCollectionName(), this.encode(collection))
    return this._storage.setItem(this.getCollectionName(), collection)
  }

  private encode(collection: T[]): string {
    const encoded = this.vault.encode(JSON.stringify(collection));
    return encoded;
  }
  private decode(data: any): T[] {
    if (!data) return data;
    const decoded = JSON.parse(this.vault.decode(data));
    return decoded;
  }

  save(item: T): void {
    // console.log('decoded item', item);
    super.save(item);
  }
}
