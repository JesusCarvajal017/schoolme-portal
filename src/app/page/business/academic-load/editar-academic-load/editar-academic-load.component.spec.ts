import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAcademicLoadComponent } from './editar-academic-load.component';

describe('EditarAcademicLoadComponent', () => {
  let component: EditarAcademicLoadComponent;
  let fixture: ComponentFixture<EditarAcademicLoadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAcademicLoadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAcademicLoadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
