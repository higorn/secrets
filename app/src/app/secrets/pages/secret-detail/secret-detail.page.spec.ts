import { CommonModule } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync
} from '@angular/core/testing';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertController, IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { of } from 'rxjs';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { ActivatedRouteStub } from 'src/app/testing/activated-route-stub';
import { Secret } from '../../shared/secret';
import { SecretRepository } from '../../shared/secret.repository';
import { SecretListPage } from '../secret-list/secret-list.page';
import { SecretDetailPage } from './secret-detail.page';

describe('SecretDetailPage', () => {
  let component: SecretDetailPage;
  let fixture: ComponentFixture<SecretDetailPage>;
  let router: Router;
  let alertController: AlertController;
  let clipboard: ClipboardService;
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
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SecretDetailPage, SecretListPage],
        imports: [
          IonicModule.forRoot(),
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
          { provide: StorageService, useValue: spyStorage },
          // { provide: Router, useValue: spyRouter },
          FormBuilder,
        ],
      }).compileComponents();

      router = TestBed.inject(Router);
      router.initialNavigation();

      alertController = TestBed.inject(AlertController);
      clipboard = TestBed.inject(ClipboardService);

      spyRepository.save.mockReturnValue(of());
      spyRepository.remove.mockReturnValue(of());
      spyStorage.getItem.mockReturnValue(of({ language: 'en' }));
      routeStub.setParamMap({ id: 'password' });
      spyRepository.getById.mockReturnValue(of(undefined));

      fixture = TestBed.createComponent(SecretDetailPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  afterEach(() => {
      spyRepository.save.mockReset();
      spyRepository.remove.mockReset();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when adding a secret', () => {
    it('of type password, then should create a form of type password', () => {
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'password' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('username')).toBeTruthy();
      expect(component.form.get('password')).toBeTruthy();
    });

    it('of type card, then should create a form of type card', () => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'card' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('cctype')).toBeTruthy();
      expect(component.form.get('ccbrand')).toBeTruthy();
      expect(component.form.get('ccnumber')).toBeTruthy();
      expect(component.form.get('ccname')).toBeTruthy();
      expect(component.form.get('ccexp')).toBeTruthy();
      expect(component.form.get('cccsc')).toBeTruthy();
      expect(component.form.get('ccpin')).toBeTruthy();
    });

    it('of type identity, then should create a form of type identity', () => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'identity' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('number')).toBeTruthy();
      expect(component.form.get('fullname')).toBeTruthy();
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
      routeStub.setParamMap({ id: 'note' });

      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('note')).toBeTruthy();
    });

    it('when add a new secret should reset the form and redirect to the secrets list', fakeAsync(() => {
      component.form = new FormGroup({});
      spyRepository.getById.mockReturnValue(of(undefined));
      routeStub.setParamMap({ id: 'password' });
      const secret = new Secret('', 'password', 'test', {
        title: 'test',
        username: 'nicanor',
        password: '1234',
        site: null
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
    routeStub.setParamMap({ id: 'password' });
    const secret = new Secret('', 'password', 'test', {
      title: null,
      username: '',
      password: null,
      site: null
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
    routeStub.setParamMap({ id: 'password' });
    const secret = new Secret('', 'password', 'test', {
      title: null,
      username: 'a',
      password: null,
      site: null
    });
    component.form.setValue(secret.content);
    component.save();
    tick();

    expect(spyRepository.save).toHaveBeenCalledWith(expect.any(Secret));
    expect(component.form.pristine).toBe(true);
    expect(router.url).toBe('/tabs/secrets');
  }));

  it('should toggle the password field type when clicking the view button for type password', () => {
    component.form = new FormGroup({});
    spyRepository.getById.mockReturnValue(of(undefined));
    routeStub.setParamMap({ id: 'password' });
    const secret = new Secret('', 'password', 'test', {
      title: 'test',
      username: 'nicanor',
      password: '1234',
      site: 'abc'
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
      cctype: 'credit',
      ccbrand: 'visa',
      ccnumber: '1234',
      ccname: 'eu',
      ccexp: '132',
      cccsc: '1234',
      ccpin: '1234',
      country: 'BR'
    });
    component.form.setValue(secret.content);

    const cvvField = component.fields.find((f) => f.name === 'cccsc');
    const pinField = component.fields.find((f) => f.name === 'ccpin');
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
      const secret = new Secret('abc', 'password', 'test', {
        title: 'test',
        username: 'nicanor',
        password: '1234',
        site: 'abc'
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });
      fixture.detectChanges();
    });

    it('should show the secrets title as the pages title', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'password', 'test', {
        title: 'test',
        username: 'nicanor',
        password: '1234',
        site: 'abc'
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });

      expect(component.secret).toBe(secret);
      expect(component.title).toEqual(secret.name);
    });
  });

  describe('should load the form with the selected secret', () => {
    it('when the secret is of type password', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'password', 'test', {
        title: 'test',
        username: 'nicanor',
        password: '1234',
        site: 'abc'
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });

      expect(component.secret).toBe(secret);
    });

    it('when the secret is of type card', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'card', 'test', {
        title: 'test',
        cctype: 'credit',
        ccbrand: 'visa',
        ccnumber: '1234',
        ccname: 'eu',
        ccexp: '132',
        cccsc: '1234',
        ccpin: '1234',
        country: 'BR'
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });

      expect(component.secret).toBe(secret);
      expect(component.form.get('title')).toBeTruthy();
      expect(component.form.get('cctype')).toBeTruthy();
      expect(component.form.get('ccbrand')).toBeTruthy();
      expect(component.form.get('ccnumber')).toBeTruthy();
      expect(component.form.get('ccname')).toBeTruthy();
      expect(component.form.get('ccexp')).toBeTruthy();
      expect(component.form.get('cccsc')).toBeTruthy();
      expect(component.form.get('ccpin')).toBeTruthy();
    });
  });

  describe('when coping a secret', () => {
    it('of type password, then should copy the values to the clipboard', () => {
      component.form = new FormGroup({});
      const secret = new Secret('abc', 'password', 'test', {
        title: 'test',
        username: 'nicanor',
        password: '1234',
        site: 'abc'
      });
      spyRepository.getById.mockReturnValue(of(secret));
      routeStub.setParamMap({ id: 'abc' });
      const expectedCopyContent = "nicanor\t1234";
      let copyContent = '';
      spyOn(clipboard, 'copyFromContent').and.callFake((content: string) => {
        copyContent = content;
      })

      component.copyAll();

      expect(component.secret).toBe(secret);
      expect(copyContent).toEqual(expectedCopyContent);
    })
  })

  it('should execute the secret removing only after a confirmation', fakeAsync(() => {
    component.form = new FormGroup({});
    const secret = new Secret('abc', 'password', 'test', {
      title: 'test',
      username: 'nicanor',
      password: '1234',
      site: 'abc'
    });
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({ id: 'abc' });

    let confirmBtnHandler: Function;
    spyOn(alertController, 'create').and.callFake((obj) => {
      confirmBtnHandler = obj.buttons[1].handler;
      return Promise.resolve({
        present: jest.fn().mockResolvedValue(undefined),
      } as never);
    });
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#remove-btn'));
    btnRemove.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(confirmBtnHandler).toBeTruthy();

    confirmBtnHandler();
    tick();

    expect(spyRepository.save).toHaveBeenCalledWith(secret);
    expect(router.url).toBe('/tabs/secrets');
  }));

  it('should not execute the secret removing if the confirmation was conceled', fakeAsync(() => {
    const secret = new Secret('abc', 'password', 'test', {
      title: 'test',
      username: 'nicanor',
      password: '1234',
      site: 'abc'
    });
    spyRepository.getById.mockReturnValue(of(secret));
    routeStub.setParamMap({ id: 'abc' });

    let cancelBtnHandler: Function;
    spyOn(alertController, 'create').and.callFake((obj) => {
      cancelBtnHandler = obj.buttons[0].handler;
      return Promise.resolve({
        present: jest.fn().mockResolvedValue(undefined),
      } as never);
    });
    fixture.detectChanges();
    const btnRemove = fixture.debugElement.query(By.css('#remove-btn'));
    btnRemove.triggerEventHandler('click', null);
    tick();

    expect(alertController.create).toHaveBeenCalled();
    expect(cancelBtnHandler).toBeUndefined();
  }));
});
