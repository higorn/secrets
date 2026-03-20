import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { DEFAULT_SETTINGS } from 'src/app/shared/settings';
import { StorageService } from 'src/app/shared/storage/storage.service';
import { WellcomePage } from './wellcome.page';


describe('WellcomePage', () => {
  let component: WellcomePage;
  let fixture: ComponentFixture<WellcomePage>;
  const spyStorage = {
    getItem: jest.fn(),
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [WellcomePage],
        imports: [
          IonicModule.forRoot(),
          TranslateModule.forRoot(),
          RouterTestingModule.withRoutes([]),
        ],
        providers: [
          { provide: StorageService, useValue: spyStorage },
        ],
      }).compileComponents();

      spyStorage.getItem.mockReturnValue(of(DEFAULT_SETTINGS));
      fixture = TestBed.createComponent(WellcomePage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});