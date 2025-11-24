import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelGroups, Groups, QGroupAgendaRelation } from '../../models/parameters/groups.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class GroupsService extends GenericService<Groups, CreateModelGroups, ModelLogicalDelete> {
  constructor() { 
    super('Groups')
  }

  override obtenerTodos(status: number = 1): Observable<Groups[]> {
    return this.http.get<Groups[]>(`${this.urlBase}?status=${status}`);
    
  }

  public grupGrade(gradeId: number = 1): Observable<Groups[]> {
    return this.http.get<Groups[]>(`${this.urlBase}/GroupsGrade/${gradeId}`);
  }

  public GroupsAgendasRelation(agendaId : number,gradeId : number): Observable<QGroupAgendaRelation[]> {
    return this.http.get<QGroupAgendaRelation[]>(`${this.urlBase}/GroupsAgendas/${agendaId}/${gradeId}`);
  }

  changeAgenda(groupId: number, agendaId: number | null) {

    let params = new HttpParams();
    
    // solo enviamos agendaId si NO es null
    if (agendaId !== null) {
      params = params.set('agendaId', agendaId.toString());
    }

    return this.http.post(
      `${this.urlBase}/ChangeAgenda/${groupId}`,
      null,
      { params }
    );
  }
}
