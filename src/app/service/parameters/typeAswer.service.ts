
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRh, Rh } from '../../models/parameters/Rh';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';
import { QuestionModel } from '../../models/parameters/question.model';
import { TypeAwareModel } from '../../models/parameters/TypeAsware.model';

@Injectable({
  providedIn: 'root'
})

export class TypeAswerService extends GenericService<TypeAwareModel, TypeAwareModel, ModelLogicalDelete> {
  constructor() { 
    super('TypeAnsware')
  }

  override obtenerTodos(status: number = 1): Observable<TypeAwareModel[]> {
    return this.http.get<TypeAwareModel[]>(`${this.urlBase}?status=${status}`);
}
}
