import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { GroupDirectorService } from '../../../../../service/business/group-director.service';
import { Teacher, TeacherService } from '../../../../../service/parameters/teacher.service';
import { GroupDirectorQuery } from '../../../../../models/business/group-director.model';
import { MatIcon } from "@angular/material/icon";
import Swal from 'sweetalert2';
import { AgedaDayService } from '../../../../../service/business/agendaDay.service';
import { AgendaDayModel, AgendaDayStudentModel } from '../../../../../models/business/agenda.model';
import {MatTooltipModule} from '@angular/material/tooltip';
import { StudentService } from '../../../../../service/parameters/student.service';
import { AgedaDayStudentService } from '../../../../../service/business/agendaDayStudent.service';
import { forkJoin } from 'rxjs';

interface Curso {
  nombre: string;
  jornada: string;
  estudiantes: number;
}

@Component({
  selector: 'app-director-cursos-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIcon,
    MatTooltipModule
  ],
  templateUrl: './director-cursos-dashboard.component.html',
  styleUrl: './director-cursos-dashboard.component.css'
})
export class DirectorCursosDashboardComponent implements OnInit {
  private router = inject(Router);  

  teacher !: Teacher;
  listGroupDirector: GroupDirectorQuery[] = [];

  private servicesDirectorGroup = inject(GroupDirectorService);
  private servicesTeacher = inject(TeacherService);
  private servicesAgendaDay = inject(AgedaDayService);
  private servicesStundends = inject(StudentService);
  private servicesAgendaStudent = inject(AgedaDayStudentService);
  private route = inject(Router);
  
  ngOnInit(): void {
    this.informacionDocente();
  }


  groupsDirectorGroup(){
    this.servicesDirectorGroup.GroupDirector(this.teacher.id).subscribe({
      next: (data) =>{
        this.listGroupDirector = data;
      }
    })

    // console.log(this.teacher)
  }

  cursos: Curso[] = [
    { nombre: 'Grupo 5A - Primaria', jornada: 'Mañana', estudiantes: 30 },
    { nombre: 'Grupo 6B - Primaria', jornada: 'Tarde', estudiantes: 28 },
    { nombre: 'Grupo 7C - Primaria', jornada: 'Mañana', estudiantes: 32 },
    { nombre: 'Grupo 8A - Básica', jornada: 'Tarde', estudiantes: 25 },
  ];

  seleccionarCurso(curso: Curso): void {
    console.log('Curso seleccionado:', curso);
      this.router.navigate(['/dashboard/agendadirector']);
  }

   // carga informacion del docente
  informacionDocente(){
    const id  = parseInt(localStorage.getItem('current-user') ?? "");
    this.servicesTeacher.obtenerPorId(id).subscribe({
      next: (data) =>{
        this.teacher = data;
        console.log(this.teacher)
        this.groupsDirectorGroup();
      } 
    })
  }

  activarAgenda(curso: GroupDirectorQuery) {
    if(curso.agendaState == 1){

    }else if(curso.agendaState == 0 && curso.agendaId){
      Swal.fire({
          title: '¿Estás seguro?',
          text: `¿Quieres abrir la agenda de ${curso.nameGroup}?`,
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sí, continuar',
          cancelButtonText: 'No, cancelar',
          reverseButtons: true,
        }).then((result) => {
          if (result.isConfirmed) {

            let dataCreate : AgendaDayModel = {
              groupId: curso.groupId,
              agendaId: curso.agendaId ?? 0,
              date: this.getTodayLocalDate(),
              openedAt: this.toLocalISOString(),
              status: 1
            }
          
            //activacion de agenda day
            this.servicesAgendaDay.crear(dataCreate).subscribe({
              next: (agendaDayCreado) => {
                // información de agenda day id
                const agendaDayId = agendaDayCreado.id;

                // creado la agenda day student
                this.servicesStundends.StudentGroups(curso.groupId).subscribe({
                  next: (students) => {
                    const peticiones = students.map((student) => {
                      const registro: AgendaDayStudentModel = {
                        status: 1,
                        agendaDayId: agendaDayId ?? 0,
                        studentId: student.id,
                        agendaDayStudentStatus: 1,
                        completedAt: new Date().toISOString(),
                      };

                      return this.servicesAgendaStudent.crear(registro);
                    });

                    // opcional: si quieres esperar que todos terminen, usas forkJoin
                    forkJoin(peticiones).subscribe({
                      next: () => {
                        this.groupsDirectorGroup();
                        Swal.fire(
                          'Hecho!',
                          'La agenda y los registros de estudiantes se crearon correctamente.',
                          'success'
                        );
                      },
                      error: (err) => {
                        console.error('Error creando uno o más AgendaDayStudent:', err);
                        Swal.fire(
                          'Error',
                          'Ocurrió un problema al registrar algunos estudiantes.',
                          'error'
                        );
                      },
                    });
                  },
                });
              },
            });
          }
          else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Cancelado',
              'Operación cancelada por el usuario.',
              'info'
            );
          }
        });
      }
    }

  registroAgenda(curso: GroupDirectorQuery ){


    this.route.navigate([`/dashboard/agendadirector`], { state: { curso: curso } });
  }

  private getTodayLocalDate(): string {
    const today = new Date();

    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 01-12
    const day = today.getDate().toString().padStart(2, '0');          // 01-31

    return `${year}-${month}-${day}`;  // "2025-11-26"
  }

  private toLocalISOString(): string {
    const d = new Date();
    const offsetMs = d.getTimezoneOffset() * 60 * 1000;

    // Ajusta la fecha quitando el offset antes de convertir a ISO
    const local = new Date(d.getTime() - offsetMs);

    return local.toISOString().replace('.000Z', 'Z');
  }




  

}
