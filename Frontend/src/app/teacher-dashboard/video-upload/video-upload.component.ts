import { Component } from '@angular/core';

@Component({
  selector: 'app-video-upload',
  template: `
    <div class="upload-container">
      <h2>Upload Video</h2>
      <p>Video upload form will be implemented here</p>
    </div>
  `,
  styles: [`
    .upload-container {
      padding: 20px;
    }
  `],
  standalone: true
})
export class VideoUploadComponent {}