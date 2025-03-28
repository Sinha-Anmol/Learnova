import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdf-upload',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './pdf-upload.component.html',
  styleUrls: ['./pdf-upload.component.scss'],
})
export class PdfUploadComponent {
  uploadForm: FormGroup;
  isUploading = false;

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      file: [null, Validators.required],
      shortDescription: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.uploadForm.patchValue({ file });
    } else {
      this.snackBar.open('Please select a valid PDF file.', 'Close', { duration: 3000 });
      event.target.value = ''; // Reset file input
    }
  }

  uploadPdf() {
    if (this.uploadForm.invalid) {
      this.snackBar.open('Please select a valid PDF file and enter a description.', 'Close', { duration: 3000 });
      return;
    }
  
    const formData = new FormData();
    formData.append('file', this.uploadForm.value.file);
    formData.append('shortDescription', this.uploadForm.value.shortDescription);
  
    const token = localStorage.getItem('authToken'); // ✅ Correct token retrieval
  
    if (!token) {
      this.snackBar.open('Unauthorized: Please log in again.', 'Close', { duration: 3000 });
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // ✅ Correct token usage
    });
  
    this.isUploading = true;
    this.http.post('https://localhost:7030/api/Multimedia/upload-pdf', formData, { headers }).subscribe({
      next: () => {
        this.snackBar.open('PDF uploaded successfully!', 'Close', { duration: 3000 });
        this.uploadForm.reset();
      },
      error: (error) => {
        console.error('Upload error:', error);
        this.snackBar.open('Upload failed: ' + (error.error?.message || 'Unauthorized'), 'Close', { duration: 3000 });
      },
      complete: () => (this.isUploading = false),
    });
  }
}
