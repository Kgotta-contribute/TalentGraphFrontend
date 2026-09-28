import React from "react";

interface RecruiterReadProps {
  recruiterRead?: {
    detectedRole: string;
    seniorityLevel: string;
    shortlistOdds: "Strong" | "Borderline" | "Low";
    summary: string;
    strongestHighlight?: string;
  };
}

const RecruiterVerdict: React.FC<RecruiterReadProps> = ({ recruiterRead }) => {
  if (!recruiterRead) return null;

  const oddsBadge =
    recruiterRead.shortlistOdds === "Strong"
      ? "bg-green-100 text-green-800 border-green-200"
      : recruiterRead.shortlistOdds === "Borderline"
      ? "bg-amber-100 text-amber-800 border-amber-200"
      : "bg-red-100 text-red-800 border-red-200";

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The 7-Second Recruiter Read</span>
          <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{recruiterRead.detectedRole}</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 font-medium">Shortlist Odds:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${oddsBadge}`}>
            {recruiterRead.shortlistOdds}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Estimated Seniority & Scope</p>
          <p className="text-sm font-semibold text-slate-800">{recruiterRead.seniorityLevel}</p>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{recruiterRead.summary}</p>

        {recruiterRead.strongestHighlight && (
          <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-xl p-3.5 mt-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1">
              <span>⭐</span> Top Differentiator (Memorability Test)
            </div>
            <p className="text-xs text-indigo-800 leading-relaxed italic">
              "{recruiterRead.strongestHighlight}"
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterVerdict;
