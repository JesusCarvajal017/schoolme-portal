import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelGroups, Groups } from '../../models/parameters/groups.model';
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
}
