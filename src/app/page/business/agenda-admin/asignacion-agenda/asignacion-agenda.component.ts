import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AgendaService } from '../../../../service/business/agenda.service';
import { GroupsService } from '../../../../service/parameters/groups.service';
import { GradeService } from '../../../../service/parameters/grade.service';
import { Grade } from '../../../../models/parameters/grade.model';
import { QGroupAgendaRelation } from '../../../../models/parameters/groups.model';
import { LoaderComponent } from "../../../../components/loader/loader.component";
import { forkJoin } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import Swal from 'sweetalert2';
import { AgendaModel } from '../../../../models/business/agenda.model';

interface GroupItem {
  id: number;
  name: string;
  selected?: boolean;
}

interface GradeBlock {
  id: number;
  name: string;
  groups: GroupItem[];
}  

@Component({
  selector: 'app-asignacion-agenda',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    RouterLink,
    LoaderComponent
],
  templateUrl: './asignacion-agenda.component.html',
  styleUrl: './asignacion-agenda.component.css'
})
export class AsignacionAgendaComponent implements OnInit{

  grades : Grade[] = [];
  groupsAgenda : QGroupAgendaRelation[] =[]; 

  // data inicial de las agendas asociadas a un grupo
  initialGroupsAgenda: QGroupAgendaRelation[] = [];

  idAgenda!:number;
  nameGrado?: string;
  isLoader:boolean = false;

  router = inject(Router);




  ngOnInit(): void {
    this.idAgenda = parseInt(this.route.snapshot.paramMap.get('id') ?? "") ;
    this.cargaDataAgenda();
    this.cargarGrados();
  }


  //  ========================================= servicios vista ======================================
  servicesAgenda = inject(AgendaService);
  servicioGruops = inject(GroupsService);
  servicesGrade = inject(GradeService);


  // servicesAsignacionAgenda = inject(Asig);
  private route = inject(ActivatedRoute);
  private readonly alerts = inject(TuiAlertService);

  private readonly formBuilder = inject(FormBuilder);


  formGrup = this.formBuilder.nonNullable.group({
    gradeId:  new FormControl<number | null>(null, { validators: [Validators.required] })
  })


  cargarGrados(){
    this.servicesGrade.obtenerTodos(1).subscribe({
      next: (data) =>{
        this.grades = data;
      }
    });
  }

  cargaDataAgenda(){
    this.servicesAgenda.obtenerPorId(this.idAgenda).subscribe({
      next: (data)=>{
        this.agenda = data;
      }
    })
  }

  cargarGrupos(gradeId: number, gradeName: string){
    this.servicioGruops.GroupsAgendasRelation(this.idAgenda, gradeId)
      .subscribe({
        next: (data) => {
          this.nameGrado = gradeName;
          this.groupsAgenda = data;

          // copia “plana” para comparar luego
          this.initialGroupsAgenda = data.map(g => ({ ...g }));
        }
      });
  
  }


  selectedGradeId = 1; // por defecto el primero o el que quieras

  agenda !: AgendaModel;


  onAssign(): void {
    this.isLoader = true;
      // 1. ver qué grupos cambiaron su estado
    const gruposCambiados = this.groupsAgenda.filter(g => {
      const original = this.initialGroupsAgenda.find(o => o.id === g.id);
      return !original || original.isAssigned !== g.isAssigned;
    });

     if (gruposCambiados.length === 0) {
        this.isLoader = false;
        Swal.fire("Sin cambios", "No hay asignaciones para actualizar", "info");
        return;
      }

    // 2. crear un array de peticiones (Observables)
    const peticiones = gruposCambiados.map(g => {
      const agendaIdToSend = g.isAssigned ? this.idAgenda : null;
      return this.servicioGruops.changeAgenda(g.id, agendaIdToSend);
    });

    // 3. esperar a que TODAS terminen
    forkJoin(peticiones).subscribe({
      next: () => {
       
        Swal.fire("Exitoso", "Asignacion exitosa", "success");
        this.isLoader= false;
        // opcional: refrescar estado inicial
        this.initialGroupsAgenda = this.groupsAgenda.map(g => ({ ...g }));
      },
      error: (err) => {
        console.error(err);
        this.isLoader= false;
      
      },
    });

  }

}
