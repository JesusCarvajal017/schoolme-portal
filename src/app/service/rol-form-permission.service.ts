import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRolFormPermission, RolFormPermission } from '../models/security/rol-form-permission.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class RolFormPermissionService extends GenericService<RolFormPermission, CreateModelRolFormPermission, ModelLogicalDelete> {
  constructor() { 
    super('RolFormPermission')
  }

    override obtenerTodos(status: number = 1): Observable<RolFormPermission[]> {
        return this.http.get<RolFormPermission[]>(`${this.urlBase}?status=${status}`);
  }
}


export type { RolFormPermission };
