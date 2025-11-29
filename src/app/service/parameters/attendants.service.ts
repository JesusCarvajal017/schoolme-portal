
import { inject, Injectable } from '@angular/core';

import { GenericService } from '../api/generic.service';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { CreateModelAttendants, Attendants } from '../../models/parameters/attendants.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AttendantsService extends GenericService<Attendants, CreateModelAttendants, ModelLogicalDelete> {
  constructor() { 
    super('Attendants');
  }
 override obtenerTodos(status: number = 1): Observable<Attendants[]> {
    return this.http.get<Attendants[]>(`${this.urlBase}?status=${status}`);
  }

  obtenerRelacionNinos(status: number = 1, idperson: number): Observable<Attendants[]> {
    return this.http.get<Attendants[]>(`${this.urlBase}/Relation?status=${status}&personId=${idperson}`);
  }


}
export type { Attendants };

