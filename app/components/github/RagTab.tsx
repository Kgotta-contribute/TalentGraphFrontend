interface RagTabProps {
  ragAnalysis?: GitHubRagAnalysis;
}

export default function RagTab({ ragAnalysis }: RagTabProps) {
  const isDetected = Boolean(ragAnalysis?.rag_detected);

  return (
    <div className="space-y-4">
      <div
        className={`border rounded-xl p-5 flex items-start gap-4 ${
          isDetected ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="text-3xl">{isDetected ? '🤖' : '❌'}</div>
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-sm mb-1">
            {isDetected ? 'RAG / LLM Pipeline Detected' : 'No RAG Implementation Detected'}
          </div>
          <p className="text-gray-600 text-xs leading-relaxed">{ragAnalysis?.summary}</p>
          {isDetected && (
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {ragAnalysis?.framework && ragAnalysis.framework !== 'none' && (
                <span className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg font-semibold">
                  🔗 {ragAnalysis.framework}
                </span>
              )}
              {ragAnalysis?.vector_store && ragAnalysis.vector_store !== 'none' && (
                <span className="bg-purple-100 text-purple-800 border border-purple-200 px-2.5 py-1 rounded-lg font-semibold">
                  🔍 {ragAnalysis.vector_store}
                </span>
              )}
              {ragAnalysis?.llm_provider && ragAnalysis.llm_provider !== 'none' && (
                <span className="bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-lg font-semibold">
                  🧠 {ragAnalysis.llm_provider}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-gray-400">Confidence</div>
          <div className="font-bold text-indigo-600 text-lg">
            {Math.round((ragAnalysis?.confidence || 0) * 100)}%
          </div>
        </div>
      </div>

      {isDetected && ragAnalysis?.pipeline_stages && ragAnalysis.pipeline_stages.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Pipeline Stages</h4>
          <div className="flex flex-wrap items-center gap-2">
            {ragAnalysis.pipeline_stages.map((stage, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                  {stage}
                </span>
                {i < ragAnalysis.pipeline_stages.length - 1 && <span className="text-gray-400">→</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {ragAnalysis?.evidence_files && ragAnalysis.evidence_files.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Evidence Files</h4>
          <div className="space-y-1">
            {ragAnalysis.evidence_files.map((f, i) => (
              <div key={i} className="text-xs font-mono text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                📄 {f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
