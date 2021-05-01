import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { TestBed } from '@angular/core/testing';

import { TranslatorService } from './translator.service';

describe('TranslatorService', () => {
  let service: TranslatorService;
  const spyTranslate = {
    setDefaultLang: jest.fn(),
    use: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
        // TranslateService,
        { provide: TranslateService, useValue: spyTranslate },
      ],
    });
  });

  afterEach(() => {
    spyTranslate.use.mockReset();
  });

  it('should be created', () => {
    service = TestBed.inject(TranslatorService);
    expect(service).toBeTruthy();
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
