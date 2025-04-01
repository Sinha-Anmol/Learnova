import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pdf-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss']
})
export class PdfUploadComponent {
  uploadForm: FormGroup;
  isUploading = false;
  
  domains = ['FullStack', 'Frontend', 'Backend', 'DevOps', 'QualityAssurance', 'Cloud'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  constructor(
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(500)]],
      domain: ['', Validators.required],
      level: ['', Validators.required]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.uploadForm.patchValue({ file });
      this.uploadForm.get('file')?.updateValueAndValidity();
    } else {
      alert('Please select a valid PDF file');
      event.target.value = '';
    }
  }

  uploadPdf() {
    if (this.uploadForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.uploadForm.value.file);
    formData.append('shortDescription', this.uploadForm.value.shortDescription);
    formData.append('domain', this.uploadForm.value.domain);
    formData.append('level', this.uploadForm.value.level);
  
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please log in again');
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  
    this.isUploading = true;
    this.http.post('https://localhost:7030/api/Multimedia/upload-pdf', formData, { headers }).subscribe({
      next: () => {
        alert('PDF uploaded successfully!');
        this.uploadForm.reset();
      },
      error: (error) => {
        console.error('Upload error:', error);
        alert('Upload failed: ' + (error.error?.message || 'Server error'));
      },
      complete: () => (this.isUploading = false),
    });
  }
}