import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { SecretsPageModule } from '../../secrets.module';
import { ImportService } from '../../shared/import.service';
import { SecretRepository } from '../../shared/secret.repository';
import { SecretListPage } from './secret-list.page';

const secrets = [
  {
    type: 'LOGIN',
    name: 'test',
    content: {
      name: 'test',
      user: 'nicanor',
      password: '1234',
    },
  },
];

describe('SecretListPage', () => {
  let component: SecretListPage;
  let fixture: ComponentFixture<SecretListPage>;
  const spyRepository = {
    getAll: jest.fn(),
    dataReady: () => of(),
  };
  const spyImport = {
    getDataToImport: jest.fn(),
  }
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          SecretsPageModule,
          RouterTestingModule.withRoutes([]),
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: SecretRepository, useValue: spyRepository },
          { provide: ImportService, useValue: spyImport },
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();

      spyRepository.getAll.mockReturnValue(of(secrets));
      spyImport.getDataToImport.mockReturnValue(of(undefined));
      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));

      fixture = TestBed.createComponent(SecretListPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  afterEach(() => {
    spyRepository.getAll.mockReset();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list secrets', fakeAsync(() => {
    let len: number;

    component.isLoading = false;
    component.ionViewDidEnter();
    tick();
    component.secrets.subscribe((items) => {
      len = items.length;
    });

    expect(spyRepository.getAll).toHaveBeenCalled();
    expect(len).toBeGreaterThan(0);
  }));

/*   it('when is import, then go to import page', () => {
    spyImport.isImport.mockReturnValue(of(true));

    component.ionViewDidEnter();

    expect(spyRepository.getAll).not.toHaveBeenCalled();
  }) */
});
