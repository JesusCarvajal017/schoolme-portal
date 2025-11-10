import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarAttendantsComponent } from './editar-attendants.component';

describe('EditarAttendantsComponent', () => {
  let component: EditarAttendantsComponent;
  let fixture: ComponentFixture<EditarAttendantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarAttendantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarAttendantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
