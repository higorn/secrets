import { fakeAsync, tick } from '@angular/core/testing';
import { from, Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CrudRepository } from './crud.repository';
import { Entity } from './entity';
import { StorageService } from './storage.service';

interface MyCollection extends Entity {
  id: string;
  name: string;
}

class MyRepository extends CrudRepository<MyCollection> {
  constructor(private storageService: StorageService) {
    super(storageService);
  }
  getCollectionName(): string {
    return 'MyCollection';
  }
  getAll(): Observable<MyCollection[]> {
    return this.storageService.getItem(this.getCollectionName());
  }
  saveAll(collection: MyCollection[]): Observable<MyCollection[]> {
    return this.storageService.setItem(this.getCollectionName(), collection);
  }
}

describe('StorageService', () => {
  let repository: CrudRepository<MyCollection>;
  const storageService = {
    getItem: (key: string) => from(new Promise((resolve, reject) => {
      setTimeout(() => resolve(JSON.parse(localStorage.getItem(key))))
    })),
    setItem: (key: string, value: any) => from(new Promise((resolve, reject) => {
      setTimeout(() => resolve(localStorage.setItem(key, JSON.stringify(value))))
    })),
    removeItem: (key: string) => from(new Promise((resolve, reject) => {
      setTimeout(() => resolve(localStorage.removeItem(key)))
    })),
    clear: () => of(localStorage.clear()),
    keys: () => of([])
  }

  beforeEach(() => {
    repository = new MyRepository(storageService);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('when get by id with an empty collection', fakeAsync(() => {
    let item: MyCollection

    repository.getById('a').subscribe(it => item = it);
    tick();

    expect(item).toBeNull();
  }))

  describe('should include new items in the collection', () => {

    it('given that the collection is empty', fakeAsync(() => {
      let collection: MyCollection[]
      repository.getAll().subscribe(items => {
        collection = items
      });
      tick();
      expect(collection).toBeNull()
    }))

    it('when I include a new item, then the collection size should be one', fakeAsync(() => {
      const item = { id: 'a', name: 'nicanor' }
      repository.save(item);
      tick();

      let len: number;
      repository.getAll().subscribe(items => len = items.length);
      tick();
      expect(len).toEqual(1);
    }))

    it('when I include another item, then the collection size should be two', fakeAsync(() => {
      const item = { id: 'b', name: 'nicanor' }
      repository.save(item);
      tick();

      let len: number;
      repository.getAll().subscribe(items => len = items.length);
      tick();
      expect(len).toEqual(2);
    }))
  })

  it('should get an item by id', fakeAsync(() => {
    let item: MyCollection;
    repository.getById('a').subscribe(it => item = it);
    tick();
    expect(item.name).toBe('nicanor');
  }))

  it('should not create duplicated entries', fakeAsync(() => {
    const item = { id: 'c', name: 'nicanor' }

    repository.save(item);
    tick();

    let len: number;
    repository.getAll().subscribe(items => len = items.length);
    tick();
    expect(len).toEqual(3);

    repository.save(item);

    repository.getAll().subscribe(items => len = items.length);
    tick();
    expect(len).toEqual(3);
  }))

  it('should update an existing entry', fakeAsync(() => {
    let updatedItem: MyCollection;
    const item = { id: 'c', name: 'protasio' }

    repository.save(item);
    tick();

    repository.getById('c').subscribe(item => {
      updatedItem = item
      // console.log('c', item)
    })

    let len: number;
    repository.getAll().subscribe(items => {
      len = items.length
      // console.log('len', len)
    });
    tick();
    expect(len).toEqual(3);
    expect(updatedItem.name).toBe('protasio');
  }))

  it('should remove an item', fakeAsync(() => {
    let removedItem = {};

    repository.getById('a').subscribe(item => repository.remove(item))
    tick();
    repository.getById('a').subscribe(item => removedItem = item)
    tick();

    let len: number;
    repository.getAll().subscribe(items => len = items.length);
    tick();
    expect(len).toEqual(2);
    expect(removedItem).toBe(undefined);
  }))
});

