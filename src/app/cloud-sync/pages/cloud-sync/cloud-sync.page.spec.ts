import { Injector } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage.service';
import { SettingsService } from './../../../shared/settings.service';
import { CloudSyncPage } from './cloud-sync.page';


describe('CloudSyncPage', () => {
  let component: CloudSyncPage;
  let fixture: ComponentFixture<CloudSyncPage>;
  let loadingController: LoadingController;
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spyCloud = {
    signIn: jest.fn(),
    sync: jest.fn(),
  };
  const spySettings = {
    getCloudSync: jest.fn()
  }
  const spyInjector = {
    get: jest.fn()
  }
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CloudSyncPage],
        imports: [
          IonicModule,
          FormsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: Router, useValue: spyRouter },
          { provide: SettingsService, useValue: spySettings },
          { provide: Injector, useValue: spyInjector },
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();

      loadingController = TestBed.inject(LoadingController);

      spySettings.getCloudSync.mockReturnValue(of('none'))
      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      fixture = TestBed.createComponent(CloudSyncPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  afterEach(() => {
    spyRouter.navigate.mockReset()
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the provider from the settings when it is set', () => {
    expect(component.provider).toEqual('none')
  })

  it('when skip should redirect to the secrets list', () => {
    component.skip()
    expect(spyRouter.navigate).toHaveBeenCalledWith(['/tabs/secrets'])
  })

  it('after choose the provider should redirect to the secrets list', fakeAsync(() => {
    component.provider = 'none'
    spyCloud.signIn.mockReturnValue(of(null))
    spyOn(component, 'getProvider').and.returnValue(spyCloud)
    spyOn(loadingController, 'create').and.callFake((obj) => {
      return new Promise((resolve, reject) => {
        resolve({ present: jest.fn() });
      });
    });
    spyOn(loadingController, 'dismiss').and.callFake((obj) => {});

    component.select()
    tick()

    expect(spyRouter.navigate).toHaveBeenCalledWith(['/tabs/secrets'])
  }))
});
