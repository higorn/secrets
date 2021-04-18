import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
/*   const spyStorage = {
    set: jest.fn(),
    get: jest.fn()
  } */

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
/*         IonicStorageModule.forRoot({
          name: '__mydb',
          driverOrder: [Drivers.LocalStorage]
        }) */
      ],
/*       providers: [
        { provide: Storage, useValue: spyStorage }
      ] */
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store an object', () => {
    const secrets = [
      {
        name: 'test',
        user: 'nicanor',
        password: '1234'
      }
    ]
    // service.set('secrets', secrets)
    // const s = service.get('secrets')
    // expect(s).toEqual(secrets)
  })
});
