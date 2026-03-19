import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MockStorageService } from 'src/app/testing/mock-storage-service';
import { StorageService } from '../storage/storage.service';
import { VaultService } from './vault.service';


describe('VaultService', () => {
  let vault: VaultService;
  const storageService = new MockStorageService();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: StorageService, useValue: storageService }],
    });
    vault = TestBed.inject(VaultService);
  });

  it('should be created', () => {
    expect(vault).toBeTruthy();
  });

  it('should create the vault when it does not exists', fakeAsync(() => {
    let vaultContent: any;
    storageService.getItem('vault').subscribe((item) => (vaultContent = item));
    tick();
    expect(vaultContent).toBeNull();

    vault.unseal('secret');
    tick();

    storageService.getItem('vault').subscribe((item) => (vaultContent = item));
    tick();

    expect(vaultContent).toBeTruthy();
    expect(vaultContent.length).toBe(3);
  }));

  it('should encode and decode based on a password', fakeAsync(() => {
    const pass = 'secret';
    vault.unseal(pass);
    tick();
    const data = 'abc';
    const encoded = vault.encode(data);
    const decoded = vault.decode(encoded);
    expect(decoded).toEqual(data);
  }));

  it('should encode and decode with special char', fakeAsync(() => {
    const pass = 'secret';
    vault.unseal(pass);
    tick();
    const data = 'ąłbc';
    const encoded = vault.encode(data);
    const decoded = vault.decode(encoded);
    expect(decoded).toEqual(data);
  }));

  it('should reset the vault', fakeAsync(() => {
    let vaultContent: any;

    storageService.getItem('vault').subscribe((item) => (vaultContent = item));
    tick();

    expect(vaultContent).toBeTruthy();
    expect(vaultContent.length).toBe(3);

    vault.reset();

    storageService.getItem('vault').subscribe((item) => (vaultContent = item));
    tick();
    expect(vaultContent).toBeNull();
  }));

  it('should seal the vault', fakeAsync(() => {
    expect(vault.isSealed()).toBe(true);

    vault.unseal('secret');
    tick();
    const data = 'abc';
    let encoded = vault.encode(data);
    let decoded = vault.decode(encoded);

    expect(decoded).toEqual(data);
    expect(vault.isSealed()).toBe(false);

    vault.seal();
    const encode = () => vault.encode(data);

    expect(vault.isSealed()).toBe(true);
    expect(encode).toThrow(Error);
  }));

  it('should throw error when try to unseal with wrong password', fakeAsync(() => {
    let unsealSuccess = true;
    expect(vault.isSealed()).toBe(true);

    vault.unseal('wrong').subscribe((isSuccess) => (unsealSuccess = isSuccess));
    tick();

    expect(unsealSuccess).toBe(false);
  }));
});
