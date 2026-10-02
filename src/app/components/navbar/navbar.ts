import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private auth = inject(AuthService);
  private router = inject(Router);

  candidateName = this.auth.candidateName;
  showLogoutPopup = signal(false);

  openLogoutPopup(): void {
    this.showLogoutPopup.set(true);
  }

  cancelLogout(): void {
    this.showLogoutPopup.set(false);
  }

  confirmLogout(): void {
    this.showLogoutPopup.set(false);
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cancelLogout();
  }
}