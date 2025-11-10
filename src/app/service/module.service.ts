import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelModule, Module } from '../models/security/module.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class ModuleService extends GenericService<Module, CreateModelModule, ModelLogicalDelete> {
  constructor() { 
    super('Module')
  }

     override obtenerTodos(status: number = 1): Observable<Module[]> {
      return this.http.get<Module[]>(`${this.urlBase}?status=${status}`);
}
}
