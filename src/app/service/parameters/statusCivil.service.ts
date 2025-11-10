
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRh, Rh } from '../../models/parameters/Rh';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';
import { CreateStatusCivil, StatusCivil } from '../../models/parameters/StatusCivil';

@Injectable({
  providedIn: 'root'
})

export class StatusCivilServices extends GenericService<StatusCivil, CreateStatusCivil, ModelLogicalDelete> {
  constructor() { 
    super('MaterialStatus')
  }

     override obtenerTodos(status: number = 1): Observable<Rh[]> {
      return this.http.get<Rh[]>(`${this.urlBase}?status=${status}`);
}
}
