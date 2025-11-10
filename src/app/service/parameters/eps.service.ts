import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelEps, Eps } from '../../models/parameters/eps.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';

@Injectable({
  providedIn: 'root'
})

export class EpsService extends GenericService<Eps, CreateModelEps, ModelLogicalDelete> {
  constructor() { 
    super('Eps')
  }

     override obtenerTodos(status: number = 1): Observable<Eps[]> {
      return this.http.get<Eps[]>(`${this.urlBase}?status=${status}`);
}
}
