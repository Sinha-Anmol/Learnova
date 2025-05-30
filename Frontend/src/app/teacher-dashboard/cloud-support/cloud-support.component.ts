import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cloud-support',
  templateUrl: './cloud-support.component.html',
  styleUrls: ['./cloud-support.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class CloudSupportComponent implements OnInit {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  isLoading: boolean = false;
  isDragging: boolean = false;

  // Stats properties
  totalVideos: number = 0;
  totalStudents: number = 0;
  averageRating: number = 0;

  domainOptions = [
    'FullStack',
    'Frontend',
    'Backend',
    'DevOps',
    'QualityAssurance',
    'Cloud'
  ];

  levelOptions = [
    'Beginner',
    'Intermediate',
    'Advanced'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      keyTopics: ['', Validators.required],
      domain: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    const token = localStorage.getItem('authToken');
    this.http.get('https://localhost:7030/api/Analytics/GetTeacherStats', {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: (response: any) => {
        this.totalVideos = response.totalVideos || 0;
        this.totalStudents = response.totalStudents || 0;
        this.averageRating = response.averageRating || 0;
      },
      error: (err) => {
        console.error('Error loading stats:', err);
      }
    });
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      this.handleFiles(files);
    }
  }

  private handleFiles(files: FileList) {
    const videoFiles = Array.from(files).filter(file => 
      file.type.startsWith('video/') && 
      ['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)
    );

    if (videoFiles.length === 0) {
      this.snackBar.open('Please select valid video files (MP4, WebM, or MOV)', 'Close', { 
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.selectedFiles = [...this.selectedFiles, ...videoFiles];
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  cancelUpload() {
    this.selectedFiles = [];
    this.uploadForm.reset();
  }

  onSubmit() {
    if (this.selectedFiles.length === 0 || !this.uploadForm.valid) {
      this.snackBar.open('Please fill all required fields and select at least one file', 'Close', { 
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    
    // Append course details
    formData.append('title', this.uploadForm.get('title')?.value);
    formData.append('description', this.uploadForm.get('description')?.value);
    formData.append('keyTopics', this.uploadForm.get('keyTopics')?.value);
    formData.append('domain', this.uploadForm.get('domain')?.value);
    formData.append('level', this.uploadForm.get('level')?.value);
    formData.append('teacherEmail', localStorage.getItem('userEmail') || '');

    // Append all selected files
    this.selectedFiles.forEach(file => {
      formData.append('files', file);
    });

    const token = localStorage.getItem('authToken');
    this.http.post('https://localhost:7030/api/LearnovaCourses/upload', formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: (response: any) => {
        this.snackBar.open('Course Uploaded Successfully', 'Close', { 
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.uploadForm.reset();
        this.selectedFiles = [];
        this.loadStats(); // Reload stats after successful upload
      },
      error: (err) => {
        console.error('Error uploading course:', err);
        this.snackBar.open('Failed to upload course', 'Close', { 
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
