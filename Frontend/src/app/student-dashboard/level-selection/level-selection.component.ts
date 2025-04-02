// level-selection.component.ts
import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-level-selection',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="level-selection-container">
    <h2 mat-dialog-title>Select Level for {{data.domain}}</h2>
    <mat-dialog-content>
        <div class="levels-grid">
          <div *ngFor="let level of levels" 
               class="level-card"
               [class.selected]="selectedLevel === level"
               (click)="selectLevel(level)">
            <div class="level-icon">
              <mat-icon>{{getLevelIcon(level)}}</mat-icon>
            </div>
            <h3>{{level}}</h3>
            <p>{{getLevelDescription(level)}}</p>
          </div>
        </div>
    </mat-dialog-content>
    </div>
  `,
  styles: [`
    .level-selection-container {
      background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
      color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }

    mat-dialog-title {
      color: #ffffff;
      text-align: center;
      margin: 0;
      padding: 20px;
      background: rgba(0, 188, 212, 0.1);
      border-bottom: 1px solid rgba(0, 188, 212, 0.2);
    }

    mat-dialog-content {
      padding: 20px;
      max-height: 80vh;
      overflow-y: auto;
    }

    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      padding: 10px;
    }

    .level-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 15px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);

      &:hover {
        transform: translateY(-3px);
        border-color: #00BCD4;
        box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
      }

      &.selected {
        background: rgba(0, 188, 212, 0.1);
        border-color: #00BCD4;
        box-shadow: 0 4px 15px rgba(0, 188, 212, 0.2);
      }

      .level-icon {
        width: 45px;
        height: 45px;
        margin: 0 auto 10px;
        background: rgba(0, 188, 212, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(0, 188, 212, 0.3);
        transition: all 0.3s ease;

        mat-icon {
          font-size: 1.6rem;
          width: 1.6rem;
          height: 1.6rem;
          line-height: 1.6rem;
          color: #00BCD4;
        }
      }

      h3 {
        font-size: 1.2rem;
        margin: 0 0 6px;
        color: #ffffff;
      }

      p {
        color: rgba(255, 255, 255, 0.7);
        margin: 0;
        font-size: 0.85rem;
      }
    }

    @media (max-width: 768px) {
      .levels-grid {
        grid-template-columns: 1fr;
        gap: 10px;
      }

      .level-card {
        padding: 12px;

        .level-icon {
          width: 40px;
          height: 40px;

          mat-icon {
            font-size: 1.4rem;
            width: 1.4rem;
            height: 1.4rem;
            line-height: 1.4rem;
          }
        }

        h3 {
          font-size: 1.1rem;
        }

        p {
          font-size: 0.8rem;
        }
      }
    }
  `]
})
export class LevelSelectionComponent {
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  selectedLevel: string | null = null;

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

  getLevelIcon(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'school';
      case 'Intermediate':
        return 'trending_up';
      case 'Advanced':
        return 'stars';
      default:
        return 'school';
    }
  }

  getLevelDescription(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'Perfect for those new to the subject';
      case 'Intermediate':
        return 'For those with some prior knowledge';
      case 'Advanced':
        return 'For experienced learners';
      default:
        return '';
    }
  }
}