const LANG_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  HTML: '#E34C26',
  CSS: '#563D7C',
  Go: '#00ADD8',
  Rust: '#DEA584',
  Java: '#B07219',
  'C++': '#F34B7D',
  'C#': '#178600',
  Ruby: '#701516',
  Shell: '#89E051',
  Dockerfile: '#384D54',
};

const langColor = (l: string) => LANG_COLORS[l] || '#6366F1';

interface RepoHeroCardProps {
  result: GitHubHarnessResult;
}

export default function RepoHeroCard({ result }: RepoHeroCardProps) {
  const complexityScore = result.architecture.technical_complexity_score ?? 85;
  const qualityScore = result.code_quality?.overall_quality_score ?? 80;

  const docScore = (() => {
    const q = String(result.code_quality?.documentation_quality || '').toLowerCase();
    if (['excellent', 'high'].includes(q)) return 94;
    if (['good', 'complete'].includes(q)) return 85;
    if (['moderate', 'medium', 'basic'].includes(q)) return 72;
    if (['low', 'poor', 'minimal'].includes(q)) return 50;
    return Math.min(
      95,
      Math.max(50, Math.round(Math.min((result.readme?.length || 0) / 100, 40) + 55))
    );
  })();

  const activityScore = (() => {
    if (result.git_activity?.activity_signal === 'active') {
      return Math.max(75, Math.min(98, 100 - (result.git_activity?.days_since_push ?? 0) * 2));
    }
    if (result.git_activity?.activity_signal === 'slow') return 68;
    if (result.git_activity?.activity_signal === 'dormant') return 45;
    return 88;
  })();

  const rawChips = [
    ...(result.languages?.map((l) => l.name) || []),
    ...Object.values(result.architecture?.tech_stack || {}).flat(),
    ...(result.repo_info.topics || []),
  ];
  const uniqueChips = Array.from(new Set(rawChips.filter(Boolean))).slice(0, 8);

  return (
    <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-6 shadow-xs font-mono text-xs">
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
        {/* Left Column: Avatar + Repo Info + Metadata + Tech badges */}
        <div className="flex items-start gap-4 flex-1">
          {/* Circular Black Octocat Avatar */}
          <div className="w-12 h-12 rounded-full bg-gray-950 flex items-center justify-center shrink-0 shadow-sm border border-gray-800">
            <svg className="w-7 h-7 fill-white" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <a
                href={result.repo_info.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-xl font-black text-gray-900 hover:text-indigo-600 transition flex items-center gap-1"
              >
                {result.repo_info.full_name}
                <span className="text-xs text-gray-400 font-normal">↗</span>
              </a>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-900 text-white shadow-2xs">
                PUBLIC
              </span>
              {result.architecture.production_readiness_tier && (
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-2xs ${
                    result.architecture.production_readiness_tier.includes('Production')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : result.architecture.production_readiness_tier.includes('Beta')
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  {result.architecture.production_readiness_tier}
                </span>
              )}
              {result.subpath && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  📁 Subpath: {result.subpath}
                </span>
              )}
            </div>

            <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">
              {result.repo_info.description}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-gray-500 font-medium">
              <span className="font-semibold text-gray-800">
                ★ {result.repo_info.stars.toLocaleString()}
              </span>
              <span>•</span>
              <span className="font-semibold text-gray-800">
                ⑂ {result.repo_info.forks.toLocaleString()}
              </span>
              <span>•</span>
              <span>
                ⊙ <strong className="text-gray-800 font-semibold">{result.repo_info.open_issues} open issues</strong>
              </span>
              <span>•</span>
              <span>
                ⚖ <strong className="text-gray-800 font-semibold">{result.repo_info.license || 'None'}</strong>
              </span>
              <span>•</span>
              <span>
                ⑂ <strong className="text-gray-800 font-semibold">{result.repo_info.default_branch || 'main'}</strong>
              </span>
            </div>

            {/* Detected tech badges row */}
            {uniqueChips.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {uniqueChips.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-gray-50 text-gray-700 border border-gray-200 shadow-2xs hover:bg-gray-100 transition"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 4 Score Metric Cards */}
        <div className="grid grid-cols-2 gap-3 lg:w-[320px] shrink-0">
          {/* Complexity */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">COMPLEXITY</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-indigo-600">{complexityScore}</span>
              <span className="text-[11px] text-gray-400 font-semibold">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${complexityScore}%` }}
              />
            </div>
          </div>

          {/* Code Quality */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">CODE QUALITY</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-emerald-600">{qualityScore}</span>
              <span className="text-[11px] text-gray-400 font-semibold">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${qualityScore}%` }}
              />
            </div>
          </div>

          {/* Documentation */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">DOCUMENTATION</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-blue-600">{docScore}</span>
              <span className="text-[11px] text-gray-400 font-semibold">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${docScore}%` }}
              />
            </div>
          </div>

          {/* Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ACTIVITY</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-black text-amber-500">{activityScore}</span>
              <span className="text-[11px] text-gray-400 font-semibold">/ 100</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${activityScore}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Language bar */}
      {result.languages?.length > 0 && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-bold text-gray-600 uppercase tracking-wider text-[10px]">
              LANGUAGE DISTRIBUTION
            </span>
            <span className="text-gray-400 text-[11px] font-medium">{result.languages.length} detected</span>
          </div>
          <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-gray-100 shadow-inner">
            {result.languages.map((l) => (
              <div
                key={l.name}
                style={{ width: `${l.percentage}%`, backgroundColor: langColor(l.name) }}
                title={`${l.name}: ${l.percentage}%`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-4 mt-2.5 text-[11px]">
            {result.languages.slice(0, 7).map((l) => (
              <div key={l.name} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: langColor(l.name) }}
                />
                <span className="font-medium text-gray-800">{l.name}</span>
                <span className="text-gray-400">{l.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
