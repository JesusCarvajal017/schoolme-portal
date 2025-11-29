import { Component, inject } from '@angular/core';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule, MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule, MatSlideToggle } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

// taiga-ui
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButtonGroup } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiDialog, TuiHint } from '@taiga-ui/core';

// terceros
import Swal from 'sweetalert2';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { AgendaModel, AgendaQuery } from '../../../../models/business/agenda.model';
import { infoModal } from '../../../../models/global/info-modal.model';
import { AgendaService } from '../../../../service/business/agenda.service';
import { CommonModule } from '@angular/common';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { FormAgendaAdminComponent } from "../../../forms/form-agenda-admin/form-agenda-admin.component";
import { MatMenu, MatMenuModule } from "@angular/material/menu";
import { Router } from '@angular/router';


@Component({
  selector: 'app-lading-agenda-admin',
  imports: [
    MatIcon,
    ListadoGenericoComponent,
    MatSlideToggle,
    CommonModule,
    TuiTitle,
    MatSidenavModule,
    MatCardModule,
    TuiHeader,
    TuiButtonGroup,
    TuiAppearance,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    SweetAlert2Module,
    TuiDialog,
    TuiHint,
    ListadoGenericoComponent,
    FormAgendaAdminComponent,
    MatMenu,
    MatMenuModule
],
  templateUrl: './lading-agenda-admin.component.html',
  styleUrl: './lading-agenda-admin.component.css'
})
export class LadingAgendaAdminComponent {

 // Modelos
  agenda: AgendaQuery[] = [];
  filteredTeacher: AgendaQuery[] = [];

  model?: AgendaModel;

  modelUpdate?: AgendaModel;

  modalInfo!: infoModal;

  idicadorActive: number = 1;
  titleTeacher!: string;
  isEditMode: boolean = false;
  idperson!: number; 

  // Modal
  protected open = false;

  // Búsqueda y paginación
  searchTerm: string = '';
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

   // acciones a realizar 
  // 0: ninguna, 1 : crear, 2 : actualizar
  action!: number;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  isUser !: boolean;

  // Servicios
  private readonly alerts = inject(TuiAlertService);
  private servicesAngenda = inject(AgendaService);
  // private servicePerson = inject(PersonService)

  ngOnInit(): void {
    // carga de informacion de la tabla
    this.cargarData();
  }

  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado actualizado!' }).subscribe();
  }

  protected  modalCommand(action: number, id: number = 0): void { 
    if(action == 2){
      
      var infoM : infoModal = {
        title : "actualizacion de datos",
        titleButton : "actualizar",
        descripcion : ""
      }

      // id de la entidad de teacher 
      // esto va a retoranar la informacion de la persona 
      this.idperson = id;

      // carga del modelo de person complete
      this.queryId(id);

      // informacion del modal para el usuario
      this.modalInfo = infoM;

    }else if(action == 1){

      // limpiar la data, para evitar que aparezcan llenos los campos al registrar
      this.clearData();

      // input de correo electronico, para el caso de crear person con user
      this.isUser= true;

      var infoM : infoModal = {
        title : "Registrar datos",
        titleButton : "Registrar",
        descripcion : ""
      }
      
      // informacion del modal para el usuario
      this.modalInfo = infoM;
    }
    else{
      this.clearData();
    }

    this.open = true;
  }

  // carga el modelo de person, no de la entidad propia
  queryId(id: number) : void {
    // consulta la entidad por medio del id la entidad propia
    this.servicesAngenda.obtenerPorId(id).subscribe({
      next: (data)=>{
        this.modelUpdate = data;
      }
    });
  }

  clearData() : void{
    this.modelUpdate =  null!;
    this.idperson = 0;
  }

  // Modal para crear o editar
  handleSubmit(data: AgendaModel): void {
    if(this.modelUpdate){
    
      data.id = this.idperson;

      // actualizar person junto a databasic
      this.servicesAngenda.actualizar(data).subscribe({
        next: () =>{
          this.closeModal();
          this.cargarData(this.idicadorActive);
          Swal.fire("Exitoso", "docente actualizado correctamente", "success");
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }else{
      // registrar
      this.servicesAngenda.crear(data).subscribe({
        next: (res) =>{

          console.log("Registro...");
          

          Swal.fire("Exitoso", "docente creado correctamente", "success");
          
          this.closeModal();
          this.cargarData(this.idicadorActive);
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }

  }

  closeModal(): void {
    this.open = false;
    this.isEditMode = false;
    this.modelUpdate  = undefined;
  }

  cambiarStatus(status: number): void {
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  cargarData(status: number = 1): void {
    this.servicesAngenda.obtenerTodos(status).subscribe((data) => {
      this.agenda = data;
      this.applyFilters();
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.agenda;

    if (this.searchTerm.trim() !== '') {
      filtered = this.agenda.filter((r) =>
        `${r.name} ${r.description}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredTeacher = filtered;
    this.totalPages = Math.ceil(this.filteredTeacher.length / this.pageSize);

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredTeacher.slice(start, start + this.pageSize);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  logical(event: any, id: number): void {
    let value: number = event.checked ? 1 : 0;

    this.servicesAngenda.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  deleteRegister(id: number): void {

    this.servicesAngenda.eliminar(id).subscribe({
      next: ()=>{
        this.cargarData(this.idicadorActive);
        this.alerts.open("Limpieza aplicada", { label: 'Pregunta borrada con exito!' }).subscribe();
      }
    });
  }

  router = inject(Router);

  asignacionAgenda(agendaId : number){
    this.router.navigate([`/dashboard/agendas/asignacion/${agendaId}`]);
  }

  confgAgenda(agendaId : number){
    this.router.navigate([`/dashboard/agendas/config/${agendaId}`]);
  }
}
