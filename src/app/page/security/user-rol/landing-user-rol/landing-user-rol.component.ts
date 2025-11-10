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
import { TuiButtonGroup } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiButton, TuiDialog, TuiHint } from '@taiga-ui/core';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { UserRolService } from '../../../../service/user-rol.service';
import { UserRol, CreateModelUserRol } from '../../../../models/security/user-rol.model';
import { FormControl, FormGroup } from '@angular/forms';
import { FormUserRolComponent } from "../../../forms/form-user-rol/form-user-rol.component";

@Component({
  standalone: true,
  selector: 'app-landing-user-rol',
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
    FormUserRolComponent
  ],
  templateUrl: './landing-user-rol.component.html',
  styleUrl: './landing-user-rol.component.css',
})
export class LandingUserRolComponent implements OnInit {

  // Atributos importantes del módulo
  userRol: UserRol[] = [];
  filteredUsers: UserRol[] = [];
  idicadorActive: number = 1;

  // título de los modales, según la acción a realizar del crud
  titleForm!: string;

  // PROPIEDADES PARA EL MODAL
  modelUserRol?: UserRol; // Para editar un rol existente
  isEditMode: boolean = false; // Indica si estamos editando o creando
  
  // ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO para manejar creación y edición
  protected modalCommand(title: string, userRol?: UserRol): void { 
    this.titleForm = title;
    this.isEditMode = !!userRol; // true si userRol existe, false si es undefined
    this.modelUserRol = userRol ? { ...userRol } : undefined; // clonar objeto para evitar mutaciones
    this.open = true;
  }

  // MÉTODO para manejar el submit del formulario
  handleRolSubmit(data: CreateModelUserRol): void {
    if (this.isEditMode && this.modelUserRol) {
      // Actualizar asignación existente
      const updateData: CreateModelUserRol = {
        ...data,
        id: this.modelUserRol.id
      };
      
      this.serviceUserRol.actualizar(updateData).subscribe({
        next: (response) => {
          Swal.fire({
            title: "¡Exitoso!",
            text: "Asignación de rol actualizada correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          console.error('Error actualizando asignación:', err);
          Swal.fire({
            title: "Error",
            text: "No se pudo actualizar la asignación de rol",
            icon: "error",
            confirmButtonText: "Entendido"
          });
        }
      });
    } else {
      // Crear nueva asignación
      // Verificar que no exista ya esta combinación usuario-rol
      const existeAsignacion = this.userRol.some(ur => 
        ur.userId === data.userId && ur.rolId === data.rolId && ur.status === 1
      );

      if (existeAsignacion) {
        Swal.fire({
          title: "Asignación duplicada",
          text: "Este usuario ya tiene asignado este rol",
          icon: "warning",
          confirmButtonText: "Entendido"
        });
        return;
      }

      this.serviceUserRol.crear(data).subscribe({
        next: (response) => {
          Swal.fire({
            title: "¡Exitoso!",
            text: "Asignación de rol creada correctamente",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
          });
          this.closeModal();
          this.cargarData(this.idicadorActive); // Recargar la lista
        },
        error: (err) => {
          console.error('Error creando asignación:', err);
          
          // Manejar errores específicos
          let errorMessage = "No se pudo crear la asignación de rol";
          if (err.error?.message) {
            errorMessage = err.error.message;
          } else if (err.status === 409) {
            errorMessage = "Esta asignación ya existe";
          }
          
          Swal.fire({
            title: "Error",
            text: errorMessage,
            icon: "error",
            confirmButtonText: "Entendido"
          });
        }
      });
    }
  }

  // MÉTODO para cerrar modal y limpiar datos
  closeModal(): void {
    this.open = false;
    this.modelUserRol = undefined;
    this.isEditMode = false;
    this.titleForm = '';
  }
  // ======================= end =======================

  // servicio de alerta de taiga
  private readonly alerts = inject(TuiAlertService);

  // búsqueda
  searchTerm: string = '';

  // paginación
  currentPage: number = 1;
  pageSize: number = 5; // 5 por página
  totalPages: number = 1;

  constructor(private serviceUserRol: UserRolService, private router: Router) {
    this.cargarData();
  }

  ngOnInit(): void {
    // Inicialización adicional si es necesaria
  }

  // notificación de estado
  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado cambiado!' }).subscribe();
  }

  // cambiar filtro de estado (activos/inactivos)
  cambiarStatus(status: number): void {
    this.idicadorActive = status;
    this.currentPage = 1; // resetear paginación
    this.cargarData(this.idicadorActive);
  }

  // cargar asignaciones desde el servicio
  cargarData(status: number = 1): void {
    this.serviceUserRol.obtenerTodos(status).subscribe({
      next: (data) => {
        this.userRol = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        this.alerts.open('Error cargando las asignaciones', { 
          label: 'Error!' 
        }).subscribe();
      }
    });
  }

  // búsqueda
  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase().trim();
    this.currentPage = 1; // resetear paginación al buscar
    this.applyFilters();
  }

  // aplicar búsqueda + paginación
  applyFilters(): void {
    let filtered = this.userRol;

    if (this.searchTerm !== '') {
      filtered = this.userRol.filter((r) =>
        `${r.nameUser} ${r.rolName}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

    // corregir página actual si es mayor al total
    if (this.currentPage > this.totalPages && this.totalPages > 0) {
      this.currentPage = this.totalPages;
    } else if (this.totalPages === 0) {
      this.currentPage = 1;
    }
  }

  // obtener asignaciones de la página actual
  get paginatedUsers(): UserRol[] {
    if (this.filteredUsers.length === 0) {
      return [];
    }
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // cambiar de página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // activar/desactivar asignación
  logical(event: any, id: number): void {
    let value: number = event.checked ? 1 : 0;

    this.serviceUserRol.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification(`Asignación ${value === 1 ? 'activada' : 'desactivada'} correctamente`);
      },
      error: (err) => {
        console.error('Error cambiando estado:', err);
        // Revertir el toggle si hay error
        event.source.checked = !event.checked;
        this.alerts.open('Error al cambiar el estado', { 
          label: 'Error!' 
        }).subscribe();
      }
    });
  }

  // eliminar asignación
  deleteRegister(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.serviceUserRol.eliminar(id).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La asignación ha sido eliminada correctamente',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            });
            this.cargarData(this.idicadorActive);
          },
          error: (err) => {
            console.error('Error eliminando registro:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la asignación',
              icon: 'error',
              confirmButtonText: 'Entendido'
            });
          }
        });
      }
    });
  }

  // Método auxiliar para obtener el array de páginas para la paginación
  get pagesArray(): number[] {
    return Array(this.totalPages).fill(0).map((_, i) => i + 1);
  }

  // Método auxiliar para Math.min en el template
  mathMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  // Métodos para obtener conteos de estados
  get activosCount(): number {
    return this.userRol.filter(u => u.status === 1).length;
  }

  get inactivosCount(): number {
    return this.userRol.filter(u => u.status === 0).length;
  }
}