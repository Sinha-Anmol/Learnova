import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

interface FileItem {
  id: number;
  fileName: string;
  fileType: string;
  shortDescription: string;
  uploadedOn: string;
  fileSize: number;
}

@Component({
  selector: 'app-file-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {
  displayedColumns: string[] = ['fileName', 'type', 'description', 'date', 'actions'];
  dataSource: FileItem[] = [];
  isLoading = true;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadFiles();
  }

  loadFiles() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<FileItem[]>('https://localhost:7030/api/Multimedia/my-files', { headers }).subscribe({
      next: (files) => {
        this.dataSource = files.map(file => ({
          ...file,
          uploadedOn: new Date(file.uploadedOn).toLocaleDateString()
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load files:', error);
        this.snackBar.open('Failed to load files', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  downloadFile(id: number) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    window.open(`https://localhost:7030/api/Multimedia/download/${id}`, '_blank');
  }

  getFileIcon(type: string): string {
    if (type.includes('pdf')) return 'picture_as_pdf';
    if (type.includes('video')) return 'videocam';
    return 'insert_drive_file';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}