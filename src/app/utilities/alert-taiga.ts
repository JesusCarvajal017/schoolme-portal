import { inject, Injectable, TemplateRef, ViewChild } from "@angular/core";
import { TuiAlertService, TuiAlertContext } from "@taiga-ui/core";


@Injectable({
  providedIn: 'root'
})
export class AlertApp {
    mensage: string = "se a actulizado la persona";
    style : string = "positive";

    private readonly alerts = inject(TuiAlertService);
 
    @ViewChild('withdrawTemplate')
    protected withdrawTemplate?: TemplateRef<TuiAlertContext>;
 
    @ViewChild('depositTemplate')
    protected depositTemplate?: TemplateRef<TuiAlertContext>;

    showDepositAlert(): void {
      this.alerts
          .open(this.depositTemplate || '', {
              label: this.mensage,
              appearance: this.style,
              autoClose: 3000, // auto cerrado
          })
          .subscribe();
    }

}