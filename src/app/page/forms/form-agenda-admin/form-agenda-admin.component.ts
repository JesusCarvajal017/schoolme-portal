import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';

import {MatFormFieldModule} from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';


import { TuiDay } from '@taiga-ui/cdk/date-time';
import { TuiError} from '@taiga-ui/core';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiTextfield, TuiDataList} from "@taiga-ui/core";
import { CommonModule } from '@angular/common';
import { TuiChevron, TuiSelect, TuiInputNumber, TuiInputDate} from '@taiga-ui/kit';
import { AgendaModel } from '../../../models/business/agenda.model';
import { AlertApp } from '../../../utilities/alert-taiga';
import { infoModal } from '../../../models/global/info-modal.model';


@Component({
  selector: 'app-form-agenda-admin',
  imports: [
    FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatButtonModule, MatSlideToggleModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatStepperModule,
    TuiTextfield,
    TuiDataList,
    CommonModule,
    TuiSelect,
    TuiInputNumber,
    TuiInputDate
  ],
  templateUrl: './form-agenda-admin.component.html',
  styleUrl: './form-agenda-admin.component.css'
})
export class FormAgendaAdminComponent implements OnInit {

    // ======================= start entradas de componente =======================
    @Input()
    model?: AgendaModel = undefined;
  
    @Output()
    posteoForm = new EventEmitter<AgendaModel>();
  
    // ======================= end entradas de componente =======================
  
  
    // ======================= start salidas de componente =======================
  
    // ======================= end salidas de componente =======================
  
    
    // ======================== start propiedades de configuración ========================
  
    activadorUser = new FormControl<boolean>(false, { nonNullable: true });
  
    // propiedades de configuracion vista
    isChecked = true;
  
    // configuraciones de stepe
    isLinear = true;
    isEditable = false;
    idPerson!: number;
    userView : boolean = false;
  

    // ======================== end propiedades de configuración ========================
  
    // =========================== start servicios ========================================
  
    alertService = inject(AlertApp);
    router = inject(Router);
  
    // =========================== end services ========================================
    
    // objeto de tipo documento == models
    documentTypeList : DocumentType[] = [];
  
    @Input({required: true})
    modalInfo !: infoModal;
  
    // funciona el select con esto
    docNameById = new Map<number, string>();
    
    //idicador de activacion usuario
    activeUser !: boolean | null;
  
    ngOnInit(): void {
      
    }

    ngOnChanges() : void{
      if(!this.model) return;
        
      this.form.patchValue({
        description: this.model.description,
        name: this.model.name,
        status: true,

      });
    }
  
    private _hydrating = false;  
  
    // ================================ start formularios reactivos ================================
  
    private readonly formBuilder = inject(FormBuilder);
    private readonly dataBasicForm = inject(FormBuilder);
    private readonly userBuilderForm = inject(FormBuilder);
  

    // ================================ end formularios reactivos ================================
  
  
    // ================================== start configuraciones de los formularios reactivos ==================================
  
  form = this.formBuilder.nonNullable.group({
    status: [true],
    name: ['', {validators: [Validators.required]}],
    description: ['', {validators: [Validators.required]}]
  });


  // emisor de data de formulario
  emitirData(){
    let dataForm = this.form.getRawValue();
    
    let preData : AgendaModel = {
      description: dataForm.description ?? 0,
      name: dataForm.name,
      status: 1
    }

    this.posteoForm.emit(preData);
  }

}
