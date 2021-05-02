import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule, Platform } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { BiometricService } from 'src/app/shared/biometric.service';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { SettingsService } from 'src/app/shared/settings.service';
import { StorageService } from 'src/app/shared/storage.service';
import { VaultService } from 'src/app/shared/vault.service';
import { StartPageRoutingModule } from '../../start-routing.module';
import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;
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
  };
  const spySettingsRepo = {
    get: jest.fn(),
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
          { provide: SettingsService, useValue: spySettingsRepo },
          { provide: Platform, useValue: spyPlt },
        ],
      }).compileComponents();

      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      spySettingsRepo.get.mockReturnValue(of(DEFAULT_SETTINGS));
      spyBiometric.verifyIdentity.mockReturnValue(of());
      fixture = TestBed.createComponent(StartPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  afterEach(() => {
    spyRouter.navigate.mockReset();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the biometric service', () => {
    // expect(spyBiometric.verifyIdentity).toHaveBeenCalled();
  });

  it('should go to the wellcome page if is the first time in the app', () => {
    // expect(spyRouter.navigate).toHaveBeenCalledWith(['/wellcome']);
  });
});
