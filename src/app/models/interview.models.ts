export interface CandidateLoginResponse {
  candidateId: number;
  name: string;
}

export interface StartInterviewRequest {
  company: string;
  role: string;
  experience: string;
  technologies: string[];
}

export interface StartInterviewResponse {
  interviewId: number;
  company: string;
  role: string;
  round: string;
  roundEndTime: string;
  remainingSeconds: number;
}

export interface QuestionResponse {
  questionId: number;
  round: string;
  technology: string;
  question: string;
  questionNumber: number;
  totalQuestions: number;
  remainingSeconds: number;
}

export interface AnswerRequest {
  questionId: number;
  answer: string;
}

export interface AnswerResponse {
  questionId: number;
  score: number;
  feedback: string;
  idealAnswer: string;
  roundCompleted: boolean;
  nextRound: string;
}

export interface InterviewResult {
  interviewId: number;
  company: string;
  role: string;
  codingScore: number;
  aptitudeScore: number;
  technicalScore: number;
  hrScore: number;
  finalScore: number;
  recommendation: string;
  strengths: string;
  weaknesses: string;
  preparationPlan: string;
}

export const ROUND_COMPLETED = 'COMPLETED';
