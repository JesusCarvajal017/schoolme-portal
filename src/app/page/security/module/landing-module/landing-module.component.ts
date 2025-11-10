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
import { ModuleService } from '../../../../service/module.service';
import { Module, CreateModelModule } from '../../../../models/security/module.model'; // Agregar CreateModelModule
import { FormModuleComponent } from "../../../forms/form-module/form-module.component"; // Agregar import

@Component({
  standalone: true,
  selector: 'app-landing-module',
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
    // TuiButton, // Agregar TuiButton de nuevo
    TuiDialog,
    TuiHint,
    TuiInputModule,
    FormModuleComponent // Agregar a imports
  ],
  templateUrl: './landing-module.component.html',
  styleUrl: './landing-module.component.css',
})
export class LandingModuleComponent implements OnInit {

  // Atributos importantes de modulo
  module: Module[] = [];
  filteredUsers: Module[] = [];
  idicadorActive : number = 1;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  // NUEVAS PROPIEDADES PARA EL MODAL
  modelModule?: Module; // Para editar un module existente
  isEditMode: boolean = false; // Indica si estamos editando o creando

  
  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO ACTUALIZADO para manejar creación y edición
  protected modalCommand(title: string, module?: Module): void { 
      this.titleForm = title;
      this.isEditMode = !!module; // true si module existe, false si es undefined
      this.modelModule = module; // undefined para crear, objeto Module para editar
      this.open = true;
  }

  // NUEVO MÉTODO para manejar el submit del formulario
  handleModuleSubmit(data: CreateModelModule): void {
    if (this.isEditMode && this.modelModule) {
      // Actualizar module existente
      const updateData: CreateModelModule = {
        ...data,
        id: this.modelModule.id
      };
      
      this.serviceModule.actualizar(updateData).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Módulo actualizado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo actualizar el módulo", "error");
          console.error(err);
        }
      });
    } else {
      // Crear nuevo module
      this.serviceModule.crear(data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Módulo creado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo crear el módulo", "error");
          console.error(err);
        }
      });
    }
  }

  // NUEVO MÉTODO para cerrar modal y limpiar datos
  closeModal(): void {
    this.open = false;
    this.modelModule = undefined;
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

  constructor(private serviceModule: ModuleService, private router: Router) {
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

  // cargar modules desde el servicio
  cargarData(status : number = 1) {
    this.serviceModule.obtenerTodos(status).subscribe((data) => {
      this.module = data;
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
    let filtered = this.module;

    if (this.searchTerm.trim() !== '') {
      filtered = this.module.filter((m) =>
        `${m.name} ${m.description}`
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

  // obtener modules de la página actual
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

  // activar/desactivar module
  logical(event: any, id: number) {
    let value: number = event.checked ? 1 : 0;


    this.serviceModule.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  // eliminar module
  deleteRegister(id: number) {
    this.serviceModule.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}