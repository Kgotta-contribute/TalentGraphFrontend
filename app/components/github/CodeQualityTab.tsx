interface CodeQualityTabProps {
  codeQuality?: GitHubCodeQuality;
}

export default function CodeQualityTab({ codeQuality }: CodeQualityTabProps) {
  const metricCards = [
    {
      label: 'Type Hints',
      value: codeQuality?.type_hints_coverage || 'unknown',
      color: ['complete', 'high', 'good'].includes(
        String(codeQuality?.type_hints_coverage || '').toLowerCase()
      )
        ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
        : ['moderate', 'medium', 'partial'].includes(
            String(codeQuality?.type_hints_coverage || '').toLowerCase()
          )
        ? 'text-amber-700 bg-amber-50 border-amber-300'
        : ['none', 'low', 'poor'].includes(
            String(codeQuality?.type_hints_coverage || '').toLowerCase()
          )
        ? 'text-rose-700 bg-rose-50 border-rose-300'
        : 'text-gray-800 bg-gray-100 border-gray-300',
    },
    {
      label: 'Error Handling',
      value: codeQuality?.error_handling_quality || 'unknown',
      color: ['good', 'high', 'robust'].includes(
        String(codeQuality?.error_handling_quality || '').toLowerCase()
      )
        ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
        : ['moderate', 'medium', 'basic'].includes(
            String(codeQuality?.error_handling_quality || '').toLowerCase()
          )
        ? 'text-amber-700 bg-amber-50 border-amber-300'
        : ['none', 'poor', 'low'].includes(
            String(codeQuality?.error_handling_quality || '').toLowerCase()
          )
        ? 'text-rose-700 bg-rose-50 border-rose-300'
        : 'text-gray-800 bg-gray-100 border-gray-300',
    },
    {
      label: 'Documentation',
      value: codeQuality?.documentation_quality || 'unknown',
      color: ['good', 'high', 'comprehensive'].includes(
        String(codeQuality?.documentation_quality || '').toLowerCase()
      )
        ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
        : ['moderate', 'medium', 'basic'].includes(
            String(codeQuality?.documentation_quality || '').toLowerCase()
          )
        ? 'text-amber-700 bg-amber-50 border-amber-300'
        : ['none', 'poor', 'low'].includes(
            String(codeQuality?.documentation_quality || '').toLowerCase()
          )
        ? 'text-rose-700 bg-rose-50 border-rose-300'
        : 'text-gray-800 bg-gray-100 border-gray-300',
    },
    {
      label: 'Tests',
      value: codeQuality?.has_tests
        ? `✅ ${codeQuality.test_files_detected?.length || 0} files`
        : '❌ None',
      color: codeQuality?.has_tests
        ? 'text-emerald-700 bg-emerald-50 border-emerald-300'
        : 'text-rose-700 bg-rose-50 border-rose-300',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metricCards.map((m) => (
          <div
            key={m.label}
            className="bg-white border border-gray-200/90 rounded-xl p-4 text-center shadow-xs"
          >
            <div className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              {m.label}
            </div>
            <div className={`inline-block px-3 py-1 rounded-lg text-xs font-black capitalize border ${m.color}`}>
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {codeQuality?.code_organization && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-1">
            Code Organization
          </h4>
          <p className="text-xs text-gray-600">{codeQuality.code_organization}</p>
        </div>
      )}

      {codeQuality?.test_files_detected && codeQuality.test_files_detected.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">
            Test Files
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {codeQuality.test_files_detected.map((f, i) => (
              <span
                key={i}
                className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-mono"
              >
                📄 {f}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {codeQuality?.strengths && codeQuality.strengths.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-2">
              ✓ Strengths
            </h4>
            <ul className="space-y-1.5">
              {codeQuality.strengths.map((s, i) => (
                <li key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {codeQuality?.improvement_areas && codeQuality.improvement_areas.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-2">
              ↑ Improvement Areas
            </h4>
            <ul className="space-y-1.5">
              {codeQuality.improvement_areas.map((s, i) => (
                <li key={i} className="text-xs text-amber-900 flex items-start gap-1.5">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {codeQuality?.hardcoded_configs && codeQuality.hardcoded_configs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-2">
            ⚠ Hardcoded Configs
          </h4>
          <ul className="space-y-1">
            {codeQuality.hardcoded_configs.map((c, i) => (
              <li key={i} className="text-xs text-amber-900">
                • {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
