
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRh, Rh } from '../../models/parameters/Rh';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class RhService extends GenericService<Rh, CreateModelRh, ModelLogicalDelete> {
  constructor() { 
    super('Rh')
  }

     override obtenerTodos(status: number = 1): Observable<Rh[]> {
      return this.http.get<Rh[]>(`${this.urlBase}?status=${status}`);
}
}
