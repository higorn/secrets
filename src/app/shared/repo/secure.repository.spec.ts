import { fakeAsync, tick } from '@angular/core/testing';
import { from } from 'rxjs';
import { MockStorageService } from '../../testing/mock-storage-service';
import { Entity } from '../entity';
import { VaultService } from '../vault/vault.service';
import { SecureRepository } from './secure.repository';


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
  const storageService = new MockStorageService();
  const vaultService = new VaultService(storageService);

  beforeEach(() => {
    repository = new MyRepository(storageService, vaultService);

  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  it('should encrypt and serialize the collection before save id', fakeAsync(() => {
    const item = { id: 'a', name: 'nicanor' }
    vaultService.unseal('secret');
    tick(2000);
    repository.save(item);
    tick();
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
