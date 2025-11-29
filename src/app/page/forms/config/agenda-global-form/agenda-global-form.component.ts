import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { AsignacionAgendaService } from '../../../../service/business/asignacion-agenda.service';
import { QuestionCompositionQueryDto } from '../../../../models/business/agenda.model';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RegisterGlobalStudentAnswersDto, RegisterStudentAnswersDto, StudentAnswerInputDto } from '../../../../models/business/studentAsware.mode';
import { StudentAnswerService } from '../../../../service/business/stundeAsware.service';

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
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './agenda-global-form.component.html',
  styleUrl: './agenda-global-form.component.css'
})
export class AgendaGlobalFormComponent implements OnInit, OnChanges {
  private fb = inject(FormBuilder);
  private agendaService = inject(AsignacionAgendaService);
  private studentAnswerService = inject(StudentAnswerService);


  /** id de la agenda que vas a pintar (se lo pasas desde el padre) */
  @Input({required: true}) agendaId!: number;

  @Input({required: true}) agendaDayId!: number;
  @Input({required: true}) groupId!: number;

  @Input() mode: 'global' | 'student' = 'global';
  @Input() agendaDayStudentId?: number | null;


  questions: QuestionCompositionQueryDto[] = [];
  form!: FormGroup;

  ngOnInit(): void {
    this.loadQuestions();
  }

  ngOnChanges(): void {
    // Si ya están las preguntas cargadas y cambia el modo o el estudiante, recargamos respuestas
    if (this.form && this.questions.length > 0) {
      if (this.mode === 'student' && this.agendaDayStudentId) {
        this.loadStudentAnswers();
      } else if (this.mode === 'global') {
        this.form.reset();
      }
    }
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
      }else if (q.nameAnswer === 'Number') {
        group[name] = new FormControl<number | null>(null);

      }else if (q.nameAnswer === 'Date') {
        group[name] = new FormControl<Date | null>(null);
      }else {
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

    const answers: StudentAnswerInputDto[] = this.questions.map(q => {
      const controlName = this.controlName(q);
      const value = raw[controlName];

      const dto: StudentAnswerInputDto = {
        questionId: q.id,
      };

      switch (q.nameAnswer) {
        case 'Text':
          dto.valueText = value ?? null;
          break;

        case 'Bool':
          dto.valueBool = value ?? null;
          break;

        case 'Number':
          dto.valueNumber = value ?? null;
          break;

        case 'Date':
          dto.valueDate = value ? (value as Date).toISOString() : null;
          break;

        case 'OptionSingle':
          dto.optionIds = value != null ? [value as number] : [];
          break;

        case 'OptionMulti':
          dto.optionIds = (value as number[] | null) ?? [];
          break;
      }

      return dto;
    });

    // 🔹 MODO GLOBAL
    if (this.mode === 'global') {
      const payload: RegisterGlobalStudentAnswersDto = {
        agendaDayId: this.agendaDayId,
        groupId: this.groupId,
        answers,
      };

      console.log('Payload GLOBAL a enviar:', payload);

      this.studentAnswerService.saveGlobalAnswers(payload).subscribe({
        next: () => {
          console.log('Agenda global guardada correctamente');
          this.form.markAsPristine();
        },
        error: (err) => {
          console.error('Error guardando agenda global', err);
        },
      });

    // 🔹 MODO INDIVIDUAL (estudiante)
    } else if (this.mode === 'student' && this.agendaDayStudentId) {
      const payload: RegisterStudentAnswersDto = {
        agendaDayStudentId: this.agendaDayStudentId,
        answers,
        status: 1
      };

      console.log('Payload INDIVIDUAL a enviar:', payload);

      this.studentAnswerService.saveStudentAnswers(payload).subscribe({
        next: () => {
          console.log('Agenda individual guardada correctamente');
          this.form.markAsPristine();
        },
        error: (err) => {
          console.error('Error guardando agenda individual', err);
        },
      });
    }
  }



  private loadStudentAnswers(): void {
    if (!this.agendaDayStudentId) return;

    this.studentAnswerService
      .getStudentAnswers(this.agendaDayStudentId)
      .subscribe({
        next: (dto) => {
          if (!dto || !dto.answers) return;

          // dto.answers: StudentAnswerInputDto[]
          for (const a of dto.answers) {
            const q = this.questions.find(q => q.id === a.questionId);
            if (!q) continue;

            const ctrlName = this.controlName(q);
            const ctrl = this.form.get(ctrlName);
            if (!ctrl) continue;

            switch (q.nameAnswer) {
              case 'Text':
                ctrl.setValue(a.valueText ?? null);
                break;

              case 'Bool':
                ctrl.setValue(a.valueBool ?? null);
                break;

              case 'Number':
                ctrl.setValue(a.valueNumber ?? null);
                break;

              case 'Date':
                ctrl.setValue(a.valueDate ? new Date(a.valueDate) : null);
                break;

              case 'OptionSingle':
                // opción única → primer id de OptionIds
                ctrl.setValue(
                  a.optionIds && a.optionIds.length > 0
                    ? a.optionIds[0]
                    : null
                );
                break;

              case 'OptionMulti':
                // múltiple → arreglo completo
                ctrl.setValue(a.optionIds ?? []);
                break;
            }

            ctrl.markAsPristine();
          }
        },
        error: (err) => {
          console.error('Error cargando respuestas del estudiante', err);
        },
      });
  }
}
