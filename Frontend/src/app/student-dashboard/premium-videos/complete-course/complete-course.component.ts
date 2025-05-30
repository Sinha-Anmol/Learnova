import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

interface Video {
  videoId: number;
  fileName: string;
  fileUrl: string;
  contentType: string;
}

interface CourseData {
  courseId: number;
  title: string;
  description: string;
  keyTopics: string;
  teacherEmail: string;
  domain: string;
  level: string;
  createdDate: string;
  uid: string;
  videos: Video[];
}

@Component({
  selector: 'app-complete-course',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './complete-course.component.html',
  styleUrls: ['./complete-course.component.scss']
})
export class CompleteCourseComponent implements OnInit {
  courseData: CourseData | null = null;
  selectedVideo: Video | null = null;

  // Collapsible sidebar sections
  showTopics = true;
  showNotes = false;
  showMessages = false;
  showCourseInfo = false;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      const response = navigation.extras.state['courseData'];
      if (Array.isArray(response) && response.length > 0) {
        this.courseData = response[0];
        if (this.courseData && this.courseData.videos && this.courseData.videos.length > 0) {
          this.selectedVideo = this.courseData.videos[0];
        }
      }
    }
  }

  ngOnInit(): void {
    if (!this.courseData) {
      this.router.navigate(['/student-dashboard/premium-videos']);
    }
  }

  getKeyTopics(): string[] {
    return this.courseData?.keyTopics.split(',').map(topic => topic.trim()) || [];
  }

  selectVideo(video: Video) {
    if (this.courseData && this.courseData.videos) {
      this.selectedVideo = video;
    }
  }

  getVideoLabel(index: number): string {
    return `Video ${index + 1}`;
  }

  toggleSection(section: string) {
    this.showTopics = section === 'topics' ? !this.showTopics : false;
    this.showNotes = section === 'notes' ? !this.showNotes : false;
    this.showMessages = section === 'messages' ? !this.showMessages : false;
    this.showCourseInfo = section === 'courseInfo' ? !this.showCourseInfo : false;
  }

  getSelectedVideoIndex(): number {
    if (!this.selectedVideo || !this.courseData) return -1;
    return this.courseData.videos.findIndex(v => v.videoId === this.selectedVideo!.videoId);
  }
}
