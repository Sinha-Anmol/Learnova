// src/app/services/analytics.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly apiUrl = 'https://learnova-production.up.railway.app/api/Analytics';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  getUserId(): Promise<number> {
    if (!this.isBrowser()) return Promise.resolve(0);
    
    const email = localStorage.getItem('userEmail');
    if (!email) return Promise.resolve(0);
    
    return this.http.get<{ userId: number }>(
      `${this.apiUrl}/GetUserIdByEmail?email=${encodeURIComponent(email)}`
    ).toPromise()
     .then(response => response?.userId || 0)
     .catch(() => 0);
  }

  getVideoProgress(userId: number, videoId: number): Promise<any> {
    return this.http.get(`${this.apiUrl}?userId=${userId}&videoId=${videoId}`)
      .toPromise()
      .catch(() => null);
  }

  saveVideoProgress(payload: any): Promise<any> {
    return this.http.post(this.apiUrl, payload)
      .toPromise()
      .catch(error => console.error('Error saving progress:', error));
  }
}