import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';


interface VideoProgress {
  videoId: number;
  percentageWatched: number;
  lastWatched: string;
  fileName: string;
  enrolled: boolean;
}

interface CompletedCourse {
  id: number;
  fileName: string;
  domain: string;
  level: string;
}

@Component({
  selector: 'app-analysis-s',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule],
  templateUrl: './analysis-s.component.html',
  styleUrls: ['./analysis-s.component.scss', './analysis-s2.component.scss']
})
export class AnalysisSComponent implements OnInit {
  domains = ['FullStack', 'Frontend', 'Backend', 'DevOps', 'QualityAssurance', 'Cloud'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];
  progressData: { [key: string]: VideoProgress } = {};
  completedCourses: CompletedCourse[] = [];
  showReports = false;
  userId: number = 0;
  selectedDomain: string | null = null;
  selectedLevel: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const email = localStorage.getItem('userEmail');
    if (email) {
      this.http.get<{ userId: number }>(
        `https://localhost:7030/api/Analytics/GetUserIdByEmail?email=${encodeURIComponent(email)}`
      ).subscribe({
        next: (response) => {
          this.userId = response.userId;
        },
        error: () => {
          console.error('Failed to fetch userId from email');
        }
      });
    }
  }

  toggleReports() {
    this.showReports = !this.showReports;
    if (this.showReports && this.userId > 0) {
      this.fetchCompletedCourses();
    }
  }

  private fetchCompletedCourses() {
    this.http.get<CompletedCourse[]>(
      `https://localhost:7030/api/Analytics/completed-courses/${this.userId}`
    ).subscribe(courses => {
      this.completedCourses = courses;
    });
  }

  selectDomainLevel(domain: string, level: string) {
    this.selectedDomain = domain;
    this.selectedLevel = level;
    const key = this.getStorageKey(domain, level);

    if (!this.progressData[key]) {
      this.fetchProgressData(domain, level);
    }
  }

  private fetchProgressData(domain: string, level: string) {
    const key = this.getStorageKey(domain, level);
    this.progressData[key] = { enrolled: false } as VideoProgress;

    this.http.get<any[]>(
      `https://localhost:7030/api/Analytics/domain-files?domain=${domain}&level=${level}`
    ).subscribe({
      next: (videos) => {
        if (videos.length > 0) {
          const videoId = videos[0].id;
          this.fetchVideoProgress(domain, level, videoId);
        }
      }
    });
  }

  private fetchVideoProgress(domain: string, level: string, videoId: number) {
    const key = this.getStorageKey(domain, level);

    this.http.get<any>(
      `https://localhost:7030/api/Analytics?userId=${this.userId}&videoId=${videoId}`
    ).subscribe(progress => {
      this.progressData[key] = {
        videoId,
        percentageWatched: progress?.percentageWatched || 0,
        lastWatched: progress?.lastWatched || '',
        fileName: progress?.fileName || '',
        enrolled: true
      };
    });
  }

  private getStorageKey(domain: string, level: string): string {
    return `${domain}|${level}`;
  }

  getProgress(domain: string, level: string): number {
    const key = this.getStorageKey(domain, level);
    return this.progressData[key]?.percentageWatched || 0;
  }

  getColor(percentage: number): string {
    const hue = (percentage * 1.2).toString(10);
    return `hsl(${hue}, 100%, 50%)`;
  }

  isEnrolled(domain: string, level: string): boolean {
    const key = this.getStorageKey(domain, level);
    return this.progressData[key]?.enrolled || false;
  }

  getVideoName(domain: string, level: string): string {
    const key = this.getStorageKey(domain, level);
    return this.progressData[key]?.fileName || '';
  }
}
