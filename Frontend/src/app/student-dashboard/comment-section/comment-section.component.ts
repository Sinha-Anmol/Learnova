import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-comment-section',
  imports: [FormsModule, NgFor],
  standalone: true,
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnInit {
  comments: any[] = [];
  newComment: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadComments();
  }

  loadComments() {
    this.http.get('https://localhost:7030/api/comments')
      .subscribe((data: any) => {
        this.comments = data;
      });
  }

  postComment() {
    if (!this.newComment.trim()) return;

    this.http.post('https://localhost:7030/api/comments', { text: this.newComment })
      .subscribe(() => {
        this.newComment = '';
        this.loadComments();
      });
  }
}
