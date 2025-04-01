import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatToolbarModule,
    MatTabsModule,
    RouterModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {
  stats = {
    courses: 0,
    students: 0,
    files: 0
  };

  userEmail: string | null = null;
  multimediaFiles: any[] = [];
  displayedColumns: string[] = ['fileName', 'fileType', 'domain', 'level', 'shortDescription', 'uploadedOn', 'fileSize'];
  
  // Domain and level options
  domains = ['FullStack', 'Frontend', 'Backend', 'DevOps', 'QualityAssurance', 'Cloud'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  // Filters
  selectedDomain = '';
  selectedLevel = '';

  constructor(
    public router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadUserEmail();
    this.loadStats();
    setTimeout(() => {
      if (this.userEmail) {
        this.loadUserFiles();
      } else {
        this.snackBar.open('User email not found', 'Close', { duration: 3000 });
      }
    }, 100); 
  }

  loadUserEmail() {
    this.userEmail = localStorage.getItem('email'); 
    if (!this.userEmail) {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = this.decodeJwt(token);
        this.userEmail = decodedToken?.unique_name || decodedToken?.email || null;
      }
    }
  }

  loadStats() {
    this.stats = {
      courses: 5,
      students: 42,
      files: 8
    };
  }

  loadUserFiles() {
    if (!this.userEmail) {
      this.snackBar.open('User email not found', 'Close', { duration: 3000 });
      return;
    }

    let apiUrl = `https://learnova-production.up.railway.app/api/Multimedia/user-files?email=${encodeURIComponent(this.userEmail)}`;
    
    if (this.selectedDomain) {
      apiUrl += `&domain=${this.selectedDomain}`;
    }
    if (this.selectedLevel) {
      apiUrl += `&level=${this.selectedLevel}`;
    }

    const token = localStorage.getItem('authToken');

    this.http.get(apiUrl, { 
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) 
    }).subscribe({
      next: (data: any) => {
        this.multimediaFiles = data;
      },
      error: (err) => {
        console.error('Error fetching files:', err);
        this.snackBar.open('Failed to load files', 'Close', { duration: 3000 });
      }
    });
  }

  applyFilters() {
    this.loadUserFiles();
  }

  resetFilters() {
    this.selectedDomain = '';
    this.selectedLevel = '';
    this.loadUserFiles();
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  navigateToUpload(type: 'video' | 'pdf') {
    this.router.navigate(['/teacher/upload', type]);
  }
}