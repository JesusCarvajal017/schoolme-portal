import { Component, EventEmitter, inject, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { QuestionCreate, QuestionModel } from '../../../../models/parameters/question.model';
import { AlertApp } from '../../../../utilities/alert-taiga';
import { TypeAswerService } from '../../../../service/parameters/typeAswer.service';
import { TypeAwareModel } from '../../../../models/parameters/TypeAsware.model';
import { infoModal } from '../../../../models/global/info-modal.model';


@Component({
  selector: 'app-form-question',
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
    TuiChevron,
    TuiSelect,
    TuiInputNumber,
    TuiInputDate
  ],
  templateUrl: './form-question.component.html',
  styleUrl: './form-question.component.css'
})
export class FormQuestionComponent {

  
    // ======================= start entradas de componente =======================
    @Input()
    model?: QuestionCreate = undefined;
  
    @Output()
    posteoForm = new EventEmitter<QuestionCreate>();
  
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
  
    servicesTypeAsware = inject(TypeAswerService);

    
    alertService = inject(AlertApp);
    router = inject(Router);
  
    // =========================== end services ========================================
    
    // objeto de tipo documento == models
    documentTypeList : DocumentType[] = [];

    tipoRespuesta : TypeAwareModel[] = [];
  
    @Input({required: true})
    modalInfo !: infoModal;
  
    // funciona el select con esto
    docNameById = new Map<number, string>();
    
    // Helper importante
    // solucion rara de select para que en vista se vea, puede tener mejora, si
    idToName = (v: number | string | null | undefined): string => {
      if (v == null) return '';
      const id = typeof v === 'string' ? Number(v) : v;
      return this.docNameById.get(id) ?? '';
    };
  
    //idicador de activacion usuario
    activeUser !: boolean | null;
  
    ngOnInit(): void {
      this.cargarTipoRespuesta();
    }

    ngOnChanges() : void{
      if(!this.model) return;
        
      this.form.patchValue({
        text: this.model.text,
        typeAnswerId: this.model.typeAnswerId,
        status: true,

      });
    }
  
    private _hydrating = false;  
  
    // ================================ start formularios reactivos ================================
  
    private readonly formBuilder = inject(FormBuilder);
    private readonly dataBasicForm = inject(FormBuilder);
    private readonly userBuilderForm = inject(FormBuilder);
  
    protected readonly tipoRespuestafy: TuiStringHandler<number> = (id) =>
        this.tipoRespuesta.find((item) => item.id === id)?.name ?? '';
  

    // ================================ end formularios reactivos ================================
  
  
    // ================================== start configuraciones de los formularios reactivos ==================================
  
  form = this.formBuilder.nonNullable.group({
    status: [true],
    typeAnswerId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    text: ['', {validators: [Validators.required]}]
  });


  // emisor de data de formulario
  emitirData(){
    let dataForm = this.form.getRawValue();
    
    let preData : QuestionCreate = {
      typeAnswerId: dataForm.typeAnswerId ?? 0,
      text: dataForm.text,
      status: 1
    }

    this.posteoForm.emit(preData);
  }


  // Carga de información de tipo de respuesta
  cargarTipoRespuesta(){
    this.servicesTypeAsware.obtenerTodos().subscribe({
      next: (data)=> {
        this.tipoRespuesta = data; 
      }
    });
  }
}
