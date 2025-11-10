import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CreateModelRol, Rol } from '../../../models/security/rol.model';
import { RouterLink } from '@angular/router';

import { TuiHeader} from '@taiga-ui/layout';
import { TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {TuiInputModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';

import { TuiCheckbox } from '@taiga-ui/kit';
import { MatIconModule } from "@angular/material/icon";
import { CreateModelPermission, Permission } from '../../../models/security/permission.model';

@Component({
  selector: 'app-form-permission',
  imports: [FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatButtonModule, MatSlideToggleModule,
    // RouterLink, TuiTitle, TuiHeader,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiDataList,
    TuiHint,
    TuiCheckbox, MatIconModule,
    // TuiIcon,
    TuiTextfield
  ],
  templateUrl: './form-permission.component.html',
  styleUrl: './form-permission.component.css'
})
export class FormPermissionComponent implements OnInit, OnChanges { 

  @Input({required: true})
  title: string = '';

  @Input({required: true})
  actionDescriptio !: string;

  @Input()
  model?: Permission;

  @Output()
  posteoForm = new EventEmitter<CreateModelRol>();

  ngOnInit(): void {
    // Inicialización si es necesaria
  }

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.nonNullable.group({
    name: ['', {validators: [Validators.required, Validators.minLength(2)]}],
    description: ['', {validators: [Validators.required, Validators.minLength(5)]}],
    status: [true],
  });

  ngOnChanges(): void {
    if(this.model){
      let values = {
        name: this.model.name,
        description: this.model.description,
        status: this.model.status == 1 ? true : false, // convertir el valor numerico a un valor booleano
      }
      this.form.patchValue(values); // cargar los datos en el formulario
    }
  }

  // funciones principales
  emitirValoresForm(){
    let capture = this.form.getRawValue(); // capturar los datos del formulario

    const dataPermission : CreateModelPermission = {
      ...capture,
      status: capture.status ? 1 : 0,
      id: 0
    }

    this.posteoForm.emit(dataPermission);
  }

  guardarCambios(){
    // Método para futuras implementaciones
  }
}