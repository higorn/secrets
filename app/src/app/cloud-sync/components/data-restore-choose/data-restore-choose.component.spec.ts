import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { DataRestoreChooseComponent } from './data-restore-choose.component';

describe('DataRestoreChooseComponent', () => {
  let component: DataRestoreChooseComponent;
  let fixture: ComponentFixture<DataRestoreChooseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataRestoreChooseComponent ],
      imports: [
        IonicModule.forRoot(),
        FormsModule,
        TranslateModule.forRoot(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DataRestoreChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
