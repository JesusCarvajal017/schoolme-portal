import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelModuleForm, ModuleForm } from '../models/security/module-form.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class ModuleFormService extends GenericService<ModuleForm, CreateModelModuleForm, ModelLogicalDelete> {
  constructor() { 
    super('ModuleForm')
  }

    override obtenerTodos(status: number = 1): Observable<ModuleForm[]> {
        return this.http.get<ModuleForm[]>(`${this.urlBase}?status=${status}`);
  }
}
