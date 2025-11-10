import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateModelStudent, Student } from '../../../models/parameters/student.model';
import { RouterLink } from '@angular/router';

import { TuiHeader } from '@taiga-ui/layout';
import { TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule, TuiSelectModule } from '@taiga-ui/legacy';

import { TuiCheckbox, TuiDataListWrapper, TuiTooltip } from '@taiga-ui/kit';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

// Importar servicios para obtener usuarios y roles
import { PersonService } from '../../../service/person.service';
import { CreateModelPerson, Person, PersonOrigin } from '../../../models/security/person.model';
import { Teacher, TeacherService } from '../../../service/parameters/teacher.service';
import { CreateModelTeacher } from '../../../models/parameters/teacher.model';

@Component({
  selector: 'app-form-teacher',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,

    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfield,
    TuiDataList,
    TuiHint,
    MatIconModule,

    TuiDataListWrapper,
  ],
  templateUrl: './form-teacher.component.html',
  styleUrl: './form-teacher.component.css'
})
export class FormTeacherComponent implements OnInit, OnChanges {

  @Input({ required: true })
  title: string = '';

  @Input({ required: true })
  actionDescriptio!: string;

  @Input()
  model?: Teacher;

  @Output()
  posteoForm = new EventEmitter<CreateModelTeacher>();

  // Listas para los dropdowns
  persons: Person[] = [];

  // Loading states
  loadingPerson = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  

  form = this.formBuilder.nonNullable.group({
    personId: [0, { validators: [Validators.required, Validators.min(1)] }],
    status: [true],
  });

  ngOnInit(): void {
    // this.loadUsers();
    this.cargarPerson();
  }

  ngOnChanges(): void {
    if (this.model) {
      let values = {
        personId: this.model.personId,
        status: this.model.status == 1 ? true : false,
      }
      this.form.patchValue(values);
    }
  }

  // // Cargar usuarios desde el servicio
  // loadUsers(): void {
  //   this.loadingPerson = true;
  //   this.personService.obtenerTodos(1).subscribe({
  //     next: (data) => {
  //       this.persons = data;
  //       this.loadingPerson = false;
  //     },
  //     error: (err) => {
  //       console.error('Error cargando usuarios:', err);
  //       this.loadingPerson = false;
  //     }
  //   });
  // }

 
  // Obtener nombre del usuario seleccionado
  getSelectedPersonName(): string {
    const PersonId = this.form.get('PersonId')?.value;
    const person = this.persons.find(u => u.id === PersonId);
    return person ? person.fullName : '';
  }



  // Función principal para emitir los valores del formulario
  emitirValoresForm(): void {
    if (this.form.valid) {
      let capture = this.form.getRawValue();

      const dataGroupDirector: CreateModelTeacher = {
        id: this.model?.id || 0,
        personId: capture.personId,
        fullName: this.getSelectedPersonName(),
        status: capture.status ? 1 : 0,

      }

      this.posteoForm.emit(dataGroupDirector);
    }
  }

  guardarCambios(): void {
    this.emitirValoresForm();
  }

  // solucion de los select taiga

  // lista de la data a traer del la db


  // lista de la data a traer del la db
  personList: PersonOrigin[] = [];
  personListById = new Map(this.personList.map(d => [d.id, d.fullName]));

  idToNamePerson = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.personListById.get(id) ?? '';
  };

  cargarPerson(): void {
    this.personService.obtenerTodos().subscribe(data => {
      this.personList = data;
      this.personListById = new Map(this.personList.map(d => [d.id, d.fullName]));
    });
  }
}
