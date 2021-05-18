import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { SettingsService } from 'src/app/shared/settings.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { Secret } from './secret';
import { SecretRepository } from './secret.repository';
import { v4 as uuid } from 'uuid';


describe('SecretStorageService', () => {
  let service: SecretRepository;
  const spyStorageService = {
    setItem: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    keys: () => of([]),
  }
  const spyVaultService = {
    encode: jest.fn(),
    decode: jest.fn(),
  }
  const spyCloudSyncProvider = {
    get: jest.fn(),
  }

  beforeEach(() => {
    spyStorageService.getItem.mockReturnValue(of([]));
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: spyStorageService },
        { provide: VaultService, useValue: spyVaultService },
        { provide: CloudSyncServiceProvider, useValue: spyCloudSyncProvider },
      ]
    });
    spyCloudSyncProvider.get.mockReturnValue(of({ init: jest.fn() }))
    service = TestBed.inject(SecretRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the collection name', () => {
    expect(service.getCollectionName()).toBe('secrets')
  })

  describe('should merge two list of secrets', () => {
    it('when both lists are empty, then the output list should also be empty', () => {
      const mergedSecrets = service.mergeSecrets([], []);

      expect(mergedSecrets).toEqual([])
    })

    it('when listA and listB has different elements, then the output list should contain the joint of A and B', () => {
      const listA = [
        new Secret(uuid(), 'login', 'aaa', {login: 'aaa@aa', password: '123'})
      ]
      const listB = [
        new Secret(uuid(), 'login', 'bbb', {login: 'bbb@bb', password: '321'})
      ]

      const mergedSecrets = service.mergeSecrets(listA, listB);

      expect(mergedSecrets.length).toBe(2)
      expect(mergedSecrets).toEqual(listA.concat(listB))
    })

    it('when listA is empty then returns listB', () => {
      const listA = []
      const listB = [
        new Secret(uuid(), 'login', 'bbb', {login: 'bbb@bb', password: '321'})
      ]

      const mergedSecrets = service.mergeSecrets(listA, listB);

      expect(mergedSecrets.length).toBe(1)
      expect(mergedSecrets).toEqual(listB)
    })

    it('when listB is empty then returns listA', () => {
      const listA = [
        new Secret(uuid(), 'login', 'aaa', {login: 'aaa@aa', password: '123'})
      ]
      const listB = []

      const mergedSecrets = service.mergeSecrets(listA, listB);

      expect(mergedSecrets.length).toBe(1)
      expect(mergedSecrets).toEqual(listA)
    })

    it('when both lists has the same elements, then returns only one list', () => {
      const listA = [
        new Secret(uuid(), 'login', 'aaa', {login: 'aaa@aa', password: '123'}, new Date())
      ]
      const listB = [
        listA[0]
      ]

      const mergedSecrets = service.mergeSecrets(listA, listB);

      expect(mergedSecrets.length).toBe(1)
      expect(mergedSecrets).toEqual(listA)
    })

    it('when both lists has the same elements with different data, then returns the newest', () => {
      const d1 = new Date()
      const d2 = new Date()
      d2.setHours(d2.getHours() + 1)
      const id = uuid();
      const listA = [
        new Secret(id, 'login', 'aaa', {login: 'aaa@aa', password: '123'}, d1)
      ]
      const listB = [
        new Secret(id, 'login', 'aaa', {login: 'aaa@aa', password: '321'}, d2)
      ]

      const mergedSecrets = service.mergeSecrets(listA, listB);

      expect(mergedSecrets.length).toBe(1)
      expect(mergedSecrets).toEqual(listB)
    })

    it('when lists A and B has the same different elements and some equal elements', () => {
      const d1 = new Date()
      const d2 = new Date()
      d2.setHours(d2.getHours() + 1)
      const id = uuid();
      const listA = [
        new Secret(id, 'login', 'aaa', {login: 'aaa@aa', password: '123'}, d1),
        new Secret(uuid(), 'web', 'bbb', {user: 'bbb', password: '123', site: 'www'}, d1),
        new Secret(uuid(), 'email', 'ccc', {email: 'ccc@cc', password: '321', site: 'www'}, d1),
        new Secret(uuid(), 'card', 'ddd', {cardnumber: '1234', cardowner: 'ddd', cardexpires: d2, cvv: 303, pin: 444}, d1),
      ]
      const listB = [
        new Secret(id, 'login', 'aaa', {login: 'aaa@aa', password: '321'}, d2),
        new Secret(listA[1].id, 'web', 'bbb', {user: 'bbb', password: '123', site: 'www'}, d1),
        new Secret(listA[2].id, 'email', 'ccc', {email: 'cc@cc', password: '321', site: 'ww'}, d2),
        new Secret(uuid(), 'card', 'eee', {cardnumber: '4321', cardowner: 'eee', cardexpires: d2, cvv: 302, pin: 333}, d2),
      ]
      const expectedMerged = [
        listB[0], listA[1], listB[2], listA[3], listB[3]
      ]

      const mergedSecrets = service.mergeSecrets(listA, listB);

      expect(mergedSecrets.length).toBe(5)
      expect(mergedSecrets).toEqual(expectedMerged)
    })
  })
});
