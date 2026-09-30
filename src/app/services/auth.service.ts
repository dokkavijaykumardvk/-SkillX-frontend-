import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { CandidateLoginResponse } from '../models/interview.models';

const NAME_KEY = 'skillx_candidate_name';
const ID_KEY = 'skillx_candidate_id';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = 'http://localhost:8091/api/candidate';

  /** Reactive current candidate name, read by the navbar. */
  readonly candidateName = signal<string | null>(this.readStoredName());

  constructor(private http: HttpClient) {}

  login(name: string): Observable<CandidateLoginResponse> {
    return this.http.post<CandidateLoginResponse>(`${this.apiUrl}/login`, { name }).pipe(
      tap((response) => {
        localStorage.setItem(NAME_KEY, response.name);
        localStorage.setItem(ID_KEY, String(response.candidateId));
        this.candidateName.set(response.name);
      })
    );
  }

  /** Client-side only: clears local storage, no backend call. */
  logout(): void {
    localStorage.removeItem(NAME_KEY);
    localStorage.removeItem(ID_KEY);
    this.candidateName.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.readStoredName();
  }

  getCandidateId(): number | null {
    const raw = localStorage.getItem(ID_KEY);
    return raw ? Number(raw) : null;
  }

  private readStoredName(): string | null {
    return localStorage.getItem(NAME_KEY);
  }
}
