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
import { PermissionService } from '../../../../service/permission.service';
import { Permission, CreateModelPermission } from '../../../../models/security/permission.model'; // Agregar CreateModelPermission
import { FormControl, FormGroup } from '@angular/forms';
import { FormPermissionComponent } from "../../../forms/form-permission/form-permission.component"; // Agregar import

@Component({
  standalone: true,
  selector: 'app-landing-permission',
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
    TuiDialog,
    TuiHint,
    TuiInputModule,
    FormPermissionComponent // Agregar a imports
  ],
  templateUrl: './landing-permission.component.html',
  styleUrl: './landing-permission.component.css',
})
export class LandingPermissionComponent implements OnInit {

  // Atributos importantes de modulo
  permission: Permission[] = [];
  filteredUsers: Permission[] = [];
  idicadorActive : number = 1;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  // NUEVAS PROPIEDADES PARA EL MODAL
  modelPermission?: Permission; // Para editar un permission existente
  isEditMode: boolean = false; // Indica si estamos editando o creando

  
  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO ACTUALIZADO para manejar creación y edición
  protected modalCommand(title: string, permission?: Permission): void { 
      this.titleForm = title;
      this.isEditMode = !!permission; // true si permission existe, false si es undefined
      this.modelPermission = permission; // undefined para crear, objeto Permission para editar
      this.open = true;
  }

  // NUEVO MÉTODO para manejar el submit del formulario
  handlePermissionSubmit(data: CreateModelPermission): void {
    if (this.isEditMode && this.modelPermission) {
      // Actualizar permission existente
      const updateData: CreateModelPermission = {
        ...data,
        id: this.modelPermission.id
      };
      
      this.servicePermission.actualizar(updateData).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Permiso actualizado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo actualizar el permiso", "error");
          console.error(err);
        }
      });
    } else {
      // Crear nuevo permission
      this.servicePermission.crear(data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Permiso creado correctamente", "success");
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo crear el permiso", "error");
          console.error(err);
        }
      });
    }
  }

  // NUEVO MÉTODO para cerrar modal y limpiar datos
  closeModal(): void {
    this.open = false;
    this.modelPermission = undefined;
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

  constructor(private servicePermission: PermissionService, private router: Router) {
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

  // cargar permissions desde el servicio
  cargarData(status : number = 1) {
    this.servicePermission.obtenerTodos(status).subscribe((data) => {
      this.permission = data;
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
    let filtered = this.permission;

    if (this.searchTerm.trim() !== '') {
      filtered = this.permission.filter((p) =>
        `${p.name} ${p.description}`
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

  // obtener permissions de la página actual
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

  // activar/desactivar permission
  logical(event: any, id: number) {
    let value: number = event.checked ? 1 : 0;

    this.servicePermission.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  // eliminar permission
  deleteRegister(id: number) {
    this.servicePermission.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}