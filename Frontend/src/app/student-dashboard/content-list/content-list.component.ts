// content-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface ContentItem {
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
  contents: ContentItem[] = [];
  loading = true;
  error = false;
  domain = '';
  level = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.domain = params['domain'];
      this.level = params['level'];
      this.fetchContents();
    });
  }

  private fetchContents() {
    this.loading = true;
    this.error = false;

    this.http.get<ContentItem[]>('https://learnova-production.up.railway.app/api/Multimedia/all-files')
      .subscribe({
        next: (items) => {
          this.contents = items.filter(item => 
            item.domain === this.domain && 
            item.level === this.level
          );
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching contents:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  viewContent(content: ContentItem) {
    this.router.navigate(['/student-dashboard/content-view', content.id]);
  }

  downloadContent(item: any) {
    const link = document.createElement('a');
    link.href = `/api/Multimedia/download/${item.id}`;
    link.download = item.fileName;
    link.click();
  }
}