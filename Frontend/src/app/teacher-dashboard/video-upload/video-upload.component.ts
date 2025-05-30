import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {
  uploadForm: FormGroup;
  isUploading = false;
  selectedFile: File | null = null;
  isDragging = false;
  totalVideos = 0;
  totalStudents = 0;
  averageRating = 4.8;
  
  domains = ['FullStack', 'Frontend', 'Backend', 'DevOps', 'QualityAssurance', 'Cloud'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(500)]],
      domain: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStats();
    }
  }

  private getLocalStorageItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  loadStats() {
    const userEmail = this.getLocalStorageItem('email');
    if (!userEmail) return;

    const token = this.getLocalStorageItem('authToken');
    if (!token) return;

    const apiUrl = `https://localhost:7030/api/Multimedia/user-files?email=${encodeURIComponent(userEmail)}`;

    this.http.get(apiUrl, { 
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) 
    }).subscribe({
      next: (data: any) => {
        this.totalVideos = data.filter((file: any) => file.fileType.includes('video')).length;
        this.totalStudents = 150;
        this.averageRating = 4.8;
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
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.handleFile(file);
    }
  }

  private handleFile(file: File) {
    if (!file.type.startsWith('video/')) {
      this.snackBar.open('Please select a valid video file (MP4, AVI, MOV)', 'Close', { duration: 3000 });
      return;
    }

    this.selectedFile = file;
    this.uploadForm.patchValue({ file });
    this.uploadForm.get('file')?.updateValueAndValidity();
  }

  uploadVideo() {
    if (this.uploadForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', { duration: 3000 });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.uploadForm.value.file);
    formData.append('shortDescription', this.uploadForm.value.shortDescription);
    formData.append('domain', this.uploadForm.value.domain);
    formData.append('level', this.uploadForm.value.level);
  
    const token = this.getLocalStorageItem('authToken');
    if (!token) {
      this.snackBar.open('Please log in again', 'Close', { duration: 3000 });
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    this.isUploading = true;
    this.http.post('https://localhost:7030/api/Multimedia/upload-video', formData, { headers }).subscribe({
      next: () => {
        this.snackBar.open('Video uploaded successfully!', 'Close', { duration: 3000 });
        this.resetForm();
        this.loadStats();
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.snackBar.open('Upload failed: ' + (error.error?.message || 'Server error'), 'Close', { duration: 3000 });
      },
      complete: () => (this.isUploading = false),
    });
  }

  cancelUpload() {
    this.resetForm();
  }

  private resetForm() {
    this.selectedFile = null;
    this.uploadForm.reset();
    this.isUploading = false;
  }
}