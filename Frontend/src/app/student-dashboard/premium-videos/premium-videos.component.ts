import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-premium-videos',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './premium-videos.component.html',
  styleUrls: ['./premium-videos.component.scss']
})
export class PremiumVideosComponent implements OnInit {
  premiumVideos = [
    {
      title: '',
      description: '',
      price: '',
      duration: '10 hours',
      thumbnail: 'assets/images/math-thumbnail.jpg'
    },
    {
      title: '',
      description: '',
      price: '',
      duration: '',
      thumbnail: 'assets/images/physics-thumbnail.jpg'
    },
    {
      title: '',
      description: '',
      price: '',
      duration: '',
      thumbnail: 'assets/images/chemistry-thumbnail.jpg'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  purchaseVideo(video: any) {
    // Implement purchase logic here
    console.log('Purchasing video:', video);
  }
} 