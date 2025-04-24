import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  constructor(
    public router: Router, 
    private http: HttpClient,
    private location: Location
  ) {}

  isLandingPage(): boolean {
    return this.router.url === '/';
  }

  isLoginPage(): boolean{
    return this.router.url === '/login';
  }

  isSignUpPage(): boolean{
    return this.router.url === '/signup';
  }

  isStudentPage(): boolean{
    return this.router.url === '/student'
  }

  isTeacherPage(): boolean{
    return this.router.url === '/teacher'
  }

  goBack(): void {
    this.location.back();
  }

    logout() {
      const token = localStorage.getItem('authToken');
      this.http.post('https://learnova-production.up.railway.app/api/auth/logout', {}, {
        headers: new HttpHeaders({ Authorization: `Bearer ${token}` })
      }).subscribe({
        next: () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userName');
          this.router.navigate(['/landing']);
        },
      });
    }
}