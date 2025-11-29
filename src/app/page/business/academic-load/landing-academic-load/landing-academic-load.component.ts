import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';

// Taiga UI
import { TuiHeader } from '@taiga-ui/layout';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiHint } from '@taiga-ui/core';
import { TuiAccordion } from '@taiga-ui/kit';
import { TuiInputModule } from '@taiga-ui/legacy';

// SweetAlert
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// Servicios / modelos
import { AcademicLoadService } from '../../../../service/business/academic-load.service';
import { AcademicLoad, CreateModelAcademicLoad } from '../../../../models/business/academic-load.model';
import { TeacherService } from '../../../../service/parameters/teacher.service';
import { Teacher } from '../../../../models/parameters/teacher.model';
import { GroupsService } from '../../../../service/parameters/groups.service';
import { Groups } from '../../../../models/parameters/groups.model';
import { SubjectService } from '../../../../service/parameters/subject.service';
import { Subject } from '../../../../models/parameters/subject.model';
import { SimpleTeacherListComponent } from './simple-teacher-list/simple-teacher-list.component';


@Component({
  standalone: true,
  selector: 'app-landing-academic-load',
  templateUrl: './landing-academic-load.component.html',
  styleUrls: ['./landing-academic-load.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // Taiga
    TuiHeader,
    TuiTitle,
    TuiHint,
    TuiAccordion,
    TuiInputModule,

    // Material
    MatSidenavModule,
    MatCardModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,

    SweetAlert2Module,
    SimpleTeacherListComponent,
  ],
})
export class LandingAcademicLoadComponent implements OnInit {

  // servicios
  private teacherService = inject(TeacherService);
  private groupsService = inject(GroupsService);
  private subjectService = inject(SubjectService);
  private academicLoadService = inject(AcademicLoadService);
  private alerts = inject(TuiAlertService);

  // datos
  moduleAcademicLoad: AcademicLoad[] = [];
  teachers: Teacher[] = [];
  groups: Groups[] = [];
  subjects: Subject[] = [];

  academicLoadByDay: { [day: string]: AcademicLoad[] } = {};
  expandedDays: { [day: string]: boolean } = {};

  selectedTeacher: Teacher | null = null;

  academicLoadForm: FormGroup;

  daysOfWeek = [
    { name: 'Lunes', value: 1 },
    { name: 'Martes', value: 2 },
    { name: 'Miércoles', value: 4 },
    { name: 'Jueves', value: 8 },
    { name: 'Viernes', value: 16 },
    { name: 'Sábado', value: 32 },
    { name: 'Domingo', value: 64 },
  ];

  daysOfWeekStrings = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  constructor(private fb: FormBuilder, private router: Router) {
    this.academicLoadForm = this.fb.group({
      teacherId: [0],
      subjectId: [0, Validators.required],
      groupId: [0, Validators.required],
      days: [0, Validators.min(1)],
    });

    // Inicializar todos los días como contraídos
    this.daysOfWeekStrings.forEach(day => {
      this.expandedDays[day] = false;
    });
  }

  ngOnInit(): void {
    console.log('ngOnInit: Iniciando carga de datos');
    this.loadAcademicLoad();
    this.loadTeachers();
    this.loadGroups();
    this.loadSubjects();
  }

  loadAcademicLoad() {
    console.log('loadAcademicLoad: Llamando a servicio');
    this.academicLoadService.obtenerTodos().subscribe({
      next: (data) => {
        console.log('loadAcademicLoad: Datos recibidos', data);
        this.moduleAcademicLoad = data;
        this.groupByDay();
      },
      error: (err) => {
        console.error('loadAcademicLoad: Error al cargar', err);
      }
    });
  }

  loadTeachers() {
    this.teacherService.obtenerTodos().subscribe((data) => (this.teachers = data));
  }

  loadGroups() {
    this.groupsService.obtenerTodos().subscribe((data) => (this.groups = data));
  }

  loadSubjects() {
    this.subjectService.obtenerTodos().subscribe((data) => (this.subjects = data));
  }

  groupByDay() {
    console.log('groupByDay: Iniciando agrupación', this.moduleAcademicLoad);
    this.academicLoadByDay = {};
    this.moduleAcademicLoad.forEach((load) => {
      console.log('groupByDay: Procesando load', load, 'days:', load.days);
      load.days.forEach((day) => {
        if (!this.academicLoadByDay[day]) {
          this.academicLoadByDay[day] = [];
        }
        this.academicLoadByDay[day].push(load);
      });
    });
    console.log('groupByDay: Resultado', this.academicLoadByDay);
  }

  toggleDay(day: string) {
    this.expandedDays[day] = !this.expandedDays[day];
  }

  onTeacherSelected(teacher: Teacher) {
    this.selectedTeacher = teacher;
    this.academicLoadForm.patchValue({
      teacherId: teacher.id,
      subjectId: 0,
      groupId: 0,
      days: 0
    });
  }

  getTeacherLoads(teacherId: number): AcademicLoad[] {
    return this.moduleAcademicLoad.filter((l) => l.teacherId === teacherId);
  }

  getTeacherSchedule(teacherId: number): string[] {
    const loads = this.moduleAcademicLoad.filter((l) => l.teacherId === teacherId);
    return [...new Set(loads.flatMap((l) => l.days))];
  }

  getTeacherSubjects(teacherId: number): string[] {
    return [
      ...new Set(
        this.moduleAcademicLoad
          .filter((l) => l.teacherId === teacherId)
          .map((l) => l.subjectName)
      ),
    ];
  }

  getTeacherGroups(teacherId: number): string[] {
    return [
      ...new Set(
        this.moduleAcademicLoad
          .filter((l) => l.teacherId === teacherId)
          .map((l) => l.groupName)
      ),
    ];
  }

  onDayChange(day: any, checked: boolean) {
    let current = this.academicLoadForm.value.days || 0;
    current = checked ? current | day.value : current & ~day.value;
    this.academicLoadForm.patchValue({ days: current });
  }

  isDaySelected(value: number): boolean {
    return (this.academicLoadForm.value.days & value) !== 0;
  }

  submitAcademicLoad() {
    console.log('submitAcademicLoad: Form value', this.academicLoadForm.value);
    if (!this.academicLoadForm.valid) {
      console.log('submitAcademicLoad: Form inválido');
      Swal.fire('Atención', 'Por favor complete todos los campos y seleccione al menos un día', 'warning');
      return;
    }

    const f = this.academicLoadForm.value;

    const payload: CreateModelAcademicLoad = {
      id: 0,
      status: 1,
      teacherId: f.teacherId,
      subjectId: f.subjectId,
      groupId: f.groupId,
      days: f.days,
    };

    console.log('submitAcademicLoad: Payload', payload);

    this.academicLoadService.crear(payload).subscribe({
      next: () => {
        console.log('submitAcademicLoad: Creación exitosa');
        Swal.fire({
          title: '¡Exitoso!',
          text: 'Carga académica asignada correctamente',
          icon: 'success',
          confirmButtonColor: '#667eea'
        });
        this.loadAcademicLoad();
        this.academicLoadForm.patchValue({
          subjectId: 0,
          groupId: 0,
          days: 0
        });
      },
      error: (err) => {
        console.error('submitAcademicLoad: Error al crear', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo asignar la carga académica',
          icon: 'error',
          confirmButtonColor: '#667eea'
        });
      },
    });
  }

  deleteAcademicLoad(loadId: number) {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Esta acción eliminará la carga académica del docente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#f56565',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.academicLoadService.eliminar(loadId).subscribe({
          next: () => {
            Swal.fire({
              title: '¡Eliminado!',
              text: 'La carga académica ha sido eliminada',
              icon: 'success',
              confirmButtonColor: '#667eea'
            });
            this.loadAcademicLoad();
          },
          error: (err) => {
            console.error('deleteAcademicLoad: Error al eliminar', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar la carga académica',
              icon: 'error',
              confirmButtonColor: '#667eea'
            });
          }
        });
      }
    });
  }
}
