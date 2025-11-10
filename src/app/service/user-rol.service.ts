import { Injectable } from '@angular/core';
import { GenericService } from './api/generic.service';
import { CreateModelUserRol, UserRol } from '../models/security/user-rol.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRolService extends GenericService<UserRol, CreateModelUserRol, ModelLogicalDelete> {
  constructor() { 
    super('UserRol')
  }

    override obtenerTodos(status: number = 1): Observable<UserRol[]> {
      return this.http.get<UserRol[]>(`${this.urlBase}?status=${status}`);
}
  
}
