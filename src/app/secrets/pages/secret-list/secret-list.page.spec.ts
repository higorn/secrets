import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SecretsPageModule } from '../../secrets.module';
import { SecretRepository } from '../../shared/secret.repository';
import { SecretListPage } from './secret-list.page';

const secrets = [
  {
    type: 'LOGIN', name: 'test', content: {
      name: 'test',
      user: 'nicanor',
      password: '1234'
    }
  }
]

describe('SecretListPage', () => {
  let component: SecretListPage;
  let fixture: ComponentFixture<SecretListPage>;
  const spyStorageService = {
    getAll: jest.fn(),
    dataChanged$: of(secrets)
  }

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SecretsPageModule, RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SecretRepository, useValue: spyStorageService },
      ]
    }).compileComponents();
    spyStorageService.getAll.mockReturnValue(of(secrets));

    fixture = TestBed.createComponent(SecretListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should list secrets', () => {
    let len: number;

    component.ionViewDidEnter();
    component.secrets.subscribe(items => {
      len = items.length;
    })

    expect(spyStorageService.getAll).toHaveBeenCalled();
    expect(len).toBeGreaterThan(0);
  })
});
