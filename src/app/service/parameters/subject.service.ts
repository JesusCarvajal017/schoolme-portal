import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelSubject, Subject } from '../../models/parameters/subject.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class SubjectService extends GenericService<Subject, CreateModelSubject, ModelLogicalDelete> {
  constructor() {
    super('Subject')
  }

    override obtenerTodos(status: number = 1): Observable<Subject[]> {
      return this.http.get<Subject[]>(`${this.urlBase}?status=${status}`);
  }
}

export type { Subject };