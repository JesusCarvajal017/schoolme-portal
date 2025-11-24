
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';

import {TutionCreateModel, TutionQuery } from '../../models/business/tutition.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { AgendaModel, AgendaQuery } from '../../models/business/agenda.model';

@Injectable({
  providedIn: 'root'
})

export class AgendaService extends GenericService<AgendaQuery, AgendaModel, ModelLogicalDelete> {
  constructor() { 
    super('Agenda')
  }

  override obtenerTodos(status: number = 1): Observable<AgendaQuery[]> {
    return this.http.get<[]>(`${this.urlBase}?status=${status}`);
  }

}
