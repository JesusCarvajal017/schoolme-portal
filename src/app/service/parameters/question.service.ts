
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateModelRh, Rh } from '../../models/parameters/Rh';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { GenericService } from '../api/generic.service';
import { QuestionCreate, QuestionModel } from '../../models/parameters/question.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class QuestionService extends GenericService<QuestionModel, QuestionCreate, ModelLogicalDelete> {
  constructor() { 
    super('Question')
  }

    override obtenerTodos(status: number = 1): Observable<QuestionModel[]> {
      return this.http.get<QuestionModel[]>(`${this.urlBase}?status=${status}`);

  }

   public deleteChamp(id:number): Observable<void> {
      return this.http.delete<void>(`${environment.apiUrl}/QuestionOption/${id}`);
    }
}
