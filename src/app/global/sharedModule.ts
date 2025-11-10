import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  exports: [
    // Angular core
    CommonModule,
    HttpClientModule,
    DatePipe,

    // Angular Material
    MatCardModule,
    MatSidenavModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule,

  ],
})
export class SharedModule {}