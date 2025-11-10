import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CreateModelPerson, FormPersonValue, Person, PersonComplete } from '../../../models/security/person.model';
import { Router, RouterLink } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatTabsModule} from '@angular/material/tabs';

import { TuiHeader} from '@taiga-ui/layout';
import { TuiButton, TuiDataList, TuiError, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {TuiInputDateModule, TuiInputModule, TuiInputNumberModule, TuiSelectModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
// import { TuiDataListModule } from '@taiga-ui/core';import { TuiDataList } from '@taiga-ui/core';

// import { MatOption } from '@angular/material/select';
import { DocumentTypeService } from '../../../service/parameters/documentType.service';
import { TuiDataListWrapper, TuiPassword, TuiTooltip  } from '@taiga-ui/kit';
import { Gender, GenderType } from '../../../global/model/enumGenero';

import { MatIconModule } from "@angular/material/icon";
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

@Component({
  selector: 'app-form-todos',
  imports: [
    FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatButtonModule, MatSlideToggleModule,
    MatSelectModule,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDataListWrapper,
    TuiDataList,
    TuiHint,
    TuiInputNumberModule,
    MatIconModule,
    TuiTextfield,
    TuiHint,
    TuiInputDateModule,
    MatTabsModule,
    MatCheckboxModule,
    MatStepperModule, 
    TuiError

  ],
  templateUrl: './form-todos.component.html',
  styleUrl: './form-todos.component.css'
})
export class FormTodosComponent {

  // ======================= start entradas de componente =======================
  @Input({required: true})
  actionDescriptio !: string;

  @Input()
  model?: PersonComplete = undefined;

  @Output()
  posteoForm = new EventEmitter<CreateModelPerson>();
  // ======================= end entradas de componente =======================

  // ======================= start salidas de componente =======================

  // emision de data en caso de ser un componente reutilizable
  // @Output()
  // posteoForm = new EventEmitter<CreateModelPerson>();

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
    this.cargarMunicipio();
    this.cargarRh();
    this.cargarStatus();
    this.cargarEps();

    // cambio de valor para mostrar si crea el usuario
    this.activadorUser.valueChanges.subscribe(value => {
      this.userView = value;
    });

  }

  // ================================ start formularios reactivos ================================

  private readonly formBuilder = inject(FormBuilder);
  private readonly dataBasicForm = inject(FormBuilder);
  private readonly userBuilderForm = inject(FormBuilder);

  // ================================ end formularios reactivos ================================


  // ================================== start configuraciones de los formularios reactivos ==================================

  form = this.formBuilder.nonNullable.group({
    status: [true],
    documentTypeId: new FormControl<number | null>(null, { validators: [Validators.required] }),
    fisrtName: ['', {validators: [Validators.required]}],
    secondName: [''],
    lastName: ['', {validators: [Validators.required]}],
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
      const day = this.model.dataBasic?.brithDate ? parseTuiDay(this.model.dataBasic.brithDate) : null;

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
        munisipalityId: this.model.dataBasic?.munisipalityId ?? null,
        departamentId: this.model.dataBasic.departamentId, // si aplica
        brithDate: day,
        status: !!this.model.status ? true : false
      });
    
      
      // sincroniza estado visual
      this.form.markAsPristine();
      this.form.updateValueAndValidity({ emitEvent: false });
    // this.form.patchValue(values); // cargar los datos en el formulario
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


  // this.router.navigate(['/dashboard/todos']);
  emitirValoresForm(){
    let capture = this.form.getRawValue() ; // caputar los datos del formulario, con los tipo estrictamente definididos

    console.log(capture);

    const dataPerson : any = {
      ...capture,
      status: capture.status ? 1 : 0, // convertir el valor booleano a un valor numerico como lo establece en la db
    }

    // this.posteoForm.emit(dataPerson);
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
  genderNameById = new Map(this.generos.map(d => [d.id, d.name]));

  idToNameGender = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.genderNameById.get(id) ?? '';
  };

  // departament
  departaments : Departament[] = [];
  DepartamentNameById = new Map(this.departaments.map(d => [d.id, d.name]));

  idToNameDepartament = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.DepartamentNameById.get(id) ?? '';
  };


  cargarDepartamento() : void {
    this.servicesDepartament.obtenerTodos().subscribe(data =>{
      this.departaments = data;
        this.DepartamentNameById = new Map(this.departaments.map(d => [d.id, d.name]));
    });
  }

  // municipality
  municipality : Municipality[] = [];
  municipalityNameById = new Map(this.municipality.map(d => [d.id, d.name]));

  idToNameMunicipality = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.municipalityNameById.get(id) ?? '';
  };

  cargarMunicipio() : void {
    if(this.model){
      this.servicesMuncipality.MunicipiosDepart(this.model.dataBasic.departamentId).subscribe({
        next: (data)=> {

          this.municipality = data; 
          // console.log(this.municipality)
        },
        error: (err)=>{
          console.log(err)
        }
      });
    }

    this.form.controls.departamentId.valueChanges.subscribe(val => {
      this.servicesMuncipality.MunicipiosDepart(val).subscribe(data =>{
        this.municipality = data;
        // console.log(this.municipality)
          this.municipalityNameById = new Map(this.municipality.map(d => [d.id, d.name]));
      });
    });    
  }

  rhList : Rh[] = [];
  rhNameById = new Map(this.rhList.map(d => [d.id, d.name]));

  idToNameRh = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.rhNameById.get(id) ?? '';
  };

  cargarRh() : void {
    this.servicesRh.obtenerTodos().subscribe(data =>{
      this.rhList = data;
        this.rhNameById = new Map(this.rhList.map(d => [d.id, d.name]));
    });  
  }

  statusCivil : StatusCivil[] = [];
  statusCivilNameById = new Map(this.statusCivil.map(d => [d.id, d.name]));

  idToNameStatus = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.statusCivilNameById.get(id) ?? '';
  };

  cargarStatus() : void {
    this.servicesStatus.obtenerTodos().subscribe(data =>{
      this.statusCivil = data;
        this.statusCivilNameById = new Map(this.statusCivil.map(d => [d.id, d.name]));
    });  
  }

  epsList : Eps[] = [];
  epsNameById = new Map(this.epsList.map(d => [d.id, d.name]));

  idToNameEps = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.epsNameById.get(id) ?? '';
  };

  cargarEps() : void {
    this.servicesEps.obtenerTodos().subscribe(data =>{
      this.epsList = data;
        this.epsNameById = new Map(this.epsList.map(d => [d.id, d.name]));
    });  
  }
}
