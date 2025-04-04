import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

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
  selector: 'app-content-view',
  templateUrl: './content-view.component.html',
  styleUrls: ['./content-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    NgxExtendedPdfViewerModule
  ]
})
export class ContentViewComponent implements OnInit, OnDestroy {
  content: ContentItem | null = null;
  contentUrl: string = '';
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const contentId = this.route.snapshot.paramMap.get('id');
    if (contentId) {
      this.fetchContent(contentId);
    }
  }

  private fetchContent(id: string) {
    this.loading = true;
    this.error = false;

    this.http.get<ContentItem[]>('https://learnova-production.up.railway.app/api/Multimedia/all-files')
      .subscribe({
        next: (items) => {
          const content = items.find(item => item.id === parseInt(id, 10));
          if (content) {
            this.content = content;

            if (content.fileType.startsWith('application/pdf')) {
              // Fetch PDF as a blob
              this.http.get(`https://learnova-production.up.railway.app/api/Multimedia/download/${content.id}`, {
                responseType: 'blob'
              }).subscribe(blob => {
                this.contentUrl = URL.createObjectURL(blob);
                this.loading = false;
              }, error => {
                console.error('Error loading PDF:', error);
                this.error = true;
                this.loading = false;
              });
            } else {
              // Direct URL for videos
              this.contentUrl = `https://learnova-production.up.railway.app/api/Multimedia/download/${content.id}`;
              this.loading = false;
            }
          } else {
            this.error = true;
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Error fetching content list:', error);
          this.error = true;
          this.loading = false;
        }
      });
  }

  ngOnDestroy() {
    // Release memory if an object URL was created
    if (this.contentUrl) {
      URL.revokeObjectURL(this.contentUrl);
    }
  }

  getCertificate() {
    this.snackBar.open('Congratulations! Your certificate is being generated...', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
