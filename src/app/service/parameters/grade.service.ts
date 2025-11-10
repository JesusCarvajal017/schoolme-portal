import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelGrade, Grade } from '../../models/parameters/grade.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class GradeService extends GenericService<Grade, CreateModelGrade, ModelLogicalDelete> {
  constructor() { 
    super('Grade')
  }

     override obtenerTodos(status: number = 1): Observable<Grade[]> {
      return this.http.get<Grade[]>(`${this.urlBase}?status=${status}`);
}
}
