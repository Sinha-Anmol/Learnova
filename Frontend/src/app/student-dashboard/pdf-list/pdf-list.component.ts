// pdf-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute } from '@angular/router';

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
  templateUrl: './pdf-list.component.html'
})
export class PdfListComponent implements OnInit {
  pdfs: any[] = [];
  loading = true;
  error = false;
  domain = '';
  level = '';

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.domain = params['domain'] || '';
      this.level = params['level'] || '';
      this.loadPdfs();
    });
  }

  loadPdfs() {
    this.loading = true;
    this.error = false;
    
    this.http.get<any[]>('https://localhost:7030/api/Multimedia/all-files').subscribe({
      next: (allFiles) => {
        // Filter on client side
        this.pdfs = allFiles
          .filter(file => 
            file.fileType.includes('pdf') &&
            (this.domain ? file.domain === this.domain : true) &&
            (this.level ? file.level === this.level : true)
          )
          .map(pdf => ({
            ...pdf,
            safeUrl: this.sanitizer.bypassSecurityTrustResourceUrl(
              `data:${pdf.fileType};base64,${pdf.fileData}`
            )
          }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  viewPdf(pdf: any) {
    window.open(pdf.safeUrl, '_blank');
  }

  downloadPdf(pdf: any) {
    const link = document.createElement('a');
    link.href = `data:${pdf.fileType};base64,${pdf.fileData}`;
    link.download = pdf.fileName;
    link.click();
  }
}