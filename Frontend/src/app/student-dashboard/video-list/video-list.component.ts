// video-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-video-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './video-list.component.html',
  styleUrls: ['./video-list.component.scss']
})
export class VideoListComponent implements OnInit {
  videos: any[] = [];
  loading = true;
  error = false;
  domain = '';
  level = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.domain = params['domain'] || '';
      this.level = params['level'] || '';
      this.loadVideos();
    });
  }

  loadVideos() {
    let url = 'https://learnova-production.up.railway.app/api/Multimedia/domain-files?fileType=video';
    if (this.domain) url += `&domain=${this.domain}`;
    if (this.level) url += `&level=${this.level}`;

    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        this.videos = data.map(video => ({
          ...video,
          safeUrl: this.createVideoUrl(video.fileData)
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching videos:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  createVideoUrl(base64Data: string): SafeResourceUrl {
    const cleanBase64 = base64Data.replace(/^data:video\/\w+;base64,/, '');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:video/mp4;base64,${cleanBase64}`
    );
  }

  downloadVideo(video: any) {
    const link = document.createElement('a');
    link.href = `data:video/mp4;base64,${video.fileData}`;
    link.download = video.fileName;
    link.click();
  }

  playVideo(video: any) {
    const videoWindow = window.open('', '_blank');
    if (videoWindow) {
      videoWindow.document.write(`
        <html>
          <head>
            <title>${video.fileName}</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; display: flex; justify-content: center; align-items: center; background: #000; }
              video { max-width: 100%; max-height: 100%; }
            </style>
          </head>
          <body>
            <video controls autoplay>
              <source src="data:video/mp4;base64,${video.fileData}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </body>
        </html>
      `);
    }
  }
}