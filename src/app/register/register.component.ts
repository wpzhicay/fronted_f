import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  photoPreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group(
      {
        alias: ['', Validators.required],
        name: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9]{7,15}$/), // Solo números, de 7 a 15 dígitos
          ],
        ],
        country: ['', Validators.required],
        province: ['', Validators.required],
        city: ['', Validators.required],
        address: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      this.selectedFileName = this.selectedFile.name;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.photoPreview = e.target?.result!;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onRegister() {
    if (this.registerForm.valid) {
      const {
        alias,
        name,
        email,
        phone,
        country,
        province,
        city,
        address,
      } = this.registerForm.value;

      const userData = {
        alias,
        name,
        email,
        phone,
        country,
        province,
        city,
        address,
        photo: this.photoPreview || null,
      };

      localStorage.setItem('userData', JSON.stringify(userData));
      this.router.navigate(['/dashboard']);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
