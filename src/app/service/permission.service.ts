import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelPermission, Permission } from '../models/security/permission.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class PermissionService extends GenericService<Permission, CreateModelPermission, ModelLogicalDelete> {
  constructor() { 
    super('Permission')
  }
     override obtenerTodos(status: number = 1): Observable<Permission[]> {
      return this.http.get<Permission[]>(`${this.urlBase}?status=${status}`);
}
}


export type { Permission };
