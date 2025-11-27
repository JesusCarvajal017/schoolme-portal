import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';
import { horarioDay } from '../../../../models/business/academic-load.model';
import { AcademicLoadService } from '../../../../service/business/academic-load.service';
import { Teacher, TeacherService } from '../../../../service/parameters/teacher.service';

interface Curso {
  nombre: string;
  horaInicio: string;
  horaFin: string;
  numeroEstudiantes: number;
  aula: string;
}


@Component({
  selector: 'app-horario-docente-futurista',
  imports: [CommonModule, NgForOf],
  templateUrl: './horario-docente.component.html',
  styleUrl: './horario-docente.component.css'
})
export class HorarioDocenteComponent implements OnInit{

  private servicesLoad = inject(AcademicLoadService);
  private servicesTeacher = inject(TeacherService);

  teacher!: Teacher;
  
  ngOnInit(): void {
    this.informacionDocente();
  }

 dias: { [key: string]: number } = {
  lunes: 1,
  martes: 2,
  miercoles: 4,
  jueves: 8,
  viernes: 16,
  sabado: 32,
  domingo: 64
};

  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes'];
  diaSeleccionadoR: number | null = null;
  diaSeleccionado: string | null = null;

  // Datos mockeados con aula agregada para detalles en calendario
  horario: { [key: string]: Curso[] } = {
    'Lunes': [
      { nombre: 'Matemáticas Avanzadas', horaInicio: '08:00', horaFin: '10:00', numeroEstudiantes: 25, aula: 'Aula 101' },
      { nombre: 'Física Cuántica', horaInicio: '10:30', horaFin: '12:30', numeroEstudiantes: 20, aula: 'Laboratorio 2' },
      { nombre: 'Programación Web', horaInicio: '09:00', horaFin: '11:00', numeroEstudiantes: 30, aula: 'Aula 203' },
      { nombre: 'Bases de Datos', horaInicio: '11:30', horaFin: '13:30', numeroEstudiantes: 28, aula: 'Aula 105' },
      { nombre: 'Programación Web', horaInicio: '09:00', horaFin: '11:00', numeroEstudiantes: 30, aula: 'Aula 203' },
      { nombre: 'Bases de Datos', horaInicio: '11:30', horaFin: '13:30', numeroEstudiantes: 28, aula: 'Aula 105' },
      { nombre: 'Programación Web', horaInicio: '09:00', horaFin: '11:00', numeroEstudiantes: 30, aula: 'Aula 203' },
      { nombre: 'Bases de Datos', horaInicio: '11:30', horaFin: '13:30', numeroEstudiantes: 28, aula: 'Aula 105' }
    ],
    'Martes': [
      { nombre: 'Programación Web', horaInicio: '09:00', horaFin: '11:00', numeroEstudiantes: 30, aula: 'Aula 203' },
      { nombre: 'Bases de Datos', horaInicio: '11:30', horaFin: '13:30', numeroEstudiantes: 28, aula: 'Aula 105' }
    ],
    'Miércoles': [
      { nombre: 'Inteligencia Artificial', horaInicio: '08:00', horaFin: '10:00', numeroEstudiantes: 22, aula: 'Laboratorio IA' },
      { nombre: 'Redes Neuronales', horaInicio: '10:30', horaFin: '12:30', numeroEstudiantes: 18, aula: 'Aula 301' }
    ],
    'Jueves': [
      { nombre: 'Ciberseguridad', horaInicio: '09:00', horaFin: '11:00', numeroEstudiantes: 26, aula: 'Aula Segura' },
      { nombre: 'Ética en Tecnología', horaInicio: '11:30', horaFin: '13:30', numeroEstudiantes: 24, aula: 'Aula 102' }
    ],
    'Viernes': [
      { nombre: 'Desarrollo Móvil', horaInicio: '08:00', horaFin: '10:00', numeroEstudiantes: 27, aula: 'Laboratorio Móvil' },
      { nombre: 'Proyecto Final', horaInicio: '10:30', horaFin: '12:30', numeroEstudiantes: 15, aula: 'Aula Proyecto' }
    ]
  };

  // carga informacion del docente
  informacionDocente(){
     const id  = parseInt(localStorage.getItem('current-user') ?? "");
    this.servicesTeacher.obtenerPorId(id).subscribe({
      next: (data) =>{
        this.teacher = data;
      } 
    })
  }

  infoDiaHorario : horarioDay[] = [];

  cargarDiaHorario(dayValue: number){
   
  }


  seleccionarDia(dia: keyof typeof this.dias) {

  

    console.log(this.diaSeleccionado);

    this.diaSeleccionadoR = this.dias[dia];

      this.diaSeleccionado =  Object.keys(this.dias)
                  .find(key => this.dias[key] === this.diaSeleccionadoR) ?? "";

    console.log(this.diaSeleccionadoR);
    this.servicesLoad.horario(this.teacher.id, this.diaSeleccionadoR).subscribe({
      next :(data) => {
        this.infoDiaHorario = data;
      }
    });
  }

  get cursosDiaSeleccionado(): Curso[] {
    return this.diaSeleccionado ? this.horario[this.diaSeleccionado] || [] : [];
  }

}
