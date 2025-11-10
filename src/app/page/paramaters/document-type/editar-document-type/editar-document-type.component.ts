import { Component, inject, Input, numberAttribute, OnInit } from '@angular/core';
import { CreateModelRol, Rol } from '../../../../models/security/rol.model';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CreateModelDocumentType, DocumentType } from '../../../../models/parameters/DocumentType.model';
import { DocumentTypeService } from '../../../../service/parameters/documentType.service';
import { FormDocumentTypeComponent } from '../../../forms/form-document-type/form-document-type.component';

@Component({
  selector: 'app-editar-document-type',
  imports: [FormDocumentTypeComponent],
  templateUrl: './editar-document-type.component.html',
  styleUrl: './editar-document-type.component.css'
})
export class EditarDocumentTypeComponent implements OnInit {

  @Input({transform: numberAttribute})
  id!: number;

  module: DocumentType[] = [];
  model?: DocumentType;

  servviceEntity = inject(DocumentTypeService);

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

  editEntity(data: CreateModelDocumentType){
    let { name, acronym, status } = data;

    let pre_data : CreateModelDocumentType = {
      id: this.id,
      name,
      acronym,
      status: status ? 1 : 0,
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