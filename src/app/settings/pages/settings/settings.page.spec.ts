import { BiometricService } from 'src/app/shared/biometric.service';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { SettingsService } from 'src/app/shared/settings.service';
import { TranslatorService } from 'src/app/shared/translator.service';
import { DEFAULT_SETTINGS } from './../../../shared/settings';
import { SettingsPage } from './settings.page';
import { VaultService } from 'src/app/shared/vault/vault.service';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AutofillService } from 'src/app/shared/autofill/autofill.service';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let alertController: AlertController;
  const spyRepository = {
    getAll: jest.fn(),
    save: jest.fn(),
  };
  const spyTranslator = {
    setLang: jest.fn(),
    get: () => of(''),
  };
  const spyStorage = {
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  const spyVault = {
    reset: jest.fn(),
  };
  const spyBiometric = {
    removeCredentials: jest.fn(),
    isAvailable: jest.fn(),
  };
  const spyAutofill = {
    isAvailable: jest.fn(),
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsPage],
        imports: [
          IonicModule,
          FormsModule,
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
         ],
        providers: [
          { provide: SettingsService, useValue: spyRepository },
          { provide: TranslatorService, useValue: spyTranslator },
          { provide: StorageService, useValue: spyStorage },
          { provide: VaultService, useValue: spyVault },
          { provide: BiometricService, useValue: spyBiometric },
          { provide: AutofillService, useValue: spyAutofill },
        ],
      }).compileComponents();

      spyBiometric.isAvailable.mockReturnValue(of(false));
      spyAutofill.isAvailable.mockReturnValue(of(true));
      alertController = TestBed.inject(AlertController);
      fixture = TestBed.createComponent(SettingsPage);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the settings', () => {
    const expectedSettings = DEFAULT_SETTINGS;
    spyRepository.getAll.mockReturnValue(of(expectedSettings));
    fixture.detectChanges();

    component.inViewDidEnter();

    expect(component.settings).toBe(expectedSettings);
    expect(spyRepository.getAll).toHaveBeenCalled();
  });

  it('should be possible to change the language', () => {
    const expectedSettings = DEFAULT_SETTINGS;
    spyRepository.getAll.mockReturnValue(of(expectedSettings));
    fixture.detectChanges();

    component.inViewDidEnter();
    component.settings.language = 'pt';
    component.changeLanguage();

    expect(spyRepository.save).toHaveBeenCalledWith(component.settings);
    expect(spyTranslator.setLang).toHaveBeenCalledWith(
      component.settings.language
    );
  });

  it('should wipe device data only after a confirmation', fakeAsync(() => {
    let confirmBtnHandler: Function;
    spyVault.reset.mockReturnValue(of());
    spyOn(alertController, 'create').and.callFake((obj) => {
      confirmBtnHandler = obj.buttons[1].handler;
      return new Promise((resolve, reject) => {
        obj;
      });
    });
    fixture.detectChanges();
    const wipeBtn = fixture.debugElement.query(By.css('#wipe-btn'));
    wipeBtn.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(confirmBtnHandler).toBeTruthy();

    confirmBtnHandler();
    tick();

    expect(spyStorage.removeItem).toHaveBeenCalledWith('secrets');
    expect(spyStorage.removeItem).toHaveBeenCalledWith('settings');
    expect(spyVault.reset).toHaveBeenCalled();
  }));

  it('should show autofill option when it is available', () => {
    fixture.detectChanges();
    expect(component.isAutofillAvailable).toBe(true);
  })
});
