import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRol, Rol } from '../models/security/rol.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class RolService extends GenericService<Rol, CreateModelRol, ModelLogicalDelete> {
  constructor() { 
    super('Rol')
  }

   override obtenerTodos(status: number = 1): Observable<Rol[]> {
      return this.http.get<Rol[]>(`${this.urlBase}?status=${status}`);
}
}

export type { Rol };
