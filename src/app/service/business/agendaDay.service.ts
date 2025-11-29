
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';

import {TutionCreateModel, TutionQuery } from '../../models/business/tutition.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { AgendaDayModel, AgendaModel, AgendaQuery, CompositionAgendaModel } from '../../models/business/agenda.model';

@Injectable({
  providedIn: 'root'
})

export class AgedaDayService extends GenericService<AgendaDayModel, AgendaDayModel, ModelLogicalDelete> {
  constructor() { 
    super('AgendaDay')
  }

  override obtenerTodos(status: number = 1): Observable<AgendaDayModel[]> {
    return this.http.get<[]>(`${this.urlBase}?status=${status}`);
  }

  public closeAgenda(agendaDayId : number): Observable<void> {
    return this.http.post<void>(`${this.urlBase}/${agendaDayId}/close`, { });
  }


}
