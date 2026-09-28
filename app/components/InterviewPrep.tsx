import React from "react";

interface InterviewPrepProps {
  questions?: string[];
}

const InterviewPrep: React.FC<InterviewPrepProps> = ({ questions }) => {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <span className="p-2 rounded-xl bg-violet-50 text-violet-600 font-bold text-sm">🎯</span>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Questions This Resume Will Trigger</h3>
          <p className="text-xs text-gray-500">Technical & behavioral questions interviewers will ask based on your bullets</p>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div key={idx} className="flex items-start gap-3 bg-violet-50/40 p-3.5 rounded-xl border border-violet-100/70">
            <span className="w-5 h-5 rounded-full bg-violet-200 text-violet-800 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              {idx + 1}
            </span>
            <p className="text-xs sm:text-sm font-medium text-violet-950 leading-relaxed">{q}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewPrep;
