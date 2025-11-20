import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Teacher } from '../../../../../models/parameters/teacher.model';


@Component({
  standalone: true,
  selector: 'app-simple-teacher-list',
  templateUrl: './simple-teacher-list.component.html',
  styleUrls: ['./simple-teacher-list.component.css'],
  imports: [CommonModule, MatIconModule],
})
export class SimpleTeacherListComponent {
  @Input() teachers: Teacher[] = [];
  @Output() teacherSelected = new EventEmitter<Teacher>();

  selectedTeacherId: number | null = null;

  onTeacherClick(teacher: Teacher) {
    this.selectedTeacherId = teacher.id;
    this.teacherSelected.emit(teacher);
  }
}
