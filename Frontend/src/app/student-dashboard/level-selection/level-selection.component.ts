// level-selection.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-level-selection',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div class="level-selection-container">
      <div class="header">
        <h1>Select Your Level</h1>
        <p>Choose the difficulty level that best suits your current knowledge</p>
      </div>

      <div class="levels-grid">
        <div *ngFor="let level of levels" 
             class="level-card"
             [class.selected]="selectedLevel === level"
             (click)="selectLevel(level)">
          <div class="level-icon">
            <mat-icon>{{getLevelIcon(level)}}</mat-icon>
          </div>
          <h2>{{level}}</h2>
          <p>{{getLevelDescription(level)}}</p>
          <div class="level-stats">
            <span><mat-icon>video_library</mat-icon> {{getLevelVideos(level)}} Videos</span>
            <span><mat-icon>description</mat-icon> {{getLevelDocuments(level)}} Documents</span>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button mat-stroked-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Back
        </button>
        <button mat-raised-button 
                color="primary" 
                [disabled]="!selectedLevel"
                (click)="proceed()">
          Continue
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .level-selection-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
      padding: 40px 20px;
      color: #ffffff;
    }

    .header {
      text-align: center;
      margin-bottom: 40px;
      animation: fadeInDown 0.5s ease-out;

      h1 {
        font-size: 2.5rem;
        margin: 0;
        background: linear-gradient(45deg, #00BCD4, #03A9F4);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      p {
        font-size: 1.2rem;
        color: rgba(255, 255, 255, 0.8);
        margin-top: 10px;
      }
    }

    .levels-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .level-card {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 16px;
      padding: 25px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(5px);
      animation: fadeInUp 0.5s ease-out;

      &:hover {
        transform: translateY(-5px);
        border-color: #00BCD4;
        box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
      }

      &.selected {
        background: rgba(0, 188, 212, 0.1);
        border-color: #00BCD4;
        box-shadow: 0 8px 25px rgba(0, 188, 212, 0.2);
      }

      .level-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: rgba(0, 188, 212, 0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid rgba(0, 188, 212, 0.3);
        transition: all 0.3s ease;

        mat-icon {
          font-size: 2.5rem;
          width: 2.5rem;
          height: 2.5rem;
          line-height: 2.5rem;
          color: #00BCD4;
        }
      }

      h2 {
        font-size: 1.5rem;
        margin: 0 0 10px;
        color: #ffffff;
      }

      p {
        color: rgba(255, 255, 255, 0.7);
        margin-bottom: 20px;
      }

      .level-stats {
        display: flex;
        justify-content: center;
        gap: 20px;
        color: rgba(255, 255, 255, 0.6);
        font-size: 0.9rem;

        span {
          display: flex;
          align-items: center;
          gap: 8px;

          mat-icon {
            font-size: 1.2rem;
            width: 1.2rem;
            height: 1.2rem;
            line-height: 1.2rem;
            color: #00BCD4;
          }
        }
      }
    }

    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 40px;
      padding: 20px;

      button {
        padding: 12px 24px;
        font-size: 1rem;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;

        mat-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
          line-height: 1.2rem;
        }

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    @keyframes fadeInDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .level-selection-container {
        padding: 20px 15px;
      }

      .header {
        h1 {
          font-size: 2rem;
        }

        p {
          font-size: 1rem;
        }
      }

      .levels-grid {
        grid-template-columns: 1fr;
        gap: 15px;
      }

      .level-card {
        padding: 20px;

        .level-icon {
          width: 60px;
          height: 60px;

          mat-icon {
            font-size: 2rem;
            width: 2rem;
            height: 2rem;
            line-height: 2rem;
          }
        }

        h2 {
          font-size: 1.3rem;
        }

        .level-stats {
          flex-direction: column;
          gap: 10px;
        }
      }

      .action-buttons {
        flex-direction: column;
        gap: 15px;

        button {
          width: 100%;
          justify-content: center;
        }
      }
    }
  `]
})
export class LevelSelectionComponent implements OnInit {
  levels: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  selectedLevel: string | null = null;
  domain: string = '';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Get domain from route state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const state = navigation.extras.state as { domain: string };
      this.domain = state.domain;
    }
  }

  selectLevel(level: string) {
    this.selectedLevel = level;
  }

  getLevelIcon(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'school';
      case 'Intermediate':
        return 'trending_up';
      case 'Advanced':
        return 'workspace_premium';
      default:
        return 'school';
    }
  }

  getLevelDescription(level: string): string {
    switch (level) {
      case 'Beginner':
        return 'Perfect for those new to the subject. Start with the basics and build a strong foundation.';
      case 'Intermediate':
        return 'For learners with some experience. Dive deeper into concepts and practical applications.';
      case 'Advanced':
        return 'Challenging content for experienced learners. Master complex topics and advanced techniques.';
      default:
        return '';
    }
  }

  getLevelVideos(level: string): number {
    // Sample data - replace with actual API call
    switch (level) {
      case 'Beginner':
        return 15;
      case 'Intermediate':
        return 20;
      case 'Advanced':
        return 25;
      default:
        return 0;
    }
  }

  getLevelDocuments(level: string): number {
    // Sample data - replace with actual API call
    switch (level) {
      case 'Beginner':
        return 10;
      case 'Intermediate':
        return 15;
      case 'Advanced':
        return 20;
      default:
        return 0;
    }
  }

  goBack() {
    this.router.navigate(['/student-dashboard']);
  }

  proceed() {
    if (!this.selectedLevel) {
      this.snackBar.open('Please select a level', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['custom-snackbar']
      });
      return;
    }

    // Navigate to content list with selected level and domain
    this.router.navigate(['/student-dashboard/content-list'], {
      state: {
        domain: this.domain,
        level: this.selectedLevel
      }
    });
  }
}