import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent {
  newItem: string = '';
  priority:string = '';
  description :string = '';
  constructor(public dialogRef: MatDialogRef<AddItemDialogComponent>) {}
  onCancelClick(): void {
    this.dialogRef.close();
  }
}
