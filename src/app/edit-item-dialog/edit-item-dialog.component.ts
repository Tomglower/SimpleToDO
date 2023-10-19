  import { Component, Inject } from '@angular/core';
  import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

  @Component({
    selector: 'app-edit-item-dialog',
    templateUrl: './edit-item-dialog.component.html',
    styleUrls: ['./edit-item-dialog.component.css']
  })
  export class EditItemDialogComponent {
    text: string;
    description: string;
    priority : string;
    constructor(
      public dialogRef: MatDialogRef<EditItemDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: { text: string, description: string, priority:string }
    ) {
      this.text = data.text;
      this.description = data.description;
      this.priority =data.priority
    }

    onCancelClick(): void {
      this.dialogRef.close();
    }
  }