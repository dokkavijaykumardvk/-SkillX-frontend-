import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

import { InterviewService } from '../../services/interview.service';
import { QuestionResponse } from '../../models/interview.models';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './question.html',
  styleUrl: './question.css',
})
export class Question implements OnInit, OnDestroy {
  interviewId!: number;
  currentQuestion = signal<QuestionResponse | null>(null);
  answer = '';

  loading = signal(true);
  submitting = signal(false);
  errorMessage = signal<string | null>(null);

  remainingSeconds = signal(0);
  private timerSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.interviewId = Number(this.route.snapshot.paramMap.get('id'));
    // When arriving after finishing a round's last question, the feedback
    // screen tags the navigation with ?mode=next so we advance within the
    // same round instead of re-fetching its first question.
    const advanceWithinRound = this.route.snapshot.queryParamMap.get('mode') === 'next';
    this.loadQuestion(advanceWithinRound);
  }

  ngOnDestroy(): void {
    this.timerSub?.unsubscribe();
  }

  get displayTime(): string {
    const total = this.remainingSeconds();
    const minutes = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const seconds = Math.floor(total % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  submit(): void {
    const question = this.currentQuestion();
    const trimmed = this.answer.trim();
    if (!question || !trimmed) {
      this.errorMessage.set('Write an answer before submitting.');
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.interviewService
      .submitAnswer(this.interviewId, { questionId: question.questionId, answer: trimmed })
      .subscribe({
        next: (response) => {
          this.submitting.set(false);
          this.interviewService.lastAnswer = response;
          this.router.navigate(['/interview', this.interviewId, 'feedback']);
        },
        error: () => {
          this.submitting.set(false);
          this.errorMessage.set("Couldn't submit your answer. Please try again.");
        },
      });
  }

  private loadQuestion(advanceWithinRound: boolean): void {
    this.loading.set(true);
    this.errorMessage.set(null);

    const request$ = advanceWithinRound
      ? this.interviewService.getNextQuestion(this.interviewId)
      : this.interviewService.getQuestion(this.interviewId);

    request$.subscribe({
      next: (question) => {
        this.loading.set(false);
        this.currentQuestion.set(question);
        this.answer = '';
        this.startTimer(question.remainingSeconds);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set("Couldn't load the question. Please try again.");
      },
    });
  }

  private startTimer(seconds: number): void {
    this.timerSub?.unsubscribe();
    this.remainingSeconds.set(seconds);

    this.timerSub = interval(1000).subscribe(() => {
      this.remainingSeconds.update((value) => Math.max(0, value - 1));
    });
  }
}
