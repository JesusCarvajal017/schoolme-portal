import {inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

// TCreate === obejto de comandos
// T model de enpoint
export class GenericService<T, TCreate, Delte> {

  protected http = inject(HttpClient);
  protected urlBase:string;

  constructor(endpoint: string) {
    this.urlBase = `${environment.apiUrl}/${endpoint}`;
  }

  public obtenerTodos(status: number = 1): Observable<T[]> {
    return this.http.get<T[]>(`${this.urlBase}`);
  }

  public obtenerPorId(id: number): Observable<T> {
    return this.http.get<T>(`${this.urlBase}/${id}`);
  }

  public crear(entity: TCreate): Observable<T> {
    return this.http.post<T>(this.urlBase, entity);
  }

  public actualizar(entity: TCreate): Observable<T> {
    return this.http.put<T>(this.urlBase, entity);
  }

  public eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}`);
  }
  
  public eliminarLogico(id: number, status: number): Observable<void> {
    return this.http.delete<void>(`${this.urlBase}/${id}/${status}` );
  }
}
