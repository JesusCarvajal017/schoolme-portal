
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';
import { CreateDataBasic, DataBasic } from '../../models/business/dataBasic.mode';

@Injectable({
  providedIn: 'root'
})

export class DataBasicService extends GenericService<DataBasic, CreateDataBasic, any[]> {
  constructor() { 
    super('DataBasic')
  }

  override obtenerTodos(status: number = 1): Observable<DataBasic[]> {
    return this.http.get<[]>(`${this.urlBase}?status=${status}`);
  }
}
