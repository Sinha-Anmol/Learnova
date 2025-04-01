// content-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-content-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {
  content: any[] = [];
  loading = true;
  error = false;
  domain = '';
  level = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.domain = params['domain'];
      this.level = params['level'];
      this.loadContent();
    });
  }

  loadContent() {
    this.loading = true;
    this.error = false;
    
    this.http.get<any[]>('https://localhost:7030/api/Multimedia/all-files').subscribe({
      next: (data) => {
        this.content = data.filter(item => 
          item.domain === this.domain && 
          item.level === this.level
        );
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading content:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  viewContent(item: any) {
    const url = item.fileType.includes('pdf') 
      ? `/pdf-viewer?id=${item.id}`
      : `/video-viewer?id=${item.id}`;
    window.open(url, '_blank');
  }

  downloadContent(item: any) {
    const link = document.createElement('a');
    link.href = `/api/Multimedia/download/${item.id}`;
    link.download = item.fileName;
    link.click();
  }
}