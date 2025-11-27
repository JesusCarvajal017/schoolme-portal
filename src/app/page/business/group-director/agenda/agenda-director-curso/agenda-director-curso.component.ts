import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, Output } from '@angular/core';

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
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouteConfigLoadEnd, Router } from '@angular/router';
import { Student, StudentService } from '../../../../../service/parameters/student.service';
import { group } from '@angular/animations';
import { AgendaDayModel } from '../../../../../models/business/agenda.model';
import { GroupDirectorQuery } from '../../../../../models/business/group-director.model';
import { AgendaGlobalFormComponent } from "../../../../forms/config/agenda-global-form/agenda-global-form.component";
import { AgedaDayStudentService } from '../../../../../service/business/agendaDayStudent.service';

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
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    SweetAlert2Module,
    TuiInputModule,
    ListadoGenericoComponent,
    MatTooltipModule,
    AgendaGlobalFormComponent
],
  templateUrl: './agenda-director-curso.component.html',
  styleUrl: './agenda-director-curso.component.css',
})
export class AgendaDirectorCursoComponent implements OnInit {

  dataCurso!: GroupDirectorQuery;

  private serviceStudent = inject(StudentService);
  private servicesAgendaStudent = inject(AgedaDayStudentService);

  listStudents: Student[] = [];


  students: Estudiante[] = [];
  filteredStudents: Estudiante[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  route = inject(Router);

  ngOnInit(): void {

    // data de agenda day para su uso de logica
    const nav = this.route.getCurrentNavigation();
    const fromNav = nav?.extras?.state?.['curso'];
    const fromHistory = history.state['curso'];

    this.dataCurso = fromNav || fromHistory || null;


    this.cargarData();
  }

  cargarData(): void {
    this.serviceStudent.StudentGroups(this.dataCurso.groupId).subscribe({
      next: (data) =>{
        this.listStudents = data;
        // console.log(this.dataCurso)
      }
    })

    

    this.applyFilters();
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.listStudents;

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

  studentIndividual: Student | null = null;
  agendaGlobalBandera: boolean = false;

  abrirAgenda(estudiante?: Student): void {
    console.log("se supone que no es agenda individual");
    if(estudiante){
      this.studentIndividual = estudiante;
      this.agendaGlobalBandera = false;
      return;
    }else{
      this.agendaGlobalBandera = true;
      this.studentIndividual = null;
    }

    
  }

  cerrarAgenda(): void {
    this.studentIndividual = null;
    this.agendaGlobalBandera = false;
  }

  volverGrupos(){
    this.route.navigate(["/dashboard/dashagenda"]);
  }

}
