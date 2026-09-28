export const CAT_ICONS: Record<string, string> = {
  web_framework: '🌐',
  orm: '🗄️',
  llm: '🤖',
  vector_db: '🔍',
  auth: '🔐',
  testing: '🧪',
  devops: '🚀',
  utility: '🔧',
  frontend: '🎨',
  other: '📦',
};

interface DependenciesTabProps {
  dependencies?: GitHubDependencyAnalysis;
}

export default function DependenciesTab({ dependencies }: DependenciesTabProps) {
  const grouped: Record<string, GitHubDependencyPackage[]> = {};
  (dependencies?.packages || []).forEach((pkg) => {
    grouped[pkg.category] = grouped[pkg.category] || [];
    grouped[pkg.category].push(pkg);
  });

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-xs text-indigo-800">{dependencies?.summary}</p>
        <span className="mt-1 inline-block text-indigo-600 font-bold text-xs">
          {dependencies?.total_deps || 0} total dependencies
        </span>
      </div>

      {/* Group by category */}
      {Object.entries(grouped).map(([cat, pkgs]) => (
        <div key={cat}>
          <h4 className="font-bold text-gray-700 text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>{CAT_ICONS[cat] || '📦'}</span>
            {cat.replace(/_/g, ' ')} ({pkgs.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pkgs.map((pkg, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 text-xs">{pkg.name}</span>
                  {pkg.version && (
                    <span className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                      {pkg.version}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-[11px] leading-relaxed">{pkg.purpose}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      {(!dependencies?.packages || dependencies.packages.length === 0) && (
        <div className="text-center text-gray-400 py-8">No dependency manifests found in repository root</div>
      )}
    </div>
  );
}
