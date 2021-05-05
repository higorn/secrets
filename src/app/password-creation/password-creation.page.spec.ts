import { BiometricService } from 'src/app/shared/biometric.service';
import { FormsModule } from '@angular/forms';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import {
  AlertController,
  IonicModule,
  LoadingController,
} from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { PasswordCreationPage } from './password-creation.page';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { StorageService } from '../shared/storage.service';
import { VaultService } from '../shared/vault.service';
import { SettingsService } from '../shared/settings.service';
import { DEFAULT_SETTINGS } from '../shared/settings';

describe('Step1', () => {
  let component: PasswordCreationPage;
  let fixture: ComponentFixture<PasswordCreationPage>;
  let alertController: AlertController;
  let loadingController: LoadingController;
  const spyBiometricService = {
    isAvailable: jest.fn(),
    enableBiometric: jest.fn(),
  };
  const spyStorage = {
    getItem: jest.fn(),
  };
  const spyVaultService = {
    unseal: jest.fn(),
  };
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spySettings = {
    set: jest.fn(),
    enableBiometric: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PasswordCreationPage],
        imports: [IonicModule, FormsModule, TranslateModule.forRoot()],
        providers: [
          { provide: BiometricService, useValue: spyBiometricService },
          { provide: StorageService, useValue: spyStorage },
          { provide: VaultService, useValue: spyVaultService },
          { provide: Router, useValue: spyRouter },
          { provide: SettingsService, useValue: spySettings },
        ],
      }).compileComponents();

      alertController = TestBed.inject(AlertController);
      loadingController = TestBed.inject(LoadingController);

      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      fixture = TestBed.createComponent(PasswordCreationPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  afterEach(() => {
    spyBiometricService.isAvailable.mockReset();
    spyBiometricService.enableBiometric.mockReset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when biometrics is available, then offer to unlock with biometrics', fakeAsync(() => {
    let confirmBtnHandler: Function;
    spyBiometricService.isAvailable.mockReturnValue(of(true));
    spyOn(alertController, 'create').and.callFake((obj) => {
      confirmBtnHandler = obj.buttons[1].handler;
      return new Promise((resolve, reject) => {
        obj;
      });
    });
    fixture.detectChanges();

    component.password = '123';
    const form = fixture.debugElement.query(By.css('#form'));
    form.triggerEventHandler('submit', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
  }));

  it('when biometrics is not available, then unlock with password', fakeAsync(() => {
    spyBiometricService.isAvailable.mockReturnValue(of(false));
    spyVaultService.unseal.mockReturnValue(of(null));
    spyOn(alertController, 'create').and.callFake((obj) => {});
    spyOn(loadingController, 'create').and.callFake((obj) => {
      return new Promise((resolve, reject) => {
        resolve({ present: jest.fn() });
      });
    });
    spyOn(loadingController, 'dismiss').and.callFake((obj) => {});

    component.password = '123';
    component.createPwd();
    tick();

    expect(alertController.create).not.toHaveBeenCalled();
    expect(spyBiometricService.enableBiometric).not.toHaveBeenCalled();
    expect(spySettings.set).toHaveBeenCalledWith('isFirstTime', false);
    expect(spyVaultService.unseal).toHaveBeenCalledWith('123');
    expect(spyRouter.navigate).toHaveBeenCalledWith(['/tabs/secrets']);
  }));

  it('when choose to unlock with biometrics, then unlock with biometrics', fakeAsync(() => {
    let confirmBtnHandler: Function;
    spyBiometricService.isAvailable.mockReturnValue(of(true));
    spyBiometricService.enableBiometric.mockReturnValue(
      of({ username: 'secrets', password: '123' })
    );
    spyVaultService.unseal.mockReturnValue(of());
    spyOn(alertController, 'create').and.callFake((obj) => {
      confirmBtnHandler = obj.buttons[1].handler;
      return new Promise((resolve, reject) => {
        obj;
      });
    });
    fixture.detectChanges();

    component.password = '123';
    component.createPwd();

    expect(alertController.create).toHaveBeenCalled();
    expect(confirmBtnHandler).toBeTruthy();

    confirmBtnHandler();
    tick();

    expect(spyBiometricService.enableBiometric).toHaveBeenCalledWith('123');
    expect(spySettings.enableBiometric).toHaveBeenCalled();
    expect(spySettings.set).toHaveBeenCalledWith('isFirstTime', false);
    expect(spyVaultService.unseal).toHaveBeenCalledWith('123');
    expect(spyRouter.navigate).toHaveBeenCalledWith(['/tabs/secrets']);
  }));

  it('when decline to unlock with biometrics, then unlock with password', fakeAsync(() => {
    let cancelBtnHandler: Function;
    spyBiometricService.isAvailable.mockReturnValue(of(true));
    spyVaultService.unseal.mockReturnValue(of());
    spyOn(alertController, 'create').and.callFake((obj) => {
      cancelBtnHandler = obj.buttons[0].handler;
      return new Promise((resolve, reject) => {
        obj;
      });
    });
    fixture.detectChanges();

    component.password = '123';
    component.createPwd();

    expect(alertController.create).toHaveBeenCalled();
    expect(cancelBtnHandler).toBeTruthy();

    cancelBtnHandler();
    tick();

    expect(spyBiometricService.enableBiometric).not.toHaveBeenCalled();
    expect(spySettings.set).toHaveBeenCalledWith('isFirstTime', false);
    expect(spyVaultService.unseal).toHaveBeenCalledWith('123');
    expect(spyRouter.navigate).toHaveBeenCalledWith(['/tabs/secrets']);
  }));
});
