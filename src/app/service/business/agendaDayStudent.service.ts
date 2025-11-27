
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';

import {TutionCreateModel, TutionQuery } from '../../models/business/tutition.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { AgendaDayModel, AgendaDayStudentHeader, AgendaDayStudentModel, AgendaModel, AgendaQuery, CompositionAgendaModel } from '../../models/business/agenda.model';
import { QuestionModel } from '../../models/parameters/question.model';

@Injectable({
  providedIn: 'root'
})

export class AgedaDayStudentService extends GenericService<AgendaDayStudentModel, AgendaDayStudentModel, ModelLogicalDelete> {
  constructor() { 
    super('AgendaDayStudent')
  }

  override obtenerTodos(status: number = 1): Observable<AgendaDayStudentModel[]> {
    return this.http.get<[]>(`${this.urlBase}?status=${status}`);
  }


  public ByAgendaDayStudents(agendaId: number): Observable<AgendaDayStudentHeader[]> {
    return this.http.get<[]>(`${this.urlBase}/by-agenda-day/${agendaId}`);
  }


  

}
