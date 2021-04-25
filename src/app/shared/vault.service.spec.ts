import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockStorageService } from '../testing/mock-storage-service';
import { StorageService } from './storage.service';

import { VaultService } from './vault.service';

describe('VaultService', () => {
  let vault: VaultService;
  const storageService = new MockStorageService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageService }
      ]
    });
    vault = TestBed.inject(VaultService);
  });

  it('should be created', () => {
    expect(vault).toBeTruthy();
  });

  it('should create the vault when it does not exists', fakeAsync(() => {
    let vaultContent: any;
    storageService.getItem('vault').subscribe(item => vaultContent = item);
    tick();
    expect(vaultContent).toBeNull();

    vault.unseal('secret');
    tick();

    storageService.getItem('vault').subscribe(item => vaultContent = item);
    tick();
    // console.log('vault', vault);
    expect(vaultContent).toBeTruthy();
    expect(vaultContent.length).toBe(3);
  }))

  it('should encode and decode based on a password', fakeAsync(() => {
    const pass = 'secret';
    vault.unseal(pass);
    tick();
    const data = 'abc';
    const encoded = vault.encode(data);
    const decoded = vault.decode(encoded);
    expect(decoded).toEqual(data);
  }))
});
