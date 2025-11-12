import { Component } from '@angular/core';
import { CommonModule, NgForOf } from '@angular/common';

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
export class HorarioDocenteFuturistaComponent {
  diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  diaSeleccionado: string | null = null;

  // Datos mockeados con aula agregada para detalles en calendario
  horario: { [key: string]: Curso[] } = {
    'Lunes': [
      { nombre: 'Matemáticas Avanzadas', horaInicio: '08:00', horaFin: '10:00', numeroEstudiantes: 25, aula: 'Aula 101' },
      { nombre: 'Física Cuántica', horaInicio: '10:30', horaFin: '12:30', numeroEstudiantes: 20, aula: 'Laboratorio 2' },
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


  seleccionarDia(dia: string) {
    this.diaSeleccionado = dia;
  }

  get cursosDiaSeleccionado(): Curso[] {
    return this.diaSeleccionado ? this.horario[this.diaSeleccionado] || [] : [];
  }

}
