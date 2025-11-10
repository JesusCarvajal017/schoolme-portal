import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CreateModelMunicipality, Municipality } from '../../../models/parameters/Municipality.model';
import { RouterLink } from '@angular/router';

import { TuiHeader } from '@taiga-ui/layout';
import { TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import { TuiInputModule, TuiTextfieldControllerModule, TuiSelectModule } from '@taiga-ui/legacy';

import { TuiDataListWrapper } from '@taiga-ui/kit';
import { MatIconModule } from "@angular/material/icon";
import { CommonModule } from '@angular/common';

import { MunicipalityService } from '../../../service/parameters/Municipality.service';
import { DepartamentServices } from '../../../service/parameters/Departament.service';
import { Departament } from '../../../models/parameters/Departament.model';

@Component({
  selector: 'app-form-municipality',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSlideToggleModule,

    // Taiga
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfield,
    TuiDataList,
    TuiHint,
    MatIconModule,
    TuiDataListWrapper,
  ],
  templateUrl: './form-municipality.component.html',
  styleUrl: './form-municipality.component.css'
})
export class FormMunicipalityComponent implements OnInit, OnChanges {

  @Input({ required: true }) title: string = '';
  @Input({ required: true }) actionDescriptio!: string;
  @Input() model?: Municipality;

  @Output() posteoForm = new EventEmitter<CreateModelMunicipality>();

  private readonly formBuilder = inject(FormBuilder);
  private readonly municipalityService = inject(MunicipalityService);
  private readonly departamentService = inject(DepartamentServices);

  form = this.formBuilder.nonNullable.group({
    id: [0, { validators: [Validators.required, Validators.min(1)] }],
    departamentId: [0, { validators: [Validators.required, Validators.min(1)] }],
    status: [true],
  });

  ngOnInit(): void {
    this.cargarMunicipality();
    this.cargarDepartament();
  }

  ngOnChanges(): void {
    if (this.model) {
      const values = {
        id: this.model.id,
        departamentId: this.model.departamentId,
        status: this.model.status == 1 ? true : false,
      };
      this.form.patchValue(values);
    }
  }

  municipalityList: Municipality[] = [];
  municipalityListById = new Map<number, string>();

  idToNameMunicipality = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.municipalityListById.get(id) ?? '';
  };

  cargarMunicipality(): void {
    this.municipalityService.obtenerTodos().subscribe(data => {
      this.municipalityList = data;
      this.municipalityListById = new Map(this.municipalityList.map(d => [d.id, d.name]));
    });
  }

  departamentList: Departament[] = [];
  departamentListById = new Map<number, string>();

  idToNameDepartament = (v: number | string | null | undefined): string => {
    if (v == null) return '';
    const id = typeof v === 'string' ? Number(v) : v;
    return this.departamentListById.get(id) ?? '';
  };

  cargarDepartament(): void {
    this.departamentService.obtenerTodos().subscribe(data => {
      this.departamentList = data;
      this.departamentListById = new Map(this.departamentList.map(d => [d.id, d.name]));
    });
  }

  // Emitir formulario
  emitirValoresForm(): void {
    if (this.form.valid) {
      const capture = this.form.getRawValue();

      const dataDepartament: CreateModelMunicipality = {
        id: capture.id,
        departamentId: capture.departamentId,
        name: this.idToNameMunicipality(capture.id),
        departamentName: this.idToNameDepartament(capture.departamentId),
        status: capture.status ? 1 : 0
      };

      this.posteoForm.emit(dataDepartament);
    }
  }

  guardarCambios(): void {
    this.emitirValoresForm();
  }
}
