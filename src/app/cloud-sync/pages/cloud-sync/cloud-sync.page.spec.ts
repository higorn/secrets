import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, LoadingController, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CloudSyncServiceProvider } from 'src/app/shared/cloud-sync/cloud-sync.service.provider';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { SettingsService } from './../../../shared/settings.service';
import { CloudSyncPage } from './cloud-sync.page';


describe('CloudSyncPage', () => {
  let component: CloudSyncPage;
  let fixture: ComponentFixture<CloudSyncPage>;
  let loadingController: LoadingController;
  let modalController: ModalController;
  let router: Router;
  const routeStub = new ActivatedRouteStub();
  const spyCloud = {
    setup: jest.fn(),
    restore: jest.fn(),
  };
  const spySettings = {
    getCloudSync: jest.fn(),
    setCloudSync: jest.fn(),
    setFirstTime: jest.fn(),
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
            { path: 'start', component: CloudSyncPage },
          ]),
        ],
        providers: [
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: SettingsService, useValue: spySettings },
          { provide: CloudSyncServiceProvider, useValue: spyCloudSyncProvider },
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      loadingController = TestBed.inject(LoadingController);
      modalController = TestBed.inject(ModalController);

      spySettings.getCloudSync.mockReturnValue(of({ provider: 'none', file: null }))
      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      fixture = TestBed.createComponent(CloudSyncPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  afterEach(() => {
    spySettings.getCloudSync.mockReset()
    spyCloud.restore.mockReset()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the provider from the settings when it is set', () => {
    expect(component.provider).toEqual('none')
  })

  it('when the operation is restore, then should set op field as restore', () => {
    routeStub.setParamMap({ op: 'restore' });
    expect(component.op).toEqual('restore')
  })

  it('when the operation is restore, then should call the restore method on the choosen provider ' +
     'and redirect to the start page', fakeAsync(() => {
    routeStub.setParamMap({ op: 'restore' });
    component.provider = 'google-drive'
    spyCloud.restore.mockReturnValue(of([{ id: 'abc', name: 'eSecrets.db' }]))
    spyCloudSyncProvider.getByName.mockReturnValue(spyCloud)
    spySettings.setFirstTime.mockReturnValue(of())
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

    expect(spyCloud.restore).toHaveBeenCalled()
    expect(router.url).toBe('/start');
  }))

  it('when skip should redirect to the secrets list', fakeAsync(() => {
    component.skip()
    tick()

    expect(router.url).toBe('/tabs/secrets');
  }))

  it('after choose the provider should redirect to the secrets list', fakeAsync(() => {
    routeStub.setParamMap({ op: 'setup' });
    component.provider = 'none'
    spyCloud.setup.mockReturnValue(of({ id: 'abc', name: 'eSecrets.db' }))
    spyCloudSyncProvider.getByName.mockReturnValue(spyCloud)
    spySettings.setFirstTime.mockReturnValue(of())
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

    expect(spySettings.setCloudSync).toHaveBeenCalled()
    expect(router.url).toBe('/tabs/secrets');
  }))
});
