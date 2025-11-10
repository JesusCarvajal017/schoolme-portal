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

// terceros
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';

// servicios y modelos
import { UserService } from '../../../../service/user.service';
import { User } from '../../../../models/security/user.model';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-landing-user',
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
    RouterLink,
    SweetAlert2Module,
    // TuiButton,
    TuiDialog,
    TuiHint,
    
  ],
  templateUrl: './landing-user.component.html',
  styleUrl: './landing-user.component.css',
})
export class LandingUserComponent implements OnInit {

  // Atributos importantes de modulo
  user: User[] = [];
  filteredUsers: User[] = [];
  idicadorActive : number = 1;

  // titulo de los modales, segun la acción a relizar del crud
  titleForm!: string;

  
  //  ======================= funcionalidad del modal del taiga =======================
  protected open = false;

  protected modalCommand(title: string): void { 
      this.titleForm = title;
      this.open = true;
  }
  //  ======================= end =======================


  // servicio de alerta de taiga
  private readonly alerts = inject(TuiAlertService);

  // búsqueda
  searchTerm: string = '';

  // paginación
  currentPage: number = 1;
  pageSize: number = 5; // 5 por página
  totalPages: number = 1;

  constructor(private serviceUser: UserService, private router: Router) {
    this.cargarData();
  }

  ngOnInit(): void {}

  // notificación de estado
  protected showNotification(message: string): void {
    this.alerts.open(message, { label: 'Se a cambiado el estado!' }).subscribe();
  }

  cambiarStatus(status : number){
    this.idicadorActive = status;
    this.cargarData(this.idicadorActive);
  }

  // cargar usuarios desde el servicio
  cargarData(status : number = 1) {
    this.serviceUser.obtenerTodos(status).subscribe((data) => {
      this.user = data;
      this.applyFilters();
    });
  }

  // búsqueda
  onSearch(term: string) {
    this.searchTerm = term.toLowerCase();
    this.applyFilters();
  }

  // aplicar búsqueda + paginación
  applyFilters() {
    let filtered = this.user;

    if (this.searchTerm.trim() !== '') {
      filtered = this.user.filter((u) =>
        `${u.email}`
          .toLowerCase()
          .includes(this.searchTerm)
      );
    }

    this.filteredUsers = filtered;
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);

    // corregir página actual si es mayor al total
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  // obtener usuarios de la página actual
  get paginatedUsers() {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  // cambiar de página
  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // activar/desactivar usuario
  logical(event: any, id: number) {
    let value: number = event.checked ? 1 : 0;

    this.serviceUser.eliminarLogico(id, value).subscribe({
      next: () => {
        this.cargarData(this.idicadorActive);
        this.showNotification('Se ha cambiado el estado');
      },
    });
  }

  // eliminar usuario
  deleteRegister(id: number) {
    this.serviceUser.eliminar(id).subscribe(() => {
      Swal.fire('Exitoso', 'El registro ha sido eliminado correctamente', 'success');
      this.cargarData(this.idicadorActive);
    });
  }

}