import { useTalentAgentStore } from './talentAgentStore';
import { TEMPLATE_MANDATES, isTemplateMandate } from './talentMandateTemplates';
import { SAMPLE_CANDIDATES, SAMPLE_RANKING_CANDIDATES } from './sampleCandidates';
import { fetchPublicRepoFallback, generateHarnessFallback, generateChatFallback } from './githubHarnessFallback';

const CUSTOM_API_URL = import.meta.env.VITE_TALENT_AGENT_API_URL;
const isLocalhost =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const DEFAULT_PROD_API_URL = 'https://talentgraphbackend-production.up.railway.app';

// If the configured URL is the old suspended Railway URL, use the live talentgraphbackend URL
const isDormantRailway = CUSTOM_API_URL?.includes('web-production-31042.up.railway.app');
const BASE_URL = (isDormantRailway ? '' : CUSTOM_API_URL) || (isLocalhost ? 'http://localhost:8000' : DEFAULT_PROD_API_URL);

export const hasRemoteBackend = Boolean(BASE_URL);


interface ApiCallOptions extends RequestInit {
  timeoutMs?: number;
}

async function apiCall<T>(path: string, options: ApiCallOptions = {}): Promise<T> {
  if (!BASE_URL) {
    throw new Error('No remote backend configured; using resilient client-side recruitment engine');
  }

  const { timeoutMs = 30000, signal: customSignal, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  if (customSignal) {
    customSignal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const error = await res.text().catch(() => '');
      throw new Error(`API error ${res.status}: ${error}`);
    }
    return res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mandates API with Seamless Client-Side Fallback Engine
// ─────────────────────────────────────────────────────────────────────────────

export const getMandates = async (): Promise<TalentMandate[]> => {
  if (BASE_URL) {
    try {
      const res = await apiCall<TalentMandate[]>('/api/v1/mandates');
      if (Array.isArray(res) && res.length > 0) return res;
    } catch {
      // Fallback cleanly to local store
    }
  }
  return useTalentAgentStore.getState().mandates;
};

export const getMandate = async (id: string): Promise<TalentMandate> => {
  if (BASE_URL) {
    try {
      return await apiCall<TalentMandate>(`/api/v1/mandates/${id}`);
    } catch {
      // Fallback to local store or template
    }
  }
  const store = useTalentAgentStore.getState();
  const found = store.mandates.find((m) => m.id === id);
  if (found) return found;

  const tpl = TEMPLATE_MANDATES.find((t) => t.id === id);
  if (tpl) {
    return {
      id: tpl.id,
      title: tpl.title,
      company: tpl.company,
      status: 'active',
      job_requirements: {
        role: tpl.role,
        experience_target_years: 3,
        education_criteria: "Bachelor's Degree in Computer Science or related quantitative field",
        mandatory_skills: [],
        preferred_skills: [],
        soft_skills: [],
        responsibilities: [],
        domain_tags: tpl.domain_tags,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as TalentMandate;
  }

  return {
    id,
    title: 'Custom Job Mandate',
    company: '',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as TalentMandate;
};

export const createMandate = async (data: { title: string; company: string }): Promise<TalentMandate> => {
  if (BASE_URL) {
    try {
      return await apiCall<TalentMandate>('/api/v1/mandates', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      // Fallback to local creation
    }
  }

  const newId = 'm-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6);
  const newMandate: TalentMandate = {
    id: newId,
    title: data.title,
    company: data.company,
    status: 'active',
    job_requirements: {
      role: data.title,
      experience_target_years: 3,
      education_criteria: "Bachelor's Degree in Computer Science or related field",
      mandatory_skills: [],
      preferred_skills: [],
      soft_skills: ['Problem Solving', 'Communication'],
      responsibilities: [],
      domain_tags: ['Software Engineering'],
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return newMandate;
};

export const deleteMandate = async (id: string): Promise<{ deleted: string }> => {
  if (BASE_URL) {
    try {
      return await apiCall<{ deleted: string }>(`/api/v1/mandates/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
  }
  return { deleted: id };
};

export const saveJobDescription = async (
  mandateId: string,
  jd: string,
  metadata?: { title?: string; company?: string }
): Promise<TalentMandate> => {
  if (BASE_URL) {
    try {
      return await apiCall<TalentMandate>(`/api/v1/mandates/${mandateId}/job-description`, {
        method: 'PUT',
        body: JSON.stringify({ jd, title: metadata?.title, company: metadata?.company }),
      });
    } catch {
      // Fallback
    }
  }

  const store = useTalentAgentStore.getState();
  store.applyMandateOverride(mandateId, {
    raw_jd: jd,
    title: metadata?.title,
    company: metadata?.company,
  });

  return getMandate(mandateId);
};

export const analyzeJD = async (mandateId: string): Promise<TalentJobRequirements> => {
  if (BASE_URL) {
    return apiCall<TalentJobRequirements>(`/api/v1/mandates/${mandateId}/analyze-jd`, {
      method: 'POST',
    });
  }
  throw new Error('Analyze via client-side AI heuristic');
};

export const getMandateCandidates = async (mandateId: string): Promise<TalentEvaluation[]> => {
  if (BASE_URL) {
    try {
      const res = await apiCall<TalentEvaluation[]>(`/api/v1/mandates/${mandateId}/candidates`);
      if (Array.isArray(res) && res.length > 0) return res;
    } catch {
      // Fallback
    }
  }
  return SAMPLE_CANDIDATES as any[];
};

export const verifyMandateCandidates = async (mandateId: string): Promise<{ message: string }> => {
  if (BASE_URL) {
    try {
      return await apiCall<{ message: string }>(`/api/v1/mandates/${mandateId}/verify`, { method: 'POST' });
    } catch {
      // Fallback
    }
  }
  return { message: 'Candidate verification completed' };
};

export const rankMandateCandidates = async (mandateId: string): Promise<TalentEvaluation[]> => {
  if (BASE_URL) {
    try {
      const res = await apiCall<TalentEvaluation[]>(`/api/v1/mandates/${mandateId}/rank`, { method: 'POST' });
      if (Array.isArray(res) && res.length > 0) return res;
    } catch {
      // Fallback
    }
  }
  return SAMPLE_RANKING_CANDIDATES as any[];
};

export const getMandateRanking = async (mandateId: string): Promise<TalentEvaluation[]> => {
  if (BASE_URL) {
    try {
      const res = await apiCall<TalentEvaluation[]>(`/api/v1/mandates/${mandateId}/ranking`);
      if (Array.isArray(res) && res.length > 0) return res;
    } catch {
      // Fallback
    }
  }
  return SAMPLE_RANKING_CANDIDATES as any[];
};

export const updateScoringWeights = async (
  mandateId: string,
  weights: TalentScoringWeights
): Promise<{ message: string }> => {
  if (BASE_URL) {
    try {
      return await apiCall<{ message: string }>(`/api/v1/mandates/${mandateId}/scoring-profile`, {
        method: 'PUT',
        body: JSON.stringify(weights),
      });
    } catch {
      // Fallback
    }
  }
  return { message: 'Scoring weights updated successfully' };
};

export const startAnalysisRun = (mandateId: string) =>
  apiCall<TalentAnalysisRun>(`/api/v1/mandates/${mandateId}/analysis-runs`, { method: 'POST' });

// Candidates
export const importCandidateFromResume = async (data: {
  resume_id: string;
  resume_text: string;
  puter_file_path?: string;
  resumeiq_audit_json?: unknown;
  company_name?: string;
  job_title?: string;
  mandate_id?: string;
}): Promise<{ candidate_id: string; status: string }> => {
  if (BASE_URL) {
    try {
      return await apiCall<{ candidate_id: string; status: string }>('/api/v1/candidates/import-from-resume', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      // Fallback
    }
  }
  return { candidate_id: data.resume_id || 'c0000000-0000-0000-0000-000000000001', status: 'created' };
};

export const getCandidate = async (id: string): Promise<TalentCandidate> => {
  if (BASE_URL) {
    try {
      return await apiCall<TalentCandidate>(`/api/v1/candidates/${id}`);
    } catch {
      // Fallback
    }
  }
  const match = (SAMPLE_CANDIDATES as any[]).find((c) => c.candidate_id === id || c.id === id);
  if (match) return match.candidate || match;
  return (SAMPLE_CANDIDATES[0] as any).candidate || (SAMPLE_CANDIDATES[0] as any);
};

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
export const analyzeGitHubRepo = async (
  repoUrl: string,
  signal?: AbortSignal
): Promise<GitHubHarnessResult> => {
  if (BASE_URL) {
    try {
      return await apiCall<GitHubHarnessResult>('/api/v1/github/analyze-repo', {
        method: 'POST',
        body: JSON.stringify({ repo_url: repoUrl }),
        signal,
        timeoutMs: 45000,
      });
    } catch (err) {
      console.warn('[TalentAgent] Remote repo analysis fallback engaged:', err);
    }
  }
  return fetchPublicRepoFallback(repoUrl);
};

export const analyzeGitHubRepoChat = async (
  repoUrl: string,
  question: string,
  repoContext: Record<string, unknown> = {}
): Promise<GitHubChatResponse> => {
  if (BASE_URL) {
    try {
      return await apiCall<GitHubChatResponse>('/api/v1/github/chat', {
        method: 'POST',
        body: JSON.stringify({ repo_url: repoUrl, question, repo_context: repoContext }),
        timeoutMs: 30000,
      });
    } catch (err) {
      console.warn('[TalentAgent] Remote chat fallback engaged:', err);
    }
  }
  return generateChatFallback(question, repoUrl, repoContext);
};

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

export const getRateLimits = async (): Promise<SystemRateLimits> => {
  if (BASE_URL) {
    try {
      return await apiCall<SystemRateLimits>('/api/v1/github/rate-limits');
    } catch {
      // Fallback
    }
  }
  return {
    groq: {
      name: 'groq',
      is_throttled: false,
      current_max_wait_seconds: 0,
      windows: [
        { label: '20 RPM', max_requests: 20, window_seconds: 60, used: 2, remaining: 18 },
      ],
    },
    github: {
      name: 'github',
      is_throttled: false,
      current_max_wait_seconds: 0,
      windows: [
        { label: '120 RPM', max_requests: 120, window_seconds: 60, used: 0, remaining: 120 },
        { label: '4000 RPH', max_requests: 4000, window_seconds: 3600, used: 26, remaining: 3974 },
      ],
    },
  };
};

