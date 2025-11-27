import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { AsignacionAgendaService } from '../../../../service/business/asignacion-agenda.service';
import { QuestionCompositionQueryDto } from '../../../../models/business/agenda.model';

@Component({
  selector: 'app-agenda-global-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,

  ],
  templateUrl: './agenda-global-form.component.html',
  styleUrl: './agenda-global-form.component.css'
})
export class AgendaGlobalFormComponent {
  private fb = inject(FormBuilder);
  private agendaService = inject(AsignacionAgendaService);

  /** id de la agenda que vas a pintar (se lo pasas desde el padre) */
  @Input({required: true}) agendaId!: number;

  questions: QuestionCompositionQueryDto[] = [];
  form!: FormGroup;

  ngOnInit(): void {
    this.loadQuestions();
  }

  // nombre del control por pregunta
  controlName(q: QuestionCompositionQueryDto): string {
    return `q_${q.id}`;
  }

  private buildForm(): void {
    const group: Record<string, FormControl> = {};

    for (const q of this.questions) {
      const name = this.controlName(q);

      if (q.nameAnswer === 'Bool') {
        group[name] = new FormControl<boolean | null>(null);
      } else if (q.nameAnswer === 'OptionMulti') {
        group[name] = new FormControl<number[]>([]); // ids de opciones seleccionadas
      } else if (q.nameAnswer === 'OptionSingle') {
        group[name] = new FormControl<number | null>(null); // id de la opción
      } else {
        // Text u otros
        group[name] = new FormControl<string | null>(null);
      }
    }

    this.form = this.fb.group(group);
  }

  private loadQuestions(): void {
    this.agendaService.getQuestionsByAgenda(this.agendaId).subscribe({
      next: (qs) => {
        this.questions = qs;
        this.buildForm();
      },
      error: (err) => console.error(err),
    });
  }

  // helpers para OptionMulti
  isSelected(q: QuestionCompositionQueryDto, optionId: number): boolean {
    const control = this.form.get(this.controlName(q));
    const value = (control?.value as number[] | null) ?? [];
    return value.includes(optionId);
  }

  toggleMulti(
    q: QuestionCompositionQueryDto,
    optionId: number,
    checked: boolean
  ): void {
    const control = this.form.get(this.controlName(q));
    if (!control) return;

    let value = (control.value as number[] | null) ?? [];

    if (checked) {
      if (!value.includes(optionId)) {
        value = [...value, optionId];
      }
    } else {
      value = value.filter((id) => id !== optionId);
    }

    control.setValue(value);
    control.markAsDirty();
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const raw = this.form.value;
    console.log('Respuestas de la agenda:', raw);
    // aquí luego armas el payload para guardar respuestas
  }
}
