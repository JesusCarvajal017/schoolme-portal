import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {TuiResponsiveDialogService} from '@taiga-ui/addon-mobile';
import {TuiButton, TuiDialogService} from '@taiga-ui/core';
import {TuiConfirmService} from '@taiga-ui/kit';
import {TuiInputModule} from '@taiga-ui/legacy';
import type {PolymorpheusContent} from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-modal-basic',
  imports:  [FormsModule, TuiButton, TuiInputModule],
  templateUrl: './modal-basic.component.html',
  styleUrl: './modal-basic.component.css', 
  providers: [
    TuiConfirmService,
    {
        provide: TuiDialogService,
        useExisting: TuiResponsiveDialogService,
    },
],
})
export class ModalBasicComponent {
  private readonly confirm = inject(TuiConfirmService);
  private readonly dialogs = inject(TuiDialogService);

  protected value = '';

  protected onModelChange(value: string): void {
      this.value = value;
      this.confirm.markAsDirty();
  }

  protected onClick(content: PolymorpheusContent): void {
      // alert('hola');
      const closeable = this.confirm.withConfirm({
          label: 'Are you sure?',
          data: {
              content: 'Your data will be <strong>lost</strong>',
          },
      });

      this.dialogs
          .open(content, {label: 'Form', closeable, dismissible: closeable})
          .subscribe({
              complete: () => {
                  this.value = '';
                  this.confirm.markAsPristine();
              },
          });
  }
}
