import React from "react";

interface SkillGapItem {
  skill: string;
  frequencyPercent: number;
  whyRelevant: string;
}

interface MarketSkillGapsProps {
  skillGaps?: SkillGapItem[];
}

const MarketSkillGaps: React.FC<MarketSkillGapsProps> = ({ skillGaps }) => {
  if (!skillGaps || skillGaps.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-purple-50 text-purple-600 font-bold text-sm">📊</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Market Benchmark & In-Demand Skills</h3>
          <p className="text-xs text-gray-500">Skills frequently demanded for this role that are missing from your resume</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skillGaps.map((item, idx) => (
          <div key={idx} className="bg-purple-50/40 rounded-xl p-3.5 border border-purple-100/70 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-sm text-gray-900">{item.skill}</span>
              <span className="text-xs font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                {item.frequencyPercent}% of postings
              </span>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed mt-1">{item.whyRelevant}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketSkillGaps;
