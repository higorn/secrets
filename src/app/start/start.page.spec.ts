import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { VaultService } from '../shared/vault.service';
import { StartPageModule } from './start.module';
import { StartPage } from './start.page';


describe('StartPage', () => {
  let component: StartPage;
  let fixture: ComponentFixture<StartPage>;
  const spyRouter = {
    navigate: jest.fn()
  }
  const spyVaultService = {
    unseal: jest.fn(),
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [StartPageModule],
      providers: [
        { provide: Router, useValue: spyRouter },
        { provide: VaultService, useValue: spyVaultService }
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
