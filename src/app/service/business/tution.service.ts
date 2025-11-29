
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';

import {TutionCreateModel, TutionQuery } from '../../models/business/tutition.model';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';

@Injectable({
  providedIn: 'root'
})

export class TutionService extends GenericService<TutionQuery, TutionCreateModel, ModelLogicalDelete> {
  constructor() { 
    super('Tution')
  }

  
  public tutionGrade(gradeId: number ): Observable<TutionQuery[]> {
    return this.http.get<TutionQuery[]>(`${this.urlBase}/TutitionGrade/${gradeId}`);
  }

}
