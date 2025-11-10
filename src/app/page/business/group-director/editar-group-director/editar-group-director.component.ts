import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroupDirectorComponent } from '../../forms/form-group-director/form-group-director.component';
import { GroupDirector, GroupDirectorService } from '../../../service/business/group-director.service';
import { CreateModelGroupDirector } from '../../../models/business/group-director.model';

@Component({
  selector: 'app-editar-group-director',
  imports: [FormGroupDirectorComponent],
  templateUrl: './editar-group-director.component.html',
  styleUrl: './editar-group-director.component.css'
})
export class EditarGroupDirectorComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  groupDirector: GroupDirector[] = [];
  model?: GroupDirector;

  servviceEntity = inject(GroupDirectorService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar GroupDirector`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelGroupDirector){
    let { groupName, teacherId, status } = data;

    let pre_data : CreateModelGroupDirector = {
      id: this.id,
      groupName,
      teacherId,
      status: status ? 1 : 0,
      fisrtName: '',
      secondName: '',
      lastName: '',
      secondLastName: '',
      groupId: 0
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