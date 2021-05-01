import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { StorageService } from '../shared/storage.service';
import { VaultService } from '../shared/vault.service';
import { StartPageRoutingModule } from './start-routing.module';
import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spyVaultService = {
    unseal: jest.fn(),
  };
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StartPage],
        imports: [
          CommonModule,
          FormsModule,
          IonicModule,
          StartPageRoutingModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: Router, useValue: spyRouter },
          { provide: VaultService, useValue: spyVaultService },
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();

      spyStorage.getItem.mockReturnValue(of({ language: 'en' }));
      fixture = TestBed.createComponent(StartPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
