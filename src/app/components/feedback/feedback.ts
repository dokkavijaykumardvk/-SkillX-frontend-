import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { InterviewService } from '../../services/interview.service';
import { AnswerResponse, ROUND_COMPLETED } from '../../models/interview.models';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [],
  templateUrl: './feedback.html',
  styleUrl: './feedback.css',
})
export class Feedback implements OnInit {
  interviewId!: number;
  result = signal<AnswerResponse | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.interviewId = Number(this.route.snapshot.paramMap.get('id'));

    const lastAnswer = this.interviewService.lastAnswer;
    if (!lastAnswer) {
      // Nothing to show, e.g. the page was reloaded directly. Send the
      // candidate back to a fresh question rather than showing a blank screen.
      this.router.navigate(['/interview', this.interviewId, 'question']);
      return;
    }

    this.result.set(lastAnswer);
  }

  continue(): void {
    const answer = this.result();
    if (!answer) {
      return;
    }

    if (answer.nextRound === ROUND_COMPLETED) {
      this.router.navigate(['/interview', this.interviewId, 'results']);
      return;
    }

    if (answer.roundCompleted) {
      // New round: the question screen fetches its first question by default.
      this.router.navigate(['/interview', this.interviewId, 'question']);
    } else {
      // Same round: tell the question screen to advance instead.
      this.router.navigate(['/interview', this.interviewId, 'question'], {
        queryParams: { mode: 'next' },
      });
    }
  }
}
