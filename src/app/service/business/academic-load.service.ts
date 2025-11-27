import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelAcademicLoad, AcademicLoad, horarioDay } from '../../models/business/academic-load.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class AcademicLoadService extends GenericService<AcademicLoad, CreateModelAcademicLoad, ModelLogicalDelete> {
  constructor() { 
    super('AcademicLoad')
  }

  override obtenerTodos(status: number = 1): Observable<AcademicLoad[]> {
    return this.http.get<AcademicLoad[]>(`${this.urlBase}?status=${status}`);

  }

  public horario(idTeacher: number, day: number): Observable<horarioDay[]> {
    return this.http.get<horarioDay[]>(`${this.urlBase}/teacher/${idTeacher}?status=1&day=${day}`)
  }
}

export type { AcademicLoad };
