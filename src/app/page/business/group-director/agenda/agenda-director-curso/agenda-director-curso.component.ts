import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

// taiga-ui
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButtonGroup } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/legacy';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

// componentes
import { ListadoGenericoComponent } from "../../../../../components/listado-generico/listado-generico.component";

interface Estudiante {
  id: number;
  fullName: string;
  acronymDocument: string;
  identification: string;
  groupName: string;
  status: number;
}

@Component({
  standalone: true,
  selector: 'app-agenda-director-curso',
  imports: [
    CommonModule,
    TuiTitle,
    MatCardModule,
    TuiHeader,
    TuiButtonGroup,
    TuiAppearance,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    SweetAlert2Module,
    TuiInputModule,
    ListadoGenericoComponent
  ],
  templateUrl: './agenda-director-curso.component.html',
  styleUrl: './agenda-director-curso.component.css',
})
export class AgendaDirectorCursoComponent implements OnInit {

  students: Estudiante[] = [];
  filteredStudents: Estudiante[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  estudianteSeleccionado: Estudiante | null = null;

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData(): void {
    // Datos de ejemplo
    this.students = [
      { id: 1, fullName: 'Juan Pérez', acronymDocument: 'CC', identification: '12345678', groupName: 'Grupo 5A', status: 1 },
      { id: 2, fullName: 'María García', acronymDocument: 'TI', identification: '87654321', groupName: 'Grupo 5A', status: 1 },
      { id: 3, fullName: 'Pedro López', acronymDocument: 'CC', identification: '11223344', groupName: 'Grupo 5A', status: 0 },
      { id: 4, fullName: 'Ana Rodríguez', acronymDocument: 'TI', identification: '44332211', groupName: 'Grupo 5A', status: 1 },
      { id: 5, fullName: 'Carlos Sánchez', acronymDocument: 'CC', identification: '55667788', groupName: 'Grupo 5A', status: 1 },
    ];
    this.applyFilters();
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.students;

    if (this.searchTerm.trim() !== '') {
      filtered = filtered.filter((r) =>
        `${r.fullName} ${r.identification} ${r.groupName}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredStudents = filtered;
    this.totalPages = Math.ceil(this.filteredStudents.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredStudents.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  abrirAgenda(estudiante: Estudiante): void {
    this.estudianteSeleccionado = estudiante;
  }

  cerrarAgenda(): void {
    this.estudianteSeleccionado = null;
  }
}
