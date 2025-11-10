import { Component, inject, OnInit } from '@angular/core';
import { RegistersServices } from '../../../service/helpers/registers.service';
import { RegisterCount } from '../../../models/helpers/registers.model';

@Component({
  selector: 'app-landing-home',
  imports: [], // Removemos MatIconModule ya que usamos Font Awesome
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.css'
})
export class LandingHomeComponent implements OnInit {

  countRegister!: RegisterCount;

  // ============== services ==============
  servicesRegister = inject(RegistersServices);

  ngOnInit(): void {
    this.cargarDataRegister();
  }

  cargarDataRegister() {
    this.servicesRegister.getCoutRegister().subscribe({
      next: (data) => {
        this.countRegister = data;
      },
      error: (error) => {
        console.error('Error al cargar datos de registro:', error);
        // Opcional: manejar el error con un toast o mensaje
      }
    });
  }
}