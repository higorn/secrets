import { TestBed } from '@angular/core/testing';
import { Secret } from '../add-secret/shared/secret';

import { SecretStorageService } from './secret-storage.service';
import { StorageService } from './storage.service';

describe('SecretStorageService', () => {
  let service: SecretStorageService;
  const spyStorageService = {
    set: jest.fn(),
    get: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: spyStorageService },
      ]
    });
    service = TestBed.inject(SecretStorageService);
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
      const secret = new Secret('LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
      service.create(secret);
      expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));
      expect(service.getAll().length).toBe(1);
    })

    it('when I include another secret, then the secrets size should be two', () => {
      const secret = new Secret('LOGIN', 'test2', { name: 'test2', user: 'nicanor', password: '1234' })
      service.create(secret);
      expect(spyStorageService.set).toHaveBeenCalledWith('secrets', expect.any(Array));
      expect(service.getAll().length).toBe(2);
    })
  })

});
