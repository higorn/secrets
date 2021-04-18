import { AddSecretPageModule } from './../../add-secret.module';
import { FormBuilder } from '@angular/forms';
import { SecretStorageService } from './../../../shared/secret-storage.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../../../explore-container/explore-container.module';

import { AddSecretPage } from './add-secret.page';
import { Secret } from '../../shared/secret'

describe('AddSecretPage', () => {
  let component: AddSecretPage;
  let fixture: ComponentFixture<AddSecretPage>;
  const spyStorageService = {
    create: jest.fn()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AddSecretPageModule],
      providers: [
        { provide: SecretStorageService, useValue: spyStorageService },
        FormBuilder
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddSecretPage);
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
