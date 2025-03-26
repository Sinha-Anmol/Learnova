import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
 import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
})
export class LandingComponent {
  isDarkMode = false; // Default to light mode

  // Toggle dark mode
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
  }

  features = [
    {
      icon: '📚',
      title: 'Interactive Courses',
      description: 'Engage with interactive lessons, videos, and quizzes designed to enhance your learning experience.',
    },
    {
      icon: '🎓',
      title: 'Expert Instructors',
      description: 'Learn from industry experts with years of experience in their respective fields.',
    },
    {
      icon: '📈',
      title: 'Progress Tracking',
      description: 'Track your progress and achievements with personalized dashboards and analytics.',
    },
  ];
}