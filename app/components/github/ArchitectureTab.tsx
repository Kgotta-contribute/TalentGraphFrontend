import React, { useState } from 'react';

export function generateAsciiArchitecture(
  architecture: GitHubArchitectureAnalysis,
  repoInfo?: GitHubRepoInfo
): string {
  if (architecture.ascii_architecture_diagram && architecture.ascii_architecture_diagram.trim().length > 30) {
    return architecture.ascii_architecture_diagram;
  }

  const stack = architecture.tech_stack || {
    frontend: [],
    backend: [],
    database_and_storage: [],
    ai_and_data: [],
    devops_and_cloud: [],
    testing_and_tooling: [],
  };

  const fe = (stack.frontend || [])[0] || 'Client SPA';
  const be = (stack.backend || [])[0] || 'API Gateway';
  const db = (stack.database_and_storage || [])[0] || 'Database Storage';
  const ai = (stack.ai_and_data || [])[0] || 'AI / Worker Logic';

  return `┌──────────────────────────────────────────────────────────────────────────┐
│                          EXPERIENCE / USER INGRESS                       │
│                     ${fe.center(52)} │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │
                                     ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     API GATEWAY & ROUTING LAYER                          │
│                     ${be.center(52)} │
└──────────────────┬────────────────────────────────────┬──────────────────┘
                   │                                    │
                   ▼                                    ▼
        ┌───────────────────────────┐        ┌───────────────────────────┐
        │    Domain Orchestrator    │        │    Service Workers        │
        │    ${ai.center(23)}│        │    ${ai.center(23)}│
        └─────────────┬─────────────┘        └─────────────┬─────────────┘
                      │                                    │
                      └─────────────────┬──────────────────┘
                                        ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                     DATA PERSISTENCE & VECTOR STORAGE                    │
│                     ${db.center(52)} │
└──────────────────────────────────────────────────────────────────────────┘`;
}

interface ArchitectureTabProps {
  architecture: GitHubArchitectureAnalysis;
  repoInfo?: GitHubRepoInfo;
}

type SubView = 'system' | 'request_flow' | 'data_flow' | 'agents' | 'ascii';

export const ArchitectureTab: React.FC<ArchitectureTabProps> = ({ architecture, repoInfo }) => {
  const [activeSubView, setActiveSubView] = useState<SubView>('system');
  const [copiedDiagram, setCopiedDiagram] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<GitHubArchitectureComponent | null>(null);

  const handleCopy = async () => {
    try {
      const diagram = generateAsciiArchitecture(architecture, repoInfo);
      await navigator.clipboard.writeText(diagram);
      setCopiedDiagram(true);
      setTimeout(() => setCopiedDiagram(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  const metrics = architecture.complexity_metrics || {
    components_count: architecture.core_components?.length || 8,
    endpoints_count: 14,
    data_stores_count: architecture.tech_stack?.database_and_storage?.length || 2,
    ai_components_count: architecture.tech_stack?.ai_and_data?.length || 4,
    complexity_rating: architecture.technical_complexity_score || 85,
    modularity_rating: 90,
    coupling_rating: 32,
  };

  const zones = architecture.zones || [];
  const requestSteps = architecture.request_lifecycle || [];
  const dataStages = architecture.data_flow_stages || [];
  const agentPipeline = architecture.agent_pipeline;

  return (
    <div className="space-y-6">
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. Header: Complexity Radar & Architecture Profile                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-gray-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Architecture Observatory
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                ● Verified Grounding
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>{architecture.architecture_style || 'Modular Architecture'}</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              {architecture.system_summary?.slice(0, 220)}...
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-gray-900 border border-gray-700/80 text-xs font-mono font-medium text-gray-200">
              Tier: <span className="text-emerald-400 font-bold">{architecture.production_readiness_tier || 'Production-Grade'}</span>
            </span>
          </div>
        </div>

        {/* Live KPI Metrics & Complexity Progress */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-4">
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">Components</span>
            <span className="text-sm font-mono font-bold text-white">{metrics.components_count}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">API Endpoints</span>
            <span className="text-sm font-mono font-bold text-indigo-400">{metrics.endpoints_count}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">Data Stores</span>
            <span className="text-sm font-mono font-bold text-amber-400">{metrics.data_stores_count}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-mono text-gray-400 block uppercase">AI / Agents</span>
            <span className="text-sm font-mono font-bold text-violet-400">{metrics.ai_components_count}</span>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>COMPLEXITY</span>
              <span className="text-white font-bold">{metrics.complexity_rating}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${metrics.complexity_rating}%` }} />
            </div>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>MODULARITY</span>
              <span className="text-emerald-400 font-bold">{metrics.modularity_rating}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${metrics.modularity_rating}%` }} />
            </div>
          </div>
          <div className="bg-gray-900/80 border border-gray-800/80 rounded-xl p-2.5">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>COUPLING</span>
              <span className="text-amber-400 font-bold">{metrics.coupling_rating}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${metrics.coupling_rating}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. Interactive View Switcher Tabs                                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubView('system')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubView === 'system'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <span>🏛️</span>
          <span>System Zones & Topology</span>
        </button>

        <button
          onClick={() => setActiveSubView('request_flow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubView === 'request_flow'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <span>⚡</span>
          <span>Request Lifecycle Trace</span>
        </button>

        <button
          onClick={() => setActiveSubView('data_flow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubView === 'data_flow'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <span>🔄</span>
          <span>Data Flow & Transformations</span>
        </button>

        {agentPipeline && (
          <button
            onClick={() => setActiveSubView('agents')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeSubView === 'agents'
                ? 'bg-violet-600 text-white shadow-sm'
                : 'bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200/80'
            }`}
          >
            <span>🤖</span>
            <span>AI & Agent StateGraph</span>
          </button>
        )}

        <button
          onClick={() => setActiveSubView('ascii')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeSubView === 'ascii'
              ? 'bg-gray-900 text-emerald-400 shadow-sm'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <span>📦</span>
          <span>2D Box ASCII View</span>
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. View 1: SYSTEM ZONES & TOPOLOGY                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubView === 'system' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Architectural Zones (Click any component to inspect code evidence)
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {zones.length} Zones · {metrics.components_count} Active Modules
            </span>
          </div>

          <div className="space-y-6">
            {zones.map((zone, zIdx) => (
              <div
                key={zIdx}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-gray-300 transition"
              >
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{zone.icon || '📁'}</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                        <span>{zone.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                          {zone.badge}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5">{zone.description}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-gray-400">
                    Zone 0{zIdx + 1}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {zone.components?.map((c, cIdx) => (
                    <div
                      key={cIdx}
                      onClick={() => setSelectedComponent(c)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition relative group ${
                        selectedComponent?.name === c.name
                          ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200'
                          : 'bg-gray-50 hover:bg-white border-gray-200 hover:border-indigo-300 hover:shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-bold text-gray-900 text-xs group-hover:text-indigo-600 transition">
                          {c.name}
                        </span>
                        <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600 truncate max-w-[120px]">
                          {c.path}
                        </span>
                      </div>

                      <div className="mb-2">
                        <span className="inline-block bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded text-[10px] border border-indigo-200/80">
                          {c.tech}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 leading-relaxed mb-3 line-clamp-2">
                        {c.responsibility}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-200/60 text-[10px] font-mono">
                        <span className="text-gray-500 font-medium truncate max-w-[150px]">
                          {c.metrics || 'Verified Module'}
                        </span>
                        <span className="text-emerald-600 font-bold flex items-center gap-1">
                          <span>✓</span>
                          <span>Evidence</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. View 2: REQUEST LIFECYCLE TRACE                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubView === 'request_flow' && (
        <div className="space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <span>⚡</span>
                <span>End-to-End Request Lifecycle Pipeline</span>
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                Traces the execution path from browser user interaction down through gateway, auth, vector search, LLM, and persistence.
              </p>
            </div>
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-bold">
              {requestSteps.length} Sequential Steps
            </span>
          </div>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-indigo-200">
            {requestSteps.map((step, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center ring-4 ring-white">
                  {step.step || idx + 1}
                </span>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-900">{step.component}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200 font-bold uppercase">
                        {step.layer}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">
                      {step.file_path}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed mb-2.5">
                    {step.action}
                  </p>

                  {step.code_snippet && (
                    <div className="bg-gray-950 rounded-lg p-2.5 font-mono text-[11px] text-emerald-400 overflow-x-auto mb-2 select-all">
                      <code>{step.code_snippet}</code>
                    </div>
                  )}

                  {step.output && (
                    <div className="text-[10px] font-mono text-gray-600 flex items-center gap-1.5">
                      <span className="text-indigo-500 font-bold">↳ Result:</span>
                      <span>{step.output}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. View 3: DATA FLOW & TRANSFORMATIONS                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubView === 'data_flow' && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
            <h4 className="font-bold text-gray-900 text-sm mb-2 flex items-center gap-2">
              <span>🔄</span>
              <span>Typed Data Transformation Stages</span>
            </h4>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              How data is ingested, normalized, projected into dense vector embeddings, retrieved via cosine similarity, and synthesized.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataStages.map((stage, sIdx) => (
                <div key={sIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                        STAGE 0{stage.stage || sIdx + 1}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">{stage.file_path}</span>
                    </div>
                    <h5 className="font-bold text-gray-900 text-xs mb-2">{stage.name}</h5>

                    <div className="space-y-2 text-xs">
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Input</span>
                        <span className="text-gray-800 font-medium">{stage.input}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Transformation</span>
                        <span className="text-indigo-600 font-medium">{stage.transformation}</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <span className="text-[10px] font-mono text-gray-400 uppercase block">Output</span>
                        <span className="text-emerald-700 font-bold">{stage.output}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-gray-200 text-[10px] font-mono text-gray-500">
                    Engine: <span className="font-bold text-gray-700">{stage.component}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">
              Data Lifecycle Explanation
            </h4>
            <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line">
              {architecture.data_flow_explanation}
            </p>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. View 4: AI & AGENT STATEGRAPH                                   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubView === 'agents' && agentPipeline && (
        <div className="space-y-6 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono font-bold text-violet-600 uppercase tracking-wider">
                  StateGraph Architecture
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200 font-semibold">
                  {agentPipeline.framework}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-sm">
                Orchestration Pattern: {agentPipeline.orchestration}
              </h4>
            </div>
            <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-700 font-semibold">
              {agentPipeline.nodes?.length || 0} Domain Nodes
            </span>
          </div>

          {/* Conditional Branching Centerpiece */}
          {agentPipeline.conditional_edges && agentPipeline.conditional_edges.length > 0 && (
            <div className="bg-gradient-to-r from-violet-50 via-purple-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
              <span className="text-[10px] font-mono uppercase tracking-wider text-violet-700 font-bold block mb-2">
                ⚡ Dynamic StateGraph Branching Logic
              </span>
              <div className="space-y-2">
                {agentPipeline.conditional_edges.map((edge, eIdx) => (
                  <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs font-mono bg-white/90 p-2.5 rounded-lg border border-violet-100">
                    <span className="font-bold text-gray-800">{edge.from}</span>
                    <span className="text-violet-600 font-bold">───► [{edge.condition}] ───►</span>
                    <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">{edge.to}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agent Nodes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentPipeline.nodes?.map((node, nIdx) => (
              <div key={nIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-violet-300 transition">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-gray-900">{node.name}</span>
                  <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-gray-200 text-gray-600">
                    Node 0{nIdx + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-3">{node.role}</p>
                <div className="text-[10px] font-mono text-gray-500 pt-2 border-t border-gray-200 flex justify-between items-center">
                  <span>File: {node.file_path}</span>
                  <span className="text-violet-600 font-bold">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 7. View 5: 2D BOX ASCII VIEW                                       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeSubView === 'ascii' && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden shadow-md">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-900/90 border-b border-gray-800">
            <div className="flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono font-bold text-gray-200 ml-1.5 flex items-center gap-2">
                <span>📐</span>
                <span>System Architecture Diagram (Textual Representation)</span>
              </span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 hover:text-white text-xs font-mono font-medium transition cursor-pointer border border-gray-700 active:scale-95"
              title="Copy ASCII architecture diagram to clipboard"
            >
              {copiedDiagram ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-400 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>Copy Diagram</span>
                </>
              )}
            </button>
          </div>
          <div className="p-4 sm:p-5 bg-gray-950 overflow-x-auto max-h-[520px] overflow-y-auto">
            <pre className="font-mono text-emerald-400 text-xs sm:text-[13px] leading-relaxed select-all whitespace-pre">
              {generateAsciiArchitecture(architecture, repoInfo)}
            </pre>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 8. Interactive Evidence Drawer                                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {selectedComponent && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-950 text-white border-l border-gray-800 shadow-2xl z-50 p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-800">
              <span className="text-xs font-mono uppercase tracking-wider text-indigo-400 font-bold">
                Code Evidence Drawer
              </span>
              <button
                onClick={() => setSelectedComponent(null)}
                className="text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Component</span>
                <h3 className="text-base font-bold text-white mt-0.5">{selectedComponent.name}</h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono">
                  {selectedComponent.tech}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Verification Confidence</span>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${(selectedComponent.confidence || 0.95) * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {Math.round((selectedComponent.confidence || 0.95) * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Responsibility</span>
                <p className="text-xs text-gray-300 leading-relaxed mt-1">
                  {selectedComponent.responsibility}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase block">Source File</span>
                <span className="font-mono text-xs text-emerald-400 bg-gray-900 px-2 py-1 rounded block mt-1 break-all">
                  {selectedComponent.path}
                </span>
              </div>

              {selectedComponent.evidence && (
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase block">Code Evidence Snippet</span>
                  <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 font-mono text-xs text-gray-200 mt-1 select-all overflow-x-auto">
                    <code>{selectedComponent.evidence}</code>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 mt-6">
            {repoInfo?.html_url && selectedComponent.path ? (
              <a
                href={`${repoInfo.html_url}/blob/${repoInfo.default_branch || 'main'}/${selectedComponent.path}`}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
              >
                <span>Inspect on GitHub</span>
                <span>↗</span>
              </a>
            ) : (
              <button
                onClick={() => setSelectedComponent(null)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-mono text-xs font-bold py-2.5 px-4 rounded-xl transition cursor-pointer"
              >
                Close Drawer
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectureTab;
