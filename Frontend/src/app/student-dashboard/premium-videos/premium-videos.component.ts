import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-premium-videos',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './premium-videos.component.html',
  styleUrls: ['./premium-videos.component.scss']
})
export class PremiumVideosComponent implements OnInit {
  courseUid: string = '';
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {}

  searchCourse() {
    if (!this.courseUid) {
      this.errorMessage = 'Please enter a Course UID';
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      this.errorMessage = 'Authentication token not found';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.http.get(`https://localhost:7030/api/LearnovaCourses/filter2?Uid=${this.courseUid}`, { headers })
      .subscribe({
        next: (response: any) => {
          // Navigate to complete-course with the course data
          this.router.navigate(['/student-dashboard/premium-videos/complete-course'], {
            state: { courseData: response }
          });
        },
        error: (error) => {
          this.errorMessage = 'Error fetching course details. Please try again.';
          console.error('Error:', error);
        }
      });
  }
} 