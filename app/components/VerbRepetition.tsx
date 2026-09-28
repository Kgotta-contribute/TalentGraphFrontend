import React from "react";

interface VerbItem {
  verb: string;
  count: number;
  suggestedReplacements: string[];
  lines?: string[];
}

interface VerbRepetitionProps {
  verbRepetition?: VerbItem[];
}

const VerbRepetition: React.FC<VerbRepetitionProps> = ({ verbRepetition }) => {
  if (!verbRepetition || verbRepetition.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-amber-50 text-amber-600 font-bold text-sm">🔁</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Action Verb Repetition Matrix</h3>
          <p className="text-xs text-gray-500">Overusing starter verbs reduces impact. Aim for ≤2 uses per verb.</p>
        </div>
      </div>

      <div className="space-y-4">
        {verbRepetition.map((item, idx) => (
          <div key={idx} className="bg-amber-50/40 rounded-xl p-4 border border-amber-100/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-900 capitalize">"{item.verb}"</span>
                <span className="bg-amber-100 text-amber-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-amber-200">
                  {item.count} times
                </span>
              </div>
              <span className="text-[11px] text-amber-700 font-medium">Overused (Target: max 2)</span>
            </div>

            {/* Suggested Synonyms */}
            <div className="mt-2">
              <span className="text-[11px] font-semibold text-gray-500">Suggested Action Verb Replacements:</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {item.suggestedReplacements.map((syn, sIdx) => (
                  <span
                    key={sIdx}
                    className="bg-white text-indigo-700 font-semibold text-xs px-2.5 py-1 rounded-lg border border-indigo-100 shadow-2xs hover:bg-indigo-50 transition-colors"
                  >
                    + {syn}
                  </span>
                ))}
              </div>
            </div>

            {/* Sample Affected Line */}
            {item.lines && item.lines.length > 0 && (
              <div className="mt-2 pt-2 border-t border-amber-100/60">
                <p className="text-[11px] text-gray-500 italic">
                  Excerpt: "{item.lines[0]}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerbRepetition;
