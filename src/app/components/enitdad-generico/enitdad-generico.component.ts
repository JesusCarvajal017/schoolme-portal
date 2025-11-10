import { Component, Input } from '@angular/core';
import { LoaderComponent } from "../loader/loader.component";

@Component({
  selector: 'app-enitdad-generico',
  imports: [LoaderComponent],
  templateUrl: './enitdad-generico.component.html',
  styleUrl: './enitdad-generico.component.css'
})
export class EnitdadGenericoComponent {
  @Input({required: true})
  elements?: any;
}
