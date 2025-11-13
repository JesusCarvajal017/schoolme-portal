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

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { TeacherService } from '../../../../service/parameters/teacher.service';
import { Teacher, CreateModelTeacher } from '../../../../models/parameters/teacher.model';
import { PersonService } from '../../../../service/person.service';
import { CreateModelPerson, PersonComplete } from '../../../../models/security/person.model';
import { FormTeacherComponent } from "../../../forms/form-teacher/form-teacher.component";
import { FormTodosComponent } from "../../../forms/form-todos/form-todos.component";
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { infoModal } from '../../../../models/global/info-modal.model';
import { ThemeService } from 'ng2-charts';
import { teacherComplete } from '../../../../models/business/teacher.model';

@Component({
  standalone: true,
  selector: 'app-landing-teacher',
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
    FormTodosComponent,
    ListadoGenericoComponent
],
  templateUrl: './landing-teacher.component.html',
  styleUrl: './landing-teacher.component.css',
})
export class LandingTeacherComponent implements OnInit {
  // Modelos
  teacher: Teacher[] = [];
  filteredTeacher: Teacher[] = [];
  modelTeacher?: Teacher;

  model?: teacherComplete;

  modelUpdate !: PersonComplete;

  modalInfo!: infoModal;

  modelPerson?: PersonComplete;

  idicadorActive: number = 1;
  titleTeacher!: string;
  isEditMode: boolean = false;
  idperson!: number; 

  // Modal
  protected open = false;

  // Búsqueda y paginación
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

   // acciones a realizar 
  // 0: ninguna, 1 : crear, 2 : actualizar
  action!: number;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  isUser !: boolean;

  // Servicios
  private readonly alerts = inject(TuiAlertService);
  private serviceTeacher = inject(TeacherService);
  private servicePerson = inject(PersonService)

  ngOnInit(): void {
    // carga de informacion de la tabla
    this.cargarData();
  }

  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado actualizado!' }).subscribe();
  }

  protected  modalCommand(action: number,id: number = 0): void { 
    if(action == 2){

      // input de correo electronico
      this.isUser= false;

      var infoM : infoModal = {
        title : "actualizacion de datos",
        titleButton : "actualizar",
        descripcion : ""
      }

      // cargado model para la actualización
      this.idperson = id;
      this.queryId(id);
      this.action = 2;

      this.modalInfo = infoM;

    }else if(action == 1){
      this.clearData();


      // input de correo electronico
      this.isUser= true;

      var infoM : infoModal = {
        title : "Registrar datos",
        titleButton : "Registrar",
        descripcion : ""
      }

      this.modalInfo = infoM;

    }
    else{
      this.clearData();
    }

    this.open = true;
  }

  queryId(id: number) : void {
    this.serviceTeacher.ObtenerComplete(id).subscribe({
      next: (data)=>{
        this.modelUpdate = data.person;

        console.log("ese modelo no es");
        console.log(this.modelUpdate);
      }
    });
  }

  clearData() : void{
    this.modelUpdate =  null!;
    this.idperson = 0;
  }

  // Modal para crear o editar
  handleEpsSubmit(data: CreateModelPerson): void {

    if(this.model){
      this.model.id = this.idperson;
      // actualizar
      this.servicePerson.actulizarComplete(this.idperson,data).subscribe({
        next: () =>{
          Swal.fire("Exitoso", "docente actualizado correctamente", "success");
          this.closeModal();
          this.cargarData();
        }, 
        error: (err) => {
          console.log(err);
          // console.log(this.model)
        }
      });
      // console.log(data)
    }else{
      // registrar
      this.servicePerson.crearComplete(data,3).subscribe({
        next: (res) =>{
          
          // lista informacion necesaria para el registro del docente
          var teacher: CreateModelTeacher = {
            personId: res.id ?? 0,
            status:1
          }
          
          this.serviceTeacher.crear(teacher).subscribe({
            next:()=>{
              console.log("se creo el profesor")
            }
          });
          
          Swal.fire("Exitoso", "docente creado correctamente", "success");
          
          this.closeModal();
          this.cargarData();
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }

  }

  // Manejar submit del formulario de profesor (solo para crear)
  handleTeacherSubmit(data: CreateModelTeacher): void {
    if (!this.isEditMode) {
      // Crear nuevo profesor
      this.serviceTeacher.crear(data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Profesor creado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive);
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo crear el profesor", "error");
          console.error(err);
        }
      });
    }
  }

  // Manejar submit del formulario de persona (solo para editar)
  handlePersonSubmit(data: CreateModelPerson): void {
    if (this.isEditMode && this.modelTeacher?.personId) {
      // Actualizar información de la persona
      this.servicePerson.actulizarComplete(this.modelTeacher.personId, data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Información actualizada correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive);
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo actualizar la información", "error");
          console.error(err);
        }
      });
    }
  }

  closeModal(): void {
    this.open = false;
    this.modelTeacher = undefined;
    this.modelPerson = undefined;
    this.isEditMode = false;
  }

  cambiarStatus(status: number): void {
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  cargarData(status: number = 1): void {
    this.serviceTeacher.obtenerTodos(status).subscribe((data) => {
      this.teacher = data;
      this.applyFilters();
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.teacher;

    if (this.searchTerm.trim() !== '') {
      filtered = this.teacher.filter((r) =>
        `${r.fullName} ${r.identification}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredTeacher = filtered;
    this.totalPages = Math.ceil(this.filteredTeacher.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTeacher.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  logical(event: any, id: number): void {
    let value: number = event.checked ? 1 : 0;

    this.serviceTeacher.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  deleteRegister(id: number): void {
    this.serviceTeacher.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}