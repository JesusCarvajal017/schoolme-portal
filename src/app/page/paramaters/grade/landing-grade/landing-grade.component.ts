import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

// taiga-ui
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButtonGroup  } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiButton, TuiDialog, TuiHint } from '@taiga-ui/core';
import {MatTooltipModule} from '@angular/material/tooltip';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { GradeService } from '../../../../service/parameters/grade.service';
import { Grade, CreateModelGrade } from '../../../../models/parameters/grade.model'; // Agregar CreateModelRol
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormGradeComponent } from '../../../forms/form-grade/form-grade.component';
import { CreateModelGroups, Groups } from '../../../../models/parameters/groups.model';
import { Student, UpdateGrupStudent } from '../../../../models/parameters/student.model';
import { TutionCreateModel, TutionQuery } from '../../../../models/business/tutition.model';
import { StudentService } from '../../../../service/parameters/student.service';
import { TutionService } from '../../../../service/business/tution.service';
import { GroupsService } from '../../../../service/parameters/groups.service';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";

@Component({
  standalone: true,
  selector: 'app-landing-grade',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TuiTitle,
    MatSidenavModule,
    MatCardModule,
    TuiHeader,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    SweetAlert2Module,
    TuiDialog,
    TuiHint,
    ListadoGenericoComponent,
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    MatTooltipModule
],
  templateUrl: './landing-grade.component.html',
  styleUrl: './landing-grade.component.css',
})
export class LandingGradeTutuionComponent implements OnInit {

  // Atributos importantes de modulo
  groups: Groups[] = [];
  filteredUsers: Groups[] = [];
  idicadorActive : number = 1;

  grades : Grade[] = [];
  students: Student[] = [];
  tutions : TutionQuery[] = [];

  studentsNotTution : Student[] = [];

  idicadorProceso : boolean = true;
  iFormProces: boolean = true;
  ninoSelect!: string; 
  studentId !: number;
  idGradeTemp!: number;



  // titulo de los modales, segun la acción a relizar del crud
  titleGroups!: string;

  // NUEVAS PROPIEDADES PARA EL MODAL
  modelGroups?: Groups; // Para editar un rol existente
  isEditMode: boolean = false; // Indica si estamos editando o creando
  
  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO ACTUALIZADO para manejar creación y edición
  protected modalCommand(nameStudent: string, idnino: number): void { 
    this.iFormProces = true;
    this.open = true;
    this.ninoSelect = nameStudent;
    this.studentId = idnino;

  }
  
  private readonly formBuilder = inject(FormBuilder);

  formTution = this.formBuilder.nonNullable.group({
    gradeId:  new FormControl<number | null>(null, { validators: [Validators.required] })
  })

  formGrupos = this.formBuilder.nonNullable.group({
    groupId:  new FormControl<number | null>(null, { validators: [Validators.required] })
  })

  notMatriculate(){
    this.idicadorProceso = true;
    this.serviceStudents.NoMatriculados().subscribe({
      next: (data) =>{
        // carga data para lista los estudiantes especificos que no tienne matricula
        this.studentsNotTution = data; 
      },
      error: () => console.warn("No fue posible recuperar la data de los estudiantes no matriculados")
    })
  }

  // NUEVO MÉTODO para cerrar modal y limpiar datos
  closeModal(): void {
    this.open = false;
    this.modelGroups = undefined;
    this.isEditMode = false;
    this.studentId = 0;
  }
  //  ======================= end =======================

  // servicio de alerta de taiga
  private readonly alerts = inject(TuiAlertService);
  private readonly serviceGrade = inject(GradeService);
  private readonly servicesGroup = inject(GroupsService);
  private readonly serviceStudents = inject(StudentService);
  private readonly serviceTutition = inject(TutionService);

  // búsqueda
  searchTerm: string = '';

  // paginación
  currentPage: number = 1;
  pageSize: number = 5; // 5 por página
  totalPages: number = 1;

  ngOnInit(): void {
    this.cargarGrades();
    this.notMatriculate();
  }

  // notificación de estado
  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Se a cambiado el estado!' }).subscribe();
  }


  // búsqueda
  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  // aplicar búsqueda + paginación
  applyFilters() {
    let filtered = this.groups;

    if (this.searchTerm.trim() !== '') {
      filtered = this.groups.filter((r) =>
        `${r.name}
         ${r.amountStudents}
         ${r.gradeName}
         ${r.gradeId}`

          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

    // corregir página actual si es mayor al total
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  // obtener roles de la página actual
  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // cambiar de página
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // eliminar rol
  deleteRegister(id: number) {
    this.serviceTutition.eliminar(id).subscribe(() => {
      this.listTutions(this.idGradeTemp);
      Swal.fire('Exitoso', 'Matricula borrada exitosamente', 'success');
    });
  }

  cargarGrades(){
    this.serviceGrade.obtenerTodos(1).subscribe({
      next: (data) =>{
        this.grades = data;
      }
    })
  }

  cargarGrupos(){
    this.servicesGroup.grupGrade(this.idGradeTemp).subscribe({
      next: (data) =>{
        console.log(data)
        this.groups = data;
      }
    });
  }

  studentNoTution(){
    this.serviceStudents.NoMatriculados().subscribe({
      next: (data) =>{
        this.students = data;
      }
    })
  }


  matricular(){
    let dataForm = this.formTution.getRawValue();

    let data : TutionCreateModel = {
      studentId: this.studentId,
      status: 1, 
      gradeId: dataForm.gradeId ?? 0
    }

    this.serviceTutition.crear(data).subscribe({
      next: () =>{
        this.closeModal();
        this.notMatriculate();
        Swal.fire('Exitoso', 'Matricula exitosa', 'success');
      }
    });
  }


  listTutions(gradeId : number){
    this.idicadorProceso = false;

    this.idGradeTemp = gradeId;

    this.serviceTutition.tutionGrade(gradeId).subscribe({
      next: (data) => {
        this.tutions = data;
      }
    })
  }

  tutionIdtemp!:number;

  agrupar(idS : number, idT: number){
    this.tutionIdtemp= idT;
    this.cargarGrupos();
    this.iFormProces = false;
    this.studentId = idS;
    this.open = true;
  }


  AsiganarGrupo(){
    let dataForm = this.formGrupos.getRawValue();

    let data : UpdateGrupStudent = {
      id: this.studentId,
      groupId: dataForm.groupId ?? 0
    }


    this.serviceStudents.UpdateGrup(data).subscribe({
      next: ()=>{
        this.serviceTutition.eliminarLogico(this.tutionIdtemp,5).subscribe({
          next: () => {
            this.closeModal();
            this.listTutions(this.idGradeTemp);
            Swal.fire('Exitoso', 'Agrupacion exitosa', 'success');
          }  
        })
      }
    })

  }
  
}