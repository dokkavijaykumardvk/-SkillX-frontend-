import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InterviewService } from '../../services/interview.service';
import { InterviewResult } from '../../models/interview.models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [],
  templateUrl: './results.html',
  styleUrl: './results.css',
})
export class Results implements OnInit {
  result = signal<InterviewResult | null>(null);
  loading = signal(true);
  errorMessage = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    const interviewId = Number(this.route.snapshot.paramMap.get('id'));

    this.interviewService.finish(interviewId).subscribe({
      next: (result) => {
        this.loading.set(false);
        this.result.set(result);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Couldn't load your results. Please try again.");
      },
    });
  }

  startNew(): void {
    this.interviewService.lastAnswer = null;
    this.router.navigateByUrl('/setup');
  }
}
