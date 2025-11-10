import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GenericService } from './api/generic.service';
import { CreateModelUser, CreateModolUser2, User } from '../models/security/user.model';
import { ModelLogicalDelete } from '../global/model/logicalDelete.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService extends GenericService<User, CreateModelUser, ModelLogicalDelete> {
  
  constructor() {
    super('User')
  }

  override obtenerTodos(status: number = 1): Observable<User[]> {
    return this.http.get<User[]>(`${this.urlBase}?status=${status}`);
  }

  // Método para crear usuario completo con imagen
  public createUserComplete(user: CreateModolUser2): Observable<any> {
    const formData = this.construirFormData(user);
    return this.http.post(this.urlBase, formData);
  }


  // Subir foto de perfil (CORREGIDO - siguiendo patrón del commit antiguo)
  public async uploadUserPhoto(userId: number, file: File): Promise<{ ok: boolean; photo?: string }> {
    try {
      const formData = new FormData();
      formData.append('Id', String(userId));          // igual que en Swagger
      formData.append('Photo', file, file.name);      // IFormFile en backend

      const response = await fetch(`${environment.apiUrl}/User/photoUpdate`, {
        method: 'POST',
        body: formData
        // ⚠️ No pongas Content-Type manualmente, fetch lo hace solo
      });

      if (!response.ok) {
        return { ok: false };
      }

      const data = await response.json();
      return { ok: true, photo: data.photo };
    } catch (error) {
      console.error('Error subiendo foto:', error);
      return { ok: false };
    }
  }

  // Cambiar contraseña
  public changePassword(idUser: number, passwordNew: string, passwordConfirm: string): Observable<boolean> {
    const payload = { idUser, passwordNew, passwordConfirm };
    return this.http.post<boolean>(`${this.urlBase}/passwordUpdate`, payload);
  }

  // Actualizar correo electrónico
  public updateUserEmail(userId: number, email: string, personId: number, status: number): Observable<User> {
    const payload = { id: userId, email, personId, status };
    return this.http.patch<User>(`${this.urlBase}`, payload);
  }

  // Método para actualizar usuario completo (sin cambiar imagen si no se proporciona)
  public updateUserProfile(userId: number, userData: Partial<CreateModolUser2>): Observable<any> {
    const formData = new FormData();
    
    if (userData.email) formData.append('email', userData.email);
    if (userData.password) formData.append('password', userData.password);
    if (userData.personId !== undefined) formData.append('personId', userData.personId.toString());
    if (userData.status !== undefined) formData.append('status', userData.status.toString());
    if (userData.photo) formData.append('photo', userData.photo);

    return this.http.put(`${this.urlBase}/${userId}`, formData);
  }

  // Método para obtener usuario con datos de persona incluidos
  public obtenerUsuarioCompleto(userId: number): Observable<any> {
    return this.http.get(`${this.urlBase}/Complete/${userId}`)
      .pipe(
        catchError(error => {
          console.warn('Endpoint Complete no disponible, usando obtenerPorId...', error);
          // Fallback: usar el método genérico
          return this.obtenerPorId(userId);
        })
      );
  }

  private construirFormData(user: CreateModolUser2): FormData {
    const formData = new FormData();
    
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('personId', user.personId.toString());
    formData.append('status', user.status.toString());
    
    if (user.photo) {
      formData.append('photo', user.photo);
    }
    
    return formData;
  }

  // Agregar este método a tu UserService
  public updateUserComplete(id: number, user: CreateModolUser2): Observable<any> {
    const formData = this.construirFormData(user);
    return this.http.put(`${this.urlBase}/${id}`, formData);
  }
}

export type { User };