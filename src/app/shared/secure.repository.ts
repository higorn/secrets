import { Observable } from 'rxjs';
import { CrudRepository } from './crud.repository';
import { Entity } from './entity';
import { StorageService } from './storage.service';

export abstract class SecureRepository<T extends Entity> extends CrudRepository<T> {

  constructor(private _storage: StorageService) {
    super(_storage);
  }

  abstract getCollectionName(): string;

  getAll(): Observable<T[]> {
    return this._storage.getItem(this.getCollectionName());
  }
  saveAll(collection: T[]): Observable<T[]> {
    return this._storage.setItem(this.getCollectionName(), this.encode(collection))
    // return this._storage.setItem(this.getCollectionName(), collection)
  }

  private encode(collection: T[]): string {
    return 'abc'
  }

  save(item: T): void {
    console.log('decoded item', item);
    super.save(item);
  }
}
