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
import {TuiInputModule} from '@taiga-ui/legacy';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { AcademicLoadService } from '../../../../service/business/academic-load.service';
import { AcademicLoad, CreateModelAcademicLoad } from '../../../../models/business/academic-load.model'; // Agregar CreateModelRol
import { FormControl, FormGroup } from '@angular/forms';
import { FormAcademicLoadComponent } from "../../../forms/form-academic-load/form-academic-load.component";
// import { FormRolFormPermissionComponent } from "../../forms/form-module/form-module.component";

@Component({
  standalone: true,
  selector: 'app-landing-academic-load',
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
    // RouterLink,
    SweetAlert2Module,
    // TuiButton,
    TuiHint,
    TuiInputModule
],
  templateUrl: './landing-academic-load.component.html',
  styleUrl: './landing-academic-load.component.css',
})
export class LandingAcademicLoadComponent implements OnInit {

  // Atributos importantes de modulo
  moduleAcademicLoad: AcademicLoad[] = [];
  filteredUsers: AcademicLoad[] = [];
  idicadorActive : number = 1;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  // NUEVAS PROPIEDADES PARA EL MODAL
  modelAcademicLoad?: AcademicLoad; // Para editar un rol existente
  isEditMode: boolean = false; // Indica si estamos editando o creando
  
  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO ACTUALIZADO para manejar creación y edición
  protected modalCommand(title: string, moduleAcademicLoad?: AcademicLoad): void { 
      this.titleForm = title;
      this.isEditMode = !!moduleAcademicLoad; // true si rol existe, false si es undefined
      this.modelAcademicLoad = moduleAcademicLoad; // undefined para crear, objeto Rol para editar
      this.open = true;
  }

  // NUEVO MÉTODO para manejar el submit del formulario
  handleAcademicLoadSubmit(data: CreateModelAcademicLoad): void {
    if (this.isEditMode && this.modelAcademicLoad) {
      // Actualizar rol existente
      const updateData: CreateModelAcademicLoad = {
        ...data,
        id: this.modelAcademicLoad.id
      };
      
      this.serviceAcademicLoad.actualizar(updateData).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Rol actualizado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo actualizar el rol", "error");
          console.error(err);
        }
      });
    } else {
      // Crear nuevo rol
      this.serviceAcademicLoad.crear(data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Rol creado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo crear el rol", "error");
          console.error(err);
        }
      });
    }
  }

  // NUEVO MÉTODO para cerrar modal y limpiar datos
  closeModal(): void {
    this.open = false;
    this.modelAcademicLoad = undefined;
    this.isEditMode = false;
  }
  //  ======================= end =======================

  // servicio de alerta de taiga
  private readonly alerts = inject(TuiAlertService);

  // búsqueda
  searchTerm: string = '';

  // paginación
  currentPage: number = 1;
  pageSize: number = 5; // 5 por página
  totalPages: number = 1;

  constructor(private serviceAcademicLoad: AcademicLoadService, private router: Router) {
    this.cargarData();
  }

  ngOnInit(): void {}

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
    this.serviceAcademicLoad.obtenerTodos(status).subscribe((data) => {
      this.moduleAcademicLoad = data;
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
    let filtered = this.moduleAcademicLoad;

    if (this.searchTerm.trim() !== '') {
      filtered = this.moduleAcademicLoad.filter((r) =>
        `${r.groupName} ${r.fullName} ${r.subjectName} ${r.days}`
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

    this.serviceAcademicLoad.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  // eliminar rol
  deleteRegister(id: number) {
    this.serviceAcademicLoad.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}