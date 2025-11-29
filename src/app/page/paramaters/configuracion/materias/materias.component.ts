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
import { SubjectService } from '../../../../service/parameters/subject.service';
import { Subject, CreateModelSubject } from '../../../../models/parameters/subject.model';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { FormSubjectComponent } from "../../../forms/form-subject/form-subject.component";
import { infoModal } from '../../../../models/global/info-modal.model';

@Component({
  standalone: true,
  selector: 'app-materias',
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
    FormSubjectComponent
  ],
  templateUrl: './materias.component.html',
  styleUrl: './materias.component.css',
})
export class MateriasComponent implements OnInit {

  // Modelos
  subjects: Subject[] = [];
  filteredSubjects: Subject[] = [];
  modelSubject?: Subject;
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
  private serviceSubject = inject(SubjectService);

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

      this.serviceSubject.obtenerPorId(id).subscribe({
        next: (data) => {
          this.modelSubject = data;

          this.modalInfo = {
            title: "Actualización de Materia",
            titleButton: "Actualizar",
            descripcion: ""
          };

          this.open = true;
        },
        error: (err) => {
          console.error('Error al cargar materia:', err);
          Swal.fire("Error", "No se pudo cargar la materia", "error");
        }
      });
    } else if(action === 1) {
      // Modo creación
      this.clearData();
      this.isEditMode = false;

      this.modalInfo = {
        title: "Registrar Materia",
        titleButton: "Registrar",
        descripcion: ""
      };

      this.open = true;
    } else {
      this.clearData();
    }
  }

  clearData(): void {
    this.modelSubject = undefined;
  }

  handleSubmit(data: CreateModelSubject): void {
    if(this.isEditMode && this.modelSubject?.id) {
      // Actualizar
      this.serviceSubject.actualizar({ id: this.modelSubject.id, ...data }).subscribe({
        next: () => {
          this.closeModal();
          this.cargarData(this.indicadorActive);
          Swal.fire("Exitoso", "Materia actualizada correctamente", "success");
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          Swal.fire("Error", "No se pudo actualizar la materia", "error");
        }
      });
    } else {
      // Crear
      this.serviceSubject.crear(data).subscribe({
        next: () => {
          this.closeModal();
          this.cargarData(this.indicadorActive);
          Swal.fire("Exitoso", "Materia creada correctamente", "success");
        },
        error: (err) => {
          console.error('Error al crear:', err);
          Swal.fire("Error", "No se pudo crear la materia", "error");
        }
      });
    }
  }

  closeModal(): void {
    this.open = false;
    this.modelSubject = undefined;
    this.isEditMode = false;
  }

  cambiarStatus(status: number): void {
    this.indicadorActive = status;
    this.cargarData(this.indicadorActive);
  }

  cargarData(status: number = 1): void {
    this.serviceSubject.obtenerTodos(status).subscribe({
      next: (data) => {
        this.subjects = data;
        this.applyFilters();
      },
      error: (err) => {
        console.error('Error al cargar materias:', err);
      }
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.subjects;

    if (this.searchTerm.trim() !== '') {
      filtered = this.subjects.filter((subject) =>
        subject.name.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredSubjects = filtered;
    this.totalPages = Math.ceil(this.filteredSubjects.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedSubjects() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredSubjects.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  logical(event: any, id: number): void {
    let value: number = event.checked ? 1 : 0;

    this.serviceSubject.eliminarLogico(id, value).subscribe({
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
    this.serviceSubject.eliminar(id).subscribe({
      next: () => {
        Swal.fire('Exitoso', 'La materia ha sido eliminada correctamente', 'success');
        this.cargarData(this.indicadorActive);
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        Swal.fire('Error', 'No se pudo eliminar la materia', 'error');
      }
    });
  }
}
