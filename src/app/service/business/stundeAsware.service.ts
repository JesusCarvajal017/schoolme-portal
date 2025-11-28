
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericService } from '../api/generic.service';

import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { AgendaDayStudentHeader, AgendaDayStudentModel} from '../../models/business/agenda.model';
import { RegisterGlobalStudentAnswersDto, StudentAnswerModel } from '../../models/business/studentAsware.mode';

@Injectable({
  providedIn: 'root'
})

export class StudentAnswerService  extends GenericService<StudentAnswerModel, StudentAnswerModel, ModelLogicalDelete> {
  constructor() { 
    super('StudentAnsware')
  }

  override obtenerTodos(status: number = 1): Observable<StudentAnswerModel[]> {
    return this.http.get<[]>(`${this.urlBase}?status=${status}`);
  }


  saveGlobalAnswers(dto: RegisterGlobalStudentAnswersDto): Observable<void> {
    return this.http.post<void>(`${this.urlBase}/answers/global`, dto);
  }


}
