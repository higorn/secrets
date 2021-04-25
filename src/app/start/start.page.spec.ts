import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { StartPage } from './start.page';

describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;
  const spyRouter = {
    navigate: jest.fn()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StartPage ],
      imports: [IonicModule.forRoot()],
      providers: [
        { provide: Router, useValue: spyRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StartPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
