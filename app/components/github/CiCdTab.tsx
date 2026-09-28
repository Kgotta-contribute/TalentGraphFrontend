interface CiCdTabProps {
  cicdAnalysis?: GitHubCiCdAnalysis;
}

export default function CiCdTab({ cicdAnalysis }: CiCdTabProps) {
  const hasCi = Boolean(cicdAnalysis?.has_ci);

  return (
    <div className="space-y-4">
      <div
        className={`border rounded-xl p-4 flex items-center gap-4 ${
          hasCi ? 'bg-emerald-50 border-emerald-200' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="text-2xl">{hasCi ? '🚀' : '❌'}</div>
        <div>
          <div className="font-bold text-gray-900 text-sm">
            {hasCi
              ? `CI/CD Active — ${cicdAnalysis?.platform || 'Detected'}`
              : 'No CI/CD workflows found'}
          </div>
          <p className="text-xs text-gray-600 mt-0.5">{cicdAnalysis?.summary}</p>
          {cicdAnalysis?.test_automation && (
            <span className="mt-1.5 inline-block text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
              ✓ Test Automation
            </span>
          )}
        </div>
      </div>

      {cicdAnalysis?.workflows?.map((wf, i) => (
        <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <div className="font-bold text-gray-900 text-xs mb-1.5">{wf.name}</div>
          <div className="flex flex-wrap gap-2 mb-2">
            {wf.triggers?.map((t) => (
              <span
                key={t}
                className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-[10px] font-medium"
              >
                on: {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {wf.stages?.map((stage, j) => (
              <div key={j} className="flex items-center gap-1.5">
                <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-[10px]">
                  {stage}
                </span>
                {j < (wf.stages?.length || 0) - 1 && <span className="text-gray-300 text-xs">→</span>}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">{wf.summary}</p>
        </div>
      ))}
    </div>
  );
}
