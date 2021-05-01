import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StorageService } from '../shared/storage.service';
import { TranslatorService } from '../shared/translator.service';
import { VaultService } from '../shared/vault.service';
import { SettingsPage } from './settings.page';
import { Settings } from './shared/settings';
import { SettingsRepository } from './shared/settings.repository';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;
  let alertController: AlertController;
  const spyRepository = {
    get: jest.fn(),
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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SettingsPage],
        imports: [IonicModule, FormsModule, TranslateModule.forRoot()],
        providers: [
          { provide: SettingsRepository, useValue: spyRepository },
          { provide: TranslatorService, useValue: spyTranslator },
          { provide: StorageService, useValue: spyStorage },
          { provide: VaultService, useValue: spyVault },
        ],
      }).compileComponents();

      alertController = TestBed.inject(AlertController);
      fixture = TestBed.createComponent(SettingsPage);
      component = fixture.componentInstance;
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load the settings', () => {
    const expectedSettings: Settings = { language: 'en' };
    spyRepository.get.mockReturnValue(of(expectedSettings));
    fixture.detectChanges();

    component.inViewDidEnter();

    expect(component.settings).toBe(expectedSettings);
    expect(spyRepository.get).toHaveBeenCalled();
  });

  it('should be possible to change the language', () => {
    const expectedSettings: Settings = { language: 'en' };
    spyRepository.get.mockReturnValue(of(expectedSettings));
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
});
