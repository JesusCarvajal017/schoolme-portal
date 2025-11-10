import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';
import { SidebarService } from '../../service/sidebar.service';
import { SidebarItem } from '../../models/sidebar-item.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatExpansionModule,
    RouterModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  sidebarItems: SidebarItem[] = [];

  constructor(private sidebarService: SidebarService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchSidebarItems();
  }

  fetchSidebarItems(): void {
    this.sidebarService.getSidebarItems().subscribe(items => {
      this.sidebarItems = items;
      this.cdr.detectChanges();
    });
  }
}
