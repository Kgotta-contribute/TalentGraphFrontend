import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { analyzeGitHubRepo, getRateLimits, type SystemRateLimits } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { BrandLogo } from '~/components/icons/BrandIcons';
import OverviewTab from '~/components/github/OverviewTab';
import ArchitectureTab from '~/components/github/ArchitectureTab';
import TechStackTab from '~/components/github/TechStackTab';
import FileTreeTab from '~/components/github/FileTreeTab';
import DependenciesTab from '~/components/github/DependenciesTab';
import RagTab from '~/components/github/RagTab';
import AgentsTab from '~/components/github/AgentsTab';
import SecurityTab from '~/components/github/SecurityTab';
import CiCdTab from '~/components/github/CiCdTab';
import CodeQualityTab from '~/components/github/CodeQualityTab';
import GitHistoryTab from '~/components/github/GitHistoryTab';
import ChatPanel from '~/components/github/ChatPanel';
import ObservabilityPanel from '~/components/github/ObservabilityPanel';
import RepoHeroCard from '~/components/github/RepoHeroCard';

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const SAMPLE_REPOS = [
  {
    name: 'langchain-ai/langgraph',
    brand: 'LangChain',
    url: 'https://github.com/langchain-ai/langgraph',
    desc: 'Agentic state graph framework',
    iconType: 'langchain',
  },
  {
    name: 'vercel/next.js',
    brand: 'Next.js',
    url: 'https://github.com/vercel/next.js',
    desc: 'Full-stack React framework',
    iconType: 'nextjs',
  },
  {
    name: 'fastapi/fastapi',
    brand: 'FastAPI',
    url: 'https://github.com/fastapi/fastapi',
    desc: 'Python async web framework',
    iconType: 'fastapi',
  },
  {
    name: 'microsoft/autogen',
    brand: 'Microsoft',
    url: 'https://github.com/microsoft/autogen',
    desc: 'Multi-agent conversation framework',
    iconType: 'microsoft',
  },
  {
    name: 'openai/swarm',
    brand: 'OpenAI',
    url: 'https://github.com/openai/swarm',
    desc: 'Educational multi-agent orchestration',
    iconType: 'openai',
  },
];


const TABS = [
  { id: 'overview', icon: '📊', label: 'Overview', desc: 'System summary, architecture style & production tier' },
  { id: 'architecture', icon: '🏛️', label: 'Architecture', desc: 'System topology, components, patterns & dataflow' },
  { id: 'techstack', icon: '⚙️', label: 'Tech Stack', desc: 'Languages, frameworks, ORMs & runtime tools' },
  { id: 'filetree', icon: '📁', label: 'File Explorer', desc: 'Recursive repository file tree & code viewer' },
  { id: 'dependencies', icon: '📦', label: 'Dependencies', desc: 'Package manifests & direct third-party libraries' },
  { id: 'rag', icon: '🤖', label: 'AI / RAG', desc: 'Vector search, embeddings & LLM pipeline analysis' },
  { id: 'agents', icon: '🕸️', label: 'Agents', desc: 'Multi-agent frameworks & orchestration patterns' },
  { id: 'security', icon: '🔒', label: 'Security', desc: 'Secret audit, exposure risks & security posture' },
  { id: 'cicd', icon: '🚀', label: 'CI/CD', desc: 'GitHub Actions, automated test & build workflows' },
  { id: 'quality', icon: '✅', label: 'Code Quality', desc: 'Type hints, error handling, tests & docs' },
  { id: 'git', icon: '📜', label: 'Git History', desc: 'Commit cadence, velocity & top contributors' },
  { id: 'chat', icon: '💬', label: 'Agent Chat', desc: 'Interactive Q&A grounded in source files' },
] as const;

type TabId = typeof TABS[number]['id'];

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function GitHubMcpPage() {
  const { mandateId: paramMandateId } = useParams();
  const { activeMandateId, mandates } = useTalentAgentStore();
  const currentMandateId =
    paramMandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');

  const [inputUrl, setInputUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<GitHubHarnessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Rate Limits live telemetry
  const [rateLimits, setRateLimits] = useState<SystemRateLimits | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchLimits = () => {
      getRateLimits()
        .then((data) => {
          if (mounted) setRateLimits(data);
        })
        .catch(() => {});
    };
    fetchLimits();
    const timer = setInterval(fetchLimits, 8000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, []);

  // ── Stop Handler ──────────────────────────────────────────────────────────

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setAnalyzing(false);
    setError('Analysis stopped by user.');
  };

  // ── Analysis ───────────────────────────────────────────────────────────────

  const handleAnalyze = async (overrideUrl?: string) => {
    const url = overrideUrl || inputUrl;
    if (!url.trim().startsWith('https://github.com/')) {
      setError('Repository URL must start with "https://github.com/"');
      return;
    }

    // Set up AbortController for cancel support
    abortControllerRef.current = new AbortController();

    setAnalyzing(true);
    setError(null);
    setResult(null);
    setActiveTab('overview');

    try {
      const data = await analyzeGitHubRepo(url.trim(), abortControllerRef.current.signal);
      setResult(data);
      setInputUrl(url.trim());
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Analysis stopped by user.');
      } else {
        const msg = err instanceof Error ? err.message : 'Failed to analyze repository.';
        setError(msg);
      }
    } finally {
      setAnalyzing(false);
      abortControllerRef.current = null;
    }
  };

  // ── Clipboard ─────────────────────────────────────────────────────────────

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text?.includes('github.com')) setInputUrl(text.trim());
    } catch { /* declined */ }
  };

  const isValidGitHubUrl =
    inputUrl.trim().startsWith('https://github.com/') &&
    inputUrl.trim().length > 'https://github.com/'.length;

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <RecruiterLayout mandateId={currentMandateId}>

      {/* ── Page Header (Image Reference) ── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-6 w-full">
        {/* Left Column: Avatar + Agent 6 pill + Title + Subtitles */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#5850EC] to-[#7C3AED] flex items-center justify-center text-white shadow-md shrink-0">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div className="min-w-0">
            <div>
              <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full mb-1">
                Agent 6 —
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight whitespace-nowrap">
              <span className="text-[#5850EC]">GitHub</span> Project Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 font-semibold mt-1 whitespace-nowrap">
              Analyze any GitHub repository using MCP tools and AI agents
            </p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-normal">
              Understand the architecture, tech stack, code structure, dependencies, AI pipelines, security, CI/CD, and more.
            </p>
          </div>
        </div>

        {/* Right side: Page 7 - MCP Agent Harness + Status Pills (Image Reference) */}
        <div className="flex items-center gap-3 shrink-0 ml-auto justify-end">
          {/* Page 7 - MCP Agent Harness Card */}
          <div className="bg-white/90 border border-indigo-200/90 rounded-2xl px-3.5 py-2 flex items-center gap-2.5 shadow-2xs font-mono">
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
            <div className="text-left font-mono">
              <span className="text-[11px] font-bold text-indigo-600 block leading-tight">Page 7 - MCP</span>
              <span className="text-[10px] text-indigo-500 font-medium">Agent Harness Workflow</span>
            </div>
          </div>

          {/* Telemetry Pills stacked */}
          <div className="flex flex-col gap-1.5 font-mono text-xs">
            {/* Top row: MCP & Groq */}
            <div className="bg-white/95 border border-gray-200/90 rounded-xl px-3 py-1 flex items-center gap-3 shadow-2xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shadow-xs animate-pulse" />
                <span className="text-gray-800 font-bold text-[11px]">MCP: Online</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-600 text-xs font-bold">⚡</span>
                <span className="font-bold text-purple-700 text-[11px]">
                  Groq: {rateLimits?.groq?.windows?.find((w) => w.label.includes('RPM'))?.remaining ?? 20}/20 RPM
                </span>
              </div>
            </div>

            {/* Bottom row: GitHub API with both RPM and RPH */}
            <div className="bg-white/95 border border-gray-200/90 rounded-xl px-3 py-1 flex items-center gap-2 shadow-2xs">
              <svg className="w-3.5 h-3.5 fill-current text-gray-900 shrink-0" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="text-gray-800 text-[11px] font-semibold">
                GitHub: <span className="font-bold text-gray-900">
                  {(() => {
                    const rpm = rateLimits?.github?.windows?.find((w) => w.label.includes('RPM'))?.remaining ?? 20;
                    const rph = rateLimits?.github?.windows?.find((w) => w.label.includes('RPH'))?.remaining ?? 824;
                    return `${rpm}/20 RPM · ${rph}/850 RPH`;
                  })()}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── URL Input Card (Visual Redesign) ── */}
      <div className="bg-gradient-to-b from-white via-indigo-50/15 to-white border border-indigo-100/90 rounded-2xl p-6 mb-5 shadow-xs relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="pointer-events-none absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-bl from-indigo-200/30 via-purple-100/15 to-transparent rounded-full blur-2xl" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              GITHUB REPOSITORY URL
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 font-mono">
              Public or Monorepo
            </span>
          </div>
          <span className="text-[11px] font-mono text-indigo-600/90 hidden sm:inline-flex items-center gap-1 font-semibold">
            <span>✨</span> Paste your repository link or pick a demo below
          </span>
        </div>

        <p className="text-xs text-gray-500 font-mono mb-3">
          Enter a public GitHub repository URL to analyze its codebase, architecture and documentation.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full group">
            <span className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-indigo-600 transition-colors">
              <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </span>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && isValidGitHubUrl && !analyzing && handleAnalyze()}
              placeholder="https://github.com/username/repository"
              className="w-full bg-white border border-gray-300 hover:border-indigo-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 rounded-xl pl-10 pr-28 py-3 font-mono text-xs sm:text-sm text-gray-900 focus:outline-none shadow-2xs transition-all placeholder:text-gray-400"
            />
            <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
              {inputUrl.length > 0 && (
                <button
                  type="button"
                  onClick={() => setInputUrl('')}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer text-xs font-bold"
                  title="Clear written URL"
                >
                  ✕
                </button>
              )}
              <button
                onClick={handlePasteClipboard}
                className="px-2.5 py-1 text-[11px] font-mono font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg shadow-2xs transition flex items-center gap-1 cursor-pointer"
                title="Paste from clipboard"
              >
                <span>📋</span>
                <span>Paste</span>
              </button>
            </div>
          </div>
          {analyzing ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                disabled
                className="w-full sm:w-auto px-5 py-3 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-bold font-mono text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 opacity-90 cursor-wait"
              >
                <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>Running Harness...</span>
              </button>
              <button
                type="button"
                onClick={handleStop}
                className="px-4 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold font-mono text-xs rounded-xl shadow-2xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                title="Stop analysis"
              >
                <span className="w-2.5 h-2.5 bg-rose-600 rounded-2xs inline-block" />
                <span>Stop</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleAnalyze()}
              disabled={!isValidGitHubUrl}
              className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#6366F1] via-[#5850EC] to-[#4F46E5] text-white font-bold font-mono text-xs sm:text-sm rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all ${
                !isValidGitHubUrl
                  ? 'opacity-40 cursor-not-allowed shadow-none'
                  : 'hover:from-[#4F46E5] hover:to-[#4338CA] shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer'
              }`}
              title={
                !isValidGitHubUrl
                  ? 'URL must start with "https://github.com/"'
                  : 'Analyze repository with multi-agent pipeline'
              }
            >
              <span>🚀</span>
              <span>Analyze Repository</span>
            </button>
          )}

        </div>

        {/* Validation hint */}
        {inputUrl.trim() && !isValidGitHubUrl && (
          <p className="mt-2 text-[11px] font-mono text-amber-600 flex items-center gap-1.5">
            <span>⚠️</span>
            <span>URL must start with &quot;https://github.com/&quot; (e.g. https://github.com/owner/repo)</span>
          </p>
        )}

        {/* Quick sample chips with authentic brand logos */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 flex items-center gap-2 flex-wrap text-xs font-mono">
          <span className="text-gray-400 font-semibold text-[11px] flex items-center gap-1 shrink-0">
            <span className="text-amber-500">⚡</span> Try:
          </span>
          {SAMPLE_REPOS.map((s) => {
            const isSelected = inputUrl === s.url;
            return (
              <button
                key={s.name}
                onClick={() => {
                  setInputUrl(s.url);
                  handleAnalyze(s.url);
                }}
                disabled={analyzing}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-medium transition-all shadow-2xs cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs'
                    : 'bg-white hover:bg-gradient-to-r hover:from-indigo-50/70 hover:to-purple-50/70 text-gray-700 hover:text-indigo-900 border-gray-200 hover:border-indigo-300 hover:shadow-xs hover:-translate-y-0.5'
                } disabled:opacity-50`}
                title={s.desc}
              >
                <BrandLogo type={s.iconType} />
                <span className="font-semibold">{s.name}</span>
                <span className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded px-1 py-0.2">
                  {s.brand}
                </span>
              </button>
            );
          })}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-mono flex items-center justify-between">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)} className="text-rose-500 hover:text-rose-700 font-bold cursor-pointer">✕</button>
          </div>
        )}
      </div>

      {/* ── Analysis Pipeline Bar (Image 1) ── */}
      <div
        className={`bg-white/90 border rounded-2xl px-5 py-3 mb-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono transition-all ${
          analyzing
            ? 'border-indigo-400 ring-2 ring-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/70'
            : 'border-gray-200/90'
        }`}
      >
        <div className="flex items-center gap-2 text-indigo-600 font-bold shrink-0">
          {analyzing ? (
            <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin shrink-0" />
          ) : (
            <span className="text-sm">⏱️</span>
          )}
          <span>{analyzing ? 'Running Analysis Pipeline...' : 'Analysis Pipeline'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-[11px] flex-wrap font-medium">
          <span className={`font-bold ${analyzing ? 'text-indigo-600 animate-pulse' : 'text-gray-900'}`}>1. Fetch Repository</span>
          <span className="text-gray-400 font-bold">›</span>
          <span className={`font-bold ${analyzing ? 'text-indigo-600' : 'text-gray-900'}`}>2. Parse &amp; Index</span>
          <span className="text-gray-400 font-bold">›</span>
          <span className="text-gray-900 font-bold">3. Analyze Code</span>
          <span className="text-gray-400 font-bold">›</span>
          <span className="text-gray-900 font-bold">4. Generate Insights</span>
          <span className="text-gray-400 font-bold">›</span>
          <span className="text-gray-900 font-bold">5. Build Report</span>
        </div>
        <div className="text-[11px] text-gray-500 font-medium shrink-0 flex items-center gap-1.5">
          <span className="text-indigo-500">⏱️</span>
          <span>{analyzing ? 'Est. time: 30–60s' : 'Est. time: 30–60s'}</span>
        </div>
      </div>

      {/* ── Results ── */}
      {result && (
        <div className="space-y-5 font-mono text-xs">

          {/* Observability Panel */}
          <ObservabilityPanel observability={result.observability} />

          {/* Repo Hero Card */}
          <RepoHeroCard result={result} />

          {/* ── Tabbed Detail Panel ── */}
          <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs">
            {/* ── Heading & Interactive Instructions Above Tabs ── */}
            <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/50 to-slate-50 border-b border-gray-200 px-5 py-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                      🧭
                    </span>
                    <h3 className="text-sm font-bold font-mono text-gray-900 uppercase tracking-wide">
                      Deep Intelligence Dimensions · 12 Specialized Analysis Views
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                      Click any tab to view analysis
                    </span>
                  </div>
                  <p className="text-xs font-mono text-gray-600 mt-1.5 leading-relaxed">
                    The GitHub Intelligence Harness deployed parallel specialized sub-agents across the repository evidence.
                    Click any tab below to review the multi-agent findings — including system topology, dependencies, RAG & LLM pipelines,
                    security vulnerabilities, test coverage, and interactive codebase chat.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Tab Bar: All 12 Tabs Fitted in One Screen with High-Contrast Clickable Buttons ── */}
            <div className="p-2 bg-slate-100/90 border-b border-gray-200">
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-1.5 w-full">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabId)}
                      title={`${tab.label}: ${tab.desc} (Click to view)`}
                      className={`group relative flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-150 cursor-pointer select-none text-center ${
                        isActive
                          ? 'bg-gradient-to-b from-[#6366F1] to-[#4F46E5] text-white shadow-sm ring-2 ring-indigo-400/50 border border-indigo-700'
                          : 'bg-white hover:bg-indigo-50/80 text-slate-800 hover:text-indigo-700 border border-slate-200/90 hover:border-indigo-300 shadow-2xs hover:shadow-xs hover:-translate-y-0.5'
                      }`}
                    >
                      <span className="text-sm mb-0.5 transform group-hover:scale-110 transition-transform">
                        {tab.icon}
                      </span>
                      <span
                        className={`text-[10px] xl:text-[11px] font-bold font-mono tracking-tight truncate w-full ${
                          isActive ? 'text-white font-black' : 'text-slate-800 font-bold group-hover:text-indigo-700'
                        }`}
                      >
                        {tab.label}
                      </span>
                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">

              {/* ── Overview ── */}
              {activeTab === 'overview' && (
                <OverviewTab
                  architecture={result.architecture}
                  ragAnalysis={result.rag_analysis}
                  agentDetection={result.agent_detection}
                  cicdAnalysis={result.cicd_analysis}
                  codeQuality={result.code_quality}
                />
              )}

              {/* ── Architecture ── */}
              {activeTab === 'architecture' && (
                <ArchitectureTab architecture={result.architecture} repoInfo={result.repo_info} />
              )}

              {/* ── Tech Stack ── */}
              {activeTab === 'techstack' && (
                <TechStackTab techStack={result.architecture.tech_stack} />
              )}

              {/* ── File Explorer ── */}
              {activeTab === 'filetree' && (
                <FileTreeTab fileTree={result.file_tree} />
              )}

              {/* ── Dependencies ── */}
              {activeTab === 'dependencies' && (
                <DependenciesTab dependencies={result.dependencies} />
              )}

              {/* ── AI / RAG ── */}
              {activeTab === 'rag' && (
                <RagTab ragAnalysis={result.rag_analysis} />
              )}

              {/* ── Agents ── */}
              {activeTab === 'agents' && (
                <AgentsTab agentDetection={result.agent_detection} />
              )}

              {/* ── Security ── */}
              {activeTab === 'security' && (
                <SecurityTab security={result.security} />
              )}

              {/* ── CI/CD ── */}
              {activeTab === 'cicd' && (
                <CiCdTab cicdAnalysis={result.cicd_analysis} />
              )}

              {/* ── Code Quality ── */}
              {activeTab === 'quality' && (
                <CodeQualityTab codeQuality={result.code_quality} />
              )}

              {/* ── Git History ── */}
              {activeTab === 'git' && (
                <GitHistoryTab gitActivity={result.git_activity} />
              )}

              {/* ── Agent Chat ── */}
              {activeTab === 'chat' && (
                <ChatPanel result={result} inputUrl={inputUrl} />
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 text-xs text-gray-400 font-mono">
            <span>Analyzed with GitHub MCP · {result.observability.tools_used} tool calls · Groq (gpt-oss-120b)</span>
            <button
              onClick={() => handleAnalyze()}
              className="px-4 py-1.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white rounded-xl font-bold text-xs shadow-xs cursor-pointer"
            >
              Analyze Another →
            </button>
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}
