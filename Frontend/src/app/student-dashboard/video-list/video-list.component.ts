import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
  defaultThumbnail = 'assets/video-thumbnail.png';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    const apiUrl = 'https://localhost:7030/api/Multimedia/all-files';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.videos = data
          .filter(file => file.fileType.includes('video'))
          .map(video => ({
            ...video,
            safeUrl: this.createVideoUrl(video.fileData),
            thumbnail: this.defaultThumbnail
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
    // Remove any existing data URL prefix if present
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