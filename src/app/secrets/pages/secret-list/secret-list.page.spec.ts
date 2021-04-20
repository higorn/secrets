import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SecretStorageService } from 'src/app/shared/secret-storage.service';
import { SecretsPageModule } from '../../secrets.module';
import { SecretListPage } from './secret-list.page';


describe('SecretListPage', () => {
  let component: SecretListPage;
  let fixture: ComponentFixture<SecretListPage>;
  const spyStorageService = {
    getAll: jest.fn()
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SecretsPageModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SecretStorageService, useValue: spyStorageService },
      ]
    }).compileComponents();
    const secrets = [
      {
        type: 'LOGIN', name: 'test', content: {
          name: 'test',
          user: 'nicanor',
          password: '1234'
        }
      }
    ]
    spyStorageService.getAll.mockReturnValue(secrets);

    fixture = TestBed.createComponent(SecretListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list secrets', () => {

    expect(spyStorageService.getAll).toHaveBeenCalled();
    expect(component.secrets.length).toBeGreaterThan(0);
  })
});
