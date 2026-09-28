import React, { useState } from 'react';

interface FileTreeTabProps {
  fileTree?: GitHubRootFileItem[];
}

export const FileTreeTab: React.FC<FileTreeTabProps> = ({ fileTree = [] }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider">
          Repository Structure ({fileTree.length} entries)
        </h4>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[11px] text-indigo-600 hover:text-indigo-800 cursor-pointer font-medium"
        >
          {collapsed ? 'Expand all' : 'Collapse all'}
        </button>
      </div>
      {!collapsed && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 max-h-96 overflow-y-auto space-y-0.5">
          {fileTree.length === 0 ? (
            <div className="text-center text-gray-400 py-6 text-xs">No files detected in tree</div>
          ) : (
            fileTree.map((f: GitHubRootFileItem, i: number) => {
              const depth = (f.path?.split('/').length || 1) - 1;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between text-xs py-1 px-2 hover:bg-white rounded transition"
                  style={{ paddingLeft: `${8 + depth * 16}px` }}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="shrink-0">{f.type === 'dir' ? '📁' : '📄'}</span>
                    <span className="text-gray-800 font-medium truncate">{f.name}</span>
                  </div>
                  {f.size > 0 && (
                    <span className="text-[10px] text-gray-400 shrink-0 font-mono">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default FileTreeTab;
