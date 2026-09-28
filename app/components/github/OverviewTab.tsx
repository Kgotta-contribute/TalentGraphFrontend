interface OverviewTabProps {
  architecture: GitHubArchitectureAnalysis;
  ragAnalysis?: GitHubRagAnalysis;
  agentDetection?: GitHubAgentDetection;
  cicdAnalysis?: GitHubCiCdAnalysis;
  codeQuality?: GitHubCodeQuality;
}

export default function OverviewTab({
  architecture,
  ragAnalysis,
  agentDetection,
  cicdAnalysis,
  codeQuality,
}: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
        <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>🏛️</span> Architecture Style
        </h3>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg border border-indigo-200 text-xs">
          {architecture.architecture_style || 'Unknown'}
        </span>
        <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line mt-3">
          {architecture.system_summary}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'RAG Detected',
            value: ragAnalysis?.rag_detected ? '✅ Yes' : '❌ No',
            color: ragAnalysis?.rag_detected
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-gray-700 bg-gray-50 border-gray-200',
          },
          {
            label: 'Agents Found',
            value: agentDetection?.agents_detected ? `✅ ${agentDetection.agent_count}` : '❌ No',
            color: agentDetection?.agents_detected
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-gray-700 bg-gray-50 border-gray-200',
          },
          {
            label: 'CI/CD',
            value: cicdAnalysis?.has_ci ? '✅ Yes' : '❌ No',
            color: cicdAnalysis?.has_ci
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-gray-700 bg-gray-50 border-gray-200',
          },
          {
            label: 'Tests',
            value: codeQuality?.has_tests ? '✅ Yes' : '❌ No',
            color: codeQuality?.has_tests
              ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
              : 'text-gray-700 bg-gray-50 border-gray-200',
          },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-gray-200/90 rounded-xl p-4 text-center shadow-xs">
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">{card.label}</div>
            <div className={`inline-block px-3 py-1 rounded-lg text-xs font-black border ${card.color}`}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-200 rounded-xl p-4">
          <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-2">✓ Engineering Strengths</h4>
          <ul className="space-y-1.5">
            {architecture.engineering_strengths?.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-emerald-950 text-xs">
                <span className="text-emerald-600 font-bold">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-rose-50/50 border border-rose-200 rounded-xl p-4">
          <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider mb-2">⚠ Risks &amp; Bottlenecks</h4>
          <ul className="space-y-1.5">
            {architecture.potential_bottlenecks_and_risks?.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-rose-950 text-xs">
                <span className="text-rose-600 font-bold">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
