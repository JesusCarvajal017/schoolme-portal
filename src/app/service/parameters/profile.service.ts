// service/profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { UserProfile } from '../../models/security/profile.model';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private url = `${environment.imgUrl}/User/Profile`;

  constructor(private http: HttpClient) {}

  obtenerPerfil(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.url}/${userId}`);
  }
}
