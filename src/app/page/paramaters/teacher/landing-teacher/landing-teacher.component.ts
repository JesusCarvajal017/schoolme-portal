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
import { TeacherService } from '../../../../service/parameters/teacher.service';
import { Teacher, CreateModelTeacher } from '../../../../models/parameters/teacher.model';
import { PersonService } from '../../../../service/person.service';
import { CreateModelPerson, PersonComplete } from '../../../../models/security/person.model';
import { FormTeacherComponent } from "../../../forms/form-teacher/form-teacher.component";
import { FormTodosComponent } from "../../../forms/form-todos/form-todos.component";
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";

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
    TuiInputModule,
    FormTeacherComponent,
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
  modelPerson?: PersonComplete;
  
  idicadorActive: number = 1;
  titleTeacher!: string;
  isEditMode: boolean = false;

  // Modal
  protected open = false;

  // Búsqueda y paginación
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  // Servicios
  private readonly alerts = inject(TuiAlertService);
  private serviceTeacher = inject(TeacherService);
  private servicePerson = inject(PersonService);
  private router = inject(Router);

  ngOnInit(): void {
    this.cargarData();
  }

  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado actualizado!' }).subscribe();
  }

  // Modal para crear o editar
  protected modalCommand(title: string, teacher?: Teacher): void {
    this.titleTeacher = title;
    this.isEditMode = !!teacher;
    this.modelTeacher = teacher;

    // Si estamos editando, cargar la información completa de la persona
    if (this.isEditMode && teacher?.personId) {
      this.servicePerson.ObtenerComplete(teacher.personId).subscribe({
        next: (person) => {
          this.modelPerson = person;
          this.open = true;
        },
        error: (err) => {
          console.error('Error cargando persona:', err);
          Swal.fire("Error", "No se pudo cargar la información de la persona", "error");
        }
      });
    } else {
      this.modelPerson = undefined;
      this.open = true;
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