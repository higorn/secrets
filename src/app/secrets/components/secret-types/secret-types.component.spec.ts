import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SecretsPageModule } from '../../secrets.module';

import { SecretTypesComponent } from './secret-types.component';

describe('SecretTypesComponent', () => {
  let component: SecretTypesComponent;
  let fixture: ComponentFixture<SecretTypesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SecretsPageModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SecretTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
