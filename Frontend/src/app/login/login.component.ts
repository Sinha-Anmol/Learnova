import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar'; // For showing error messages

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  private apiUrl = 'https://localhost:7030/api/auth/login';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar // For showing error messages
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required], // Role selection field
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post<{ token: string }>(this.apiUrl, credentials).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          localStorage.setItem('authToken', response.token);

          const decodedToken = this.decodeJwt(response.token);
          const userRole = decodedToken?.role;

          // Ensure selected role matches the one in the token
          if (userRole === credentials.role) {
            this.router.navigate([`/${userRole.toLowerCase()}-dashboard`]); // Redirect to role-specific dashboard
          } else {
            this.showError('Selected role does not match our records.');
          }
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.showError('Invalid email, password, or role. Please try again.');
        },
      });
    } else {
      this.showError('Please fill out all fields correctly.');
    }
  }

  private decodeJwt(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000, // Show error for 5 seconds
      panelClass: ['error-snackbar'], // Custom style for error messages
    });
  }
}