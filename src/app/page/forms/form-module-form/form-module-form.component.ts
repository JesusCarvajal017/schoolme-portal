import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CreateModelModuleForm, ModuleForm } from '../../../models/security/module-form.model';
import { RouterLink } from '@angular/router';

import { TuiHeader} from '@taiga-ui/layout';
import { TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {TuiInputModule, TuiTextfieldControllerModule, TuiSelectModule} from '@taiga-ui/legacy';

import { TuiCheckbox, TuiDataListWrapper } from '@taiga-ui/kit';
import { MatIconModule } from "@angular/material/icon";
import { Module } from '../../../models/security/module.model';
import {ModuleService} from '../../../service/module.service';
import { Form } from '../../../models/security/form.model';
import { FormService } from '../../../service/form.service';

@Component({
  selector: 'app-form-module-form',
  imports: [FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatButtonModule, MatSlideToggleModule,
    // RouterLink, TuiTitle, TuiHeader,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiDataList,
    TuiHint,
    TuiCheckbox, MatIconModule,
    TuiSelectModule,
    // TuiIcon,
    TuiTextfield,
    TuiDataList,
    TuiHint,
    TuiDataListWrapper,
    

  ],
  templateUrl: './form-module-form.component.html',
  styleUrl: './form-module-form.component.css'
})
export class FormModuleFormComponent implements OnInit, OnChanges { 

  @Input({required: true})
  title: string = '';

  @Input({required: true})
  actionDescriptio !: string;

  @Input()
  model?: ModuleForm;

  @Output()
  posteoForm = new EventEmitter<CreateModelModuleForm>();

  ngOnInit(): void {
    this.cargarModule();
    this.cargarForm();
    // Inicialización si es necesaria
  }

  private readonly formBuilder = inject(FormBuilder);
  private readonly moduleService = inject(ModuleService);
  private readonly formService = inject(FormService);

  form = this.formBuilder.nonNullable.group({
    formName: ['', {validators: [Validators.required, Validators.minLength(2)]}],
    formId: ['', {validators: [Validators.required, Validators.minLength(2)]}],
    moduleId: ['', {validators: [Validators.required, Validators.minLength(2)]}],
    moduleName: ['', {validators: [Validators.required, Validators.minLength(5)]}],
    status: [true],
  });

  

  ngOnChanges(): void {
    if(this.model){
      let values = {
        name: this.model.formName,
        description: this.model.moduleName,
        status: this.model.status == 1 ? true : false, // convertir el valor numerico a un valor booleano
      }
      this.form.patchValue(values); // cargar los datos en el formulario
    }
  }

  // funciones principales
  emitirValoresForm(){
    let capture = this.form.getRawValue(); // capturar los datos del formulario

    const dataModuleForm : CreateModelModuleForm = {
      ...capture,
      status: capture.status ? 1 : 0,
      id: 0,
      moduleId: 0,
      formId: 0
    }

    this.posteoForm.emit(dataModuleForm);
  }

  guardarCambios(){
    // Método para futuras implementaciones
  }

  // lista de la data a traer del la db
    moduleList: Module[] = [];
    moduleListById = new Map(this.moduleList.map(d => [d.id, d.name]));
  
    idToNameModule = (v: number | string | null | undefined): string => {
      if (v == null) return '';
      const id = typeof v === 'string' ? Number(v) : v;
      return this.moduleListById.get(id) ?? '';
    };
  
  
    cargarModule(): void {
      this.moduleService.obtenerTodos().subscribe(data => {
        this.moduleList = data;
        this.moduleListById = new Map(this.moduleList.map(d => [d.id, d.name]));
      });
    }
  
    // lista de la data a traer del la db
    formList: Form[] = [];
    formListById = new Map(this.formList.map(d => [d.id, d.name]));
  
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
  
}