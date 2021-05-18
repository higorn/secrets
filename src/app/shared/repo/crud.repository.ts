import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Entity } from '../entity';

export abstract class CrudRepository<T extends Entity> {

  constructor() {}

  abstract getAll(): Observable<T[]>;
  abstract saveAll(collection: T[]): Observable<T[]>;

  getById(id: string): Observable<T> {
    return this.getAll().pipe(map((items) => items && items.find((item) => item.id === id)));
  }

  save(item: T): Observable<T[]> {
    return this.getAll().pipe(switchMap((items) => {
      const collection = items || [];
      const curr = collection.find((i) => i.id === item.id);
      if (curr) this.update(curr, item);
      else collection.push(item);
      return this.saveAll(collection);
    }));
  }

  update(currItem: T, newItem: T): void {
    Object.keys(newItem).forEach((key) => (currItem[key] = newItem[key]));
  }

  remove(item: T): Observable<T[]> {
    return this.getAll().pipe(switchMap((items) => this.saveAll(items.filter((i) => i.id !== item.id))));
  }
}
