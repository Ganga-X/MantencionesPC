import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-register', templateUrl: './register.page.html', styleUrls: ['../login/login.page.scss'], standalone: false })
export class RegisterPage {
  loading = false; error = '';
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly form = this.formBuilder.nonNullable.group({ name: ['', [Validators.required, Validators.minLength(3)]], email: ['', [Validators.required, Validators.email]], whatsapp: ['', [Validators.required, Validators.pattern(/^\+?[0-9 ]{8,15}$/)]], password: ['', [Validators.required, Validators.minLength(6)]] });
  async submit(): Promise<void> { if (this.form.invalid) { this.form.markAllAsTouched(); return; } this.loading = true; this.error = ''; const value = this.form.getRawValue(); try { await this.auth.register(value.name, value.email, value.whatsapp, value.password); await this.router.navigateByUrl('/dashboard'); } catch { this.error = 'No pudimos crear la cuenta. Verifica el correo e inténtalo nuevamente.'; } finally { this.loading = false; } }
}