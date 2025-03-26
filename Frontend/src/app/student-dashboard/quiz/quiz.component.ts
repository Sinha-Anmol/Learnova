import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRadioModule, MatButtonModule, FormsModule, HttpClientModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  quiz: any;
  selectedAnswer: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    // Fetch the courseId from the route parameters
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.fetchQuiz(+courseId); // Convert courseId to a number
    }
  }

  fetchQuiz(courseId: number) {
    this.http.get<any>(`http://localhost:7030/api/quizzes/${courseId}`).subscribe({
      next: (response) => {
        this.quiz = response;
      },
      error: (error) => {
        console.error('Failed to fetch quiz:', error);
      },
    });
  }

  submitQuiz() {
    if (this.selectedAnswer === this.quiz.correctAnswer) {
      alert('Correct answer!');
    } else {
      alert('Wrong answer. Try again!');
    }
  }
}