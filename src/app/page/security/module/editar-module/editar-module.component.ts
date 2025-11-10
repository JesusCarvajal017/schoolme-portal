import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelRol, Rol } from '../../../../models/security/rol.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormModuleComponent } from '../../../forms/form-module/form-module.component';
import { CreateModelModule, Module } from '../../../../models/security/module.model';
import { ModuleService } from '../../../../service/module.service';

@Component({
  selector: 'app-editar-module',
  imports: [FormModuleComponent],
  templateUrl: './editar-module.component.html',
  styleUrl: './editar-module.component.css'
})
export class EditarModuleComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  module: Module[] = [];
  model?: Module;

  servviceEntity = inject(ModuleService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar modulo`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelModule){
    let { name, description, status } = data;

    let pre_data : CreateModelModule = {
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
          this.router.navigate(['dashboard/modulos']);
       }});
  }
}