import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';
import { CreateModelAttendants } from '../../models/parameters/attendants.model';
import { Attendants } from '../parameters/attendants.service';

@Injectable({
  providedIn: 'root'
})

export class AcudienteService extends GenericService<Attendants, CreateModelAttendants, ModelLogicalDelete> {
  constructor() { 
    super('Attendants')
  }

}

