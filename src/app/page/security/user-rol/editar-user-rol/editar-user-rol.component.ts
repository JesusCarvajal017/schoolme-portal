import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelUserRol, UserRol } from '../../../../models/security/user-rol.model';
import { RolService } from '../../../../service/rol.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormUserRolComponent } from '../../../forms/form-user-rol/form-user-rol.component';
import { UserRolService } from '../../../../service/user-rol.service';

@Component({
  selector: 'app-editar-rol',
  imports: [FormUserRolComponent],
  templateUrl: './editar-user-rol.component.html',
  styleUrl: './editar-user-rol.component.css'
})
export class EditarUserRolComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  userRol: UserRol[] = [];
  model?: UserRol;

  servviceEntity = inject(UserRolService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar User-Rol`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelUserRol){
    let { nameUser, rolName, status } = data;

    let pre_data : CreateModelUserRol = {
      id: this.id,
      nameUser,
      rolName,
      status: status ? 1 : 0,
      userId: 0,
      rolId: 0
    }

    console.log(this.model);
    console.log(pre_data);

    this.servviceEntity.actualizar(pre_data).subscribe(
      {next: () => {
          Swal.fire("Exitoso", "Actualizacion exitosa", "success");
          this.router.navigate(['dashboard/roles']);
       }});
  }
}