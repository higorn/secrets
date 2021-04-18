import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { Secret } from 'src/app/add-secret/shared/secret';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';
import { SecretsPageModule } from './../../secrets.module';
import { SecretDetailPage } from './secret-detail.page';


describe('SecretDetailPage', () => {
  let component: SecretDetailPage;
  let fixture: ComponentFixture<SecretDetailPage>;
  const spyStorageService = {
    create: jest.fn()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SecretsPageModule],
      providers: [
        { provide: SecretStorageService, useValue: spyStorageService },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SecretDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when add a new secret should reset the form', () => {
    const secret = new Secret('LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    component.form.setValue(secret.content);
    component.addSecret();

    expect(spyStorageService.create).toHaveBeenCalledWith(secret);
    expect(component.form.invalid).toBe(true)
  })

  it('should toggle the password field type when clicking the view button', () => {
    component.showSecret()
    expect(component.pwType).toEqual('text')
    component.showSecret()
    expect(component.pwType).toEqual('password')
  })
});
