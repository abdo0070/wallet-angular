import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, AuthResponse } from '../../services/auth.service';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  loading = false;
  errorMessage = '';

  formData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Inline field-level errors
  errors = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // -----------------------------------
  // PASSWORD RULE CHECKLIST STATE
  // -----------------------------------
  passwordRules = {
    minLength: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  // ---------------------------
  // CHECK PASSWORD LIVE
  // ---------------------------
  updatePasswordRules() {
    const p = this.formData.password;

    this.passwordRules.minLength = p.length >= 8;
    this.passwordRules.upper = /[A-Z]/.test(p);
    this.passwordRules.lower = /[a-z]/.test(p);
    this.passwordRules.number = /\d/.test(p);
    this.passwordRules.special = /[^A-Za-z0-9]/.test(p);

    // Also update confirm password validation
    this.validatePassword();
    this.validateConfirmPassword();
  }

  // ---------------------------
  // FIELD VALIDATION LOGIC
  // ---------------------------

  validateName() {
    this.errors.name = this.formData.name.trim().length < 2
      ? 'Name must be at least 2 characters.'
      : '';
  }

  validateEmail() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    this.errors.email = !emailPattern.test(this.formData.email)
      ? 'Invalid email format.'
      : '';
  }

  validatePassword() {
    const r = this.passwordRules;

    const valid =
      r.minLength && r.upper && r.lower && r.number && r.special;

    this.errors.password = valid ? '' : 'Password does not meet requirements.';
  }

  validateConfirmPassword() {
    this.errors.confirmPassword =
      this.formData.password !== this.formData.confirmPassword
        ? 'Passwords do not match.'
        : '';
  }

  // ---------------------------
  // SUBMIT FORM
  // ---------------------------
  onSubmit(form: NgForm) {

    this.validateName();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();

    // Stop if any field has errors
    if (
      this.errors.name ||
      this.errors.email ||
      this.errors.password ||
      this.errors.confirmPassword
    ) {
      this.errorMessage = 'Please fix the errors above.';
      return;
    }

    this.errorMessage = '';
    this.loading = true;

    this.authService.register(this.formData).subscribe({
      next: (res: AuthResponse) => {
        const userId = res.userId || '';
        this.sharedService.setUser(userId, res.name || this.formData.name, res.token);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.msg || 'Registration failed. Check API link or details.';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
