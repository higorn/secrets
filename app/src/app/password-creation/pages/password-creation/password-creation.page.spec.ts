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
import { SettingsService } from 'src/app/shared/settings.service';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('PasswordCreationPage', () => {
  let component: PasswordCreationPage;
  let fixture: ComponentFixture<PasswordCreationPage>;
  let alertController: AlertController;
  let loadingController: LoadingController;
  let router: Router;
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
    enableBiometric: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PasswordCreationPage],
        imports: [
          IonicModule.forRoot(),
          FormsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([
            { path: 'cloud-sync/setup', component: PasswordCreationPage},
          ]),
        ],
        providers: [
          { provide: BiometricService, useValue: spyBiometricService },
          { provide: StorageService, useValue: spyStorage },
          { provide: VaultService, useValue: spyVaultService },
          // { provide: Router, useValue: spyRouter },
          { provide: SettingsService, useValue: spySettings },
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
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
      return Promise.resolve({
        present: jest.fn().mockResolvedValue(undefined),
      } as never);
    });
    fixture.detectChanges();

    component.password = '123';
    const form = fixture.debugElement.query(By.css('#form'));
    form.triggerEventHandler('submit', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
  }));

  it('when biometrics is not available, then unlock with password', waitForAsync(async () => {
    spyBiometricService.isAvailable.mockReturnValue(of(false));
    spyVaultService.unseal.mockReturnValue(of(null));
    spyOn(alertController, 'create').and.callFake((obj) => {});
    jest.spyOn(loadingController, 'create').mockResolvedValue({
      present: jest.fn().mockResolvedValue(undefined),
      dismiss: jest.fn().mockResolvedValue(undefined),
    } as never);
    jest.spyOn(loadingController, 'dismiss').mockResolvedValue(true as never);
    fixture.detectChanges();

    component.password = '123';
    component.createPwd();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await fixture.whenStable();

    expect(alertController.create).not.toHaveBeenCalled();
    expect(spyBiometricService.enableBiometric).not.toHaveBeenCalled();
    expect(spyVaultService.unseal).toHaveBeenCalledWith('123');
    // expect(spyRouter.navigate).toHaveBeenCalledWith(['/cloud-sync']);
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
      return Promise.resolve({
        present: jest.fn().mockResolvedValue(undefined),
      } as never);
    });

    component.password = '123';
    component.createPwd();

    expect(alertController.create).toHaveBeenCalled();
    expect(confirmBtnHandler).toBeTruthy();

    confirmBtnHandler();
    tick();
    fixture.detectChanges();


    expect(spyBiometricService.enableBiometric).toHaveBeenCalledWith('123');
    expect(spySettings.enableBiometric).toHaveBeenCalled();
    expect(spyVaultService.unseal).toHaveBeenCalledWith('123');
    // expect(spyRouter.navigate).toHaveBeenCalledWith(['/cloud-sync']);
  }));

  it('when decline to unlock with biometrics, then unlock with password', fakeAsync(() => {
    let cancelBtnHandler: Function;
    spyBiometricService.isAvailable.mockReturnValue(of(true));
    spyVaultService.unseal.mockReturnValue(of());
    spyOn(alertController, 'create').and.callFake((obj) => {
      cancelBtnHandler = obj.buttons[0].handler;
      return Promise.resolve({
        present: jest.fn().mockResolvedValue(undefined),
      } as never);
    });
    fixture.detectChanges();

    component.password = '123';
    component.createPwd();

    expect(alertController.create).toHaveBeenCalled();
    expect(cancelBtnHandler).toBeTruthy();

    cancelBtnHandler();
    tick();

    expect(spyBiometricService.enableBiometric).not.toHaveBeenCalled();
    expect(spyVaultService.unseal).toHaveBeenCalledWith('123');
    // expect(spyRouter.navigate).toHaveBeenCalledWith(['/cloud-sync']);
  }));
});
