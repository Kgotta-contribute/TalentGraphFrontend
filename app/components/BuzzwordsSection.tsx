import React from "react";

interface BuzzwordItem {
  word: string;
  whyAvoid: string;
  beforeExample: string;
  afterExample: string;
}

interface BuzzwordsSectionProps {
  buzzwords?: BuzzwordItem[];
}

const BuzzwordsSection: React.FC<BuzzwordsSectionProps> = ({ buzzwords }) => {
  if (!buzzwords || buzzwords.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-sm">🚫</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Vague Buzzwords & Clichés</h3>
          <p className="text-xs text-gray-500">Recruiters consider generic descriptors fluff unless backed by proof</p>
        </div>
      </div>

      <div className="space-y-4">
        {buzzwords.map((item, idx) => (
          <div key={idx} className="bg-gray-50/80 rounded-xl p-4 border border-gray-100 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-md border border-rose-100">
                "{item.word}"
              </span>
              <span className="text-xs text-gray-500">{item.whyAvoid}</span>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="text-xs text-gray-600">
                <span className="font-bold text-gray-400">Before: </span>
                <span className="line-through text-gray-500">{item.beforeExample}</span>
              </div>
              <div className="text-xs bg-emerald-50 text-emerald-950 p-2.5 rounded-lg border border-emerald-100">
                <span className="font-bold text-emerald-700">Recruiter-Approved Fix: </span>
                <span>{item.afterExample}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuzzwordsSection;
