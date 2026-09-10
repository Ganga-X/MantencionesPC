import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({ selector: 'app-forgot-password', templateUrl: './forgot-password.page.html', styleUrls: ['../login/login.page.scss'], standalone: false })
export class ForgotPasswordPage {
  sent = false; error = '';
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  readonly form = this.formBuilder.nonNullable.group({ email: ['', [Validators.required, Validators.email]] });
  async submit(): Promise<void> { if (this.form.invalid) { this.form.markAllAsTouched(); return; } try { await this.auth.resetPassword(this.form.getRawValue().email); this.sent = true; } catch { this.error = 'No pudimos enviar el correo de recuperación.'; } }
}