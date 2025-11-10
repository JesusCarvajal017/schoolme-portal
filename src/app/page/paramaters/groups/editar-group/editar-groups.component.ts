import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelRol, Rol } from '../../../models/security/rol.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroupsComponent } from '../../forms/form-groups/form-groups.component';
import { CreateModelGroups, Groups } from '../../../models/parameters/groups.model';
import { GroupsService } from '../../../service/parameters/groups.service';

@Component({
  selector: 'app-editar-groups',
  imports: [FormGroupsComponent],
  templateUrl: './editar-groups.component.html',
  styleUrl: './editar-groups.component.css'
})
export class EditarGroupsComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  module: Groups[] = [];
  model?: Groups;

  servviceEntity = inject(GroupsService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar grupo`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelGroups){
    let { name, gradeName, amountStudents, status } = data;

    let pre_data : CreateModelGroups = {
      id: this.id,
      name,
      gradeName,
      amountStudents,
      status: status ? 1 : 0,
      gradeId: 0,
      agendaId: 0
    }

    console.log(this.model);
    console.log(pre_data);

    this.servviceEntity.actualizar(pre_data).subscribe(
      {next: () => {
          Swal.fire("Exitoso", "Actualizacion exitosa", "success");
          this.router.navigate(['dashboard/grupos']);
       }});
  }
}