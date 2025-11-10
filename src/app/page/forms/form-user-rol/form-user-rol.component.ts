import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateModelUserRol, UserRol } from '../../../models/security/user-rol.model';
import { RouterLink } from '@angular/router';

import { TuiHeader } from '@taiga-ui/layout';
import { TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule, TuiSelectModule } from '@taiga-ui/legacy';

import { TuiCheckbox, TuiDataListWrapper, TuiTooltip } from '@taiga-ui/kit';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

// Importar servicios para obtener usuarios y roles
import { UserService, User } from '../../../service/user.service';
import { RolService } from '../../../service/rol.service';
import { Rol } from '../../../models/security/rol.model';


@Component({
  selector: 'app-form-user-rol',
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
  templateUrl: './form-user-rol.component.html',
  styleUrl: './form-user-rol.component.css'
})
export class FormUserRolComponent implements OnInit, OnChanges {

  @Input({ required: true })
  title: string = '';

  @Input({ required: true })
  actionDescriptio!: string;

  @Input()
  model?: UserRol;

  @Output()
  posteoForm = new EventEmitter<CreateModelUserRol>();

  // Listas para los dropdowns
  users: User[] = [];
  roles: Rol[] = [];

  // Loading states
  loadingUsers = false;
  loadingRoles = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly rolService = inject(RolService);

  form = this.formBuilder.nonNullable.group({
    userId: [0, { validators: [Validators.required, Validators.min(1)] }],
    rolId: [0, { validators: [Validators.required, Validators.min(1)] }],
    status: [true],
  });

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.cargarUser();
    this.cargarRol();
  }

  ngOnChanges(): void {
    if (this.model) {
      let values = {
        userId: this.model.userId,
        rolId: this.model.rolId,
        status: this.model.status == 1 ? true : false,
      }
      this.form.patchValue(values);
    }
  }

  // Cargar usuarios desde el servicio
  loadUsers(): void {
    this.loadingUsers = true;
    this.userService.obtenerTodos(1).subscribe({
      next: (data) => {
        this.users = data;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loadingUsers = false;
      }
    });
  }

  // Cargar roles desde el servicio
  loadRoles(): void {
    this.loadingRoles = true;
    this.rolService.obtenerTodos(1).subscribe({
      next: (data) => {
        this.roles = data;
        this.loadingRoles = false;
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.loadingRoles = false;
      }
    });
  }

  // Obtener nombre del usuario seleccionado
  getSelectedUserName(): string {
    const userId = this.form.get('userId')?.value;
    const user = this.users.find(u => u.id === userId);
    return user ? user.email : '';
  }

  // Obtener nombre del rol seleccionado
  getSelectedRolName(): string {
    const rolId = this.form.get('rolId')?.value;
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.name : '';
  }

  // Función principal para emitir los valores del formulario
  emitirValoresForm(): void {
    if (this.form.valid) {
      let capture = this.form.getRawValue();

      const dataUserRol: CreateModelUserRol = {
        id: this.model?.id || 0,
        userId: capture.userId,
        rolId: capture.rolId,
        nameUser: this.getSelectedUserName(),
        rolName: this.getSelectedRolName(),
        status: capture.status ? 1 : 0
      }

      this.posteoForm.emit(dataUserRol);
    }
  }

  guardarCambios(): void {
    this.emitirValoresForm();
  }

  // solucion de los select taiga

  // lista de la data a traer del la db
  userList: User[] = [];
  userListById = new Map(this.userList.map(d => [d.id, d.email]));

  idToNameUser = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.userListById.get(id) ?? '';
  };

  cargarUser(): void {
    this.userService.obtenerTodos().subscribe(data => {
      this.userList = data;
      this.userListById = new Map(this.userList.map(d => [d.id, d.email]));
    });
  }

  // lista de la data a traer del la db
  rolList: Rol[] = [];
  rolListById = new Map(this.rolList.map(d => [d.id, d.name]));

  idToNameRol = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.rolListById.get(id) ?? '';
  };

  cargarRol(): void {
    this.rolService.obtenerTodos().subscribe(data => {
      this.rolList = data;
      this.userListById = new Map(this.rolList.map(d => [d.id, d.name]));
    });
  }
}
