import { BiometricService } from 'src/app/shared/biometric.service';
import { FormsModule } from '@angular/forms';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { WellcomePage } from './wellcome.page';
import { StorageService } from '../shared/storage.service';
import { of } from 'rxjs';
import { DEFAULT_SETTINGS } from '../shared/settings';
import { By } from '@angular/platform-browser';
import { VaultService } from '../shared/vault.service';
import { Router } from '@angular/router';
import { SettingsService } from '../shared/settings.service';

describe('WellcomePage', () => {
  let component: WellcomePage;
  let fixture: ComponentFixture<WellcomePage>;
  let alertController: AlertController;
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
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WellcomePage],
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

      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      fixture = TestBed.createComponent(WellcomePage);
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
    spyVaultService.unseal.mockReturnValue(of());
    spyOn(alertController, 'create').and.callFake((obj) => {});
    fixture.detectChanges();

    component.password = '123';
    component.createPwd();

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
