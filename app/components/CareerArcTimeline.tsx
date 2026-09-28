import React from "react";

interface CareerItem {
  period: string;
  title: string;
  organization?: string;
  isFlagged?: boolean;
  flagReason?: string;
}

interface CareerArcTimelineProps {
  careerArc?: CareerItem[];
}

const CareerArcTimeline: React.FC<CareerArcTimelineProps> = ({ careerArc }) => {
  if (!careerArc || careerArc.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-blue-50 text-blue-600 font-bold text-sm">🗺️</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Career Arc & Timeline Scan</h3>
          <p className="text-xs text-gray-500">How a recruiter traces your career order and chronological progression</p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-100">
        {careerArc.map((item, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-[27px] top-1 w-4 h-4 rounded-full border-2 bg-white ${
                item.isFlagged
                  ? "border-rose-500 bg-rose-50 ring-4 ring-rose-100"
                  : "border-indigo-500 ring-4 ring-indigo-50"
              }`}
            />

            <div
              className={`p-3.5 rounded-xl border transition-all ${
                item.isFlagged
                  ? "bg-rose-50/70 border-rose-200"
                  : "bg-gray-50/80 border-gray-100"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-extrabold text-xs text-indigo-700">{item.period}</span>
                {item.isFlagged && (
                  <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    ⚠️ Flagged Issue
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-gray-900 mt-1">{item.title}</h4>
              {item.organization && (
                <p className="text-xs text-gray-600 font-medium">{item.organization}</p>
              )}

              {item.isFlagged && item.flagReason && (
                <p className="text-xs text-rose-700 font-semibold mt-2 pt-2 border-t border-rose-200/60">
                  ⚠️ {item.flagReason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerArcTimeline;
