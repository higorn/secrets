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
    const item = { id: 'a', name: 'nicanor' };
    vaultService.unseal('secret');
    tick(2000);
    spyOn(storageService, 'setItem').and.callFake((key, value) => {
      return from(
        new Promise<void>((resolve) => {
          setTimeout(() => {
            localStorage.setItem(key, JSON.stringify(value));
            resolve();
          });
        }),
      );
    });
    repository.save(item).subscribe();
    tick();
    tick();

    let len: number;
    repository.getAll().subscribe((items) => (len = items.length));
    tick();
    expect(len).toEqual(1);
  }));
});
