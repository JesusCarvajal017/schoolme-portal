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
import { TuiTitle, TuiAppearance, TuiAlertService, TuiDialog, TuiHint } from '@taiga-ui/core';
import {TuiInputModule} from '@taiga-ui/legacy';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { GroupsService } from '../../../../service/parameters/groups.service';
import { Groups, CreateModelGroups } from '../../../../models/parameters/groups.model'; // Agregar CreateModelRol
import { FormGroupsComponent } from "../../../forms/form-groups/form-groups.component";
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { GradeService } from '../../../../service/parameters/grade.service';
import { Grade } from '../../../../models/parameters/grade.model';
import { Student } from '../../../../models/parameters/student.model';
import { StudentService } from '../../../../service/parameters/student.service';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelect, MatOption } from "@angular/material/select";
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TutionService } from '../../../../service/business/tution.service';
import { TutionCreateModel, TutionQuery } from '../../../../models/business/tutition.model';
// import { FormGroupsComponent } from '../../forms/form-groups/form-groups.component';

@Component({
  standalone: true,
  selector: 'app-landing-groups',
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
    MatSelect,
    MatOption
],
  templateUrl: './landing-groups.component.html',
  styleUrl: './landing-groups.component.css',
})
export class LandingGroupsComponent implements OnInit {

  // Atributos importantes de modulo
  groups: Groups[] = [];
  filteredUsers: Groups[] = [];
  idicadorActive : number = 1;

  grades : Grade[] = [];
  students: Student[] = [];
  tutions : TutionQuery[] = [];

  studentsNotTution : Student[] = [];

  idicadorProceso : boolean = true;
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
    this.open = true;
    this.ninoSelect = nameStudent;
    this.studentId = idnino;

  }
  
  private readonly formBuilder = inject(FormBuilder);

  formTution = this.formBuilder.nonNullable.group({
    gradeId:  new FormControl<number | null>(null, { validators: [Validators.required] })
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



  // NUEVO MÉTODO para manejar el submit del formulario
  handleRolSubmit(data: CreateModelGroups): void {
    if (this.isEditMode && this.modelGroups) {
      // Actualizar rol existente
      const updateData: CreateModelGroups = {
        ...data,
        id: this.modelGroups.id
      };
      
      this.serviceGroups.actualizar(updateData).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Grupo actualizado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo actualizar el grupo", "error");
          console.error(err);
        }
      });
    } else {
      // Crear nuevo rol
      this.serviceGroups.crear(data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Grupo creado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo crear el grupo ", "error");
          console.error(err);
        }
      });
    }
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
  private readonly serviceStudents = inject(StudentService);
  private readonly serviceTutition = inject(TutionService);

  // búsqueda
  searchTerm: string = '';

  // paginación
  currentPage: number = 1;
  pageSize: number = 5; // 5 por página
  totalPages: number = 1;

  constructor(private serviceGroups: GroupsService, private router: Router) {
    this.cargarData();
  }

  ngOnInit(): void {
    this.cargarGrades();
    this.notMatriculate();
  }

  // notificación de estado
  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Se a cambiado el estado!' }).subscribe();
  }

  cambiarStatus(status : number){
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  // cargar roles desde el servicio
  cargarData(status : number = 1) {
    this.serviceGroups.obtenerTodos(status).subscribe((data) => {
      this.groups = data;
      this.applyFilters();
    });
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

  // activar/desactivar rol
  logical(event: any, id: number) {
    let value: number = event.checked ? 1 : 0;


    this.serviceGroups.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
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
  

}