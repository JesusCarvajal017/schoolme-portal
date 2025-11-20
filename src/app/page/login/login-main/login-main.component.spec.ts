import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { LoginMainComponent } from './login-main.component';
import { AuthMainService } from '../../../service/auth/auth-main.service';
import { UserService } from '../../../service/user.service';

describe('LoginMainComponent', () => {
  let component: LoginMainComponent;
  let fixture: ComponentFixture<LoginMainComponent>;
  let mockAuthService: jasmine.SpyObj<AuthMainService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthMainService', ['login', 'enviarCodigo', 'validateCodigo']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['changePassword']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [LoginMainComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthMainService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginMainComponent);
    component = fixture.componentInstance;
    mockAuthService = TestBed.inject(AuthMainService) as jasmine.SpyObj<AuthMainService>;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forms', () => {
    expect(component.form).toBeDefined();
    expect(component.formRecuperar).toBeDefined();
    expect(component.formCodigo).toBeDefined();
    expect(component.formNuevaPassword).toBeDefined();
  });

  it('should validate password requirements', () => {
    const control1 = { value: 'Abc123' } as AbstractControl;
    const control2 = { value: 'abc123' } as AbstractControl;
    expect(component.validarPasswordSegura(control1)).toBeNull(); // Should pass
    expect(component.validarPasswordSegura(control2)).toEqual({ passwordDebil: true }); // No uppercase
  });

  it('should call login on loguear with valid form', () => {
    mockAuthService.login.and.returnValue(of({ token: 'test-token', expiracion: new Date('2025-01-01') }));
    mockRouter.navigate.and.returnValue(Promise.resolve(true));

    component.form.setValue({ email: 'test@example.com', password: 'password' });
    component.loguear();

    expect(mockAuthService.login).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
