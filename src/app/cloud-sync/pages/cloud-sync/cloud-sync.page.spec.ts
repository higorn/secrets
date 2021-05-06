import { ComponentFixture, TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { StorageService } from 'src/app/shared/storage.service';
import { SettingsService } from './../../../shared/settings.service';
import { CloudSyncPage } from './cloud-sync.page';


describe('CloudSyncPage', () => {
  let component: CloudSyncPage;
  let fixture: ComponentFixture<CloudSyncPage>;
  const spyRouter = {
    navigate: jest.fn(),
  };
  const spyCloud = {
    signIn: jest.fn(),
    sync: jest.fn(),
  };
  const spySettings = {
    getCloudSync: jest.fn()
  }
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CloudSyncPage],
        imports: [
          IonicModule,
          FormsModule,
          TranslateModule.forRoot(),
        ],
        providers: [
          { provide: Router, useValue: spyRouter },
          { provide: CloudSyncService, useValue: spyCloud },
          { provide: StorageService, useValue: spyStorage },
          { provide: SettingsService, useValue: spySettings }
        ],
      }).compileComponents();

      spySettings.getCloudSync.mockReturnValue(of('none'))
      fixture = TestBed.createComponent(CloudSyncPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the provider from the settings when it is set', () => {
    expect(component.provider).toEqual('none')
  })
});
