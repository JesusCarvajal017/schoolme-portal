
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';

import {TutionCreateModel, TutionQuery } from '../../models/business/tutition.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { AgendaModel, AgendaQuery, CompositionAgendaModel } from '../../models/business/agenda.model';
import { QuestionModel } from '../../models/parameters/question.model';

@Injectable({
  providedIn: 'root'
})

export class AsignacionAgendaService extends GenericService<CompositionAgendaModel, CompositionAgendaModel, ModelLogicalDelete> {
  constructor() { 
    super('CompsitionAgenda')
  }

  override obtenerTodos(status: number = 1): Observable<CompositionAgendaModel[]> {
    return this.http.get<[]>(`${this.urlBase}?status=${status}`);
  }

  public preguntasAgenda(agendaId: number): Observable<QuestionModel[]> {
    return this.http.get<[]>(`${this.urlBase}/AgendaComposition/${agendaId}`);
  }



}
