import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { FormRolComponent } from '../../../forms/form-rol/form-rol.component';
import { CreateModelRol, Rol } from '../../../../models/security/rol.model';
import { RolService } from '../../../../service/rol.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-rol',
  imports: [FormRolComponent],
  templateUrl: './editar-rol.component.html',
  styleUrl: './editar-rol.component.css'
})
export class EditarRolComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  rol: Rol[] = [];
  model?: Rol;

  servviceEntity = inject(RolService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar rol`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelRol){
    let { name, description, status } = data;

    let pre_data : CreateModelRol = {
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
          this.router.navigate(['dashboard/roles']);
       }});
  }
}