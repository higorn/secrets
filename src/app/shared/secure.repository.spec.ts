import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { from, of } from 'rxjs';
import { Entity } from './entity';
import { SecureRepository } from './secure.repository';

import { StorageService } from './storage.service';

interface MyCollection extends Entity {
  id: string;
  name: string;
}

class MyRepository extends SecureRepository<MyCollection> {
  getCollectionName(): string {
    return 'MyCollection';
  }
}

describe('SecureRepository', () => {
  let repository: SecureRepository<MyCollection>;
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

  it('should encrypt and serialize the collection before save id', fakeAsync(() => {
    const item = { id: 'a', name: 'nicanor' }
    repository.save(item);
    spyOn(storageService, 'setItem').and.callFake((key, value) => {
      console.log('encoded item', value);
      return from(new Promise((resolve, reject) => {
        setTimeout(() => resolve(localStorage.setItem(key, JSON.stringify(value))))
      }))
    })
    tick();

    let len: number;
    repository.getAll().subscribe(items => len = items.length);
    tick();
    expect(len).toEqual(1);
  }))
});
