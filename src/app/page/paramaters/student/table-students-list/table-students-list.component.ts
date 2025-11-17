import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogContent, MatDialogActions, MatDialogModule } from "@angular/material/dialog";
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { Student } from '../../../../models/parameters/student.model';
import { StudentService } from '../../../../service/parameters/student.service';
import { MatIcon } from "@angular/material/icon";
import { Attendants, AttendantsService } from '../../../../service/parameters/attendants.service';
import { CreateModelAttendants } from '../../../../models/parameters/attendants.model';
import { TuiDataList, TuiAlertService, TuiTextfield } from "@taiga-ui/core";
import { RelationShipType, RelationShipTypeEnum } from '../../../../global/model/enumGenero';
import { TuiStringHandler } from '@taiga-ui/cdk/types';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { TuiSelect} from '@taiga-ui/kit';
import { ActivatedRoute, Router } from '@angular/router';

import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatOption, MatSelect } from "@angular/material/select";

@Component({
  selector: 'app-table-students-list',
  imports: [MatDialogContent, MatDialogActions, MatButtonModule, MatDialogModule, ListadoGenericoComponent, MatIcon, FormsModule,
    ReactiveFormsModule,
    TuiDataList,
    TuiSelect,
    TuiTextfield, MatFormField, MatLabel, MatOption, MatSelect],
  templateUrl: './table-students-list.component.html',
  styleUrl: './table-students-list.component.css'
})
export class TableStudentsListComponent implements OnInit {

  // @Input({required: true})
  modelCreate !: CreateModelAttendants;

  studentList : Student[] = [];
  attendans !: Attendants;

  relationAdd: boolean = false;
  serviceStudents = inject(StudentService);
  servicesAttends = inject(AttendantsService);
  private readonly alerts = inject(TuiAlertService);
  readonly data = inject<{ id: number }>(MAT_DIALOG_DATA);

  relation: RelationShipTypeEnum[] = RelationShipType;


  private readonly formBuilder = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);

  formTypeRelation = this.formBuilder.nonNullable.group({
    relationShipTypeEnum:  new FormControl<number | null>(null, { validators: [Validators.required] })
  })

  protected readonly relationfy: TuiStringHandler<number> = (id) =>
      this.relation.find((item) => item.id === id)?.name ?? '';


  ngOnInit(): void {
    this.cargarDataStudent();
    // this.modelCreate.personId = this.dataPerson.id;

  }

  cargarDataStudent(){
    this.serviceStudents.obtenerTodos(1).subscribe({
      next: (data) => {
        this.studentList = data;
      },
      error: (error) =>{
        this.studentList = [];
        console.error(error);
      }
    });
  }

  addstudents(id: number){
    let preparar : CreateModelAttendants = {
      personId: this.data.id,
      studentId: id,
      relationShipTypeEnum: 0,
      status: 1
    }

    this.relationAdd = true;
    this.modelCreate = preparar;
  }

  addRelation(){
    let dataForm = this.formTypeRelation.getRawValue();

    this.modelCreate.relationShipTypeEnum = dataForm.relationShipTypeEnum ?? 0;
    // console.log(this.modelCreate.relationShipTypeEnum);

    this.servicesAttends.crear(this.modelCreate).subscribe({
      next: ()=>{
        this.alerts.open("Exitoso", { label: 'Relación agregada con exito!', appearance: 'success', }).subscribe();
        this.refreshRoute();
      },
      error: () => {
        this.alerts.open("Ups!", { label: 'Relacion no fue aplicada!', appearance: 'error' }).subscribe();
      }
    })


    // ==================== retorno de data =====================
    // this.posteoAttendans.emit(dataForm.relationShipTypeEnum ?? 0);
  }


  refreshRoute() {
    const current = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([current]);
    });
  }

}
