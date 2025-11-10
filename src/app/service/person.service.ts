import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CreateModelPerson, Person, PersonComplete, PersonOrigin } from '../models/security/person.model';
import { PersonData } from '../models/security/person.model'; // Asegúrate de que esté importado
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { GenericService } from './api/generic.service';

@Injectable({
  providedIn: 'root'
})
export class PersonService extends GenericService<PersonOrigin, CreateModelPerson, ModelLogicalDelete> {
  
  constructor() {
    super('Person')
  }

  obtenerTodosOrigin(status: number = 1): Observable<PersonOrigin[]> {
    return this.http.get<PersonOrigin[]>(`${this.urlBase}?status=${status}`);
  }

  crearComplete(entity: CreateModelPerson): Observable<CreateModelPerson> {
    return this.http.post<CreateModelPerson>(`${this.urlBase}/CreateComplet`, entity);
  }

  actulizarComplete(id: number, entity: CreateModelPerson): Observable<CreateModelPerson> {
    return this.http.put<CreateModelPerson>(`${this.urlBase}/UpdateComplete/${id}`, entity);
  }

  public ObtenerComplete(id: number): Observable<PersonComplete> {
    return this.http.get<PersonComplete>(`${this.urlBase}/PersonBasic/${id}`);
  }

  // Método específico para obtener PersonData (incluye municipio, EPS, etc.)
  public obtenerPersonData(id: number): Observable<PersonData> {
    // Primero intentar el endpoint específico para PersonData
    return this.http.get<PersonData>(`${this.urlBase}/PersonData/${id}`)
      .pipe(
        catchError(error => {
          console.warn('Endpoint PersonData no disponible, usando fallback...', error);
          // Fallback: usar PersonBasic y mapear
          return this.ObtenerComplete(id).pipe(
            map(personComplete => this.mapToPersonData(personComplete))
          );
        })
      );
  }

  // Método para obtener persona con datos completos para el perfil
  public obtenerParaPerfil(id: number): Observable<PersonData> {
    // Usar obtenerPersonData que ya tiene el fallback implementado
    return this.obtenerPersonData(id);
  }

  // Método para mapear PersonComplete a PersonData
  private mapToPersonData(personComplete: any): PersonData {
    return {
      documentTypeId: personComplete.documentTypeId || 0,
      acronymDocument: personComplete.acronymDocument || 'DOC',
      identification: personComplete.identification || 0,
      fisrtName: personComplete.fisrtName || '',
      secondName: personComplete.secondName || null,
      lastName: personComplete.lastName || '',
      secondLastName: personComplete.secondLastName || null,
      phone: personComplete.phone || 0,
      gender: personComplete.gender || 0,
      rhId: personComplete.rhId || 0,
      rhName: personComplete.rhName || 'No especificado',
      adress: personComplete.adress || '',
      brithDate: personComplete.brithDate || '',
      stratumStatus: personComplete.stratumStatus || 0,
      materialStatusId: personComplete.materialStatusId || 0,
      epsId: personComplete.epsId || 0,
      epsName: personComplete.epsName || 'No especificado',
      munisipalityId: personComplete.munisipalityId || 0,
      munisipalityName: personComplete.munisipalityName || 'No especificado',
      id: personComplete.id || 0,
      status: personComplete.status || 1
    };
  }

  // Método para actualizar datos específicos del perfil
  public actualizarDatosPerfil(id: number, datos: Partial<PersonData>): Observable<PersonData> {
    return this.http.put<PersonData>(`${this.urlBase}/UpdateProfile/${id}`, datos);
  }
}