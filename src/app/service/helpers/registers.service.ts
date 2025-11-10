import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RegisterCount } from '../../models/helpers/registers.model';


@Injectable({ providedIn: 'root' })
export class RegistersServices {
  http = inject(HttpClient);
  urlApi !: string;

  constructor(){
    this.urlApi = environment.apiUrl;
  }

  public getCoutRegister(): Observable<RegisterCount> {
    return this.http.get<RegisterCount>(`${this.urlApi}/View/Registers`).pipe();
  }
  
}







