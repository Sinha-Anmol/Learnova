import { Component, OnInit } from '@angular/core';
import { Router, RouterModule} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileListComponent } from './file-list/file-list.component';


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
    FileListComponent,
    RouterModule
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

  constructor(
    public router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    // Implement your stats loading logic here
    this.stats = {
      courses: 5,
      students: 42,
      files: 8
    };
  }

  navigateToUpload(type: 'video' | 'pdf') {
    this.router.navigate(['/teacher/upload', type]);
  }
}