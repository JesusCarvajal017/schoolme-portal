import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

// angular material
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';

// taiga-ui
import { TuiHeader } from '@taiga-ui/layout';
import { TuiButtonGroup } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiDialog, TuiHint } from '@taiga-ui/core';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { Teacher } from '../../../../models/parameters/teacher.model';
import { PersonService } from '../../../../service/person.service';
import { CreateModelPerson, Person, PersonComplete, PersonOrigin } from '../../../../models/security/person.model';
import { FormTodosComponent } from "../../../forms/form-todos/form-todos.component";
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { infoModal } from '../../../../models/global/info-modal.model';
import { teacherComplete } from '../../../../models/business/teacher.model';
import { Attendants, CreateModelAttendants } from '../../../../models/parameters/attendants.model';
import { AttendantsService } from '../../../../service/parameters/attendants.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-landig-page',
  imports: [
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
    FormTodosComponent,
    ListadoGenericoComponent,
    MatTooltipModule
],
  templateUrl: './landig-page.component.html',
  styleUrl: './landig-page.component.css'
})
export class LandigPageComponent {
  // Modelos
  attendants: Attendants[] = [];
  filteredTeacher: PersonOrigin[] = [];
  modelTeacher?: Teacher;

  model?: teacherComplete;

  modelUpdate !: PersonComplete;

  modalInfo!: infoModal;

  modelPerson!: PersonOrigin[];

  // indice del estado de consulta
  idicadorActive: number = 3;
  
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
  private serviceAttendants = inject(AttendantsService);
  private servicePerson = inject(PersonService)
  router = inject(Router);

  ngOnInit(): void {
    // carga de informacion de la tabla
    this.cargarData();
  }

  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Estado actualizado!' }).subscribe();
  }

  protected  modalCommand(action: number, id: number = 0): void { 
    if(action == 2){
      // input de correo electronico
      this.isUser= false;

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
    this.servicePerson.ObtenerComplete(id).subscribe({
      next: (data)=>{
        // modelo de person complete es decir, person <-> databasic
        this.modelUpdate = data;
      }
    });
  }

  clearData() : void{
    this.modelUpdate =  null!;
    this.idperson = 0;
  }

  // Modal para crear o editar
  handleSubmit(data: CreateModelPerson): void {
    if(this.modelUpdate){

      
      // del modelo de person sacamos el id de la persona
      var prId = this.modelUpdate.id ?? 0;
      data.status = 3;

      // actualizar person junto a databasic
      this.servicePerson.actulizarComplete(prId,data).subscribe({
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
      // parche chambon del estado
      data.status = 3;

      this.servicePerson.crearComplete(data,4).subscribe({
        next: (res) =>{
          Swal.fire("Exitoso", "Acudiente creado correctamente", "success");
          
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
    this.modelTeacher = undefined;
    this.modelPerson = [];
    this.isEditMode = false;
  }

  cambiarStatus(status: number): void {
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  cargarData(status: number = 3): void {
    this.servicePerson.obtenerTodosOrigin(status).subscribe((data) => {
      this.modelPerson = data;
      this.applyFilters();
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.modelPerson;

    if (this.searchTerm.trim() !== '') {
      filtered = this.modelPerson.filter((r) =>
        `${r.fisrtName} ${r.identification}`
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
    let value: number = event.checked ? 3 : 0;

    this.servicePerson.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  deleteRegister(id: number, personId: number): void {

    this.servicePerson.eliminar(personId).subscribe({
      next: ()=>{
        this.alerts.open("Limpieza aplicada", { label: 'Acudiente borrado con exito!' }).subscribe();
      }
    });

    this.serviceAttendants.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }

  goToStudent(id: number) {
    this.router.navigate(['/dashboard/acudientes/mifamilia', id]);
  }
}
