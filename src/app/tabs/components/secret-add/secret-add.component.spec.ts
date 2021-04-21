import { TabsPageModule } from './../../tabs.module';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SecretAddComponent } from './secret-add.component';

describe('SecretAddComponent', () => {
  let component: SecretAddComponent;
  let fixture: ComponentFixture<SecretAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TabsPageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SecretAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
