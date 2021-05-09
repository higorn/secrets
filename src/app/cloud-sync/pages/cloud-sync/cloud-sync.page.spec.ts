import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, LoadingController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SecretListPage } from 'src/app/secrets/pages/secret-list/secret-list.page';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { SettingsService } from './../../../shared/settings.service';
import { CloudSyncPage } from './cloud-sync.page';


describe('CloudSyncPage', () => {
  let component: CloudSyncPage;
  let fixture: ComponentFixture<CloudSyncPage>;
  let loadingController: LoadingController;
  let router: Router;
  const spyCloud = {
    signIn: jest.fn(),
    sync: jest.fn(),
  };
  const spySettings = {
    getCloudSync: jest.fn()
  }
  const spyStorage = {
    getItem: jest.fn(),
  };
  const spyCloudSyncProvider = {
    getByName: jest.fn(),
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CloudSyncPage],
        imports: [
          IonicModule,
          FormsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'tabs/secrets', component: CloudSyncPage },
          ]),
        ],
        providers: [
          { provide: SettingsService, useValue: spySettings },
          { provide: CloudSyncServiceProvider, useValue: spyCloudSyncProvider },
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      loadingController = TestBed.inject(LoadingController);

      spySettings.getCloudSync.mockReturnValue(of('none'))
      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      fixture = TestBed.createComponent(CloudSyncPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the provider from the settings when it is set', () => {
    expect(component.provider).toEqual('none')
  })

  it('when skip should redirect to the secrets list', fakeAsync(() => {
    component.skip()
    tick()

    expect(router.url).toBe('/tabs/secrets');
  }))

  it('after choose the provider should redirect to the secrets list', fakeAsync(() => {
    component.provider = 'none'
    spyCloud.signIn.mockReturnValue(of(null))
    spyCloudSyncProvider.getByName.mockReturnValue(spyCloud)
    spyOn(loadingController, 'create').and.callFake((obj) => {
      return new Promise((resolve, reject) => {
        resolve({ present: jest.fn() });
      });
    });
    spyOn(loadingController, 'dismiss').and.callFake((obj) => {
      return new Promise((resolve, reject) => {resolve(true)})
    });

    component.select()
    tick()

    expect(router.url).toBe('/tabs/secrets');
  }))
});
