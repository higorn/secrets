import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';

import { SelectItemsComponent } from './select-items.component';

describe('SelectItemsComponent', () => {
  let component: SelectItemsComponent;
  let fixture: ComponentFixture<SelectItemsComponent>;
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectItemsComponent ],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: StorageService, useValue: spyStorage },
      ],
    }).compileComponents();

    spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
    fixture = TestBed.createComponent(SelectItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
