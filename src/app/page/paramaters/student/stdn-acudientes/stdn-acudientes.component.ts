import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

// taiga-ui
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButtonGroup } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiDialog, TuiHint } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { StudentService } from '../../../../service/parameters/student.service';
import { Student, CreateModelStudent } from '../../../../models/parameters/student.model';
import { PersonService } from '../../../../service/person.service';
import { CreateModelPerson, PersonComplete } from '../../../../models/security/person.model';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { infoModal } from '../../../../models/global/info-modal.model';

import { FormTodosComponent } from "../../../forms/form-todos/form-todos.component";



@Component({
  selector: 'app-stdn-acudientes',
  imports: [
    CommonModule,
    TuiTitle,
    MatSidenavModule,
    MatCardModule,
    TuiHeader,
    TuiButtonGroup,
    TuiAppearance,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    SweetAlert2Module,
    TuiDialog,
    TuiHint,
    ListadoGenericoComponent,
    MatButtonModule, MatMenuModule,
    FormTodosComponent
  ],
  templateUrl: './stdn-acudientes.component.html',
  styleUrl: './stdn-acudientes.component.css'
})
export class StdnAcudientesComponent {
 // Modelos
  students: Student[] = [];
  filteredStudents: Student[] = [];
  modelStudent?: Student;
  
  modelPerson?: PersonComplete;
  
  idicadorActive: number = 1;
  titleStudent!: string;
  isEditMode: boolean = false;

  // Modal
  protected open = false;

  // Búsqueda y paginación
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // ====================================== Start Servicios ======================================

  private readonly alerts = inject(TuiAlertService);
  private serviceStudent = inject(StudentService);
  private servicePerson = inject(PersonService);
  private router = inject(Router);

  // ====================================== Start Servicios ======================================


  ngOnInit(): void {
    this.cargarData();
  }

  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado actualizado!' }).subscribe();
  }

  isUser = false;
  idperson!: number;
  modalInfo!: infoModal;
  action !: number;


  protected  modalCommand(action: number, id: number = 0): void { 
    if(action == 2){
      // input de correo electronico
      this.isUser= false;

      var infoM : infoModal = {
        title : "actualizacion de datos",
        titleButton : "actualizar",
        descripcion : ""
      }

      // id de la entidad de teacher 
      // esto va a retoranar la informacion de la persona 
      this.idperson = id;

      // carga del modelo de person complete
      this.queryId(id);

      // informacion del modal para el usuario
      this.modalInfo = infoM;

    }else if(action == 1){

      // limpiar la data, para evitar que aparezcan llenos los campos al registrar
      this.clearData();

      // input de correo electronico, para el caso de crear person con user
      this.isUser= false;

      var infoM : infoModal = {
        title : "Registrar datos",
        titleButton : "Registrar",
        descripcion : ""
      }
      
      // informacion del modal para el usuario
      this.modalInfo = infoM;
    }
    else{
      this.clearData();
    }

    this.open = true;
  }

 // carga el modelo de person, no de la entidad propia
  queryId(id: number) : void {

    // consulta la entidad por medio del id la entidad propia
    this.serviceStudent.ObtenerComplete(id).subscribe({
      next: (data)=>{
        // modelo de person complete es decir, person <-> databasic
        this.modelPerson = data.person;
      }
    });
  }

  clearData() : void{
    this.modelPerson =  null!;
    this.idperson = 0;
  }

  // Modal para crear o editar
  handleSubmit(data: CreateModelPerson): void {
    if(this.modelPerson){
      // id de persona
      var prId = this.modelPerson.id ?? 0;

      // actualizar
      this.servicePerson.actulizarComplete(prId,data).subscribe({
        next: () =>{
          Swal.fire("Exitoso", "Estudiante actualizado correctamente", "success");
          this.cargarData(this.idicadorActive);
          this.closeModal();
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }else{
      // registrar
      this.servicePerson.crearComplete(data).subscribe({
        next: (res) =>{
          
          // lista informacion necesaria para el registro del docente
          let student: CreateModelStudent = {
            personId: res.id ?? 0,
            status:1
          }
          
          this.serviceStudent.crear(student).subscribe({
            next:()=>{
              console.log("se creo el estudiante")
            }
          });
          
          Swal.fire("Exitoso", "Estudiante creado correctamente", "success");
          
          this.closeModal();
          this.cargarData(this.idicadorActive);
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }

  }


  closeModal(): void {
    this.open = false;
    this.modelStudent = undefined;
    this.modelPerson = undefined;
    this.isEditMode = false;
  }

  cambiarStatus(status: number): void {
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  cargarData(status: number = 1): void {
    this.serviceStudent.obtenerTodos(status).subscribe((data) => {
      this.students = data;
      // console.log(this.students);
      this.applyFilters();
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.students;

    if (this.searchTerm.trim() !== '') {
      filtered = this.students.filter((r) =>
        `${r.fullName} ${r.identification} ${r.groupName}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredStudents = filtered;
    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  logical(event: any, id: number): void {
    let value: number = event.checked ? 1 : 0;

    this.serviceStudent.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  deleteRegister(id: number): void {
    this.serviceStudent.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}
