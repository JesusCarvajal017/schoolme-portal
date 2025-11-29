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
import { GroupDirectorService } from '../../../../service/business/group-director.service';
import { GroupDirector, CreateModelGroupDirector } from '../../../../models/business/group-director.model'; // Agregar CreateModelRol
import { FormControl, FormGroup } from '@angular/forms';
import { FormGroupsComponent } from "../../../forms/form-groups/form-groups.component";
import { FormGroupDirectorComponent } from "../../../forms/form-group-director/form-group-director.component";
// import { FormGroupsComponent } from '../../forms/form-groups/form-groups.component';

@Component({
  standalone: true,
  selector: 'app-landing-group-director',
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
    FormGroupDirectorComponent
],
  templateUrl: './landing-group-director.component.html',
  styleUrl: './landing-group-director.component.css',
})
export class LandingGroupDirectorComponent implements OnInit {

  // Atributos importantes de modulo
  groupDirector: GroupDirector[] = [];
  filteredUsers: GroupDirector[] = [];
  idicadorActive : number = 1;

  // titulo de los modales, segun la acción a relizar del crud
  titleGroups!: string;

  // NUEVAS PROPIEDADES PARA EL MODAL
  modelGroupDirector?: GroupDirector; // Para editar un rol existente
  isEditMode: boolean = false; // Indica si estamos editando o creando

  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO ACTUALIZADO para manejar creación y edición
  protected modalCommand(title: string, groupDirector?: GroupDirector): void {
      this.titleGroups = title;
      this.isEditMode = !!groupDirector; // true si rol existe, false si es undefined
      this.modelGroupDirector = groupDirector; // undefined para crear, objeto Rol para editar
      this.open = true;
  }

  // NUEVO MÉTODO para manejar el submit del formulario
  handleGroupDirectorSubmit(data: CreateModelGroupDirector): void {

    if (this.isEditMode && this.modelGroupDirector) {
      // Actualizar rol existente
      const updateData: CreateModelGroupDirector = {
        ...data,
        id: this.modelGroupDirector.id
      };

      console.log("holaaa")

      this.serviceGroupDirector.actualizar(updateData).subscribe({
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
      this.serviceGroupDirector.crear(data).subscribe({
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
    this.modelGroupDirector = undefined;
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

  constructor(private serviceGroupDirector: GroupDirectorService, private router: Router) {
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
    this.serviceGroupDirector.obtenerTodos(status).subscribe((data) => {
      this.groupDirector = data;
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
    let filtered = this.groupDirector;

    if (this.searchTerm.trim() !== '') {
      filtered = this.groupDirector.filter((r) =>
        `${r.fisrtName} ${r.secondName} ${r.lastName} ${r.secondLastName} ${r.nameGroup}`

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
    // let dataSend = { status: value };

    this.serviceGroupDirector.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  // eliminar rol
  deleteRegister(id: number) {
    this.serviceGroupDirector.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}
