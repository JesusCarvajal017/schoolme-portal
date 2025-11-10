import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';


import { CreateModelDocumentType, DocumentType } from '../../models/parameters/DocumentType.model';
import { GenericService } from '../api/generic.service';
import { ModelLogicalDelete } from '../../global/model/logicalDelete.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DocumentTypeService extends GenericService<DocumentType, CreateModelDocumentType, ModelLogicalDelete> {
  constructor() { 
    super('DocumentType')
  }

  override obtenerTodos(status: number = 1): Observable<DocumentType[]> {
    return this.http.get<DocumentType[]>(`${this.urlBase}?status=${status}`);
  }
}
