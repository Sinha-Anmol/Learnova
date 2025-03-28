import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, MatIconModule, MatListModule],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  constructor(private router: Router) {}

  openVideosPage() {
    this.router.navigate(['/student-dashboard/videos']);
  }

  openPdfsPage() {
    this.router.navigate(['/student-dashboard/pdfs']);
  }

  // For future expansion
  cards = [
    {
      title: 'Video Library',
      description: 'Access all your course videos in one place',
      icon: 'ondemand_video',
      action: () => this.openVideosPage(),
      color: 'primary'
    },
    {
      title: 'PDF Resources',
      description: 'Download study materials and lecture notes',
      icon: 'picture_as_pdf',
      action: () => this.openPdfsPage(),
      color: 'accent'
    }
  ];
}