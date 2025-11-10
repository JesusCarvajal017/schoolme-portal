import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SidebarItem } from '../models/sidebar-item.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthMainService } from './auth/auth-main.service'; 

@Injectable({ providedIn: 'root' })
export class SidebarService {
  http = inject(HttpClient);
  authService = inject(AuthMainService);
  urlApi!: string;
  
  constructor() {
    this.urlApi = environment.apiUrl;
  }
  
  public getSidebarItems(): Observable<SidebarItem[]> {
    const rolId = this.authService.obtenerRolId();
    
    return this.http.get<SidebarItem[]>(`${this.urlApi}/View/Menu?rolId=${rolId}`);
  }
}