interface GitHistoryTabProps {
  gitActivity?: GitHubGitActivity;
}

export default function GitHistoryTab({ gitActivity }: GitHistoryTabProps) {
  const statCards = [
    {
      label: 'Activity',
      value: gitActivity?.activity_signal || 'unknown',
      color:
        gitActivity?.activity_signal === 'active'
          ? 'text-emerald-800 bg-emerald-50 border-emerald-300'
          : gitActivity?.activity_signal === 'slow'
          ? 'text-amber-800 bg-amber-50 border-amber-300'
          : 'text-rose-800 bg-rose-50 border-rose-300',
    },
    {
      label: 'Contributors',
      value: `${gitActivity?.commit_authors?.length || 0} authors`,
      color: 'text-indigo-900 bg-indigo-50 border-indigo-200',
    },
    {
      label: 'Days since push',
      value:
        gitActivity?.days_since_push != null
          ? `${gitActivity.days_since_push}d ago`
          : 'unknown',
      color: 'text-slate-900 bg-slate-100 border-slate-300',
    },
    {
      label: 'Size',
      value: `${((gitActivity?.size_kb || 0) / 1024).toFixed(1)} MB`,
      color: 'text-purple-900 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((m) => (
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

      <div>
        <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3">
          Recent Commits
        </h4>
        <div className="space-y-2">
          {gitActivity?.recent_commits?.map((c, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200/90 rounded-xl p-3 shadow-2xs"
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold text-indigo-600 font-mono">{c.sha}</span>
                <span className="text-gray-500 font-medium">
                  {c.date ? new Date(c.date).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-gray-900 text-xs font-medium">{c.message}</p>
              <span className="text-[11px] text-gray-600 mt-0.5 block">by {c.author}</span>
            </div>
          ))}
        </div>
      </div>

      {gitActivity?.commit_authors && gitActivity.commit_authors.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">
            Authors
          </h4>
          <div className="flex flex-wrap gap-2">
            {gitActivity.commit_authors.map((a, i) => (
              <span
                key={i}
                className="bg-white border border-gray-200 text-gray-700 px-2.5 py-1 rounded-lg text-xs font-medium"
              >
                👤 {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
