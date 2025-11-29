import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelForm, Form } from '../models/security/form.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class FormService extends GenericService<Form, CreateModelForm, ModelLogicalDelete> {
  constructor() { 
    super('Form')
  }

  override obtenerTodos(status: number = 1): Observable<Form[]> {
    return this.http.get<Form[]>(`${this.urlBase}?status=${status}`);
  }
}

export type { Form };
