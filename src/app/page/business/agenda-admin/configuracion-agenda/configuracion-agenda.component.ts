import { Component, inject, OnInit } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AgendaModel, CompositionAgendaModel } from '../../../../models/business/agenda.model';
import { AgendaService } from '../../../../service/business/agenda.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { QuestionCompositionModel, QuestionModel } from '../../../../models/parameters/question.model';
import { AsignacionAgendaService } from '../../../../service/business/asignacion-agenda.service';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TuiAlertService, TuiDialog } from '@taiga-ui/core';
import { QuestionService } from '../../../../service/parameters/question.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-configuracion-agenda',
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
    ListadoGenericoComponent,
    SweetAlert2Module,

    // Taiga modal
    TuiDialog
],
  templateUrl: './configuracion-agenda.component.html',
  styleUrl: './configuracion-agenda.component.css'
})
export class ConfiguracionAgendaComponent implements OnInit {

  idAgenda!:number;
  nameGrado?: string;
  openModal: boolean = false;

  agenda !: AgendaModel;
  question!: QuestionModel;

  listQuestion: QuestionCompositionModel[] = [];

  listQuestionAdd: QuestionModel[] = [];

  // SERVICIOS
  private route = inject(ActivatedRoute);
  private servicesAgenda = inject(AgendaService);
  private servicesComposition = inject(AsignacionAgendaService);
  private servicesQuestion = inject(QuestionService);


  private readonly alerts = inject(TuiAlertService);


  ngOnInit(): void {
    this.idAgenda = parseInt(this.route.snapshot.paramMap.get('id') ?? "") ;
    this.cargaDataAgenda();
    this.listPreguntasRelacionadas();
  }

  cargaDataAgenda(){
    this.servicesAgenda.obtenerPorId(this.idAgenda).subscribe({
      next: (data)=>{
        this.agenda = data;
      }
    })
  }

  cargarListQuestion(){
    this.servicesQuestion.obtenerTodos().subscribe({
      next: (data) =>{
        this.listQuestionAdd = data;
      }
    })
  }

  listPreguntasRelacionadas(){
    this.servicesComposition.preguntasAgenda(this.idAgenda).subscribe({
      next: (data)=>{
        this.listQuestion = data;
      }
    })
  }

  deleteRegister(id: number){
    this.servicesComposition.eliminar(id).subscribe({
      next: ()=>{
        this.listPreguntasRelacionadas();
        this.alerts.open("success", { label: 'Pregunta borrada con exito!' }).subscribe();
      }
    });
  }


  addQuestion(id: number){
    let predata : CompositionAgendaModel =  {
      agendaId: this.idAgenda,
      status :1,
      questionId: id
    }

    this.servicesComposition.crear(predata).subscribe({
      next: () =>{
        this.openModal = false;
        Swal.fire("Exitoso", "Pregunta adjuntada a la agenda", "success");
        this.listPreguntasRelacionadas();
      }, error: () =>{

        Swal.fire("Ups", "La pregunta no pudo ser adjuntada a la agenda", "error");
      }
    })
  }

  

  modalCommand(action: number){
    this.openModal = true;
    this.cargarListQuestion();
  }


  






}
