import React from 'react';

interface TechStackTabProps {
  techStack?: Record<string, string[]>;
}

export const TechStackTab: React.FC<TechStackTabProps> = ({ techStack = {} }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(techStack).map(([cat, items]) => (
        <div key={cat} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            {cat.replace(/_/g, ' ')}
          </h4>
          {Array.isArray(items) && items.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {items.map((t: string) => (
                <span
                  key={t}
                  className="bg-white text-gray-800 border border-gray-200 px-2 py-1 rounded-md text-[11px] font-medium shadow-2xs"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-400 text-xs italic">None detected</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default TechStackTab;
