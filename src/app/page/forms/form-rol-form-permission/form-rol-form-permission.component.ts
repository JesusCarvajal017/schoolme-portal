import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { FormService, Form } from '../../../service/form.service';
import { PermissionService, Permission } from '../../../service/permission.service';
import { RolService } from '../../../service/rol.service';
import { Rol } from '../../../models/security/rol.model';
import { CreateModelRolFormPermission, RolFormPermission } from '../../../models/security/rol-form-permission.model';


@Component({
  selector: 'app-form-rol-form-permission',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatSelectModule,

    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfield,
    TuiDataList,
    TuiHint,
    // TuiCheckbox, 
    MatIconModule,

    TuiDataListWrapper,
    // TuiTooltip





  ],
  templateUrl: './form-rol-form-permission.component.html',
  styleUrl: './form-rol-form-permission.component.css'
})
export class FormRolFormPermissionComponent implements OnInit, OnChanges {

  @Input({ required: true })
  title: string = '';

  @Input({ required: true })
  actionDescriptio !: string;

  @Input()
  model?: RolFormPermission;

  @Output()
  posteoForm = new EventEmitter<CreateModelRolFormPermission>();

  // Listas para los dropdowns
  forms: Form[] = [];
  Permissions: Permission[] = [];
  roles: Rol[] = [];

  // Loading states
  loadingForms = false;
  loadingPermissions = false;
  loadingRoles = false;

  private readonly formBuilder = inject(FormBuilder);
  private readonly formService = inject(FormService);
  private readonly permissionService = inject(PermissionService);
  private readonly rolService = inject(RolService);

  form = this.formBuilder.nonNullable.group({
    formId: [0, { validators: [Validators.required, Validators.min(1)] }],
    rolId: [0, { validators: [Validators.required, Validators.min(1)] }],
    permissionId: [0, { validators: [Validators.required, Validators.min(1)] }],
    status: [true],
  });

  ngOnInit(): void {
    this.cargarForm();
    this.cargarPermission();
    this.cargarRol();

  }

  ngOnChanges(): void {
    if (this.model) {
      let values = {
        formId: this.model.FormId,
        permissionId: this.model.PermissionId,
        rolId: this.model.rolId,
        status: this.model.status == 1 ? true : false,
      }
      this.form.patchValue(values);
    }
  }

  // Cargar usuarios desde el servicio
  loadUsers(): void {
    this.loadingForms = true;
    this.formService.obtenerTodos(1).subscribe({
      next: (data) => {
        this.forms = data;
        this.loadingForms = false;
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loadingForms = false;
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
  getSelectedFormName(): string {
    const formId = this.form.get('formId')?.value;
    const form = this.forms.find(u => u.id === formId);
    return form ? form.name : '';
  }

  // Obtener nombre del rol seleccionado
  getSelectedRolName(): string {
    const rolId = this.form.get('rolId')?.value;
    const rol = this.roles.find(r => r.id === rolId);
    return rol ? rol.name : '';
  }

  getSelectedPermissionName(): string {
    const permissionId = this.form.get('permissionId')?.value;
    const permission = this.Permissions.find(p => p.id === permissionId);
    return permission ? permission.name : '';
  }
  // Función principal para emitir los valores del formulario
  emitirValoresForm(): void {
    if (this.form.valid) {
      let capture = this.form.getRawValue();

      const dataRolFormPermission: CreateModelRolFormPermission = {
        id: this.model?.id || 0,
        formId: capture.formId,
        permissionId: capture.permissionId,
        rolId: capture.rolId,
        formName: this.getSelectedFormName(),
        rolName: this.getSelectedRolName(),
        permissionName: this.getSelectedPermissionName(),
        status: capture.status ? 1 : 0,
      }

      this.posteoForm.emit(dataRolFormPermission);
    }
  }

  guardarCambios(): void {
    this.emitirValoresForm();
  }

  // solucion de los select taiga

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
      this.rolListById = new Map(this.rolList.map(d => [d.id, d.name]));
    });
  }

  // lista de la data a traer del la db
  formList: Form[] = [];
  formListById = new Map(this.rolList.map(d => [d.id, d.name]));

  idToNameForm = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.formListById.get(id) ?? '';
  };


  cargarForm(): void {
    this.formService.obtenerTodos().subscribe(data => {
      this.formList = data;
      this.formListById = new Map(this.formList.map(d => [d.id, d.name]));
    });
  }

  
  // lista de la data a traer del la db
  permissionList: Permission[] = [];
  permissionListById = new Map(this.rolList.map(d => [d.id, d.name]));

  idToNamePermission = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.permissionListById.get(id) ?? '';
  };


  cargarPermission(): void {
    this.permissionService.obtenerTodos().subscribe(data => {
      this.permissionList = data;
      this.permissionListById = new Map(this.permissionList.map(d => [d.id, d.name]));
    });
  }
}



