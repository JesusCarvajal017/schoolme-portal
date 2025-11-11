import { Component, HostListener, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { SidebarItem } from '../../../models/sidebar-item.model';

@Component({
  selector: 'app-menu',
  imports: [MatIconModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  @Input() dataSlidebar: SidebarItem[] = [];
  
  @Input()
  indicador!: number;

  idMenu !: string ;

  ngOnInit(): void{
    this.idMenu = `sidebarAccordion${this.indicador}`; 

  }


  // isOpen: Record<string, boolean> = {};

  // @HostListener('document:shown.bs.collapse', ['$event'])
  // onShown(e: any) {
  //   const id = e?.target?.id;
  //   if (id) this.isOpen[id] = true;
  // }

  // @HostListener('document:hidden.bs.collapse', ['$event'])
  // onHidden(e: any) {
  //   const id = e?.target?.id;
  //   if (id) this.isOpen[id] = false;
  // }
}
