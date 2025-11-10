import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormStudentComponent } from '../../../forms/form-student/form-student.component';
import { FormTodosComponent } from '../../../forms/form-todos/form-todos.component';
import { StudentService } from '../../../../service/parameters/student.service';
import { PersonService } from '../../../../service/person.service';
import { CreateModelStudent, Student } from '../../../../models/parameters/student.model';
import { CreateModelPerson, PersonComplete } from '../../../../models/security/person.model';
import { forkJoin } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-student',
  imports: [
    CommonModule,
    FormStudentComponent, 
    FormTodosComponent,  
    MatTabsModule
  ],
  templateUrl: './editar-student.component.html',
  styleUrl: './editar-student.component.css'
})
export class EditarStudentComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  modelStudent?: Student;
  modelPerson?: PersonComplete;

  serviceStudent = inject(StudentService);
  servicePerson = inject(PersonService);
  router = inject(Router);

  title: string = '';
  titlePerson: string = '';
  
  // Para controlar qué se debe actualizar
  studentDataChanged: CreateModelStudent | null = null;
  personDataChanged: CreateModelPerson | null = null;

  ngOnInit(): void {
    this.queryEntity(this.id);
    this.title = `Editar Estudiante`;
    this.titlePerson = `Editar Información Personal`;
  }

  queryEntity(id: number): void {
    this.serviceStudent.obtenerPorId(id).subscribe({
      next: (student) => {
        this.modelStudent = student;
        
        // Ahora cargar la información completa de la persona asociada
        if (student.personId) {
          this.servicePerson.ObtenerComplete(student.personId).subscribe({
            next: (person) => {
              this.modelPerson = person;
            },
            error: (err) => {
              console.error('Error cargando persona:', err);
              Swal.fire("Error", "No se pudo cargar la información de la persona", "error");
            }
          });
        }
      },
      error: (err) => {
        console.error('Error cargando estudiante:', err);
        Swal.fire("Error", "No se pudo cargar la información del estudiante", "error");
      }
    });
  }

  // Capturar cambios del formulario de estudiante
  onStudentFormChange(data: CreateModelStudent): void {
    this.studentDataChanged = {
      ...data,
      id: this.id
    };
  }

  // Capturar cambios del formulario de persona
  onPersonFormChange(data: CreateModelPerson): void {
    this.personDataChanged = data;
  }

  // Guardar todos los cambios
  saveAllChanges(): void {
    const updates: any[] = [];

    // Si hay cambios en el estudiante
    if (this.studentDataChanged) {
      const studentUpdate = this.serviceStudent.actualizar(this.studentDataChanged);
      updates.push(studentUpdate);
    }

    // Si hay cambios en la persona
    if (this.personDataChanged && this.modelStudent?.personId) {
      const personUpdate = this.servicePerson.actulizarComplete(
        this.modelStudent.personId, 
        this.personDataChanged
      );
      updates.push(personUpdate);
    }

    if (updates.length === 0) {
      Swal.fire("Aviso", "No hay cambios para guardar", "info");
      return;
    }

    // Ejecutar todas las actualizaciones en paralelo
    forkJoin(updates).subscribe({
      next: () => {
        Swal.fire("Exitoso", "Información actualizada correctamente", "success");
        this.router.navigate(['dashboard/students']);
      },
      error: (err) => {
        console.error('Error actualizando:', err);
        Swal.fire("Error", "No se pudo actualizar la información", "error");
      }
    });
  }
}