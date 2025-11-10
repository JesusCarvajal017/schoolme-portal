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
import { AttendantsService } from '../../../../service/parameters/attendants.service';
import { Attendants, CreateModelAttendants } from '../../../../models/parameters/attendants.model'; // Agregar CreateModelRol
import { FormControl, FormGroup } from '@angular/forms';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
// import { FormStudentComponent } from "../../forms/form-groups/form-groups.component";
// import { FormGroupsComponent } from '../../forms/form-groups/form-groups.component';

@Component({
  standalone: true,
  selector: 'app-landing-attendants',
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
    TuiInputModule,
    ListadoGenericoComponent
],
  templateUrl: './landing-attendants.component.html',
  styleUrl: './landing-attendants.component.css',
})
export class LandingAttendantsComponent implements OnInit {

  // Atributos importantes de modulo
  attendants: Attendants[] = [];
  filteredAttendants: Attendants[] = [];
  idicadorActive : number = 1;

  // titulo de los modales, segun la acción a relizar del crud
  titleAttendants!: string;

  // NUEVAS PROPIEDADES PARA EL MODAL
  modelAttendants?: Attendants; // Para editar un rol existente
  isEditMode: boolean = false; // Indica si estamos editando o creando
  
  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  // MÉTODO ACTUALIZADO para manejar creación y edición
  protected modalCommand(title: string, attendants?: Attendants): void { 
      this.titleAttendants = title;
      this.isEditMode = !!attendants; // true si rol existe, false si es undefined
      this.modelAttendants = attendants; // undefined para crear, objeto Rol para editar
      this.open = true;
  }

  // NUEVO MÉTODO para manejar el submit del formulario
  handleAttendantsSubmit(data: CreateModelAttendants): void {
    if (this.isEditMode && this.modelAttendants) {
      // Actualizar rol existente
      const updateData: CreateModelAttendants = {
        ...data,
        id: this.modelAttendants.id
      };
      
      this.serviceAttendants.actualizar(updateData).subscribe({
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
      this.serviceAttendants.crear(data).subscribe({
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
    this.modelAttendants = undefined;
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

  constructor(private serviceAttendants: AttendantsService, private router: Router) {
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
    this.serviceAttendants.obtenerTodos(status).subscribe((data) => {
      this.attendants = data;
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
    let filtered = this.attendants;

    if (this.searchTerm.trim() !== '') {
      filtered = this.attendants.filter((r) =>
        `${r.nameAttendant}
         ${r.identification}`

          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredAttendants = filtered;
    this.totalPages = Math.ceil(this.filteredAttendants.length / this.pageSize);

    // corregir página actual si es mayor al total
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  // obtener roles de la página actual
  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredAttendants.slice(start, start + this.pageSize);
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


    this.serviceAttendants.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  // eliminar rol
  deleteRegister(id: number) {
    this.serviceAttendants.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }
}