import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelRol, Rol } from '../../../../models/security/rol.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGradeComponent } from '../../../forms/form-grade/form-grade.component';
import { CreateModelGrade, Grade } from '../../../../models/parameters/grade.model';
import { GradeService } from '../../../../service/parameters/grade.service';

@Component({
  selector: 'app-editar-grade',
  imports: [FormGradeComponent],
  templateUrl: './editar-grade.component.html',
  styleUrl: './editar-grade.component.css'
})
export class EditarEpsComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  module: Grade[] = [];
  model?: Grade;

  servviceEntity = inject(GradeService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar grado`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelGrade){
    let { name, status } = data;

    let pre_data : CreateModelGrade = {
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