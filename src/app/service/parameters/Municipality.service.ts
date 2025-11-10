
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRh, Rh } from '../../models/parameters/Rh';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';
import { CreateModelMunicipality, Municipality } from '../../models/parameters/Municipality.model';

@Injectable({
  providedIn: 'root'
})

export class MunicipalityService extends GenericService<Municipality, CreateModelMunicipality, ModelLogicalDelete> {
  constructor() { 
    super('Municipality')
  }


  override obtenerTodos(status: number = 1): Observable<Municipality[]> {
       return this.http.get<Municipality[]>(`${this.urlBase}?status=${status}`);
  }

  public MunicipiosDepart(id: any): Observable<Municipality[]> {
      return this.http.get<Municipality[]>(`${this.urlBase}/list/${id}`);
  }
}

