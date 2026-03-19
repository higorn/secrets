import { TestBed } from '@angular/core/testing';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';

import { SecretListMenuController } from './secret-list-menu.controller';
import { SecretRepository } from './secret.repository';

describe('SecretListMenuController', () => {
  let service: SecretListMenuController;
  const spyStorage = {
    getItem: jest.fn(),
  };
  const spyRepository = {
    getAll: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        ModalController,
        { provide: StorageService, useValue: spyStorage },
        { provide: SecretRepository, useValue: spyRepository },
      ]
    });
    spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
    service = TestBed.inject(SecretListMenuController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
