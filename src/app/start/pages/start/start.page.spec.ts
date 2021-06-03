import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, LoadingController, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { from, of } from 'rxjs';
import { BiometricService } from 'src/app/shared/biometric.service';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { SettingsService } from 'src/app/shared/settings.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { StartPageRoutingModule } from '../../start-routing.module';
import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;
  let loadingController: LoadingController;
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spyVaultService = {
    unseal: jest.fn(),
  };
  const spyStorage = {
    getItem: jest.fn(),
  };
  const spyBiometric = {
    verifyIdentity: jest.fn(),
    isAvailable: jest.fn(),
  };
  const spySettings = {
    get: jest.fn(),
    isBiometricEnabled: jest.fn(),
  };
  const spyPlt = {
    pause: of(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StartPage],
        imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          StartPageRoutingModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: Router, useValue: spyRouter },
          { provide: VaultService, useValue: spyVaultService },
          { provide: StorageService, useValue: spyStorage },
          { provide: BiometricService, useValue: spyBiometric },
          { provide: SettingsService, useValue: spySettings },
          { provide: Platform, useValue: spyPlt },
        ],
      }).compileComponents();

      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      spySettings.get.mockReturnValue(of(DEFAULT_SETTINGS));
      spySettings.isBiometricEnabled.mockReturnValue(of(false));
      spyBiometric.isAvailable.mockReturnValue(of(false));
      spyBiometric.verifyIdentity.mockReturnValue(of());
      loadingController = TestBed.inject(LoadingController);
      fixture = TestBed.createComponent(StartPage);
      component = fixture.componentInstance;
    })
  );

  afterEach(() => {
    spyRouter.navigate.mockReset();
    spyBiometric.isAvailable.mockReset();
    spySettings.isBiometricEnabled.mockReset();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the biometric option if available and enabled', fakeAsync(() => {
    spyBiometric.isAvailable.mockReturnValue(of(true));
    spySettings.isBiometricEnabled.mockReturnValue(of(true));
    component.ionViewDidEnter();
    tick();
    expect(component.isBiometric).toBe(true);
  }));

  it('should not show the biometric option when not available', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component.isBiometric).toBe(false);
  }));

  it('should not show the biometric option when available but disabled by settings', fakeAsync(() => {
    spyBiometric.isAvailable.mockReturnValue(of(true));
    fixture.detectChanges();
    tick();
    expect(component.isBiometric).toBe(false);
  }));

  it('should show error when wrong password', fakeAsync(() => {
    spyVaultService.unseal.mockReturnValue(from(new Promise((resolve, reject) => resolve(false))));
    spyOn(loadingController, 'create').and.callFake((obj) => {
      return new Promise((resolve, reject) => {
        resolve({ present: jest.fn() });
      });
    });
    spyOn(loadingController, 'dismiss').and.callFake((obj) => {
      return new Promise((resolve, reject) => {resolve(true)})
    });

    component.unlockWithPwd();
    tick();

    expect(component.unlockFailed).toBe(true);
  }));
});
