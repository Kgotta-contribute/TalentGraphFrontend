interface SecurityTabProps {
  security?: GitHubSecurityAnalysis;
}

export default function SecurityTab({ security }: SecurityTabProps) {
  const risk = security?.overall_risk || 'unknown';

  return (
    <div className="space-y-4">
      <div
        className={`border rounded-xl p-4 flex items-center gap-4 ${
          risk === 'high'
            ? 'bg-rose-50 border-rose-200'
            : risk === 'medium'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-emerald-50 border-emerald-200'
        }`}
      >
        <div className="text-3xl">
          {risk === 'high' ? '🔴' : risk === 'medium' ? '🟡' : '🟢'}
        </div>
        <div>
          <div className="font-bold text-gray-900 text-sm capitalize">Risk: {risk}</div>
          <div className="text-xs text-gray-600 mt-0.5">
            Auth: <strong>{security?.auth_mechanism || 'Unknown'}</strong>
          </div>
          <p className="text-xs text-gray-600 mt-1">{security?.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {security?.security_strengths && security.security_strengths.length > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider mb-2">
              ✓ Security Strengths
            </h4>
            <ul className="space-y-1.5">
              {security.security_strengths.map((s, i) => (
                <li key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {security?.insecure_configs && security.insecure_configs.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider mb-2">
              ⚠ Configuration Issues
            </h4>
            <ul className="space-y-1.5">
              {security.insecure_configs.map((s, i) => (
                <li key={i} className="text-xs text-amber-900 flex items-start gap-1.5">
                  <span>•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {security?.secret_indicators && security.secret_indicators.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
          <h4 className="font-bold text-rose-800 text-xs uppercase tracking-wider mb-2">
            ⛔ Hardcoded Secret Indicators
          </h4>
          <p className="text-[11px] text-rose-600 mb-2">
            Note: Actual secret values are never displayed by this tool.
          </p>
          <ul className="space-y-1.5">
            {security.secret_indicators.map((s, i) => (
              <li key={i} className="text-xs text-rose-900 flex items-start gap-1.5">
                <span>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
