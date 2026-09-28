import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PythonSourceModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'graph' | 'state' | 'scoring'>('graph');

  if (!isOpen) return null;

  const graphCode = `from typing import TypedDict
from langgraph.graph import StateGraph, END

# --- TALENTAGENT 5-NODE RECRUITMENT PIPELINE ---

def build_recruitment_graph():
    workflow = StateGraph(RecruitmentState)
    
    # 1. Define Agent Nodes
    workflow.add_node("agent1_jd_analyzer", analyze_jd_node)
    workflow.add_node("agent2_resume_parser", parse_resume_node)
    workflow.add_node("agent3_requirement_verifier", verify_requirements_node)
    workflow.add_node("agent4_candidate_ranker", rank_candidates_node)
    workflow.add_node("agent5_dossier_generator", generate_dossier_node)
    
    # 2. Wire Workflow Sequence
    workflow.set_entry_point("agent1_jd_analyzer")
    workflow.add_edge("agent1_jd_analyzer", "agent2_resume_parser")
    workflow.add_edge("agent2_resume_parser", "agent3_requirement_verifier")
    workflow.add_edge("agent3_requirement_verifier", "agent4_candidate_ranker")
    workflow.add_edge("agent4_candidate_ranker", "agent5_dossier_generator")
    workflow.add_edge("agent5_dossier_generator", END)
    
    return workflow.compile()`;

  const stateCode = `class RecruitmentState(TypedDict):
    mandate_id: str
    raw_job_description: str
    job_requirements: dict   # Agent 1 Output
    
    # Candidate Ingestion & Parsing
    uploaded_resumes: list[dict]
    parsed_candidates: list[dict] # Agent 2 Output
    
    # Verification & Evidence
    verification_results: dict    # Agent 3 Output
    github_analyses: dict         # GitHub MCP Tool
    
    # Mathematical Scoring
    scoring_weights: dict
    candidate_scores: list[dict]  # Agent 4 Output (Deterministic)
    
    # Final Executive Synthesis
    recruitment_reports: dict     # Agent 5 Output`;

  const scoringCode = `def calculate_deterministic_score(verification, candidate, job_req, weights):
    """Agent 4: Multi-factor weighted mathematical scoring (Pure Python, NO LLM)."""
    # 1. Technical Skills (40%)
    tech_score = (len(verification.matched_req) / len(job_req.mandatory)) * 100
    
    # 2. Experience Tenure (25%)
    exp_score = min(100.0, (candidate.years_experience / job_req.target_years) * 85.0)
    
    # 3. JD Semantic Similarity (20%) via pgvector cosine similarity
    jd_sim_score = verification.tech_coverage_pct
    
    # 4. Project Relevance (10%)
    proj_score = min(100.0, len(candidate.projects) * 25.0)
    
    # 5. Education & Credentials (5%)
    edu_score = 85.0 if candidate.education else 60.0
    
    # Weighted Sum = 100%
    final = (
        tech_score * weights["technical_skills"] +
        exp_score * weights["experience_tenure"] +
        jd_sim_score * weights["jd_similarity"] +
        proj_score * weights["project_relevance"] +
        edu_score * weights["education_certs"]
    )
    return round(final, 2)`;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-gray-200 text-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-mono">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-lg text-xs font-mono bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
              Python 3.12
            </span>
            <h3 className="font-bold text-lg text-gray-900">LangGraph 5-Node Agentic Pipeline Architecture</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-3 flex gap-2 border-b border-gray-200 bg-gray-50/80">
          <button
            onClick={() => setActiveTab('graph')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            workflow.py (LangGraph)
          </button>
          <button
            onClick={() => setActiveTab('state')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'state'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            state.py (TypedDict)
          </button>
          <button
            onClick={() => setActiveTab('scoring')}
            className={`px-4 py-2 text-xs font-mono font-bold rounded-t-xl transition-all cursor-pointer ${
              activeTab === 'scoring'
                ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 shadow-2xs'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            scoring.py (Deterministic Engine)
          </button>
        </div>

        {/* Code View */}
        <div className="p-6 overflow-y-auto font-mono text-xs leading-relaxed bg-gray-900 text-emerald-400 shadow-inner">
          <pre>
            <code>
              {activeTab === 'graph' && graphCode}
              {activeTab === 'state' && stateCode}
              {activeTab === 'scoring' && scoringCode}
            </code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500 font-mono">
          <span>LLM: Groq (openai/gpt-oss-120b) · Vector DB: Supabase pgvector · Tool: GitHub MCP</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold transition shadow-xs shadow-indigo-500/20 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
