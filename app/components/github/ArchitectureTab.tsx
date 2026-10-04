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

  const fe = (stack.frontend || [])[0] || 'Client SPA';
  const be = (stack.backend || [])[0] || 'API Gateway';
  const db = (stack.database_and_storage || [])[0] || 'Database Storage';
  const ai = (stack.ai_and_data || [])[0] || 'AI / Worker Logic';
  const storage = (stack.database_and_storage || [])[1] || 'Persistence Layer';

  return `┌────────────────────────────────────────────────────────┐
│                   User / Web Browser                   │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         ${fe.padEnd(46, ' ')} │
└────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│         ${be.padEnd(46, ' ')} │
└────────────────────────────────────────────────────────┘
            │               │               │
            ▼               ▼               ▼
┌─────────────────┬─────────────────┬─────────────────┐
│${ai.padEnd(17, ' ')}│${db.padEnd(17, ' ')}│${storage.padEnd(17, ' ')}│
└─────────────────┴─────────────────┴─────────────────┘`;
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
