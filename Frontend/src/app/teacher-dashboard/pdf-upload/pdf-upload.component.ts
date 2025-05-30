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
  selector: 'app-pdf-upload',
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
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss']
})
export class PdfUploadComponent implements OnInit {
  uploadForm: FormGroup;
  isUploading = false;
  selectedFile: File | null = null;
  isDragging = false;
  
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
    // Initialize any necessary data
  }

  private getLocalStorageItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
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
    if (file.type !== 'application/pdf') {
      this.snackBar.open('Please select a valid PDF file', 'Close', { duration: 3000 });
      return;
    }

    this.selectedFile = file;
    this.uploadForm.patchValue({ file });
    this.uploadForm.get('file')?.updateValueAndValidity();
  }

  uploadPdf() {
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
    this.http.post('https://localhost:7030/api/Multimedia/upload-pdf', formData, { headers }).subscribe({
      next: () => {
        this.snackBar.open('PDF uploaded successfully!', 'Close', { duration: 3000 });
        this.resetForm();
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