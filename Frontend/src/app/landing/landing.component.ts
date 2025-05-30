import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Course {
  id: number;
  fileName: string;
  fileType: string;
  shortDescription: string;
  domain: string;
  level: string;
  uploadedOn: string;
  fileSize: number;
}

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    RouterLink,
    MatIconModule,
  ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  courses: Course[] = [];
  categories: string[] = [];
  selectedCategory: string = 'All';
  isDarkMode = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchCourses();
  }

  fetchCourses() {
    this.http.get<Course[]>('https://localhost:7030/api/Multimedia/all-files')
      .subscribe(courses => {
        this.courses = courses;
        this.categories = ['All', ...new Set(courses.map(course => course.domain))];
      });
  }

  getFilteredCourses(): Course[] {
    if (this.selectedCategory === 'All') {
      return this.courses;
    }
    return this.courses.filter(course => course.domain === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  
}