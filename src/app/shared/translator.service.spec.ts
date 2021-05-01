import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

import { TranslatorService } from './translator.service';
import { StorageService } from './storage.service';
import { of } from 'rxjs';

describe('TranslatorService', () => {
  let service: TranslatorService;
  const spyTranslate = {
    setDefaultLang: jest.fn(),
    use: jest.fn(),
  };
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        { provide: TranslateService, useValue: spyTranslate },
        { provide: StorageService, useValue: spyStorage },
      ],
    });
    spyStorage.getItem.mockReturnValue(of(null));
  });

  afterEach(() => {
    spyTranslate.use.mockReset();
    spyStorage.getItem.mockReset();
  });

  it('should be created', () => {
    service = TestBed.inject(TranslatorService);
    expect(service).toBeTruthy();
  });

  it('should use the language in the settings if it exists', () => {
    const spyNavigator = jest.spyOn(window.navigator, 'language', 'get');
    spyNavigator.mockReturnValue('pt-BR');
    spyStorage.getItem.mockReturnValue(of({ language: 'en' }));

    service = TestBed.inject(TranslatorService);

    expect(service.getLang()).toEqual('en');
  });

  it('when the navigator language is not preset, then set en as default', () => {
    const spyNavigator = jest.spyOn(window.navigator, 'language', 'get');
    spyNavigator.mockReturnValue(undefined);

    service = TestBed.inject(TranslatorService);

    expect(service.getLang()).toEqual('en');
  });

  it('when the navigator language is en-US, then use en', () => {
    const spyNavigator = jest.spyOn(window.navigator, 'language', 'get');
    spyNavigator.mockReturnValue('en-US');

    service = TestBed.inject(TranslatorService);

    expect(service.getLang()).toEqual('en');
  });

  it('when the navigator language is pt-BR, then use pt', () => {
    const spyNavigator = jest.spyOn(window.navigator, 'language', 'get');
    spyNavigator.mockReturnValue('pt-BR');

    service = TestBed.inject(TranslatorService);

    expect(service.getLang()).toEqual('pt');
  });

  it('should be possible to change the language in use', () => {
    const spyNavigator = jest.spyOn(window.navigator, 'language', 'get');
    spyNavigator.mockReturnValue('pt-BR');

    service = TestBed.inject(TranslatorService);

    expect(service.getLang()).toEqual('pt');
    expect(spyTranslate.use).toHaveBeenCalledWith('pt');

    service.setLang('en');

    expect(service.getLang()).toEqual('en');
    expect(spyTranslate.use).toHaveBeenCalledWith('en');
  });
});
