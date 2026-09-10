import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-login', templateUrl: './login.page.html', styleUrls: ['./login.page.scss'], standalone: false })
export class LoginPage {
  loading = false;
  error = '';
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true; this.error = '';
    try { await this.auth.login(this.form.getRawValue().email, this.form.getRawValue().password); await this.router.navigateByUrl('/dashboard'); }
    catch { this.error = 'No pudimos iniciar sesión. Revisa tus datos e inténtalo nuevamente.'; }
    finally { this.loading = false; }
  }

  async googleLogin(): Promise<void> {
    this.loading = true; this.error = '';
    try { await this.auth.loginWithGoogle(); await this.router.navigateByUrl('/dashboard'); }
    catch { this.error = 'No pudimos iniciar sesión con Google.'; }
    finally { this.loading = false; }
  }
}