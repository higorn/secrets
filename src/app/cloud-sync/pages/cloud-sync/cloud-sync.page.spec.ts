import { CloudSyncService } from 'src/app/shared/cloud-sync.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

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

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CloudSyncPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: Router, useValue: spyRouter },
          { provide: CloudSyncService, useValue: spyCloud },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(CloudSyncPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
