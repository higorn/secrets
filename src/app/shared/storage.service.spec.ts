import { TestBed } from '@angular/core/testing';
// import { IonicStorageModule } from '@ionic/storage-angular';

import { IonicStorageService } from './ionic-storage.service';

describe('StorageService', () => {
  let service: IonicStorageService;
/*   const spyStorage = {
    set: jest.fn(),
    get: jest.fn()
  } */

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        // IonicStorageModule
/*         IonicStorageModule.forRoot({
          name: '__mydb',
          driverOrder: [Drivers.LocalStorage]
        }) */
      ],
/*       providers: [
        { provide: Storage, useValue: spyStorage }
      ] */
    });
    service = TestBed.inject(IonicStorageService);
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
