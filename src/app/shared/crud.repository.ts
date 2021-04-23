import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { Entity } from "./entity";
import { StorageService } from "./storage.service";

export abstract class CrudRepository<T extends Entity> {
  private collection: Observable<T[]>;

  constructor(private storage: StorageService) {
    this.collection = this.storage.getItem(this.getCollectionName()) || of([]);
  }

  abstract getCollectionName(): string;

  getAll(): Observable<T[]> {
    // return this.storage.getItem(this.getCollectionName()) || of([]);
    return this.collection;
  }

  getById(id: string): Observable<T> {
    // return this.getAll().pipe(map(items => items.find(item => item.id === id)))
    return this.collection.pipe(map(items => items.find(item => item.id === id)))
    // return this.getAll().find(item => item.id === id);
  }

  save(item: T): void {
    // this.getAll().subscribe(items => {
    this.collection.subscribe(items => {
      if (items.length == 0)
        this.storage.setItem(this.getCollectionName(), [item]);
      else {
        const curr = items.find(i=> i.id === item.id);
        if (curr)
          this.update(curr, item);
        else
          items.push(item);
        this.storage.setItem(this.getCollectionName(), items);
      }

    })
/*     if (this.getAll().length == 0) {
      this.storage.setItem(this.getCollectionName(), [item]);
    } else {
      const collection = this.getAll();
      const curr = collection.find(i=> i.id === item.id);
      if (curr)
        this.update(curr, item);
      else
        collection.push(item);
      this.storage.setItem(this.getCollectionName(), collection);
    } */
  }

  update(currItem: T, newItem: T): void {
    Object.keys(currItem).forEach(key => currItem[key] = newItem[key]);
  }

  remove(item: T): void {
    // this.getAll().subscribe(items => {
    this.collection.subscribe(items => {
      const index = items.indexOf(item);
      items.splice(index, 1);
      this.storage.setItem(this.getCollectionName(), items);
    })
/*     const collection = this.getAll();
    const index = collection.indexOf(item);
    collection.splice(index, 1);
    this.storage.setItem(this.getCollectionName(), collection); */
  }
}