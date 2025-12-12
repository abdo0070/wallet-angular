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
  emailPattern = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).{8,}$/;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Email and password are required.';
      return;
    }

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
        const userId = res.userId || 'user1';
        this.sharedService.setUser(userId, res.name);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.errorMessage = 'Login failed. Check API link or credentials.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}

