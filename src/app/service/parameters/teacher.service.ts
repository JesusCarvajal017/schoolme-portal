import { inject, Injectable } from '@angular/core';

import { GenericService } from '../api/generic.service';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { Observable } from 'rxjs';
import { CreateModelTeacher, Teacher } from '../../models/parameters/teacher.model';


@Injectable({
  providedIn: 'root'
})

export class TeacherService extends GenericService<Teacher, CreateModelTeacher, ModelLogicalDelete> {
  constructor() { 
    super('Teacher')
  }


  override obtenerTodos(status: number = 1): Observable<Teacher[]> {
       return this.http.get<Teacher[]>(`${this.urlBase}?status=${status}`);
  }


}
export type { Teacher };

