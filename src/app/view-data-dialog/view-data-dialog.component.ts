import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-data-dialog',
  templateUrl: './view-data-dialog.component.html',
  styleUrls: ['./view-data-dialog.component.scss']
})
export class ViewDataDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ViewDataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

}
