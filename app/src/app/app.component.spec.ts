import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { of } from 'rxjs';

import { AppComponent } from './app.component';
import { VaultService } from './shared/vault/vault.service';

describe('AppComponent', () => {
  const spyPlt = {
    pause: of(),
  };
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spyVaultService = {
    unseal: jest.fn(),
  };

  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: Router, useValue: spyRouter },
        { provide: VaultService, useValue: spyVaultService },
        { provide: Platform, useValue: spyPlt },
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
  // TODO: add more tests!

});
