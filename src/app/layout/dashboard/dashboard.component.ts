import { Component, inject } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';

import { TuiRoot, TuiDataListComponent, TuiDropdown, TuiScrollbar } from '@taiga-ui/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MenuComponent } from "../../components/nav/menu/menu.component";
import { SidebarItem } from '../../models/sidebar-item.model';
import { TuiAvatar } from "@taiga-ui/kit";
import { SidebarService } from '../../service/sidebar.service';
import { RouterModule } from "@angular/router";
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [MatSidenavModule, MatCardModule, TuiRoot, MatIconModule, MenuComponent, TuiAvatar, TuiDataListComponent, TuiDropdown, MatIcon, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  router = inject(Router);

  sidebarItems: SidebarItem[] = [];

  sidebarService = inject(SidebarService);

  // constructor(private sidebarService: SidebarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchSidebarItems();
  }

  fetchSidebarItems(): void {
    this.sidebarService.getSidebarItems().subscribe((items: SidebarItem[]) => {
      this.sidebarItems = items;

    });
  }


  cerrarSession() : void{
    localStorage.clear();
    this.router.navigate(['/login']);     
  }

}
