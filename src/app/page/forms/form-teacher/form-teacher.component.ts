import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';


import { MatIconModule, MatIcon } from "@angular/material/icon";
import { CommonModule, JsonPipe } from '@angular/common';

// Importar servicios para obtener usuarios y roles
import { PersonService } from '../../../service/person.service';
import { CreateModelPerson, Person, PersonOrigin } from '../../../models/security/person.model';
import { Teacher, TeacherService } from '../../../service/parameters/teacher.service';
import { CreateModelTeacher } from '../../../models/parameters/teacher.model';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiTextfield, TuiDataList} from "@taiga-ui/core";
import { TuiChevron, TuiSelect, TuiCheckbox } from '@taiga-ui/kit';

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
    MatIcon,
    TuiChevron,
    TuiTextfield,
    TuiSelect,
    TuiDataList,
    TuiCheckbox
],
  templateUrl: './form-teacher.component.html',
  styleUrl: './form-teacher.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  personList: PersonOrigin[] = [];

  // Loading states
  loadingPerson = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  
  private readonly cdr = inject(ChangeDetectorRef);

  protected readonly stringify: TuiStringHandler<number> = (id) =>
    this.personList.find((item) => item.id === id)?.fisrtName ?? '';
  

  form = this.formBuilder.nonNullable.group({
    personId: [0, { validators: [Validators.required, Validators.min(1)] }],
    status: [true],
  });

  ngOnInit(): void {
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
        status: capture.status ? 1 : 0,

      }

      console.log(dataGroupDirector);

      this.posteoForm.emit(dataGroupDirector);
    }
  }

  guardarCambios(): void {
    this.emitirValoresForm();
  }

  // solucion de los select taiga

  // lista de la data a traer del la db


  // lista de la data a traer del la db
  
  personListById = new Map(this.personList.map(d => [d.id, d.fullName]));

  idToNamePerson = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.personListById.get(id) ?? '';
  };

  cargarPerson(): void {
    this.personService.obtenerTodosOrigin().subscribe(data => {
      this.personList = data;
      this.cdr.markForCheck();
      // this.personListById = new Map(this.personList.map(d => [d.id, d.fullName]));
    });
  }


   protected readonly items: readonly Python[] = [
        {id: 42, name: 'John Cleese'},
        {id: 237, name: 'Eric Idle'},
        {id: 666, name: 'Michael Palin'},
        {id: 123, name: 'Terry Gilliam'},
        {id: 777, name: 'Terry Jones'},
        {id: 999, name: 'Graham Chapman'},
    ];

  
  }

interface Python {
  readonly id: number;
  readonly name: string;
}