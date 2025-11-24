import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';


// Registrar Swiper Elements
// register();

@Component({
  selector: 'app-landing-home',
  imports: [CommonModule],
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LandingHomeComponent implements OnInit {
  images = [
    { src: './inicio/docentes.png', alt: 'docentes' },
    { src: './inicio/niños.png', alt: 'niños' },
    { src: './inicio/padres.png', alt: 'padres' },
    { src: './inicio/niños-aula.png', alt: 'aulas' }



  ];

  ngOnInit(): void {
    // Swiper se inicializa automáticamente con los web components
  }
}
