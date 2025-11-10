
import { inject, Injectable } from '@angular/core';

import { GenericService } from '../api/generic.service';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { CreateModelStudent, Student } from '../../models/parameters/student.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StudentService extends GenericService<Student, CreateModelStudent, ModelLogicalDelete> {
  constructor() { 
    super('Student');
  }
 override obtenerTodos(status: number = 1): Observable<Student[]> {
        return this.http.get<Student[]>(`${this.urlBase}?status=${status}`);
  }


}
export type { Student };

