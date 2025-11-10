import { Component, inject, Input } from '@angular/core';
import { AuthMainService } from '../../service/auth/auth-main.service';

@Component({
  selector: 'app-autorizado',
  imports: [],
  templateUrl: './autorizado.component.html',
  styleUrl: './autorizado.component.css'
})
export class AutorizadoComponent {
  @Input()
  rol?: string;


  serviceSecurity = inject(AuthMainService);

  estaAutorizado(): boolean {
    if(this.rol){
      return this.serviceSecurity.obtenerRol() === this.rol;
    }else{
      return this.serviceSecurity.estalogeado();
    }
  }




}
