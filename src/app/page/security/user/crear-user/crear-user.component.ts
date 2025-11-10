import { Component, inject } from '@angular/core';

import { FormUserComponent } from '../../../forms/form-user/form-user.component';
import { UserService } from '../../../../service/user.service';
import { CreateModelUser } from '../../../../models/security/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-crear-user',
  imports: [FormUserComponent],
  templateUrl: './crear-user.component.html',
  styleUrl: './crear-user.component.css'
})
export class CrearUserComponent {
  title = 'Registrar Usuario';

  router = inject(Router);
  serviceUser = inject(UserService);

  guardarUsuario(data: CreateModelUser){
    this.serviceUser.crear(data).subscribe({
      next: () => {
        Swal.fire("Exitoso", "Registro exitoso", "success"); // alerta de swalalert
        this.router.navigate(['/user']);
      }
    });
  }

}
