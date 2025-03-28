import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-pdf-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './pdf-list.component.html',
  styleUrls: ['./pdf-list.component.scss']
})
export class PdfListComponent implements OnInit {
  pdfs: any[] = [];
  loading = true;
  error = false;
  defaultThumbnail = 'assets/pdf-thumbnail.png';

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.loadPdfs();
  }

  loadPdfs() {
    const apiUrl = 'https://localhost:7030/api/Multimedia/all-files';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.pdfs = data
          .filter(file => file.fileType.includes('pdf'))
          .map(pdf => ({
            ...pdf,
            safeUrl: this.createPdfUrl(pdf.fileData),
            thumbnail: this.defaultThumbnail
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching PDFs:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  createPdfUrl(base64Data: string): SafeResourceUrl {
    // Remove any existing data URL prefix if present
    const cleanBase64 = base64Data.replace(/^data:application\/pdf;base64,/, '');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `data:application/pdf;base64,${cleanBase64}`
    );
  }

  downloadPdf(pdf: any) {
    const link = document.createElement('a');
    link.href = `data:application/pdf;base64,${pdf.fileData}`;
    link.download = pdf.fileName;
    link.click();
  }

  viewPdf(pdf: any) {
    const pdfWindow = window.open('', '_blank');
    if (pdfWindow) {
      pdfWindow.document.write(`
        <html>
          <head>
            <title>${pdf.fileName}</title>
            <style>
              body, html { margin: 0; padding: 0; height: 100%; }
              embed { width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <embed src="data:application/pdf;base64,${pdf.fileData}#toolbar=0&navpanes=0&scrollbar=0" type="application/pdf">
          </body>
        </html>
      `);
    }
  }
}