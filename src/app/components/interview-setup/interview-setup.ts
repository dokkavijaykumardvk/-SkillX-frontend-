import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { InterviewService } from '../../services/interview.service';

@Component({
  selector: 'app-interview-setup',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './interview-setup.html',
  styleUrl: './interview-setup.css',
})
export class InterviewSetup {
  company = '';
  role = '';
  experience = '';
  technologiesInput = '';

  loading = signal(false);
  errorMessage = signal<string | null>(null);

  constructor(
    private interviewService: InterviewService,
    private router: Router
  ) {}

  submit(): void {
    const company = this.company.trim();
    const role = this.role.trim();
    const experience = this.experience.trim();
    const technologies = this.technologiesInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!company || !role || !experience || technologies.length === 0) {
      this.errorMessage.set('Fill in every field, including at least one technology.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.interviewService.start({ company, role, experience, technologies }).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.router.navigate(['/interview', response.interviewId, 'question']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Couldn't start the interview. Please try again.");
      },
    });
  }
}
