import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://learnova-production.up.railway.app/api/auth'; // Replace with your backend API URL

  constructor(private http: HttpClient, private router: Router) {}

  // Login method
  login(credentials: { email: string; password: string }) {
    return this.http.post<{ token: string; role: string }>(`${this.apiUrl}/login`, credentials);
  }

  // Logout method
  logout() {
    localStorage.removeItem('token'); // Remove token
    localStorage.removeItem('role'); // Remove role
    this.router.navigate(['/login']);
  }

  // Get the JWT token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Set the JWT token in localStorage
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // Get the user's role from localStorage
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Set the user's role in localStorage
  setRole(role: string) {
    localStorage.setItem('role', role);
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return !!this.getToken(); // Check if token exists
  }
}