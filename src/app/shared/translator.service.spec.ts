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
      providers: [TranslateService],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(TranslatorService);
    expect(service).toBeTruthy();
  });

  it('when the navigator language is not preset, then set en as default', () => {
    const spyWindow = jest.spyOn(window.navigator, 'language', 'get');
    spyWindow.mockReturnValue(undefined);

    service = TestBed.inject(TranslatorService);

    expect(service.language).toEqual('en');
  });

  it('when the navigator language is en-US, then use en', () => {
    const spyWindow = jest.spyOn(window.navigator, 'language', 'get');
    spyWindow.mockReturnValue('en-US');

    service = TestBed.inject(TranslatorService);

    expect(service.language).toEqual('en');
  });

  it('when the navigator language is pt-BR, then use pt', () => {
    const spyWindow = jest.spyOn(window.navigator, 'language', 'get');
    spyWindow.mockReturnValue('pt-BR');

    service = TestBed.inject(TranslatorService);

    expect(service.language).toEqual('pt');
  });
});
