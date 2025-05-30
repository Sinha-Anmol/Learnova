import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { AnalyticsService } from '../../services/analytics.service';

// Define ContentItem interface directly in the component file
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
  private videoElement: HTMLVideoElement | null = null;
  private lastSavedTime = 0;
  private saveInterval: any;
  private userId = 0;
  private currentProgress: any = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private analyticsService: AnalyticsService,
    @Inject(PLATFORM_ID) private platformId: Object
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

    this.http.get<ContentItem>(`https://localhost:7030/api/Multimedia/file-by-id/${id}`)
      .subscribe({
        next: (content) => {
          this.content = content;
          if (content.fileType.startsWith('application/pdf')) {
            this.http.get(`https://localhost:7030/api/Multimedia/download/${content.id}`, {
              responseType: 'blob'
            }).subscribe(blob => {
              this.contentUrl = URL.createObjectURL(blob);
              this.loading = false;
            }, error => this.handleError(error));
          } else {
            this.contentUrl = `https://localhost:7030/api/Multimedia/download/${content.id}`;
            this.loading = false;
            if (isPlatformBrowser(this.platformId)) {
              this.initializeTracking();
            }
          }
        },
        error: (error) => this.handleError(error)
      });
  }

  private async initializeTracking() {
    if (!this.content || !this.content.fileType.startsWith('video/')) return;

    try {
      this.userId = await this.analyticsService.getUserId();
      if (this.userId) {
        this.currentProgress = await this.analyticsService.getVideoProgress(this.userId, this.content.id);
      }
      
      setTimeout(() => this.setupVideoTracking(), 500);
    } catch (error) {
      console.error('Tracking initialization failed:', error);
    }
  }

  private setupVideoTracking() {
    const videoEl = document.querySelector('.video-player');
    if (!videoEl) return;
    
    this.videoElement = videoEl as HTMLVideoElement;

    this.saveInterval = setInterval(() => this.saveProgress(false), 5000);

    this.videoElement.addEventListener('pause', () => this.saveProgress(false));
    this.videoElement.addEventListener('ended', () => this.saveProgress(true));

    window.addEventListener('beforeunload', this.saveProgressBeforeUnload.bind(this));
  }

  private async saveProgress(isFinal: boolean) {
    if (!this.videoElement || !this.content || !this.userId) return;

    const currentTime = this.videoElement.currentTime;
    const totalDuration = this.videoElement.duration;
    const percentageWatched = totalDuration ? (currentTime / totalDuration) * 100 : 0;

    if (!isFinal && 
        (currentTime - this.lastSavedTime < 5) && 
        (!this.currentProgress || percentageWatched <= this.currentProgress.percentageWatched + 5)) {
      return;
    }

    const payload = {
      userId: this.userId,
      videoId: this.content.id,
      currentTime,
      totalDuration,
      lastWatched: new Date().toISOString(),
      percentageWatched
    };

    try {
      await this.analyticsService.saveVideoProgress(payload);
      this.lastSavedTime = currentTime;
      this.currentProgress = payload;
    } catch (error) {
      console.error('Progress save failed:', error);
    }
  }

  private saveProgressBeforeUnload() {
    this.saveProgress(true);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.saveInterval) clearInterval(this.saveInterval);
      window.removeEventListener('beforeunload', this.saveProgressBeforeUnload);
      
      if (this.videoElement) {
        this.videoElement.removeEventListener('pause', () => this.saveProgress(false));
        this.videoElement.removeEventListener('ended', () => this.saveProgress(true));
      }
      
      if (this.contentUrl) {
        URL.revokeObjectURL(this.contentUrl);
      }
    }
  }

  private handleError(error: any) {
    console.error('Error:', error);
    this.error = true;
    this.loading = false;
  }

  getCertificate() {
    this.snackBar.open('Congratulations! Your certificate is being generated...', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}