import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
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
  };
  const spyRouter = {
    initialNavigation: jest.fn(),
    navigate: jest.fn(),
  };
  const spyAlert = {
    create: jest.fn(),
    dismiss: jest.fn(),
    getTop: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SecretDetailPage, SecretListPage],
        imports: [
          IonicModule,
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          RouterTestingModule.withRoutes([
            { path: 'tabs/secrets', component: SecretListPage },
          ]),
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: ActivatedRoute, useValue: routeStub },
          { provide: SecretRepository, useValue: spyRepository },
          // { provide: Router, useValue: spyRouter },
          FormBuilder,
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      router.initialNavigation();

      alertController = TestBed.inject(AlertController);

      spyRepository.save.mockReset();

      fixture = TestBed.createComponent(SecretDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when adding a secret', () => {
    it('of type login, then should create a form of type login', () => {
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'login' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('login')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('of type card, then should create a form of type card', () => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'card' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('cardnumber')).toBeTruthy();
      expect(component.form.get('cardowner')).toBeTruthy();
      expect(component.form.get('cardexpires')).toBeTruthy();
      expect(component.form.get('cvv')).toBeTruthy();
      expect(component.form.get('cardpin')).toBeTruthy();
    });

    it('of type identity, then should create a form of type identity', () => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'identity' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('number')).toBeTruthy();
      expect(component.form.get('name')).toBeTruthy();
      expect(component.form.get('birthday')).toBeTruthy();
      expect(component.form.get('issued')).toBeTruthy();
      expect(component.form.get('expires')).toBeTruthy();
    });

    it('of type bank, then should create a form of type bank', () => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'bank' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('bank')).toBeTruthy();
      expect(component.form.get('holder')).toBeTruthy();
      expect(component.form.get('type')).toBeTruthy();
      expect(component.form.get('iban')).toBeTruthy();
      expect(component.form.get('login')).toBeTruthy();
      expect(component.form.get('internetbankpassword')).toBeTruthy();
      expect(component.form.get('banksite')).toBeTruthy();
    });

    it('of type pin, then should create a form of type pin', () => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'pin' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('pin')).toBeTruthy();
    });

    it('when add a new secret should reset the form and redirect to the secrets list', fakeAsync(() => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'login' });
      const secret = new Secret('', 'login', 'test', {
        title: 'test',
        login: 'nicanor',
        password: '1234',
      });
      component.form.setValue(secret.content);
      component.save();
      tick();

      expect(spyRepository.save).toHaveBeenCalledWith(expect.any(Secret));
      expect(component.form.pristine).toBe(true);
      expect(router.url).toBe('/tabs/secrets');
    }));
  });

  it('should not save an empty form', fakeAsync(() => {
    component.form = new FormGroup({});
    spyRepository.getById.mockReturnValue(of(undefined));
    routeStub.setParamMap({ id: 'login' });
    const secret = new Secret('', 'login', 'test', {
      title: null,
      login: '',
      password: null,
    });
    component.form.setValue(secret.content);
    component.save();
    tick();

    expect(spyRepository.save).not.toHaveBeenCalled();
    expect(component.form.pristine).toBe(true);
    expect(router.url).toBe('/tabs/secrets');
  }));

  it('should save an empty form if it has at least one field with value', fakeAsync(() => {
    component.form = new FormGroup({});
    spyRepository.getById.mockReturnValue(of(undefined));
    routeStub.setParamMap({ id: 'login' });
    const secret = new Secret('', 'login', 'test', {
      title: null,
      login: 'a',
      password: null,
    });
    component.form.setValue(secret.content);
    component.save();
    tick();

    expect(spyRepository.save).toHaveBeenCalledWith(expect.any(Secret));
    expect(component.form.pristine).toBe(true);
    expect(router.url).toBe('/tabs/secrets');
  }));

  it('should toggle the password field type when clicking the view button for type login', () => {
    component.form = new FormGroup({});
    spyRepository.getById.mockReturnValue(of(undefined));
    routeStub.setParamMap({ id: 'login' });
    const secret = new Secret('', 'login', 'test', {
      title: 'test',
      login: 'nicanor',
      password: '1234',
    });
    component.form.setValue(secret.content);

    const field = component.fields.find((f) => f.name === 'password');
    component.showSecret(field);
    expect(field.options.type).toEqual('text');
    component.showSecret(field);
    expect(field.options.type).toEqual('password');
  });

  it('should toggle the password fields type when clicking the view button for type card', () => {
    component.form = new FormGroup({});
    spyRepository.getById.mockReturnValue(of(undefined));
    routeStub.setParamMap({ id: 'card' });
    const secret = new Secret('', 'card', 'test', {
      title: 'test',
      cardnumber: '1234',
      cardowner: 'eu',
      cardexpires: '132',
      cvv: '1234',
      cardpin: '1234',
    });
    component.form.setValue(secret.content);

    const cvvField = component.fields.find((f) => f.name === 'cvv');
    const pinField = component.fields.find((f) => f.name === 'cardpin');
    component.showSecret(cvvField);
    expect(cvvField.options.type).toEqual('text');
    component.showSecret(pinField);
    expect(pinField.options.type).toEqual('text');

    component.showSecret(cvvField);
    expect(cvvField.options.type).toEqual('password');
    component.showSecret(pinField);
    expect(pinField.options.type).toEqual('password');
  });

  describe('when editing', () => {
    beforeEach(() => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'login', 'test', {
        title: 'test',
        login: 'nicanor',
        password: '1234',
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });
      fixture.detectChanges();
    });

    it('should make field editable', () => {
      expect(component.isReadonly).toBe(true);

      const btnEdit = fixture.debugElement.query(By.css('#edit-btn'));
      btnEdit.triggerEventHandler('click', null);

      expect(component.isReadonly).toBe(false);
    });

    it('should show the secrets title as the pages title', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'login', 'test', {
        title: 'test',
        login: 'nicanor',
        password: '1234',
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });

      expect(component.secret).toBe(secret);
      expect(component.title).toEqual(secret.name);
    });
  });

  describe('should load the form with the selected secret', () => {
    it('when the secret is of type login', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'login', 'test', {
        title: 'test',
        login: 'nicanor',
        password: '1234',
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });

      expect(component.secret).toBe(secret);
    });

    it('when the secret is of type card', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'card', 'test', {
        title: 'test',
        cardnumber: '1234',
        cardowner: 'eu',
        cardexpires: '132',
        cvv: '1234',
        cardpin: '1234',
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });

      expect(component.secret).toBe(secret);
      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('cardnumber')).toBeTruthy();
      expect(component.form.get('cardowner')).toBeTruthy();
      expect(component.form.get('cardexpires')).toBeTruthy();
      expect(component.form.get('cvv')).toBeTruthy();
      expect(component.form.get('cardpin')).toBeTruthy();
    });
  });

  it('should execute the secret removing only after a confirmation', fakeAsync(() => {
    component.form = new FormGroup({});
    const secret = new Secret('abc', 'login', 'test', {
      title: 'test',
      login: 'nicanor',
      password: '1234',
    });
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({ id: 'abc' });

    let confirmBtnHandler: Function;
    spyOn(alertController, 'create').and.callFake((obj) => {
      confirmBtnHandler = obj.buttons[1].handler;
      return new Promise((resolve, reject) => {
        obj;
      });
    });
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#remove-btn'));
    btnRemove.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(confirmBtnHandler).toBeTruthy();

    confirmBtnHandler();
    tick();

    expect(spyRepository.remove).toHaveBeenCalledWith(secret);
    expect(router.url).toBe('/tabs/secrets');
  }));

  it('should not execute the secret removing if the confirmation was conceled', fakeAsync(() => {
    const secret = new Secret('abc', 'login', 'test', {
      title: 'test',
      login: 'nicanor',
      password: '1234',
    });
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({ id: 'abc' });

    let cancelBtnHandler: Function;
    spyOn(alertController, 'create').and.callFake((obj) => {
      cancelBtnHandler = obj.buttons[0].handler;
      return new Promise((resolve, reject) => {
        obj;
      });
    });
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#remove-btn'));
    btnRemove.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(cancelBtnHandler).toBeUndefined();
  }));
});
