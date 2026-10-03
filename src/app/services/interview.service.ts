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
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InterviewService {
  private readonly apiUrl = `${environment.apiUrl}/api/interviews`;

  lastAnswer: AnswerResponse | null = null;

  constructor(private http: HttpClient) {}

  start(request: StartInterviewRequest): Observable<StartInterviewResponse> {
    return this.http.post<StartInterviewResponse>(`${this.apiUrl}/start`, request);
  }

  getQuestion(interviewId: number): Observable<QuestionResponse> {
    return this.http.get<QuestionResponse>(`${this.apiUrl}/${interviewId}/question`);
  }

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