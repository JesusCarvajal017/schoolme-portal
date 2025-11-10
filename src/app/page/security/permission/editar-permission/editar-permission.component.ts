import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormPermissionComponent } from '../../../forms/form-permission/form-permission.component';
import { CreateModelPermission, Permission } from '../../../../models/security/permission.model';
import { PermissionService } from '../../../../service/permission.service';
import { FormRolComponent } from "../../../forms/form-rol/form-rol.component";

@Component({
  selector: 'app-editar-permission',
  imports: [FormPermissionComponent, FormPermissionComponent],
  templateUrl: './editar-permission.component.html',
  styleUrl: './editar-permission.component.css'
})
export class EditarRolComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  permission: Permission[] = [];
  model?: Permission;

  servviceEntity = inject(PermissionService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar permiso`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelPermission){
    let { name, description, status } = data;

    let pre_data : CreateModelPermission = {
      id: this.id,
      name,
      description,
      status: status ? 1 : 0, // convertir el valor booleano a un valor numerico
    }

    console.log(this.model);
    console.log(pre_data);

    this.servviceEntity.actualizar(pre_data).subscribe(
      {next: () => {
          Swal.fire("Exitoso", "Actualizacion exitosa", "success");
          this.router.navigate(['dashboard/permisos']);
       }});
  }
}