import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

// angular material


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
import { CreateModelPerson, PersonComplete } from '../../../../models/security/person.model';
import { FormTodosComponent } from "../../../forms/form-todos/form-todos.component";
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { infoModal } from '../../../../models/global/info-modal.model';
import { teacherComplete } from '../../../../models/business/teacher.model';
import { Attendants, CreateModelAttendants } from '../../../../models/parameters/attendants.model';
import { AttendantsService } from '../../../../service/parameters/attendants.service';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { ModalMaterialComponent } from "../../../../components/modal-material/modal-material.component";
import { TableStudentsListComponent } from "../../student/table-students-list/table-students-list.component";
import { getRelationrNameById } from '../../../../global/model/enumGenero';

@Component({
  selector: 'app-mi-familia',
  imports: [
    MatIcon,
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
    TuiHint,
    ListadoGenericoComponent,
    MatTooltipModule,
    RouterLink,
    ModalMaterialComponent
],
  templateUrl: './mi-familia.component.html',
  styleUrl: './mi-familia.component.css'
})

export class MiFamiliaComponent {

  // Modelos
  attendants: Attendants[] = [];
  filteredTeacher: Attendants[] = [];
  modelTeacher?: Teacher;

  model?: teacherComplete;

  modelUpdate !: PersonComplete;

  modalInfo!: infoModal;

  modelPerson?: PersonComplete;

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
  
  idPersonAttendans !: number;

  transpRelation(id: number){
    return getRelationrNameById(id);
  }


  // Servicios
  private readonly alerts = inject(TuiAlertService);
  private serviceAttendants = inject(AttendantsService);
  private servicePerson = inject(PersonService);

  route = inject(ActivatedRoute);


  router = inject(Router);

  ngOnInit(): void {
    // carga de informacion de la tabla
    const id = this.route.snapshot.paramMap.get('id') ?? "";
    this.idPersonAttendans = parseInt(id);


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



  closeModal(): void {
    this.open = false;
    this.modelTeacher = undefined;
    this.modelPerson = undefined;
    this.isEditMode = false;
  }

  cambiarStatus(status: number): void {
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  cargarData(status: number = 1): void {
    this.serviceAttendants.obtenerRelacionNinos(status,this.idPersonAttendans).subscribe((data) => {
      this.attendants = data;
      this.applyFilters();
    });
  }

  onSearch(term: string): void {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = this.attendants;

    if (this.searchTerm.trim() !== '') {
      filtered = this.attendants.filter((r) =>
        `${r.nameAttendant} ${r.identification}`
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

    this.serviceAttendants.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  deleteRegister(id: number, personId: number): void {
    this.serviceAttendants.eliminar(personId).subscribe({
      next: ()=>{
        this.alerts.open("Relación desvinculad", { label: 'Desviculación exitosa!' }).subscribe();
        this.cargarData();
      },
      error: (error) => {
        this.alerts.open("Ups!", { label: 'La relacion no pude borrarse!' }).subscribe();
      }
    });
  }

  goToStudent(id: number) {
    this.router.navigate(['/dashboard/acudientes', id]);
  }
}
