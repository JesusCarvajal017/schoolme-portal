import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelRol, Rol } from '../../../../models/security/rol.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormRhComponent } from '../../../forms/form-rh/form-rh.component';
import { CreateModelRh, Rh } from '../../../../models/parameters/Rh';
import { RhService } from '../../../../service/parameters/rh.service';

@Component({
  selector: 'app-editar-rh',
  imports: [FormRhComponent],
  templateUrl: './editar-rh.component.html',
  styleUrl: './editar-rh.component.css'
})
export class EditarRhComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  module: Rh[] = [];
  model?: Rh;

  servviceEntity = inject(RhService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar Rh`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelRh){
    let { name, status } = data;

    let pre_data : CreateModelRh = {
      id: this.id,
      name,
      status: status ? 1 : 0, // convertir el valor booleano a un valor numerico
    }

    console.log(this.model);
    console.log(pre_data);

    this.servviceEntity.actualizar(pre_data).subscribe(
      {next: () => {
          Swal.fire("Exitoso", "Actualizacion exitosa", "success");
          this.router.navigate(['dashboard/rh']);
       }});
  }
}