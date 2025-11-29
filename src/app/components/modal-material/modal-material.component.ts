import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatDialog, MatDialogModule} from '@angular/material/dialog';
import { TableStudentsListComponent } from '../../page/paramaters/student/table-students-list/table-students-list.component';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-modal-material',
  standalone: true,
  imports: [MatButtonModule, MatIcon,MatDialogModule],
  templateUrl: './modal-material.component.html',
  styleUrl: './modal-material.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalMaterialComponent {
  readonly dialog = inject(MatDialog);
  route = inject(ActivatedRoute)

  openDialog() {
    const dialogRef = this.dialog.open(TableStudentsListComponent, {
      width: '800px',
      data : {
        id: Number(this.route.snapshot.paramMap.get('id'))
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
