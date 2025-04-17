import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LevelSelectionComponent } from './level-selection/level-selection.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss', './student-dashboard-extend.scss']
})
export class StudentDashboardComponent implements OnInit {
  domains = [
    { name: 'FullStack', icon: 'code' },
    { name: 'Frontend', icon: 'web' },
    { name: 'Backend', icon: 'storage' },
    { name: 'DevOps', icon: 'cloud' },
    { name: 'Quality Assurance', icon: 'verified' },
    { name: 'Cloud', icon: 'public' }
  ];

  userName: string = '';

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
  }

  openLevelSelection(domain: string) {
    this.dialog.open(LevelSelectionComponent, {
      data: { domain },
      width: '400px'
    });
  }

  navigateToAnalysis() {
    this.router.navigate(['/student-dashboard/analysisS']);
  }

  navigateToPremium() {
    this.router.navigate(['/student-dashboard/premium-courses']);
  }

  logout() {
    const token = localStorage.getItem('authToken');
    this.http.post('https://learnova-production.up.railway.app/api/auth/logout', {}, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        this.router.navigate(['/landing']);
      },
      error: (err) => {
        console.error('Error during logout:', err);
        this.snackBar.open('Error during logout', 'Close', { duration: 3000 });
      }
    });
  }
}