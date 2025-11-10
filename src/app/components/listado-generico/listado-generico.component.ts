import { Component, Input } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-listado-generico',
  imports: [LoaderComponent, MatIconModule],
  templateUrl: './listado-generico.component.html',
  styleUrl: './listado-generico.component.css'
})
export class ListadoGenericoComponent {

  @Input({required: true})
  elements?: any[];

}
