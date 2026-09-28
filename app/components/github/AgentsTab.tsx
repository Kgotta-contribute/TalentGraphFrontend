interface AgentsTabProps {
  agentDetection?: GitHubAgentDetection;
}

export default function AgentsTab({ agentDetection }: AgentsTabProps) {
  const isDetected = Boolean(agentDetection?.agents_detected);

  return (
    <div className="space-y-4">
      <div
        className={`border rounded-xl p-5 ${
          isDetected ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="font-bold text-gray-900 text-sm mb-1">
              {isDetected
                ? `${agentDetection?.agent_count} Agents Detected — ${agentDetection?.framework}`
                : 'No Agentic Framework Detected'}
            </div>
            <p className="text-gray-600 text-xs">{agentDetection?.summary}</p>
          </div>
          {isDetected && agentDetection?.orchestration_pattern && (
            <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold text-xs">
              {agentDetection.orchestration_pattern}
            </span>
          )}
        </div>
      </div>

      {isDetected && (
        <>
          {agentDetection?.agents && agentDetection.agents.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3">Detected Agents</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {agentDetection.agents.map((agent, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="font-bold text-gray-900 text-xs mb-1">{agent.name}</div>
                    <div className="text-gray-600 text-xs">{agent.role}</div>
                    {agent.file_path && (
                      <div className="mt-1.5 text-indigo-600 font-mono text-[10px]">
                        📄 {agent.file_path}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {agentDetection?.graph_nodes && agentDetection.graph_nodes.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Graph Nodes</h4>
              <div className="flex flex-wrap gap-2">
                {agentDetection.graph_nodes.map((node, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs font-mono">
                      {node}
                    </span>
                    {i < (agentDetection.graph_nodes?.length || 0) - 1 && (
                      <span className="text-gray-300">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
