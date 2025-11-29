import { ChangeDetectorRef, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CreateModelRol, Rol } from '../../../models/security/rol.model';
import { RouterLink } from '@angular/router';

import { TuiHeader} from '@taiga-ui/layout';
import { TuiDataList, TuiHint, TuiIcon, TuiTextfield, TuiTitle } from '@taiga-ui/core';
import {TuiInputModule, TuiTextfieldControllerModule, TuiSelectModule} from '@taiga-ui/legacy';

import { TuiCheckbox } from '@taiga-ui/kit';
import { MatIconModule } from "@angular/material/icon";
import { CreateModelGroups, Groups } from '../../../models/parameters/groups.model';
import { infoModal } from '../../../models/global/info-modal.model';
import { GradeService } from '../../../service/parameters/grade.service';
import { Grade } from '../../../models/parameters/grade.model';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-form-groups',
  imports: [FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule,
    MatButtonModule, MatSlideToggleModule,
    MatSelectModule, MatOptionModule,
    // RouterLink, TuiTitle, TuiHeader,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiSelectModule,
    TuiDataList,
    TuiHint,
    TuiCheckbox, MatIconModule,
    // TuiIcon,
    TuiTextfield
  ],
  templateUrl: './form-groups.component.html',
  styleUrl: './form-groups.component.css'
})
export class FormGroupsComponent implements OnInit, OnChanges { 

  @Input()
  modalInfo?: infoModal;

  @Input()
  model?: Groups;

  @Output()
  posteoForm = new EventEmitter<CreateModelGroups>();

  grades: Grade[] = [];

  stringifyGrade = (grade: Grade): string => grade.name;

  private readonly gradeService = inject(GradeService);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadGrades();
  }

  loadGrades(): void {
    this.gradeService.obtenerTodos(1).subscribe({
      next: (data) => {
        this.grades = data;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error loading grades:', err);
      }
    });
  }

  private readonly formBuilder = inject(FormBuilder);

  form = this.formBuilder.nonNullable.group({
    name: ['', {validators: [Validators.required, Validators.minLength(2)]}],
    gradeId: [0, {validators: [Validators.required, Validators.min(1)]}],
    amountStudents: ['0', {validators: [Validators.required, Validators.minLength(1)]}],
    status: [true],
  });

  ngOnChanges(): void {
    if(this.model){
      let values = {
        name: this.model.name,
        gradeId: this.model.gradeId,
        amountStudents: this.model.amountStudents,
        status: this.model.status == 1 ? true : false, // convertir el valor numerico a un valor booleano
      }
      this.form.patchValue(values); // cargar los datos en el formulario
    }
  }

  // funciones principales
  emitirValoresForm(){
    let capture = this.form.getRawValue(); // capturar los datos del formulario

    const dataGroups: any = {
      name: capture.name,
      gradeId: capture.gradeId,
      amountStudents: parseInt(capture.amountStudents) || 0,
      status: capture.status ? 1 : 0,
      agendaId: 0
    }

    // Only include id for updates
    if (this.model?.id) {
      dataGroups.id = this.model.id;
    }

    this.posteoForm.emit(dataGroups as CreateModelGroups);
  }

  guardarCambios(){
    // Método para futuras implementaciones
  }
}