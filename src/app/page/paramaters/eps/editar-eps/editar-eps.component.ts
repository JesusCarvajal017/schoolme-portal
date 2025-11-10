import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelRol, Rol } from '../../../../models/security/rol.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormEpsComponent } from '../../../forms/form-eps/form-eps.component';
import { CreateModelEps, Eps } from '../../../../models/parameters/eps.model';
import { EpsService } from '../../../../service/parameters/eps.service';

@Component({
  selector: 'app-editar-eps',
  imports: [FormEpsComponent],
  templateUrl: './editar-eps.component.html',
  styleUrl: './editar-eps.component.css'
})
export class EditarEpsComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  module: Eps[] = [];
  model?: Eps;

  servviceEntity = inject(EpsService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar eps`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelEps){
    let { name, status } = data;

    let pre_data : CreateModelEps = {
      id: this.id,
      name,
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