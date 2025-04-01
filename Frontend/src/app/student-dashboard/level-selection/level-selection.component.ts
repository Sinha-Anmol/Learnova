// level-selection.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-level-selection',
  standalone: true,
  imports: [CommonModule, MatListModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Select Level for {{data.domain}}</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item (click)="selectLevel('Beginner')">
          <span matListItemTitle>Beginner</span>
        </mat-list-item>
        <mat-list-item (click)="selectLevel('Intermediate')">
          <span matListItemTitle>Intermediate</span>
        </mat-list-item>
        <mat-list-item (click)="selectLevel('Advanced')">
          <span matListItemTitle>Advanced</span>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
  `
})
export class LevelSelectionComponent {
  constructor(
    public dialogRef: MatDialogRef<LevelSelectionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { domain: string },
    private router: Router
  ) {}

  selectLevel(level: string) {
    this.router.navigate(['/content-list'], {
      queryParams: {
        domain: this.data.domain,
        level: level
      }
    });
    this.dialogRef.close();
  }
}