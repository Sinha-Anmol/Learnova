import { Component } from '@angular/core';

@Component({
  selector: 'app-pdf-upload',
  template: `
    <div class="upload-container">
      <h2>Upload PDF</h2>
      <p>PDF upload form will be implemented here</p>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 20px;
    }
  `],
  standalone: true
})
export class PdfUploadComponent {}