import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TabsPageModule } from './../../tabs.module';
import { SecretAddComponent } from './secret-add.component';

describe('SecretAddComponent', () => {
  let component: SecretAddComponent;
  let fixture: ComponentFixture<SecretAddComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [TabsPageModule, TranslateModule.forRoot()],
      }).compileComponents();

      fixture = TestBed.createComponent(SecretAddComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
