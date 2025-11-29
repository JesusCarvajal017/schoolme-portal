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
import { AgendaDayModel, AgendaDayStudentHeader } from '../../../../../models/business/agenda.model';
import { GroupDirectorQuery } from '../../../../../models/business/group-director.model';
import { AgedaDayStudentService } from '../../../../../service/business/agendaDayStudent.service';
import { AgedaDayService } from '../../../../../service/business/agendaDay.service';
import Swal from 'sweetalert2';
import { AgendaGlobalFormComponent } from '../../../../forms/config/agenda-global-form/agenda-global-form.component';

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
  private servicesAgendaDay = inject(AgedaDayService);

  listStudents: AgendaDayStudentHeader[] = [];


  students: Estudiante[] = [];
  filteredStudents: AgendaDayStudentHeader[] = [];
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
    this.servicesAgendaStudent.ByAgendaDayStudents(this.dataCurso.agendaDayId ?? 0).subscribe({
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
        `${r.fullName} ${r.document}`
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

  studentIndividual: AgendaDayStudentHeader | null = null;
  agendaGlobalBandera: boolean = false;

  abrirAgenda(estudiante?: AgendaDayStudentHeader): void {
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

  cerrarAgendaGrupo(): void {
    const id = this.dataCurso.agendaDayId ?? 0;

    if (!id) {
      console.error("No hay agendaDayId");
      return;
    }

    Swal.fire({
      title: "¿Cerrar agenda del grupo?",
      text: "Una vez cerrada no podrás modificar los registros.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33"
    }).then((result) => {
      if (result.isConfirmed) {
        
        this.servicesAgendaDay.closeAgenda(id).subscribe({
          next: () => {
            Swal.fire({
              title: "Agenda cerrada",
              text: "La agenda del grupo se cerró exitosamente.",
              icon: "success",
              confirmButtonText: "Aceptar"
            }).then(() => {
              this.route.navigate(["/dashboard/dashagenda"]);
            });
          },
          error: (err) => {
            console.error("Error cerrando agenda", err);
            Swal.fire(
              "Error",
              "Ocurrió un error al cerrar la agenda.",
              "error"
            );
          }
        });

      }
    });
  }

  volverGrupos(){
    this.route.navigate(["/dashboard/dashagenda"]);
  }

  cerrarAgenda(): void {
    this.studentIndividual = null;
    this.agendaGlobalBandera = false;
  }

}
