import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  displayName = 'cliente';

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    this.auth.user$.subscribe(user => this.displayName = user?.displayName ?? 'cliente');
  }

  requestService(): void {
    this.router.navigateByUrl('/dashboard');
  }

  contactWhatsapp(): void {
    window.open(`https://wa.me/${environment.adminWhatsapp}?text=${encodeURIComponent('Hola, quiero solicitar una mantención para mi computador.')}`, '_blank');
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    await this.router.navigateByUrl('/login');
  }

}
