import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { FormUserComponent } from "../../../forms/form-user/form-user.component";
import { UserService } from '../../../../service/user.service';
import { PersonService } from '../../../../service/person.service';
import { Person } from '../../../../models/security/person.model';
import { CreateModelUser, User } from '../../../../models/security/user.model';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-user',
  imports: [],
  templateUrl: './editar-user.component.html',
  styleUrl: './editar-user.component.css'
})
export class EditarUserComponent implements OnInit{
  title = "Editar User";

  model?: User;
  personaId!: number;

  @Input({transform : numberAttribute})
  id!: number;

  serviceUser = inject(UserService);
  router = inject(Router);
  // servicePerson = inject(PersonService);

  ngOnInit(): void {
      this.queryEntity(this.id);
  }


  guardarUsuario(data: CreateModelUser){
    let dataUpdate : any = {
      ...data,
      id: this.id
    }

    this.serviceUser.actualizar(dataUpdate).subscribe({
      next: ()=>{
        Swal.fire("Exitoso", "Actualizacion exitosa", "success"); // alerta de swalalert
        this.router.navigate(['/user'])
      }
    });
  }

  queryEntity(id: number){
    this.serviceUser.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      // console.log(this.model)
      // this.personaId = this.model.personId;
      // console.log(this.personaId)
    });
  }



}
