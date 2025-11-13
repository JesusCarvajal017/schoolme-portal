import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateModelStudent, Student } from '../../../models/parameters/student.model';

import { MatIconModule, MatIcon } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

// Importar servicios para obtener usuarios y roles
import { PersonService } from '../../../service/person.service';
import { Person, PersonOrigin } from '../../../models/security/person.model';
import { GroupsService } from '../../../service/parameters/groups.service';
import { Groups } from '../../../models/parameters/groups.model';
import { TuiTextfieldComponent } from "@taiga-ui/core";
import { TuiStringHandler } from '@taiga-ui/cdk/types';


@Component({
  selector: 'app-form-student',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatIcon
],
  templateUrl: './form-student.component.html',
  styleUrl: './form-student.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormStudentComponent implements OnInit, OnChanges {

  @Input({ required: true })
  title: string = '';

  @Input({ required: true })
  actionDescriptio!: string;

  @Input()
  model?: Student;

  @Output()
  posteoForm = new EventEmitter<CreateModelStudent>();

  // Listas para los dropdowns
  persons: Person[] = [];
  groups: Groups[] = [];

  // Loading states
  loadingPerson = false;
  loadingGroups = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly personService = inject(PersonService);
  private readonly groupsService = inject(GroupsService);

  protected readonly stringify: TuiStringHandler<number> = (id) =>
    this.persons.find((item) => item.id === id)?.fisrtName ?? '';

  form = this.formBuilder.nonNullable.group({
    personId: [0, { validators: [Validators.required, Validators.min(1)] }],
    groupsId: [0, { validators: [Validators.required, Validators.min(1)] }],
    status: [true],
  });

  ngOnInit(): void {
    // this.loadUsers();
    this.loadRoles();
    this.cargarPerson();
    this.cargarGroup();
  }

  ngOnChanges(): void {
    if (this.model) {
      let values = {
        personId: this.model.personId,
        groupsId: this.model.groupId,
        status: this.model.status == 1 ? true : false,
      }
      this.form.patchValue(values);
    }
  }

  // Cargar roles desde el servicio
  loadRoles(): void {
    this.loadingGroups = true;
    this.groupsService.obtenerTodos(1).subscribe({
      next: (data) => {
        this.groups = data;
        this.loadingGroups = false;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.loadingGroups = false;
      }
    });
  }

  // Obtener nombre del usuario seleccionado
  getSelectedPersonName(): string {
    const PersonId = this.form.get('PersonId')?.value;
    const person = this.persons.find(u => u.id === PersonId);
    return person ? person.fullName : '';
  }

  // Obtener nombre del rol seleccionado
  getSelectedGroupsName(): string {
    const groupsId = this.form.get('groupsId')?.value;
    const group = this.groups.find(r => r.id === groupsId);
    return group ? group.name : '';
  }

  // Función principal para emitir los valores del formulario
  emitirValoresForm(): void {
    if (this.form.valid) {
      let capture = this.form.getRawValue();

      const dataGroupDirector: CreateModelStudent = {
        id: this.model?.id || 0,
        personId: capture.personId,
        groupId: capture.groupsId,
        fullName: this.getSelectedPersonName(),
        groupName: this.getSelectedGroupsName(),
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
  groupList: Groups[] = [];
  groupListById = new Map(this.groupList.map(d => [d.id, d.name]));

  idToNameGroup = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.groupListById.get(id) ?? '';
  };

  cargarGroup(): void {
    this.groupsService.obtenerTodos().subscribe(data => {
      this.groupList = data;
      this.groupListById = new Map(this.groupList.map(d => [d.id, d.name]));
    });
  }


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
