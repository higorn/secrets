import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { Secret } from '../../shared/secret';
import { SecretsPageModule } from './../../secrets.module';
import { SecretDetailPage } from './secret-detail.page';


describe('SecretDetailPage', () => {
  let component: SecretDetailPage;
  let fixture: ComponentFixture<SecretDetailPage>;
  const routeStub = new ActivatedRouteStub();
  let spyStorageService;

  beforeEach(waitForAsync(() => {
    spyStorageService = {
      save: jest.fn(),
      get: jest.fn()
    }
    TestBed.configureTestingModule({
      imports: [SecretsPageModule],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
/*         { provide: ActivatedRoute, useValue: {
          paramMap: of({ get: (key) => 'new'})
        }}, */
        { provide: SecretStorageService, useValue: spyStorageService },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SecretDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routeStub.setParamMap({id: 'new'});
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when add a new secret should reset the form', () => {
    const secret = new Secret('', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    component.form.setValue(secret.content);
    component.save();

    expect(spyStorageService.save).toHaveBeenCalledWith(expect.any(Secret));
    expect(component.form.invalid).toBe(true)
  })

  it('should toggle the password field type when clicking the view button', () => {
    component.showSecret()
    expect(component.pwType).toEqual('text')
    component.showSecret()
    expect(component.pwType).toEqual('password')
  })

  it('when editing should load the form with the selected secret', () => {
    routeStub.setParamMap({id: 'abc'});
    expect(spyStorageService.get).toHaveBeenCalledWith('abc');
  })
});
