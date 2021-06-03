import { TestBed } from '@angular/core/testing';

import { MasterBtnService } from './master-btn.service';

describe('MasterBtnService', () => {
  let service: MasterBtnService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterBtnService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
