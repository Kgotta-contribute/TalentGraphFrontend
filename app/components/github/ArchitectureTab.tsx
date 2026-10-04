import React, { useState } from 'react';

export function generateAsciiArchitecture(
  architecture: GitHubArchitectureAnalysis,
  repoInfo?: GitHubRepoInfo
): string {
  if (architecture.ascii_architecture_diagram && architecture.ascii_architecture_diagram.trim().length > 30) {
    return architecture.ascii_architecture_diagram;
  }

  const stack = architecture.tech_stack || {
    frontend: [],
    backend: [],
    database_and_storage: [],
    ai_and_data: [],
    devops_and_cloud: [],
    testing_and_tooling: [],
  };

  const frontendTech: string[] = stack.frontend || [];
  const backendTech: string[] = stack.backend || [];
  const dbTech: string[] = stack.database_and_storage || [];
  const aiTech: string[] = stack.ai_and_data || [];

  const repoName = (repoInfo?.name || '').toLowerCase();
  const isMultiAgent = aiTech.some(t => t.toLowerCase().includes('langgraph') || t.toLowerCase().includes('multi-agent'))
    || repoName.includes('multi_agent') || repoName.includes('debate');
  const isFrontend = (frontendTech.length > 0 && backendTech.length === 0)
    || repoName.includes('frontend');

  if (isFrontend) {
    const fe = frontendTech[0] || 'React / Vite SPA';
    const stateMgr = frontendTech.find(t => t.includes('Zustand')) ? 'Zustand Store'
      : frontendTech.find(t => t.includes('Redux')) ? 'Redux Store' : 'Local State Management';
    const router = frontendTech.find(t => t.includes('Router')) ? 'React Router' : 'Client Router';
    const styling = frontendTech.find(t => t.includes('Tailwind')) ? 'Tailwind CSS' : 'Component Styling';
    const apiLayer = 'API Client & Event Ingress';
    const targetBackend = backendTech[0] ? `${backendTech[0]} API Gateway` : 'Backend REST & SSE API';
    return `┌────────────────────────────────────────────────────────┐
│                   User / Web Browser                   │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         ${fe.padEnd(46, ' ')}│
│         Styling: ${styling.padEnd(36, ' ')}│
└────────────────────────────────────────────────────────┘
            │                               │
            ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  State Management    │        │  Client Navigation   │
│  ${stateMgr.padEnd(20, ' ')}│        │  ${router.padEnd(20, ' ')}│
└──────────────────────┘        └──────────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│         ${apiLayer.padEnd(46, ' ')}│
│         (REST Client & SSE Event Stream Ingress)       │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         ${targetBackend.padEnd(46, ' ')}│
└────────────────────────────────────────────────────────┘`;
  }

  if (isMultiAgent) {
    const agents = architecture.core_components
      ?.filter(c => c.name.toLowerCase().includes('agent') || c.name.toLowerCase().includes('worker'))
      .map(c => c.name) || [];
    const a1 = agents[0] || 'Domain Agent 1';
    const a2 = agents[1] || 'Domain Agent 2';
    const a3 = agents[2] || 'Synthesis / Arbiter';
    const coordinator = aiTech.find(t => t.includes('LangGraph')) ? 'LangGraph StateGraph Router' : 'Workflow Coordinator / Router';
    const db = dbTech[0] || 'Database Storage';
    const llm = aiTech[0] || 'LLM Inference';
    return `[ User Ingress ] ───► [ ${coordinator} ] ──┐
                                                           │
                                                           ▼
                      ┌───────────────────┬───────────────────┐
                      ▼                   ▼                   ▼
            ┌───────────────────┐┌───────────────────┐┌───────────────────┐
            │${a1.substring(0,19).padEnd(19, ' ')}││${a2.substring(0,19).padEnd(19, ' ')}││${a3.substring(0,19).padEnd(19, ' ')}│
            └───────────────────┘└───────────────────┘└───────────────────┘
                      │                   │                   │
                      └───────────────────┼───────────────────┘
                                          ▼
                      ┌───────────────────────────────────────┐
                      │    Synthesis, Scoring & Arbiter DTO   │
                      └───────────────────────────────────────┘
                                          │
                                          ▼
                      ┌───────────────────────────────────────┐
                      │ Persistence: ${db} · ${llm} │
                      └───────────────────────────────────────┘`;
  }

  // General backend / API architecture
  const srv = backendTech[0] || 'Application Core';
  const db = dbTech[0] || 'Data Persistence';
  const ai = aiTech[0] || 'Service Workers';
  return `┌────────────────────────────────────────────────────────┐
│               Client Ingress / User Ingress            │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│          API Routing Layer (${srv.substring(0,24).padEnd(24, ' ')})          │
└────────────────────────────────────────────────────────┘
            │                               │
            ▼                               ▼
┌──────────────────────┐        ┌──────────────────────┐
│  Business Services   │        │  Domain Orchestrator │
│  ${srv.substring(0,20).padEnd(20, ' ')}│        │  ${ai.substring(0,20).padEnd(20, ' ')}│
└──────────────────────┘        └──────────────────────┘
            │                               │
            └───────────────┬───────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│          Data Persistence & Storage (${db.substring(0,16).padEnd(16, ' ')})       │
└────────────────────────────────────────────────────────┘`;
}

interface ArchitectureTabProps {
  architecture: GitHubArchitectureAnalysis;
  repoInfo?: GitHubRepoInfo;
}

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ architecture, repoInfo }) => {
  const [copiedDiagram, setCopiedDiagram] = useState(false);

  const handleCopy = async () => {
    try {
      const diagram = generateAsciiArchitecture(architecture, repoInfo);
      await navigator.clipboard.writeText(diagram);
      setCopiedDiagram(true);
      setTimeout(() => setCopiedDiagram(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div className="space-y-4">
      {/* System Architecture Diagram (Textual Representation) */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-gray-200 ml-1.5 flex items-center gap-2">
              <span>📐</span>
              <span>System Architecture Diagram (Textual Representation)</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {architecture.architecture_style || 'Box & Arrow Topology'}
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-mono font-medium transition cursor-pointer border border-gray-700 active:scale-95"
            title="Copy ASCII architecture diagram to clipboard"
          >
            {copiedDiagram ? (
              <>
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-emerald-400 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Copy Diagram</span>
              </>
            )}
          </button>
        </div>
        <div className="p-4 sm:p-5 bg-gray-950 overflow-x-auto max-h-[520px] overflow-y-auto">
          <pre className="font-mono text-emerald-400 text-xs sm:text-[13px] leading-relaxed select-all whitespace-pre">
            {generateAsciiArchitecture(architecture, repoInfo)}
          </pre>
        </div>
      </div>

      {/* Data Flow & Request Lifecycle */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">
          🔄 Data Flow & Request Lifecycle
        </h4>
        <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
          {architecture.data_flow_explanation}
        </p>
      </div>

      {/* Core Components */}
      <div>
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Core Components</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {architecture.core_components?.map((c: GitHubComponentItem, i: number) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-gray-900 text-xs">{c.name}</span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                  {c.path}
                </span>
              </div>
              <p className="text-gray-600 text-xs leading-relaxed mb-2">{c.responsibility}</p>
              <div className="flex flex-wrap gap-1">
                {c.technologies?.map((t: string) => (
                  <span
                    key={t}
                    className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded text-[10px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design Patterns */}
      <div>
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Design Patterns</h4>
        <div className="space-y-2">
          {architecture.design_patterns?.map((p: GitHubDesignPattern, i: number) => (
            <div key={i} className="flex gap-3 bg-gray-50 border border-gray-200 rounded-xl p-4">
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 text-xs whitespace-nowrap h-fit">
                {p.pattern}
              </span>
              <p className="text-gray-600 text-xs leading-relaxed">{p.rationale}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchitectureTab;
