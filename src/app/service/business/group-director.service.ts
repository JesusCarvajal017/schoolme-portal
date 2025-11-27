import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelGroupDirector, GroupDirector, GroupDirectorQuery } from '../../models/business/group-director.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class GroupDirectorService extends GenericService<GroupDirector, CreateModelGroupDirector, ModelLogicalDelete> {
  constructor() { 
    super('GroupDirector')
  }

  override obtenerTodos(status: number = 1): Observable<GroupDirector[]> {
    return this.http.get<GroupDirector[]>(`${this.urlBase}?status=${status}`);
  }

  public GroupDirector(teacherId: number): Observable<GroupDirectorQuery[]> {
    return this.http.get<GroupDirectorQuery[]>(`${this.urlBase}/Groups/${teacherId}`);
  }
}

export type { GroupDirector };
