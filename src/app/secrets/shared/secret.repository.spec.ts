import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StorageService } from 'src/app/shared/storage.service';
import { VaultService } from 'src/app/shared/vault.service';
import { SecretRepository } from './secret.repository';


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

  beforeEach(() => {
    spyStorageService.getItem.mockReturnValue(of([]));
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: spyStorageService },
        { provide: VaultService, usevalue: spyVaultService }
      ]
    });
    service = TestBed.inject(SecretRepository);
    // service = new SecretRepository(spyStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the collection name', () => {
    expect(service.getCollectionName()).toBe('secrets')
  })
});
