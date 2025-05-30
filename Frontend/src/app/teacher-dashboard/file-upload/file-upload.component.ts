import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule, MatIconModule
  ],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {
  @Input() fileType: 'video' | 'pdf' = 'pdf';
  uploadForm: FormGroup;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    public router: Router
  ) {
    this.uploadForm = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.uploadForm.invalid || !this.selectedFile) return;

    this.isLoading = true;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('shortDescription', this.uploadForm.value.description);

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const endpoint = this.fileType === 'video' 
      ? 'https://localhost:7030/api/Multimedia/upload-video' 
      : 'https://localhost:7030/api/Multimedia/upload-pdf';

    this.http.post(endpoint, formData, { headers }).subscribe({
      next: (response) => {
        this.snackBar.open('File uploaded successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.router.navigate(['/teacher']);
      },
      error: (error) => {
        console.error('Upload failed:', error);
        this.snackBar.open(error.error?.message || 'Upload failed', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}