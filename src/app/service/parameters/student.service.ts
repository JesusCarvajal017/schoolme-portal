
import { inject, Injectable } from '@angular/core';

import { GenericService } from '../api/generic.service';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { CreateModelStudent, Student, StudentComplete, UpdateGrupStudent } from '../../models/parameters/student.model';
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

  public ObtenerComplete(id: number): Observable<StudentComplete> {
    return this.http.get<StudentComplete>(`${this.urlBase}/DataBasic/${id}`);
  }

  public StudentGroups(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.urlBase}/StudentsGroup/${id}`);
  }

  public NoMatriculados(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.urlBase}/MatriculationNot`);
  }

  public UpdateGrup(data: UpdateGrupStudent): Observable<boolean> {
    return this.http.post<boolean>(`${this.urlBase}/ChangeGroup`,data);
  }

  


}
export type { Student };

