import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { AppLoadingController } from './app-loading.controller';
import { DEFAULT_SETTINGS } from './settings';
import { StorageService } from './storage/storage.service';


describe('AppLoadingController', () => {
  let service: AppLoadingController;
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: StorageService, useValue: spyStorage },
      ],
    });
    spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
    service = TestBed.inject(AppLoadingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
