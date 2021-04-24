import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
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

  beforeEach(() => {
    spyStorageService.getItem.mockReturnValue(of([]));
    TestBed.configureTestingModule({});
    service = new SecretRepository(spyStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the collection name', () => {
    expect(service.getCollectionName()).toBe('secrets')
  })
});
