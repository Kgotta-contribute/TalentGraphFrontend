import { useState } from 'react';

interface ObservabilityPanelProps {
  observability: GitHubObservability;
}

export default function ObservabilityPanel({ observability }: ObservabilityPanelProps) {
  const [obsExpanded, setObsExpanded] = useState(false);

  return (
    <div className="bg-gray-900/95 backdrop-blur-xs border border-gray-700 rounded-2xl overflow-hidden shadow-lg">
      <button
        className="w-full flex items-center justify-between px-5 py-3 text-xs font-mono cursor-pointer hover:bg-gray-800/60 transition"
        onClick={() => setObsExpanded(!obsExpanded)}
      >
        <div className="flex items-center gap-3 text-emerald-400 font-bold">
          <span>✦</span>
          <span>Harness Observability</span>
          <span className="text-gray-400 font-normal">
            Tools: {observability.tools_used} · Files: {observability.files_analyzed} · Time:{' '}
            {observability.execution_time_seconds}s
          </span>
        </div>
        <span className="text-gray-400">{obsExpanded ? '▲' : '▼'}</span>
      </button>
      {obsExpanded && (
        <div className="px-5 pb-4 border-t border-gray-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-3">
            {observability.steps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-[11px]">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <div>
                  <span className="text-gray-200 font-semibold">{step.label}</span>
                  {step.detail && <span className="text-gray-500 ml-1">— {step.detail}</span>}
                </div>
              </div>
            ))}
          </div>
          {observability.errors.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-700">
              {observability.errors.map((e, i) => (
                <div key={i} className="text-yellow-400 text-[11px]">
                  ⚠ {e}
                </div>
              ))}
            </div>
          )}
          <div className="mt-3 pt-3 border-t border-gray-700 flex flex-wrap gap-x-6 gap-y-2 text-[11px]">
            <span className="text-indigo-400 font-bold">{observability.tools_used} MCP tool calls</span>
            <span className="text-indigo-400 font-bold">{observability.files_analyzed} files analyzed</span>
            <span className="text-indigo-400 font-bold">{observability.execution_time_seconds}s execution</span>
            <span className="text-emerald-400 font-medium">
              🛡️ Rate Limit Protected (Groq 20 RPM · GitHub 20 RPM &amp; 850 RPH)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
