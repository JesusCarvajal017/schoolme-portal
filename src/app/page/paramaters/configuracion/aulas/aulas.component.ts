import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

// taiga-ui
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButtonGroup } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiDialog } from '@taiga-ui/core';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { GroupsService } from '../../../../service/parameters/groups.service';
import { Groups, CreateModelGroups } from '../../../../models/parameters/groups.model';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { FormGroupsComponent } from "../../../forms/form-groups/form-groups.component";
import { infoModal } from '../../../../models/global/info-modal.model';

@Component({
  standalone: true,
  selector: 'app-aulas',
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
    ListadoGenericoComponent,
    FormGroupsComponent
  ],
  templateUrl: './aulas.component.html',
  styleUrl: './aulas.component.css',
})
export class AulasComponent implements OnInit {

  // Modelos
  groups: Groups[] = [];
  filteredGroups: Groups[] = [];
  modelGroup?: Groups;
  modalInfo!: infoModal;

  indicadorActive: number = 1;
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
  private serviceGroup = inject(GroupsService);

  ngOnInit(): void {
    this.cargarData();
  }

  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado actualizado!' }).subscribe();
  }

  protected modalCommand(action: number, id: number = 0): void {
    if(action === 2) {
      // Modo edición
      this.isEditMode = true;

      this.serviceGroup.obtenerPorId(id).subscribe({
        next: (data) => {
          this.modelGroup = data;

          this.modalInfo = {
            title: "Actualización de Grupo",
            titleButton: "Actualizar",
            descripcion: ""
          };

          this.open = true;
        },
        error: (err) => {
          console.error('Error al cargar grupo:', err);
          Swal.fire("Error", "No se pudo cargar el grupo", "error");
        }
      });
    } else if(action === 1) {
      // Modo creación
      this.clearData();
      this.isEditMode = false;

      this.modalInfo = {
        title: "Registrar Grupo",
        titleButton: "Registrar",
        descripcion: ""
      };

      this.open = true;
    } else {
      this.clearData();
    }
  }

  clearData(): void {
    this.modelGroup = undefined;
  }

  handleSubmit(data: CreateModelGroups): void {
    if(this.isEditMode && this.modelGroup?.id) {
      // Actualizar
      this.serviceGroup.actualizar({ id: this.modelGroup.id, ...data }).subscribe({
        next: () => {
          this.closeModal();
          this.cargarData(this.indicadorActive);
          Swal.fire("Exitoso", "Grupo actualizado correctamente", "success");
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire("Error", "No se pudo actualizar el grupo", "error");
        }
      });
    } else {
      // Crear
      this.serviceGroup.crear(data).subscribe({
        next: () => {
          this.closeModal();
          this.cargarData(this.indicadorActive);
          Swal.fire("Exitoso", "Grupo creado correctamente", "success");
        },
        error: (err) => {
          console.error('Error al crear:', err);
          Swal.fire("Error", "No se pudo crear el grupo", "error");
        }
      });
    }
  }

  closeModal(): void {
    this.open = false;
    this.modelGroup = undefined;
    this.isEditMode = false;
  }

  cambiarStatus(status: number): void {
    this.indicadorActive = status;
    this.cargarData(this.indicadorActive);
  }

  cargarData(status: number = 1): void {
    this.serviceGroup.obtenerTodos(status).subscribe({
      next: (data) => {
        this.groups = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al cargar grupos:', err);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.groups;

    if (this.searchTerm.trim() !== '') {
      filtered = this.groups.filter((group) =>
        group.name.toLowerCase().includes(this.searchTerm) ||
        group.gradeName.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredGroups = filtered;
    this.totalPages = Math.ceil(this.filteredGroups.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedGroups() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredGroups.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  logical(event: any, id: number): void {
    let value: number = event.checked ? 1 : 0;

    this.serviceGroup.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.indicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
      error: (err) => {
        console.error('Error al cambiar estado:', err);
      }
    });
  }

  deleteRegister(id: number): void {
    this.serviceGroup.eliminar(id).subscribe({
      next: () => {
        Swal.fire('Exitoso', 'El grupo ha sido eliminado correctamente', 'success');
        this.cargarData(this.indicadorActive);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        Swal.fire('Error', 'No se pudo eliminar el grupo', 'error');
      }
    });
  }
}
