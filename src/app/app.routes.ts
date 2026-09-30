import { Routes } from '@angular/router';

import { authGuard } from './guards/auth.guard';
import { Login } from './components/login/login';
import { InterviewSetup } from './components/interview-setup/interview-setup';
import { Question } from './components/question/question';
import { Feedback } from './components/feedback/feedback';
import { Results } from './components/results/results';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'setup' },
  { path: 'login', component: Login },
  { path: 'setup', component: InterviewSetup, canActivate: [authGuard] },
  { path: 'interview/:id/question', component: Question, canActivate: [authGuard] },
  { path: 'interview/:id/feedback', component: Feedback, canActivate: [authGuard] },
  { path: 'interview/:id/results', component: Results, canActivate: [authGuard] },
  { path: '**', redirectTo: 'setup' },
];
