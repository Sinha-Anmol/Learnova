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
  selectedFile: File | null = null;
  userId: string = '';
  isLoading: boolean = false;
  showUploadForm: boolean = false;
  uploadSuccess: boolean = false;

  domainOptions = [
    'FullStack',
    'Frontend',
    'Backend',
    'DevOps',
    'QualityAssurance',
    'Cloud'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      domain: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUserId();
  }

  getUserId() {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      this.snackBar.open('User email not found', 'Close', { duration: 3000 });
      return;
    }

    const token = localStorage.getItem('authToken');
    this.http.get(`https://learnova-production.up.railway.app/api/Analytics/GetUserIdByEmail?email=${encodeURIComponent(userEmail)}`, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: (response: any) => {
        this.userId = response.userId.toString();
      },
      error: (err) => {
        console.error('Error fetching user ID:', err);
        this.snackBar.open('Failed to fetch user ID', 'Close', { duration: 3000 });
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  toggleUploadForm() {
    this.showUploadForm = !this.showUploadForm;
    if (!this.showUploadForm) {
      this.uploadForm.reset();
      this.selectedFile = null;
      this.uploadSuccess = false;
    }
  }

  onSubmit() {
    if (!this.selectedFile || !this.uploadForm.valid || !this.userId) {
      this.snackBar.open('Please fill all required fields and select a file', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.uploadForm.get('title')?.value);
    formData.append('description', this.uploadForm.get('description')?.value);
    formData.append('userId', this.userId);
    formData.append('domain', this.uploadForm.get('domain')?.value);
    formData.append('level', this.uploadForm.get('level')?.value);

    const token = localStorage.getItem('authToken');
    this.http.post('https://learnova-production.up.railway.app/api/Aws/upload', formData, {
      headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
    }).subscribe({
      next: (response) => {
        this.uploadSuccess = true;
        this.snackBar.open('Video Uploaded Successfully', 'Close', { duration: 3000 });
        this.uploadForm.reset();
        this.selectedFile = null;
        setTimeout(() => {
          this.showUploadForm = false;
          this.uploadSuccess = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Error uploading file:', err);
        this.snackBar.open('Failed to upload file', 'Close', { duration: 3000 });
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
