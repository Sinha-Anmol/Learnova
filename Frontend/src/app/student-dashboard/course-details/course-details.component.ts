import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
})
export class CourseDetailsComponent implements OnInit {
  course: any;
  commentForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });
  }

  ngOnInit() {
    // Fetch the courseId from the route parameters
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchCourseDetails(+courseId); // Convert courseId to a number
    }
  }

  fetchCourseDetails(courseId: number) {
    this.http.get<any>(`http://localhost:7030/api/courses/${courseId}`).subscribe({
      next: (response) => {
        this.course = response;
      },
      error: (error) => {
        console.error('Failed to fetch course details:', error);
      },
    });
  }

  onSubmitComment() {
    if (this.commentForm.valid) {
      const comment = this.commentForm.value.comment;
      // Call your backend API to post the comment
      console.log('Comment:', comment);
    }
  }

  downloadPdf() {
    window.open(this.course.pdfUrl, '_blank');
  }
}