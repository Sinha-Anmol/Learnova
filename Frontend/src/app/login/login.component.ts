import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

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
    MatSnackBarModule
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
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.value;

      this.http.post<{ token: string }>(this.apiUrl, credentials).subscribe({
        next: (response) => {
          localStorage.setItem('authToken', response.token);
          
          // Decode the token to get the role
          const decodedToken = this.decodeJwt(response.token);
          const userRole = decodedToken?.role;
          
          // Check if the selected role matches the token role
          if (userRole && userRole.toLowerCase() === credentials.role.toLowerCase()) {
            // Redirect based on role
            this.router.navigate([`/${userRole.toLowerCase()}`]);
          } else {
            this.showError('Selected role does not match your account role.');
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
      const decoded = JSON.parse(atob(payload));
      console.log('Decoded token:', decoded); // For debugging
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });
  }
}