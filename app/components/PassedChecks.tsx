import React from "react";

interface CheckItem {
  title: string;
  description: string;
}

interface PassedChecksProps {
  passedChecks?: CheckItem[];
}

const PassedChecks: React.FC<PassedChecksProps> = ({ passedChecks }) => {
  if (!passedChecks || passedChecks.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 font-bold text-sm">✅</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">What You Did Well (Passed Checks)</h3>
          <p className="text-xs text-gray-500">Core structural, format, and layout elements that passed recruiter inspection</p>
        </div>
      </div>

      <div className="space-y-3">
        {passedChecks.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/70">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              ✓
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">{item.title}</h4>
              <p className="text-xs text-emerald-900/80 leading-relaxed mt-0.5">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassedChecks;
