import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AudienceDialogData } from 'src/types/dialogs.model';

@Component({
  selector: 'app-audience-layout',
  templateUrl: './audience-layout.component.html',
  styleUrls: ['./audience-layout.component.scss']
})
export class AudienceLayoutComponent {

  constructor(
    public dialogRef: MatDialogRef<AudienceLayoutComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AudienceDialogData,
  ) { }

  close(): void {
    this.dialogRef.close();
  }
}
