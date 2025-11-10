import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { FormRolComponent } from '../../../forms/form-rol/form-rol.component';
import { CreateModelModuleForm, ModuleForm } from '../../../../models/security/module-form.model';
import { ModuleFormService } from '../../../../service/module-form.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { FormModuleFormComponent } from '../../../forms/form-module-form/form-module-form.component';

@Component({
  selector: 'app-editar-module-form',
  imports: [FormModuleFormComponent],
  templateUrl: './editar-module-form.component.html',
  styleUrl: './editar-module-form.component.css'
})
export class EditarModuleFormComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  moduleForm: ModuleForm[] = [];
  model?: ModuleForm;

  servviceEntity = inject(ModuleFormService);

  router = inject(Router);

  title : string = '';

  ngOnInit(): void {
    this.queryEntity(this.id);
    
    this.title = `Editar asignación de modulos`;
  }

  queryEntity(id: number){
    this.servviceEntity.obtenerPorId(id).subscribe(data =>{
      this.model = data;
      console.log(data);
    });
  }

  editEntity(data: CreateModelModuleForm){
    let { moduleName, moduleId, formId, formName, status } = data;

    let pre_data : CreateModelModuleForm = {
      id: this.id,
      moduleName,
      formName,
      moduleId,
      formId,
      status: status ? 1 : 0,
     
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