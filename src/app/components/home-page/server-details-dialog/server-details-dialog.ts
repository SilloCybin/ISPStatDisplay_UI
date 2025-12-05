import {Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {ServerInterface} from '../../../models/interfaces/server.interface';

@Component({
  selector: 'server-details-dialog',
  templateUrl: './server-details-dialog.html',
  imports: [
    MatDialogTitle,
    MatDialogContent
  ],
})
export class ServerDetailsDialog {
  readonly data = inject<ServerInterface>(MAT_DIALOG_DATA);
}
