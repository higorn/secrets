import { of } from 'rxjs';
import { CrudRepository } from './crud.repository';
import { Entity } from './entity';

interface MyCollection extends Entity {
  id: string;
  name: string;
}

class MyRepository extends CrudRepository<MyCollection> {
  getCollectionName(): string {
    return 'MyCollection';
  }
}

describe('StorageService', () => {
  let repository: CrudRepository<MyCollection>;
  const storageService = {
    getItem: (key: string) => of(JSON.parse(localStorage.getItem(key))),
    setItem: (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value)),
    removeItem: (key: string) => localStorage.removeItem(key),
    clear: () => localStorage.clear()
  }

  beforeEach(() => {
    repository = new MyRepository(storageService);
  });

  it('should be created', () => {
    expect(repository).toBeTruthy();
  });

  describe('should include new items in the collection', () => {

    it('given that the collection is empty', () => {
      assertLength(0);
    })

    it('when I include a new item, then the collection size should be one', () => {
      const item = { id: 'a', name: 'nicanor' }
      repository.save(item);
      assertLength(1);
    })

    it('when I include another item, then the collection size should be two', () => {
      const item = { id: 'b', name: 'nicanor' }
      repository.save(item);
      assertLength(2);
    })
  })

  it('should get an item by id', () => {
    let item: MyCollection;
    repository.getById('a').subscribe(item => item = item);
    setTimeout(() => {
      expect(item.name).toBe('nicanor');
    })
  })

  it('should not create duplicated entries', () => {
    const item = { id: 'c', name: 'nicanor' }

    repository.save(item);
    assertLength(3);

    repository.save(item);
    assertLength(3);
  })

  it('should update an existing entry', () => {
    let updatedItem: MyCollection;
    const item = { id: 'c', name: 'protasio' }

    repository.save(item);
    repository.getById('c').subscribe(item => {
      updatedItem = item;
    })

    assertLength(3);
    setTimeout(() => {
      expect(updatedItem.name).toBe('protasio');
    })
  })

  it('should remove an item', () => {
    let removedItem = {};

    repository.getById('c').subscribe(item => {
      repository.remove(item);
    })
    repository.getById('c').subscribe(item => {
      removedItem = item;
    })
    assertLength(2);
    setTimeout(() => {
      expect(removedItem).toBe(undefined);
    })
  })

  function assertLength(expectedLength: number) {
    let len: number;
    repository.getAll().subscribe(items => {
      len = items.length;
    });

    setTimeout(() => {
      expect(len).toBe(expectedLength);
    });
  }
});

