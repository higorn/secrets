import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StorageService } from '../shared/storage.service';

import { TabsPage } from './tabs.page';

describe('TabsPage', () => {
  let component: TabsPage;
  let fixture: ComponentFixture<TabsPage>;
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TranslateModule.forRoot()],
        declarations: [TabsPage],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
        providers: [
          { provide: Router, useValue: spyRouter },
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();
      spyStorage.getItem.mockReturnValue(of({ language: 'en' }));
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
