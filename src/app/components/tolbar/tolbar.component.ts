import { Component, inject } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {TuiAvatar} from '@taiga-ui/kit';
import { AuthMainService } from '../../service/auth/auth-main.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tolbar',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule,TuiAvatar, MatMenuModule],
  templateUrl: './tolbar.component.html',
  styleUrl: './tolbar.component.css'
})
export class TolbarComponent {
  sevicesSalida = inject(AuthMainService);
  router = inject(Router);

  salirSesion(){
    this.sevicesSalida.logout();
    this.router.navigate(['/login'])

  }
}
