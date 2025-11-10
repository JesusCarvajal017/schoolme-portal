import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelUserRol, UserRol } from '../../../../models/security/user-rol.model';
import { RolService } from '../../../../service/rol.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { RolFormPermission, RolFormPermissionService } from '../../../../service/rol-form-permission.service';
import { FormRolFormPermissionComponent } from '../../../forms/form-rol-form-permission/form-rol-form-permission.component';
import { CreateModelRolFormPermission } from '../../../../models/security/rol-form-permission.model';

@Component({
  selector: 'app-editar-rol-form-permission',
  imports: [FormRolFormPermissionComponent],
  templateUrl: './editar-rol-form-permission.component.html',
  styleUrl: './editar-rol-form-permission.component.css'
})
export class EditarUserRolComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  rolFormPermission: RolFormPermission[] = [];
  model?: RolFormPermission;

  servviceEntity = inject(RolFormPermissionService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar RolFormPermission`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelRolFormPermission){
    let { formName, rolName, permissionName, status } = data;

    let pre_data : CreateModelRolFormPermission = {
      id: this.id,
      formName,
      rolName,
      permissionName,
      status: status ? 1 : 0,
      formId: 0,
      rolId: 0,
      permissionId: 0
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