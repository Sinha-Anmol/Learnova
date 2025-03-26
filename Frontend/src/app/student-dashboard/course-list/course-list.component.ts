import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, HttpClientModule],
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.scss'],
})
export class CourseListComponent {
  courses: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.http.get<any[]>('http://localhost:7030/api/courses').subscribe({
      next: (response) => {
        this.courses = response;
      },
      error: (error) => {
        console.error('Failed to fetch courses:', error);
      },
    });
  }

  viewCourseDetails(courseId: number) {
    this.router.navigate(['/student/course', courseId]);
  }
}