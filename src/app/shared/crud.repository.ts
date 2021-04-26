import { Observable, of, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Entity } from "./entity";
import { StorageService } from "./storage.service";

export abstract class CrudRepository<T extends Entity> {
  protected dataChangedSource = new Subject<void>();
  dataChanged$ = this.dataChangedSource.asObservable();

  constructor(private storage: StorageService) {
    // this.init();
  }

  private init() {
    setTimeout(() =>{
      this.getAll().subscribe(items => {
        if (items)
          this.dataChangedSource.next();
        else
          this.saveAll([]).subscribe(items => this.dataChangedSource.next());
      })
    })
  }

  abstract getAll(): Observable<T[]>;
  abstract saveAll(collection: T[]): Observable<T[]>;

/*   getAll(): Observable<T[]> {
    return this.storage.getItem(this.getCollectionName());
  } */

  getById(id: string): Observable<T> {
    return this.getAll().pipe(map(items => items && items.find(item => item.id === id)))
  }

  save(item: T): void {
    const sub = this.getAll().subscribe(items => {
      const collection = items || [];
      const curr = collection.find(i=> i.id === item.id);
      if (curr)
        this.update(curr, item);
      else
        collection.push(item);
      // this.storage.setItem(this.getCollectionName(), collection)
        // .subscribe(items => this.dataChangedSource.next());
      this.saveAll(collection).subscribe(items => this.dataChangedSource.next());
    })
  }

  update(currItem: T, newItem: T): void {
    Object.keys(currItem).forEach(key => currItem[key] = newItem[key]);
  }

  remove(item: T): void {
    this.getAll().subscribe(items => {
      this.saveAll(items.filter(i => i.id !== item.id)).subscribe(items => this.dataChangedSource.next());
      // this.storage.setItem(this.getCollectionName(), items.filter(i => i.id !== item.id))
        // .subscribe(items => this.dataChangedSource.next());
    })
  }
}