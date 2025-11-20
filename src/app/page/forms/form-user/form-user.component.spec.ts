import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';

import { FormUserComponent } from './form-user.component';
import { UserService } from '../../../service/user.service';
import { PersonService } from '../../../service/person.service';
import { AlertApp } from '../../../utilities/alert-taiga';
import { PersonOrigin } from '../../../models/security/person.model';

describe('FormUserComponent', () => {
  let component: FormUserComponent;
  let fixture: ComponentFixture<FormUserComponent>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockPersonService: jasmine.SpyObj<PersonService>;
  let mockAlertService: jasmine.SpyObj<AlertApp>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['createUserComplete', 'updateUserComplete']);
    const personServiceSpy = jasmine.createSpyObj('PersonService', ['obtenerTodos']);
    const alertServiceSpy = jasmine.createSpyObj('AlertApp', ['showDepositAlert']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormUserComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: PersonService, useValue: personServiceSpy },
        { provide: AlertApp, useValue: alertServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormUserComponent);
    component = fixture.componentInstance;
    mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    mockPersonService = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
    mockAlertService = TestBed.inject(AlertApp) as jasmine.SpyObj<AlertApp>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should create', () => {
    const mockPersons: PersonOrigin[] = [{
      id: 1,
      documentTypeId: 1,
      identification: '123',
      fisrtName: 'John',
      fullName: 'John Doe',
      secondName: 'A',
      lastName: 'Doe',
      secondLastName: 'B',
      phone: '123456',
      gender: 1,
      acronymDocument: 'CC',
      status: 1
    }];
    mockPersonService.obtenerTodos.and.returnValue(of(mockPersons));

    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('actionDescriptio', 'Test Action');

    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.form).toBeDefined();
    expect(component.form.controls.email).toBeDefined();
    expect(component.form.controls.password).toBeDefined();
  });

  it('should load persons on init', () => {
    const mockPersons: PersonOrigin[] = [{
      id: 1,
      documentTypeId: 1,
      identification: '123',
      fisrtName: 'John',
      fullName: 'John Doe',
      secondName: 'A',
      lastName: 'Doe',
      secondLastName: 'B',
      phone: '123456',
      gender: 1,
      acronymDocument: 'CC',
      status: 1
    }];
    mockPersonService.obtenerTodos.and.returnValue(of(mockPersons));

    component.ngOnInit();

    expect(mockPersonService.obtenerTodos).toHaveBeenCalled();
    expect(component.personList).toEqual(mockPersons);
  });

  it('should emit form data on emitirValoresForm when valid', () => {
    spyOn(component.posteoForm, 'emit');

    component.form.setValue({
      personId: 1,
      email: 'test@example.com',
      password: 'password123',
      status: true,
      photo: null
    });

    component.emitirValoresForm();

    expect(component.posteoForm.emit).toHaveBeenCalled();
  });
});
