const BASE_URL =
  import.meta.env.VITE_TALENT_AGENT_API_URL ||
  (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    ? 'https://web-production-31042.up.railway.app'
    : 'http://localhost:8000');

async function apiCall<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`API error ${res.status}: ${error}`);
  }
  return res.json();
}

// Mandates
export const createMandate = (data: { title: string; company: string }) =>
  apiCall<TalentMandate>('/api/v1/mandates', { method: 'POST', body: JSON.stringify(data) });

export const getMandates = () =>
  apiCall<TalentMandate[]>('/api/v1/mandates');

export const getMandate = (id: string) =>
  apiCall<TalentMandate>(`/api/v1/mandates/${id}`);

export const deleteMandate = (id: string) =>
  apiCall<{ deleted: string }>(`/api/v1/mandates/${id}`, { method: 'DELETE' });


export const saveJobDescription = (mandateId: string, jd: string, metadata?: { title?: string; company?: string }) =>
  apiCall<TalentMandate>(`/api/v1/mandates/${mandateId}/job-description`, {
    method: 'PUT',
    body: JSON.stringify({ jd, title: metadata?.title, company: metadata?.company }),
  });

export const analyzeJD = (mandateId: string) =>
  apiCall<TalentJobRequirements>(`/api/v1/mandates/${mandateId}/analyze-jd`, { method: 'POST' });

export const getMandateCandidates = (mandateId: string) =>
  apiCall<TalentEvaluation[]>(`/api/v1/mandates/${mandateId}/candidates`);

export const verifyMandateCandidates = (mandateId: string) =>
  apiCall<{ message: string }>(`/api/v1/mandates/${mandateId}/verify`, { method: 'POST' });

export const rankMandateCandidates = (mandateId: string) =>
  apiCall<TalentEvaluation[]>(`/api/v1/mandates/${mandateId}/rank`, { method: 'POST' });

export const getMandateRanking = (mandateId: string) =>
  apiCall<TalentEvaluation[]>(`/api/v1/mandates/${mandateId}/ranking`);

export const updateScoringWeights = (mandateId: string, weights: TalentScoringWeights) =>
  apiCall<{ message: string }>(`/api/v1/mandates/${mandateId}/scoring-profile`, {
    method: 'PUT',
    body: JSON.stringify(weights),
  });

export const startAnalysisRun = (mandateId: string) =>
  apiCall<TalentAnalysisRun>(`/api/v1/mandates/${mandateId}/analysis-runs`, { method: 'POST' });

// Candidates
export const importCandidateFromResume = (data: {
  resume_id: string;
  resume_text: string;
  puter_file_path?: string;
  resumeiq_audit_json?: unknown;
  company_name?: string;
  job_title?: string;
  mandate_id?: string;
}) => apiCall<{ candidate_id: string; status: string }>('/api/v1/candidates/import-from-resume', {
  method: 'POST',
  body: JSON.stringify(data),
});

export const getCandidate = (id: string) =>
  apiCall<TalentCandidate>(`/api/v1/candidates/${id}`);

export const analyzeGitHub = (candidateId: string) =>
  apiCall<TalentGitHubAnalysis>(`/api/v1/candidates/${candidateId}/github-analysis`, { method: 'POST' });

export const getGitHubAnalysis = (candidateId: string) =>
  apiCall<TalentGitHubAnalysis>(`/api/v1/candidates/${candidateId}/github-analysis`);

export const generateReport = (candidateId: string, mandateId: string) =>
  apiCall<TalentRecruitmentDossier>(`/api/v1/candidates/${candidateId}/report`, {
    method: 'POST',
    body: JSON.stringify({ mandate_id: mandateId }),
  });

export const getReport = (candidateId: string) =>
  apiCall<TalentRecruitmentDossier>(`/api/v1/candidates/${candidateId}/report`);

// GitHub MCP Architecture Analysis (Harness)
export const analyzeGitHubRepo = (repoUrl: string, signal?: AbortSignal) =>
  apiCall<GitHubHarnessResult>('/api/v1/github/analyze-repo', {
    method: 'POST',
    body: JSON.stringify({ repo_url: repoUrl }),
    signal,
  });

export const analyzeGitHubRepoChat = (
  repoUrl: string,
  question: string,
  repoContext: Record<string, unknown> = {}
) =>
  apiCall<GitHubChatResponse>('/api/v1/github/chat', {
    method: 'POST',
    body: JSON.stringify({ repo_url: repoUrl, question, repo_context: repoContext }),
  });

// SSE
export const createSSEConnection = (runId: string): EventSource =>
  new EventSource(`${BASE_URL}/api/v1/analysis-runs/${runId}/events`);

// Rate Limits
export interface RateLimitWindowStatus {
  label: string;
  max_requests: number;
  window_seconds: number;
  used: number;
  remaining: number;
}

export interface RateLimiterStatus {
  name: string;
  is_throttled: boolean;
  current_max_wait_seconds: number;
  windows: RateLimitWindowStatus[];
}

export interface SystemRateLimits {
  groq: RateLimiterStatus;
  github: RateLimiterStatus;
}

export const getRateLimits = () =>
  apiCall<SystemRateLimits>('/api/v1/github/rate-limits');

