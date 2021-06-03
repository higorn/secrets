import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TabsPageModule } from '../../tabs.module';
import { MasterBtnComponent } from './master-btn.component';


describe('MasterBtnComponent', () => {
  let component: MasterBtnComponent;
  let fixture: ComponentFixture<MasterBtnComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TabsPageModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MasterBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
