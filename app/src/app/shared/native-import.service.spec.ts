import { WebIntent } from '@ionic-native/web-intent/ngx';
import { TestBed } from '@angular/core/testing';

import { NativeImportService } from './native-import.service';

describe('NativeImportService', () => {
  let service: NativeImportService;
  const spyWebIntent = {
    getIntent: jest.fn()
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WebIntent, useValue: spyWebIntent }
      ]
    });
    service = TestBed.inject(NativeImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert from csv to obj', () => {
    const csv = 'name,url,username,password\n'
      + ',android://d83QBGRN5FhBqrie9nkVRQKFh_dZMVLeZcFA1YCOzX8r-4cr6BOfWRGV8XWnLIiUXQ7BuoC8P5hm1_XMRec8AQ==@com.airbnb.android/,higorn@gmail.com,\n'
      + 'www2.bancobrasil.com.br,https://www2.bancobrasil.com.br/aapf/login.jsp,10527-99,55211900\n'
      + ',android://kruaZwYGsiu76TbANLX52LLaQiATTg7QsVJEW6cz1vgYnZX_EOz197ZA6gI2AyAJ50pyP5QXnYDIY-Ct9TvhJw==@com.booking/,higorn@gmail.com,';

    const out = service.csvToObj(csv);

    expect(out[0].url).toBeTruthy();
    expect(out[0].username).toBeTruthy();
    expect(out[1].name).toBeTruthy();
    expect(out[1].url).toBeTruthy();
    expect(out[1].username).toBeTruthy();
    expect(out[1].password).toBeTruthy();
  })
});
