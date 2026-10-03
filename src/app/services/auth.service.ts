import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { CandidateLoginResponse } from '../models/interview.models';
import { environment } from '../../environments/environment';

const NAME_KEY = 'skillx_candidate_name';
const ID_KEY = 'skillx_candidate_id';

function storageGet(key: string): string | null {
  try {
    return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function storageSet(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.setItem(key, value);
  } catch {}
}

function storageRemove(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') localStorage.removeItem(key);
  } catch {}
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/api/candidate`;

  /** Reactive current candidate name, read by the navbar. */
  readonly candidateName = signal<string | null>(storageGet(NAME_KEY));

  constructor(private http: HttpClient) {}

  login(name: string): Observable<CandidateLoginResponse> {
    return this.http.post<CandidateLoginResponse>(`${this.apiUrl}/login`, { name }).pipe(
      tap((response) => {
        storageSet(NAME_KEY, response.name);
        storageSet(ID_KEY, String(response.candidateId));
        this.candidateName.set(response.name);
      })
    );
  }

  /** Client-side only: clears local storage, no backend call. */
  logout(): void {
    storageRemove(NAME_KEY);
    storageRemove(ID_KEY);
    this.candidateName.set(null);
  }

  isLoggedIn(): boolean {
    return !!storageGet(NAME_KEY);
  }

  getCandidateId(): number | null {
    const raw = storageGet(ID_KEY);
    return raw ? Number(raw) : null;
  }
}