import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { organizeMandates } from './talentMandateTemplates';

// ─────────────────────────────────────────────────────────────────────────────
// Override cache — stores in-memory edits made to mandates that haven't yet
// been fully flushed to the DB (template clicks, JD analysis results, etc.)
// Keyed by mandate ID. Persisted to localStorage.
// ─────────────────────────────────────────────────────────────────────────────
type MandateOverride = Partial<TalentMandate>;

interface TalentAgentStore {
  // Active mandate ID — persisted to localStorage
  activeMandateId: string | null;
  setActiveMandateId: (id: string | null) => void;

  // Mandates list (fetched from API, then merged with overrides on load)
  mandates: TalentMandate[];
  setMandates: (mandates: TalentMandate[]) => void;

  // Per-mandate local overrides (title / company / job_requirements changed by the user)
  // These are persisted so switching pages never loses the active-mandate label.
  mandateOverrides: Record<string, MandateOverride>;
  applyMandateOverride: (id: string, patch: MandateOverride) => void;
  clearMandateOverride: (id: string) => void;

  // Active analysis run
  activeRunId: string | null;
  activeRunStatus: TalentAnalysisRun | null;
  setActiveRun: (runId: string | null, status: TalentAnalysisRun | null) => void;

  // Errors
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

function mergeMandateWithOverride(m: TalentMandate, override: MandateOverride): TalentMandate {
  return {
    ...m,
    ...override,
    job_requirements:
      override.job_requirements || m.job_requirements
        ? ({
            ...(m.job_requirements || {}),
            ...(override.job_requirements || {}),
          } as TalentJobRequirements)
        : m.job_requirements,
  };
}

export const useTalentAgentStore = create<TalentAgentStore>()(
  persist(
    (set, get) => ({
      activeMandateId: null,
      setActiveMandateId: (id) => set({ activeMandateId: id }),

      mandates: organizeMandates([]),
      // When fresh data comes from the API, merge with any persisted overrides and organize
      setMandates: (mandates) => {
        const overrides = get().mandateOverrides;
        const list = Array.isArray(mandates) && mandates.length > 0 ? mandates : [];
        const merged = list.map((m) =>
          overrides[m.id] ? mergeMandateWithOverride(m, overrides[m.id]) : m
        );
        const organized = organizeMandates(merged);
        set({ mandates: organized });
      },

      mandateOverrides: {},
      applyMandateOverride: (id, patch) => {
        const overrides = get().mandateOverrides;
        const existing = overrides[id] || {};
        const updatedOverride: MandateOverride = {
          ...existing,
          ...patch,
          ...(patch.job_requirements || existing.job_requirements
            ? {
                job_requirements: {
                  ...(existing.job_requirements || {}),
                  ...(patch.job_requirements || {}),
                } as TalentJobRequirements,
              }
            : {}),
        };
        // Persist to override cache
        set({ mandateOverrides: { ...overrides, [id]: updatedOverride } });
        // Also update live mandates[] immediately
        const mandates = get().mandates;
        set({
          mandates: mandates.map((m) =>
            m.id === id ? mergeMandateWithOverride(m, updatedOverride) : m
          ),
        });
      },
      clearMandateOverride: (id) => {
        const overrides = { ...get().mandateOverrides };
        delete overrides[id];
        set({ mandateOverrides: overrides });
      },

      activeRunId: null,
      activeRunStatus: null,
      setActiveRun: (runId, status) =>
        set({ activeRunId: runId, activeRunStatus: status }),

      error: null,
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'talent-agent-store',
      // Only persist the selection + overrides — mandates list is re-fetched and merged
      partialState: (state: TalentAgentStore) => ({
        activeMandateId: state.activeMandateId,
        mandateOverrides: state.mandateOverrides,
      }),
    } as any
  )
);
