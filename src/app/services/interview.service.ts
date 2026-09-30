import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  AnswerRequest,
  AnswerResponse,
  InterviewResult,
  QuestionResponse,
  StartInterviewRequest,
  StartInterviewResponse,
} from '../models/interview.models';

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private readonly apiUrl = 'http://localhost:8091/api/interviews';

  /**
   * Holds the most recent answer response so the feedback screen can read it
   * without round-tripping large objects through the router.
   */
  lastAnswer: AnswerResponse | null = null;

  constructor(private http: HttpClient) {}

  start(request: StartInterviewRequest): Observable<StartInterviewResponse> {
    return this.http.post<StartInterviewResponse>(`${this.apiUrl}/start`, request);
  }

  /** Fetches the current/first question of a round. */
  getQuestion(interviewId: number): Observable<QuestionResponse> {
    return this.http.get<QuestionResponse>(`${this.apiUrl}/${interviewId}/question`);
  }

  /** Advances to the next question within the current round. */
  getNextQuestion(interviewId: number): Observable<QuestionResponse> {
    return this.http.get<QuestionResponse>(`${this.apiUrl}/${interviewId}/next`);
  }

  submitAnswer(interviewId: number, request: AnswerRequest): Observable<AnswerResponse> {
    return this.http.post<AnswerResponse>(`${this.apiUrl}/${interviewId}/answer`, request);
  }

  finish(interviewId: number): Observable<InterviewResult> {
    return this.http.post<InterviewResult>(`${this.apiUrl}/${interviewId}/finish`, {});
  }

  getResult(interviewId: number): Observable<InterviewResult> {
    return this.http.get<InterviewResult>(`${this.apiUrl}/${interviewId}/result`);
  }
}
