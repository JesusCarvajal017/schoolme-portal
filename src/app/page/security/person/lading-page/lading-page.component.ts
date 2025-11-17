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
import { TuiButtonGroup  } from '@taiga-ui/kit';
import { TuiTitle, TuiAppearance, TuiAlertService, TuiButton, TuiDialog, TuiHint } from '@taiga-ui/core';
import {TuiInputModule} from '@taiga-ui/legacy';

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { PersonService } from '../../../../service/person.service';
import { CreateModelPerson, FormPersonValue, Person, PersonComplete, PersonOrigin } from '../../../../models/security/person.model';
import { FormControl, FormGroup } from '@angular/forms';
import { FormTodosComponent } from "../../../forms/form-todos/form-todos.component";
import { AlertApp } from '../../../../utilities/alert-taiga';
import { ListadoGenericoComponent } from "../../../../components/listado-generico/listado-generico.component";
import { EnitdadGenericoComponent } from "../../../../components/enitdad-generico/enitdad-generico.component";

@Component({
  standalone: true,
  selector: 'app-lading-page',
  imports: [
    CommonModule,
    MatSidenavModule,
    MatCardModule,
    TuiButtonGroup,
    TuiAppearance,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,
    SweetAlert2Module,
    // TuiAutoFocus,
    TuiDialog,
    TuiHint,
    TuiInputModule,
    // FormTodosComponent,
    ListadoGenericoComponent
],
  templateUrl: './lading-page.component.html',
  styleUrl: './lading-page.component.css',
})
export class LadingPageComponent implements OnInit {

  // ============================= MODELOS ===============================
  model?: PersonComplete;
  persons?: PersonOrigin[];
  filteredPersons?: PersonOrigin[] = [];

  // ========================= idicadores y apoyos =========================
  idicadorActive : number = 1;
  idperson !: number; 

  // acciones a realizar 
  // 0: ninguna, 1 : crear, 2 : actualizar
  action!: number;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  // configuracion tablas
  searchTerm: string = '';

  // configuracion tablas : paginación
  currentPage: number = 1;
  pageSize: number = 6; // 10 por página
  totalPages: number = 1;

  //  ======================= start modal ======================

    protected open = false;

    // metodo que abre el modal
    protected  modalCommand(title: string, id: number = 0): void { 
      if(id != 0){
        // cargado model para la actualización
        this.idperson = id;
        this.queryId(id);
        // console.log(this.model)

        this.action = 2;
      
      }else{
        this.clearData();
      }

      this.titleForm = title;
      this.open = true;
    }

    closeModal(): void {
      this.open = false;
      this.clearData();
    }

  //  ======================= end modal =======================================

  // =========================== servicios helper  ==========================
  private readonly alerts = inject(TuiAlertService);
  alertService = inject(AlertApp);

  roter = inject(Router);

  // ================= start servicios api =======================
  serviceEntity =  inject(PersonService);

  // ================= end servicios api =======================

  ngOnInit(): void {
    this.cargarData();
  }

  // =================================== funcionalidades transversales ===================================

  // notificación de estado
  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Se a cambiado el estado!' }).subscribe();
  }

  // búsqueda
  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

   // aplicar búsqueda + paginación
  applyFilters() {
    let filtered = this.persons;

    if (this.searchTerm.trim() !== '') {
      filtered = this.persons?.filter((p) =>
        `${p.fisrtName} ${p.secondName} ${p.lastName} ${p.secondLastName} ${p.identification} ${p.phone}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredPersons = filtered;
    this.totalPages = Math.ceil(this.filteredPersons!.length / this.pageSize);

    // corregir página actual si es mayor al total
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  // obtener personas de la página actual
  get paginatedPersons() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredPersons?.slice(start, start + this.pageSize);
  }

  // cambiar de página
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // =================================== metodos del componente ===================================s
  cambiarStatus(status : number){
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  // cargad data de entidad : Person
  cargarData(status : number = 1) {
    this.serviceEntity.obtenerTodosOrigin(status).subscribe({
      next:(data) => {
        this.persons = data;
        // console.log(this.persons)
        this.applyFilters();
      }
    });
  }

  queryId(id: number) : void {
    this.serviceEntity.ObtenerComplete(id).subscribe({
      next: (data)=>{
        // carga de data
        this.model = data;
      }
    });
  }

  createPerson(data : PersonComplete): void {
    // metodo de creacion
    this.serviceEntity.crear(data).subscribe({
      next: (data)=> {
        // this.idPerson = data.id;
        this.alertService.mensage = "se registrado el usuario";
        this.alertService.showDepositAlert();
      },
      error: err => {
        console.log('errores en la api')
      }
    });
  }


  // activar/desactivar persona
  logical(event: any, id: number) {
    let value: number = event.checked ? 1 : 0;
  
    this.serviceEntity.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
        console.log(this.idicadorActive);
      },
    });
  }

  // Eliminar registro de la entidad
  deleteRegister(id: number) {
    this.serviceEntity.eliminar(id).subscribe({
      next: ()=>{
        Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
        this.cargarData();

      },
      error : (error)=> {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.error.detail,
          // footer: '<a href="#">Why do I have this issue?</a>'
        });
        console.log(error);
      } 
    });
  }

  clearData() : void{
    this.model =  null!;
    this.idperson = 0;
  }

  // =================================================== Metodos de los modales ==================================================

  // ejecutador de accion del formulario de componente
  handleEpsSubmit(data: CreateModelPerson): void {

    if(this.model){
      this.model.id = this.idperson;
      // actualizar
      this.serviceEntity.actulizarComplete(this.idperson,data).subscribe({
        next: () =>{
          Swal.fire("Exitoso", "persona actualizado correctamente", "success");
          this.closeModal();
          this.cargarData();
        }, 
        error: (err) => {
          console.log(err);
          console.log(this.model)
        }
      });
      // console.log(data)
    }else{
      // registrar
      this.serviceEntity.crearComplete(data).subscribe({
        next: () =>{
          Swal.fire("Exitoso", "persona actualizado correctamente", "success");
          this.closeModal();
          this.cargarData();
        }, 
        error: (err) => {
          console.log(err);
        }
      });
    }

  }

}
