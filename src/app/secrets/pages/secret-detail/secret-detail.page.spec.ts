import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';
import { SecretListPage } from '../secret-list/secret-list.page';
import { SecretsPageModule } from './../../secrets.module';
import { SecretDetailPage } from './secret-detail.page';


describe('SecretDetailPage', () => {
  let component: SecretDetailPage;
  let fixture: ComponentFixture<SecretDetailPage>;
  let router: Router;
  let alertController: AlertController;
  const routeStub = new ActivatedRouteStub();
  const spyRepository = {
    getAll: jest.fn(),
    getById: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  }
  const spyRouter = {
    initialNavigation: jest.fn(),
    navigate: jest.fn()
  }
  const spyAlert = {
    create: jest.fn(),
    dismiss: jest.fn(),
    getTop: jest.fn()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        SecretsPageModule,
        RouterTestingModule.withRoutes([
          { path: 'tabs/secrets', component: SecretListPage },
        ])
      ],
      providers: [
        { provide: ActivatedRoute, useValue: routeStub },
        { provide: SecretRepository, useValue: spyRepository },
        // { provide: AlertController, useClass: spyAlert },
        // { provide: Router, useValue: spyRouter },
        FormBuilder
      ]
    }).compileComponents();

    router = TestBed.inject(Router);
    router.initialNavigation();

    alertController = TestBed.inject(AlertController);

    fixture = TestBed.createComponent(SecretDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('when add a new secret should reset the form and redirect to the secrets list', fakeAsync(() => {
    spyRepository.getById.mockReturnValue(of(undefined));
    routeStub.setParamMap({id: 'new'});
    const secret = new Secret('', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    component.form.setValue(secret.content);
    component.save();
    tick();

    expect(spyRepository.save).toHaveBeenCalledWith(expect.any(Secret));
    expect(component.form.invalid).toBe(true)
    expect(router.url).toBe('/tabs/secrets')
  }))

  it('should toggle the password field type when clicking the view button', () => {
    component.showSecret()
    expect(component.pwType).toEqual('text')
    component.showSecret()
    expect(component.pwType).toEqual('password')
  })

  it('when editing should load the form with the selected secret', () => {
    const secret = new Secret('abc', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({id: 'abc'});

    expect(component.secret).toBe(secret);
  })

  it('should execute the secret removing only after a confirmation', fakeAsync(() => {
    const secret = new Secret('abc', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({id: 'abc'});

    let confirmBtnHandler: Function;
    spyOn(alertController, 'create').and.callFake((obj) => {
      confirmBtnHandler = obj.buttons[1].handler;
      return new Promise((resolve, reject) => {obj});
    })
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#remove-btn'));
    btnRemove.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(confirmBtnHandler).toBeTruthy();

    confirmBtnHandler();
    tick();

    expect(spyRepository.remove).toHaveBeenCalledWith(secret);
    expect(router.url).toBe('/tabs/secrets')
  }))

  it('should not execute the secret removing if the confirmation was conceled', fakeAsync(() => {
    const secret = new Secret('abc', 'LOGIN', 'test', { name: 'test', user: 'nicanor', password: '1234' })
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({id: 'abc'});

    let cancelBtnHandler: Function;
    spyOn(alertController, 'create').and.callFake((obj) => {
      cancelBtnHandler = obj.buttons[0].handler;
      return new Promise((resolve, reject) => {obj});
    })
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#remove-btn'));
    btnRemove.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(cancelBtnHandler).toBeUndefined();
  }))
});
