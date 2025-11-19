import { Component, EventEmitter, inject, input, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AbstractControl, FormBuilder, FormControl, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CreateModelPerson, PersonComplete } from '../../../models/security/person.model';
import { Router, RouterLink } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';


// import { MatOption } from '@angular/material/select';
import { DocumentTypeService } from '../../../service/parameters/documentType.service';
import { Gender, GenderType } from '../../../global/model/enumGenero';

import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatStepperModule} from '@angular/material/stepper';

import { DocumentType } from '../../../models/parameters/DocumentType.model';
import { CreateDataBasic, DataBasic } from '../../../models/business/dataBasic.mode';
import { Departament } from '../../../models/parameters/Departament.model';
import {DepartamentServices } from '../../../service/parameters/Departament.service';
import { MunicipalityService } from '../../../service/parameters/Municipality.service';
import { Municipality } from '../../../models/parameters/Municipality.model';
import { Rh } from '../../../models/parameters/Rh';
import { RhService } from '../../../service/parameters/rh.service';
import { StatusCivil } from '../../../models/parameters/StatusCivil';
import { StatusCivilServices } from '../../../service/parameters/statusCivil.service';
import { PersonService } from '../../../service/person.service';
import { AlertApp } from '../../../utilities/alert-taiga';
import { Eps } from '../../../models/parameters/eps.model';
import { EpsService } from '../../../service/parameters/eps.service';
import { TuiDay } from '@taiga-ui/cdk/date-time';
import { formatTuiDay, parseTuiDay } from '../../../utilities/helpers/dataDayTaiga';
import { DataBasicService } from '../../../service/business/dataBasic.service';
import { UserService } from '../../../service/user.service';
import { AddressValid } from '../../../utilities/validations/validaciones';

import { TuiError} from '@taiga-ui/core';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { TuiTextfield, TuiDataList} from "@taiga-ui/core";
import { CommonModule } from '@angular/common';
import { TuiChevron, TuiSelect, TuiInputNumber, TuiInputDate} from '@taiga-ui/kit';
import { infoModal } from '../../../models/global/info-modal.model';

@Component({
  selector: 'app-form-todos',
  imports: [
    FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatButtonModule, MatSlideToggleModule,
    MatSelectModule,
    MatTabsModule,
    MatCheckboxModule,
    MatStepperModule,
    TuiError,
    TuiTextfield,
    TuiDataList,
    CommonModule,
    TuiChevron,
    TuiSelect,
    TuiInputNumber,
    TuiInputDate
],
  templateUrl: './form-todos.component.html',
  styleUrl: './form-todos.component.css'
})
export class FormTodosComponent {

  // ======================= start entradas de componente =======================
  @Input()
  model?: PersonComplete = undefined;

  @Output()
  posteoForm = new EventEmitter<CreateModelPerson>();

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

  // configuracion de vista
  @Input({required : true})
  isUser : boolean = false;

  // ======================== end propiedades de configuración ========================

  // =========================== start servicios ========================================

  servicesPerson = inject(PersonService);
  servicesDataBasic = inject(DataBasicService);
  servicesUser = inject(UserService);

  servicesDocmentType = inject(DocumentTypeService);
  servicesDepartament = inject(DepartamentServices);
  servicesMuncipality = inject(MunicipalityService);
  servicesRh = inject(RhService);
  servicesStatus = inject(StatusCivilServices);
  servicesEps =  inject(EpsService);

  alertService = inject(AlertApp);
  router = inject(Router);

  // =========================== end services ========================================
  
  // objeto de tipo documento == models
  documentTypeList : DocumentType[] = [];
  
  dataBasic : DataBasic[] = [];

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

    // carga de informacion primaria, necesaria para selects
    this.cargarDocumentos();
    this.cargarDepartamento();
    // this.cargarMunicipio();
    this.cargarRh();
    this.cargarStatus();
    this.cargarEps();
    this.cargarMunicipio();

    // cambio de valor para mostrar si crea el usuario
    this.activadorUser.valueChanges.subscribe(value => {
      this.userView = value;
    });


  }

  private _hydrating = false;  

  // ================================ start formularios reactivos ================================

  private readonly formBuilder = inject(FormBuilder);
  private readonly dataBasicForm = inject(FormBuilder);
  private readonly userBuilderForm = inject(FormBuilder);

  protected readonly tipoDocumento: TuiStringHandler<number> = (id) =>
      this.documentTypeList.find((item) => item.id === id)?.name ?? '';

  protected readonly generofy: TuiStringHandler<number> = (id) =>
      this.generos.find((item) => item.id === id)?.name ?? '';


  readonly departamentofy: TuiStringHandler<number | null> = id =>
    id == null ? '' : this.departaments.find(d => d.id === +id)?.name ?? '';

  readonly municipiofy: TuiStringHandler<number | null> = id =>
    id == null ? '' : this.municipality.find(m => m.id === +id)?.name ?? '';


  protected readonly rhfy: TuiStringHandler<number> = (id) =>
    this.rhList.find((item) => item.id === id)?.name ?? '';

  protected readonly estadocivilfy: TuiStringHandler<number> = (id) =>
    this.statusCivil.find((item) => item.id === id)?.name ?? '';

  protected readonly epsfy: TuiStringHandler<number> = (id) =>
    this.epsList.find((item) => item.id === id)?.name ?? '';
  // ================================ end formularios reactivos ================================


  // ================================== start configuraciones de los formularios reactivos ==================================

  form = this.formBuilder.nonNullable.group({
    status: [true],
    documentTypeId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    fisrtName: ['', {validators: [Validators.required]}],
    secondName: [''],
    lastName: ['', {validators: [Validators.required]}],
    email: ['', [Validators.email, (control: AbstractControl): ValidationErrors | null => this.isUser ? Validators.required(control) : null]],
    secondLastName: [''],
    identification: new FormControl<number | null>(null, { validators: [Validators.required] }),
    phone: new FormControl<number | null>(null, { validators: [Validators.required] }),
    gender: new FormControl<number | null>(null, { validators: [Validators.required] }),

    // formulario de databasic
    rhId:  new FormControl<number | null>(null, { validators: [Validators.required] }),
    adress: ['', {validators : [Validators.required, AddressValid()] } ],
    brithDate: new FormControl<TuiDay | null>(null, { validators: [Validators.required] }),   // se puede cambiar a Date si quieres manejar fechas
    stratumStatus:  [false],
    materialStatusId:  new FormControl<number | null>(null, { validators: [Validators.required] }),
    epsId:  new FormControl<number | null>(null, { validators: [Validators.required] }),
    munisipalityId:  new FormControl<number | null>(null, { validators: [Validators.required] }),
    departamentId:  new FormControl<number | null>(null),
  });

  // ================================== end configuraciones de los formularios reactivos ==================================


  // ==================================== start manejador de errores ==================================================
  ObtenerErrorCampoAndres() : string {
      let adress = this.form.controls.adress;

      if(adress.hasError('required')){
        return "el campo debe estar lleno"
      }

      if(adress.hasError('addressInvalid')){
        return adress.getError('addressInvalid').message 
      }

      return "";
  }


  // ==================================== end manejador de errores ==================================================
  ngOnChanges(): void {
    if (!this.model) return;

    this._hydrating = true;

    const day = this.model.dataBasic?.brithDate
      ? parseTuiDay(this.model.dataBasic.brithDate)
      : null;

    // Parchea TODO excepto munisipalityId (aún no hay lista)
    this.form.patchValue({
      fisrtName: this.model.fisrtName,
      secondName: this.model.secondName,
      lastName: this.model.lastName,
      secondLastName: this.model.secondLastName,
      identification: this.model.identification ?? null,
      documentTypeId: this.model.documentTypeId ?? null,
      phone: this.model.phone ?? null,
      gender: this.model.gender ?? null,
      rhId: this.model.dataBasic?.rhId ?? null,
      adress: this.model.dataBasic?.adress ?? '',
      stratumStatus: !!this.model.dataBasic?.stratumStatus,
      materialStatusId: this.model.dataBasic?.materialStatusId ?? null,
      epsId: this.model.dataBasic?.epsId ?? null,
      departamentId: this.model.dataBasic?.departamentId ?? null,
      brithDate: day,
      status: !!this.model.status
    }, { emitEvent: false });

    // Si viene departamento en el modelo, carga municipios y recién ahí pon munisipalityId
    const depto = this.model.dataBasic?.departamentId;
    const muni  = this.model.dataBasic?.munisipalityId ?? null;

    if (depto != null) {
      this.servicesMuncipality.MunicipiosDepart(depto).subscribe({
        next: (lista) => {
          this.municipality = lista;
          // Ahora sí, asigna el municipio SIN emitir
          this.form.controls.munisipalityId.setValue(muni, { emitEvent: false });
          this._hydrating = false;
          // sincroniza estado visual
          this.form.markAsPristine();
          this.form.updateValueAndValidity(); // ya sin {emitEvent:false}
        },
        error: (err) => {
          console.log(err);
          this._hydrating = false;
        }
      });
    } else {
      // No hay departamento -> limpia municipios
      this.municipality = [];
      this.form.controls.munisipalityId.setValue(null, { emitEvent: false });
      this._hydrating = false;
      this.form.markAsPristine();
      this.form.updateValueAndValidity();
    }
  }

  // =================================== start metodos del componente ===================================

  createPerson(): void{
    // extraccion data del fomulario
    let dataForm = this.form.getRawValue();

    let preparacionData : CreateModelPerson = {
      id: this.model?.id,
      fisrtName: dataForm.fisrtName,
      secondName: dataForm.secondName,
      lastName: dataForm.lastName,
      secondLastName: dataForm.secondLastName,
      identification: dataForm.identification ?? 0,
      documentTypeId: dataForm.documentTypeId ?? 0,
      phone: dataForm.phone ?? 0,
      gender: dataForm.gender ?? 0,
      email: dataForm.email ?? '',
      status: this.form.controls['status'].value ? 1 : 0,
      dataBasic: {
        brithDate: dataForm.brithDate ? formatTuiDay(dataForm.brithDate) : '',
        status: dataForm.status ? 1 : 0,
        stratumStatus: dataForm.stratumStatus ? 1 : 0,
        personId: this.model?.id,
        rhId: dataForm.rhId ?? 0,
        materialStatusId: dataForm.materialStatusId ?? 0,
        epsId: dataForm.epsId ?? 0,
        munisipalityId: dataForm.munisipalityId ?? 0,
        adress: dataForm.adress,
        id: this.model?.dataBasic.id
      },
      fullName: ''
    }

    this.posteoForm.emit(preparacionData);
  }

  createDataBasic() : void{
    // extraccion data del fomulario
    let dataForm = this.form.getRawValue();

    // preparación de la data
    const preData : CreateDataBasic = {
      brithDate: dataForm.brithDate ? formatTuiDay(dataForm.brithDate) : '',
      status: dataForm.status ? 1 : 0,
      stratumStatus: dataForm.stratumStatus ? 1 : 0,
      personId: this.idPerson,
      rhId: dataForm.rhId ?? 0,
      materialStatusId: dataForm.materialStatusId ?? 0, 
      epsId: dataForm.epsId ?? 0,
      munisipalityId: dataForm.munisipalityId ?? 0,
      adress: dataForm.adress
    };

    console.log(preData);

    // console.log(preData);
    this.servicesDataBasic.crear(preData).subscribe({
      next: ()=>{
        this.alertService.mensage = "se a guardado la datos basicos";
        this.alertService.showDepositAlert();
      }
    });

  }

  guardarCambios(){

  }

  cargarDocumentos() : void{
    this.servicesDocmentType.obtenerTodos().subscribe(data =>{
      this.documentTypeList = data;
        this.docNameById = new Map(this.documentTypeList.map(d => [d.id, d.name]));
    });
  }

  activacionUser(){
    let value = this.activadorUser.value;
    this.userView = value ?? false;
    // console.log(capture)
  }

  // =================================== end metodos del componente ===================================
  
  // ==================================================== parche  de selects =================================================

  // helpers de select 
  generos : Gender[] = GenderType;

  // departament
  departaments : Departament[] = [];

  // cargarDepartamento() : void {
  //   this.servicesDepartament.obtenerTodos().subscribe(data =>{
  //     this.departaments = data;
  //   });
  // }

  // municipality
  municipality : Municipality[] = [];

  private _departChangeBound = false;

  cargarMunicipio(): void {
  
    // carga inicial si vienes con model
    if (this.model?.dataBasic?.departamentId) {
      this.servicesMuncipality
        .MunicipiosDepart(this.model.dataBasic.departamentId)
        .subscribe({
          next: (data) => {
            this.municipality = data;
            console.log(this.municipality);
          },
          error: (err) => console.log(err),
        });
    }

    // evita múltiples suscripciones
    if (this._departChangeBound) return;
    this._departChangeBound = true;

    // escucha cambios del control
    this.form.controls.departamentId.valueChanges.subscribe({
      next: (val) => {
        if (val === null || val === undefined) {
          this.municipality = [];
          this.form.controls.munisipalityId.reset();
          return;
        }

        this.form.controls.munisipalityId.reset();
        this.municipality = [];

        this.servicesMuncipality.MunicipiosDepart(val).subscribe({
          next: (data) => {
            this.municipality = data;
            console.log(this.municipality);
          },
          error: (err) => console.log(err),
        });
      },
      error: (err) => console.log(err),
    });
  }

  // Cargar catálogos
  cargarDepartamento(): void {
    this.servicesDepartament.obtenerTodos().subscribe({
      next: (data) => (this.departaments = data),
      error: console.error,
    });
  }

  rhList : Rh[] = [];

  cargarRh() : void {
    this.servicesRh.obtenerTodos().subscribe(data =>{
      this.rhList = data;
    });  
  }

  statusCivil : StatusCivil[] = [];

  cargarStatus() : void {
    this.servicesStatus.obtenerTodos().subscribe(data =>{
      this.statusCivil = data;
    });  
  }

  epsList : Eps[] = [];

  cargarEps() : void {
    this.servicesEps.obtenerTodos().subscribe(data =>{
      this.epsList = data;
    });  
  }
}
