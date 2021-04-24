import { Observable, of, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Entity } from "./entity";
import { StorageService } from "./storage.service";

export abstract class CrudRepository<T extends Entity> {
  private dataChangedSource = new Subject<T[]>();
  dataChanged$ = this.dataChangedSource.asObservable();

  constructor(private storage: StorageService) {
    this.dataChangedSource.next([])
    this.storage.getItem(this.getCollectionName()).subscribe(items => {
      const collection = items || []
      this.storage.setItem(this.getCollectionName(), collection).subscribe(items => this.dataChangedSource.next(items));
    })
  }

  abstract getCollectionName(): string;

  getAll(): Observable<T[]> {
  // const dataChangedSource2 = new Subject<T[]>();
  // const changed2$ = dataChangedSource2.asObservable();
    return this.storage.getItem(this.getCollectionName()).pipe(map(items => items || []));
    // return this.storage.getItem(this.getCollectionName()).pipe(map(items => items || []);
      // this.storage.getItem(this.getCollectionName()).subscribe(items => this.dataChangedSource.next(items || []));
      // this.storage.getItem(this.getCollectionName()).subscribe(items => dataChangedSource2.next(items || []));
    // return changed2$;
    // return this.changed$;
    // return this.dataChanged$;
  }

  getById(id: string): Observable<T> {
    return this.getAll().pipe(map(items => items.find(item => item.id === id)))
  }

  save(item: T): void {
    const sub = this.getAll().subscribe(items => {
      if (items.length == 0)
        items.push(item);
      else {
        const curr = items.find(i=> i.id === item.id);
        if (curr)
          this.update(curr, item);
        else
          items.push(item);
      }
      this.storage.setItem(this.getCollectionName(), items);
      this.dataChangedSource.next(items);
      // sub.unsubscribe();
    })
  }

  update(currItem: T, newItem: T): void {
    Object.keys(currItem).forEach(key => currItem[key] = newItem[key]);
  }

  remove(item: T): void {
    this.getAll().subscribe(items => {
      // const index = items.indexOf(item);
      // items.splice(index, 1);
      this.storage.setItem(this.getCollectionName(), items.filter(i => i.id !== item.id))
        .subscribe(items => this.dataChangedSource.next(items));
    })
  }
}