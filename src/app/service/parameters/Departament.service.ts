
import { inject, Injectable } from '@angular/core';

import { GenericService } from '../api/generic.service';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { CreateDepartament, Departament } from '../../models/parameters/Departament.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DepartamentServices extends GenericService<Departament, CreateDepartament, ModelLogicalDelete> {
  constructor() { 
    super('Departament');
  }
public MunicipiosDepart(id: any): Observable<Departament[]> {
      return this.http.get<Departament[]>(`${this.urlBase}/list/${id}`);
  }


}
export type { Departament };

