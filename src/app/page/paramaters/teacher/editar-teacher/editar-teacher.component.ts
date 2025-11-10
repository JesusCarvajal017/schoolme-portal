import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormTeacherComponent } from '../../forms/form-teacher/form-teacher.component';
import { FormTodosComponent } from '../../forms/form-todos/form-todos.component';
import { CreateModelTeacher, Teacher } from '../../../models/parameters/teacher.model';
import { TeacherService } from '../../../service/parameters/teacher.service';
import { PersonService } from '../../../service/person.service';
import { CreateModelPerson, PersonComplete } from '../../../models/security/person.model';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editar-teacher',
  imports: [
    CommonModule,
    // FormTeacherComponent,
    FormTodosComponent,
    MatTabsModule
  ],
  templateUrl: './editar-teacher.component.html',
  styleUrl: './editar-teacher.component.css'
})
export class EditarTeacherComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  modelTeacher?: Teacher;
  modelPerson?: PersonComplete;

  serviceTeacher = inject(TeacherService);
  servicePerson = inject(PersonService);
  router = inject(Router);

  title: string = '';
  titlePerson: string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    this.title = `Editar Profesor`;
    this.titlePerson = `Editar Información Personal`;
  }

  queryEntity(id: number): void {
    this.serviceTeacher.obtenerPorId(id).subscribe({
      next: (teacher) => {
        this.modelTeacher = teacher;
        
        // Cargar la información completa de la persona asociada
        if (teacher.personId) {
          this.servicePerson.ObtenerComplete(teacher.personId).subscribe({
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
        console.error('Error cargando profesor:', err);
        Swal.fire("Error", "No se pudo cargar la información del profesor", "error");
      }
    });
  }

  // Manejar submit del formulario de persona
  handlePersonSubmit(data: CreateModelPerson): void {
    if (this.modelTeacher?.personId) {
      this.servicePerson.actulizarComplete(this.modelTeacher.personId, data).subscribe({
        next: () => {
          Swal.fire("Exitoso", "Información actualizada correctamente", "success");
          this.router.navigate(['dashboard/teachers']);
        },
        error: (err) => {
          Swal.fire("Error", "No se pudo actualizar la información", "error");
          console.error(err);
        }
      });
    }
  }
}