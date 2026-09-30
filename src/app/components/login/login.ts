import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  name = '';
  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    const trimmed = this.name.trim();
    if (!trimmed) {
      this.errorMessage.set('Enter your name to continue.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth.login(trimmed).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigateByUrl('/setup');
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Couldn't sign you in. Please try again.");
      },
    });
  }
}
