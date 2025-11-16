import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

interface Curso {
  nombre: string;
  jornada: string;
  estudiantes: number;
}

@Component({
  selector: 'app-director-cursos-dashboard',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './director-cursos-dashboard.component.html',
  styleUrl: './director-cursos-dashboard.component.css'
})
export class DirectorCursosDashboardComponent {

  private router = inject(Router);

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

}
