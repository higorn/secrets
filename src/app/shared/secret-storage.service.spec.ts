import { TestBed } from '@angular/core/testing';
import { Secret } from '../secrets/shared/secret';
import { StorageService } from './storage.service';

import { SecretStorageService } from './secret-storage.service';

describe('SecretStorageService', () => {
  let service: SecretStorageService;
  const spyStorageService = {
    set: jest.fn(),
    get: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
/*       providers: [
        { provide: StorageService, useValue: spyStorageService },
      ] */
    });
    // service = TestBed.inject(SecretStorageService);
    service = new SecretStorageService(spyStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should include new secrets in the secrets db', () => {
    const secrets = []

    beforeEach(() => {
      spyStorageService.get.mockReturnValue(secrets);
    })

    it('given that the secrets table is empty', () => {
      expect(service.getAll().length).toBe(0);
    })

    it('when I include a new secret, then the secrets size should be one', () => {
      const secret = new Secret('1', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
      service.save(secret);
      expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));
      expect(service.getAll().length).toBe(1);
    })

    it('when I include another secret, then the secrets size should be two', () => {
      const secret = new Secret('2', 'LOGIN', 'test2', { name: 'test2', user: 'nicanor', password: '1234' })
      service.save(secret);
      expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));
      expect(service.getAll().length).toBe(2);
    })
  })

  it('should get a secret by id', () => {
    const secret = new Secret('abc', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    service.save(secret);
    expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));

    expect(service.get('abc')).toEqual(secret);
  })

  it('should not create duplicated entries', () => {
    const secrets = []
    spyStorageService.get.mockReturnValue(secrets);
    const service = new SecretStorageService(spyStorageService);

    const secret = new Secret('abc', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    service.save(secret);

    expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));
    expect(service.getAll().length).toBe(1);

    service.save(secret);
    expect(service.getAll().length).toBe(1);
  })

  it('should update an existing entry', () => {
    const secrets = []
    spyStorageService.get.mockReturnValue(secrets);
    const service = new SecretStorageService(spyStorageService);

    const secret = new Secret('abc', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    service.save(secret);

    expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));
    expect(service.getAll().length).toBe(1);

    secret.name = 'test2'
    secret.content.name = 'test2',
    secret.content.password = '4321'

    service.save(secret);
    const updated = service.get('abc');

    expect(updated.name).toEqual('test2')
    expect(updated.content.name).toEqual('test2')
    expect(updated.content.password).toEqual('4321')
    expect(service.getAll().length).toBe(1);
  })

});
