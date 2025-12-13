import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loading = false;
  errorMessage = '';
  formData = {
    email: '',
    password: ''
  };
  emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,}$/;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  onSubmit(form: NgForm) {
    // Check for "required" errors specifically
    if (!this.formData.email || !this.formData.password) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

    // Check pattern errors manually if form validation failed but fields are present
    if (!this.emailPattern.test(this.formData.email)) {
      this.errorMessage = 'Enter a valid email address.';
      return;
    }

    if (!this.passwordPattern.test(this.formData.password)) {
      this.errorMessage = 'Password must be 8+ chars and include upper, lower, number, special.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.formData).subscribe({
      next: (res) => {
        const userId = res.userId || '';
        this.sharedService.setUser(userId, res.name, res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Login failed. Check API link or credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

