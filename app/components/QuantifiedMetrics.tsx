import React, { useState } from "react";

interface QuantifiedMetricsProps {
  metrics?: {
    totalBullets: number;
    quantifiedCount: number;
    percentage: number;
    unquantifiedBullets: {
      original: string;
      rewrite: string;
      suggestion?: string;
    }[];
  };
}

const QuantifiedMetrics: React.FC<QuantifiedMetricsProps> = ({ metrics }) => {
  const [showAll, setShowAll] = useState(false);
  if (!metrics || metrics.totalBullets === 0) return null;

  const pct = Math.round(metrics.percentage || (metrics.quantifiedCount / metrics.totalBullets) * 100);
  const isHealthy = pct >= 60;
  const isModerate = pct >= 35 && pct < 60;

  const progressColor = isHealthy ? "bg-emerald-500" : isModerate ? "bg-amber-500" : "bg-rose-500";
  const displayedBullets = showAll
    ? metrics.unquantifiedBullets
    : metrics.unquantifiedBullets.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-xl bg-indigo-50 text-indigo-600 font-bold text-sm">🔢</span>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Quantified Impact Check</h3>
            <p className="text-xs text-gray-500">Measureable metrics stop recruiters from skimming past your bullets</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-gray-900">{metrics.quantifiedCount}</span>
          <span className="text-sm font-semibold text-gray-400">/{metrics.totalBullets} bullets</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 my-4">
        <div className="flex justify-between text-xs font-semibold">
          <span className={isHealthy ? "text-emerald-700" : isModerate ? "text-amber-700" : "text-rose-700"}>
            {pct}% Quantified ({pct >= 60 ? "Target Met ✓" : "Needs 50-75%+"})
          </span>
          <span className="text-gray-400">Target: 60%+</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${progressColor} transition-all duration-700 rounded-full`}
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
      </div>

      {/* Unquantified Lines Rewrite Cards */}
      {metrics.unquantifiedBullets && metrics.unquantifiedBullets.length > 0 && (
        <div className="space-y-3 mt-5">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            Suggested Bullet Rewrites ({metrics.unquantifiedBullets.length} Unquantified)
          </p>

          {displayedBullets.map((item, idx) => (
            <div key={idx} className="bg-gray-50/90 rounded-xl p-4 border border-gray-100 space-y-2">
              <div>
                <span className="text-[10px] font-bold uppercase text-rose-600 tracking-wider bg-rose-50 px-2 py-0.5 rounded">
                  Before (Unquantified)
                </span>
                <p className="text-xs text-gray-700 mt-1 line-through opacity-75">{item.original}</p>
              </div>

              <div className="pt-2 border-t border-gray-200/60">
                <span className="text-[10px] font-bold uppercase text-emerald-700 tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  After (With Impact & Metrics)
                </span>
                <p className="text-xs font-medium text-emerald-950 mt-1 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100/80">
                  {item.rewrite}
                </p>
              </div>

              {item.suggestion && (
                <p className="text-[11px] text-indigo-600 font-medium">💡 {item.suggestion}</p>
              )}
            </div>
          ))}

          {metrics.unquantifiedBullets.length > 3 && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-1 cursor-pointer"
            >
              {showAll ? "Show Fewer Rewrites ▲" : `+ View All ${metrics.unquantifiedBullets.length} Bullet Rewrites ▼`}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default QuantifiedMetrics;
