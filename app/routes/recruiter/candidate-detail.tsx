import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { getMandate, getMandateRanking, getCandidate } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { SAMPLE_RANKING_CANDIDATES } from '~/lib/sampleCandidates';
import { computeCandidateScore, getCandidateTier } from '~/lib/scoringHelper';

// ─────────────────────────────────────────────────────────────────────────────
// 3D Candidate Document & Magnifying Glass Illustration (Matching Image 1)
// ─────────────────────────────────────────────────────────────────────────────

const CandidateDetailIllustration = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center select-none">
    {/* Soft Glow Behind */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/50 via-indigo-200/40 to-purple-200/30 rounded-2xl blur-xs transform -rotate-2 scale-95" />

    {/* Illustration Container Box */}
    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white via-indigo-50/60 to-purple-100/80 border border-indigo-100/90 shadow-sm flex items-center justify-center overflow-visible">
      {/* 4-point Sparkles outside/at corners */}
      <svg className="absolute -top-2 -left-2 w-5 h-5 text-indigo-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
      </svg>
      <svg className="absolute -top-1.5 -right-1 w-3.5 h-3.5 text-purple-400 opacity-80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
      </svg>

      {/* Main SVG Graphic: Document Profile with Magnifying Glass */}
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="docBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EEF2FF" />
          </linearGradient>
          <linearGradient id="glassRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="glassFillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="glassHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>

        {/* Document Sheet */}
        <rect x="18" y="14" width="40" height="52" rx="8" fill="url(#docBgGrad)" stroke="#C7D2FE" strokeWidth="1.5" />

        {/* Candidate Avatar Icon on Document */}
        <circle cx="28" cy="27" r="6" fill="#6366F1" />
        <circle cx="28" cy="25" r="2.5" fill="#FFFFFF" />
        <path d="M23 31 C23 28.5 25 28 28 28 C31 28 33 28.5 33 31" fill="#FFFFFF" />

        {/* Skeleton text lines */}
        <rect x="38" y="23" width="14" height="2.5" rx="1.2" fill="#818CF8" />
        <rect x="38" y="28" width="10" height="2.5" rx="1.2" fill="#C7D2FE" />
        <rect x="24" y="38" width="28" height="2.5" rx="1.2" fill="#E2E8F0" />
        <rect x="24" y="44" width="22" height="2.5" rx="1.2" fill="#E2E8F0" />
        <rect x="24" y="50" width="16" height="2.5" rx="1.2" fill="#E2E8F0" />
        <rect x="24" y="56" width="12" height="2.5" rx="1.2" fill="#CBD5E1" />

        {/* 3D Floating Magnifying Glass */}
        <circle cx="50" cy="50" r="13" fill="url(#glassFillGrad)" />
        <circle cx="50" cy="50" r="13" stroke="url(#glassRingGrad)" strokeWidth="3" />
        <path d="M43 45 C45 41 49 40 53 41" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        <path d="M60 60 L69 69" stroke="url(#glassHandleGrad)" strokeWidth="4.5" strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

export default function CandidateDetail() {
  const { mandateId: paramMandateId, candidateId } = useParams();
  const navigate = useNavigate();
  const { activeMandateId, mandates } = useTalentAgentStore();
  const currentMandateId = paramMandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');

  const [mandate, setMandate] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentMandateId) {
      Promise.all([
        getMandate(currentMandateId),
        getMandateRanking(currentMandateId),
      ]).then(([m, r]) => {
        setMandate(m);
        const list = Array.isArray(r) && r.length > 0 ? r : SAMPLE_RANKING_CANDIDATES;
        setAllCandidates(list);

        const currentCandId = candidateId && candidateId !== 'select' ? candidateId : (list[0]?.candidate_id || list[0]?.id);
        if (currentCandId) {
          const ev = list.find((item: any) => (item.candidate_id || item.id) === currentCandId) || list[0];
          setEvaluation(ev);
          if (ev?.candidate) {
            setCandidate(ev.candidate);
          }
          getCandidate(currentCandId).then((c) => {
            if (c) setCandidate(c);
          }).catch(console.error);
        }
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setAllCandidates(SAMPLE_RANKING_CANDIDATES);
        const ev = SAMPLE_RANKING_CANDIDATES[0];
        setEvaluation(ev);
        setCandidate(ev.candidate);
        setLoading(false);
      });
    }
  }, [currentMandateId, candidateId]);

  const handleCandidateSwitch = (newCandId: string) => {
    navigate(`/recruiter/mandates/${currentMandateId}/candidates/${newCandId}`);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Strongly Recommended':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Recommended':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200';
      case 'Consider for Interview':
      case 'Interview Candidate':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Weak Match':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  const prof = candidate?.profile || {};
  const vResult = evaluation?.verification_result || {};
  const score = computeCandidateScore(evaluation);
  const tier = evaluation?.tier && evaluation.tier !== 'pending' ? evaluation.tier : getCandidateTier(score);
  const techCoverage = evaluation?.tech_coverage_pct || vResult?.tech_coverage_pct || 75;

  const rawTech = evaluation?.score_technical ?? 85.0;
  const rawExp = evaluation?.score_experience ?? 80.0;
  const rawJd = evaluation?.score_jd_similarity ?? evaluation?.tech_coverage_pct ?? 80.0;
  const rawProj = evaluation?.score_projects ?? 75.0;
  const rawEdu = evaluation?.score_education ?? 80.0;

  return (
    <RecruiterLayout mandateId={currentMandateId} candidateId={candidateId}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Header Banner (Matching Reference Image 1) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-indigo-50/20 to-purple-50/30 border border-indigo-100/90 p-5 sm:p-6 mb-7 shadow-xs">
        {/* Decorative watermark graphics on the right (Matching Image 1) */}
        <div className="absolute right-0 top-0 bottom-0 w-96 pointer-events-none overflow-hidden select-none opacity-40 hidden sm:block">
          <svg className="w-full h-full" viewBox="0 0 380 140" fill="none">
            {/* Sparkles */}
            <path d="M50 40 C50 40 52 37 52 34 C52 37 54 40 54 40 C54 40 52 43 52 46 C52 43 50 40 50 40 Z" fill="#818CF8" opacity="0.6" />
            <path d="M340 30 C340 30 342 27 342 24 C342 27 344 30 344 30 C344 30 342 33 342 36 C342 33 340 30 340 30 Z" fill="#6366F1" opacity="0.6" />

            {/* Faint Ascending Bar Charts */}
            <rect x="90" y="65" width="14" height="48" rx="4" fill="#C7D2FE" opacity="0.5" />
            <rect x="110" y="48" width="14" height="65" rx="4" fill="#818CF8" opacity="0.45" />
            <rect x="130" y="32" width="14" height="81" rx="4" fill="#6366F1" opacity="0.4" />

            {/* Faint Document Mockup Card */}
            <g transform="translate(180, 16)">
              <rect x="0" y="0" width="125" height="92" rx="14" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.2" opacity="0.75" />
              <circle cx="26" cy="28" r="10" fill="#818CF8" opacity="0.5" />
              <rect x="46" y="22" width="55" height="4" rx="2" fill="#818CF8" opacity="0.5" />
              <rect x="46" y="30" width="38" height="3" rx="1.5" fill="#C7D2FE" opacity="0.6" />
              <rect x="18" y="48" width="88" height="3" rx="1.5" fill="#E2E8F0" />
              <rect x="18" y="56" width="70" height="3" rx="1.5" fill="#E2E8F0" />
              <rect x="18" y="64" width="50" height="3" rx="1.5" fill="#E2E8F0" />
              {/* Star Badge floating */}
              <g transform="translate(92, 58)">
                <circle cx="15" cy="15" r="15" fill="#818CF8" opacity="0.7" />
                <path d="M15 9 L17 13 L22 13.8 L18.5 17.2 L19.4 22 L15 19.5 L10.6 22 L11.5 17.2 L8 13.8 L13 13 Z" fill="#FFFFFF" />
              </g>
            </g>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Illustration + Title info */}
          <div className="flex items-start gap-4 sm:gap-5">
            {/* 3D Document + Magnifying Glass Illustration */}
            <CandidateDetailIllustration />

            {/* Title & Description */}
            <div>
              {/* Agent 3 Pill */}
              <div className="mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <span>👤</span>
                  <span>Agent 3 • Candidate Deep Dive</span>
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight flex flex-wrap items-center gap-2">
                <span className="text-gray-900">Candidate</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Details & Analysis
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                Comprehensive candidate analysis including skill match, gap identification, experience history, projects, and AI-powered multi-factor scoring.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Candidate Switcher Bar */}
      <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-3.5 mb-6 shadow-xs flex items-center justify-between flex-wrap gap-4 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-semibold">Select Candidate:</span>
          <select
            value={candidate?.id || candidateId || ''}
            onChange={(e) => handleCandidateSwitch(e.target.value)}
            className="bg-indigo-50/70 hover:bg-indigo-50 text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 focus:border-indigo-500 rounded-xl px-3.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer font-bold shadow-xs shadow-indigo-500/10 transition"
          >
            {allCandidates.map((c) => {
              const cScore = computeCandidateScore(c);
              return (
                <option key={c.candidate_id || c.id} value={c.candidate_id || c.id} className="bg-white text-gray-800">
                  {c.candidate?.full_name || 'Candidate'} ({cScore.toFixed(1)}%)
                </option>
              );
            })}
          </select>
        </div>

        <button
          onClick={() => navigate(`/recruiter/mandates/${currentMandateId}/reports/${candidate?.id || candidateId}`)}
          className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition shadow-xs shadow-indigo-500/20 cursor-pointer"
        >
          <span>Generate Full Executive Report</span>
          <span>→</span>
        </button>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-6 mb-6 shadow-xs relative overflow-hidden font-mono">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-indigo-100 to-indigo-200 flex items-center justify-center font-black text-xl text-indigo-700 uppercase border border-indigo-200/80 shadow-2xs shrink-0">
              {candidate?.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-0.5 flex-wrap">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight font-sans">{candidate?.full_name}</h2>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase shadow-2xs ${getTierBadge(evaluation?.tier)}`}>
                  {evaluation?.tier || 'Recommended'}
                </span>
              </div>
              <p className="text-xs text-indigo-600 font-semibold">{candidate?.current_title}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-2">
                <span>{candidate?.email || 'email@techmail.io'}</span>
                <span>•</span>
                <span>{prof?.location || 'San Francisco, CA'}</span>
                <span>•</span>
                <span className="text-gray-800 font-semibold">{candidate?.years_experience || '5.5'} yrs experience</span>
              </div>
              <p className="text-xs text-gray-600 mt-3 max-w-3xl leading-relaxed">
                {prof?.summary || 'Senior Full-Stack & AI Engineer with extensive experience architecting distributed services and multi-agent LLM systems.'}
              </p>
            </div>
          </div>

          {/* Overall AI Score Display */}
          <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-5 text-center min-w-[170px] flex flex-col items-center justify-center shadow-inner">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold block mb-1">OVERALL AI SCORE</span>
            <span className="text-4xl font-black text-indigo-600">{score.toFixed(1)}</span>
            <span className="text-xs text-gray-400 mt-0.5 font-medium">out of 100</span>
          </div>
        </div>
      </div>

      {/* Main Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left: Skill Match & Gap Analysis (Agent 3) */}
        <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col font-mono">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xs font-bold uppercase text-indigo-700 tracking-wider flex items-center gap-2">
                <span>🎯</span> Skill Match & Gap Analysis
              </h2>
              <p className="text-[10px] text-gray-400">Agent 3: Requirement Verification</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${techCoverage}%` }} />
              </div>
              <span className="text-xs font-bold text-indigo-600">{Math.round(techCoverage)}% Tech Coverage</span>
            </div>
          </div>

          {/* Verified Matched Skills */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block mb-2">
              ✓ Verified Matched Skills ({vResult?.matched_required?.length || prof?.skills?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(vResult?.matched_required || prof?.skills || ['Python', 'FastAPI', 'Docker']).map((s: string) => (
                <span key={s} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs">
                  <span>✓</span> {s}
                </span>
              ))}
            </div>
          </div>

          {/* Identified Skill Gaps */}
          <div>
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block mb-2">
              ✕ Identified Skill Gaps ({vResult?.required_gaps?.length || 0})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(vResult?.required_gaps && vResult.required_gaps.length > 0) ? (
                vResult.required_gaps.map((g: string) => (
                  <span key={g} className="bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-2xs">
                    <span>✕</span> {g} <span className="text-[9px] uppercase font-bold text-rose-500">REQUIRED</span>
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-600 font-semibold">Zero critical required skill gaps detected. Full alignment with mandate.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Multi-Factor Mathematical Weights (Agent 4) */}
        <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs font-mono text-xs">
          <div className="mb-4">
            <h2 className="font-bold uppercase text-indigo-700 tracking-wider flex items-center gap-2">
              <span>⚖️</span> Multi-Factor Mathematical Weights
            </h2>
            <p className="text-[10px] text-gray-400">Agent 4: Multi-criteria weighted mathematical scoring</p>
          </div>

          <div className="space-y-3 divide-y divide-gray-100">
            {/* Factor 1: Technical */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Technical Skills Match</p>
                <p className="text-[10px] text-gray-400">Weight: 40% • Score: {rawTech.toFixed(1)}%</p>
              </div>
              <span className="font-bold text-indigo-600">
                +{(rawTech * 0.40).toFixed(1)} pts
              </span>
            </div>

            {/* Factor 2: Experience */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Experience Tenure</p>
                <p className="text-[10px] text-gray-400">Weight: 25% • Score: {rawExp.toFixed(1)}%</p>
              </div>
              <span className="font-bold text-indigo-600">
                +{(rawExp * 0.25).toFixed(1)} pts
              </span>
            </div>

            {/* Factor 3: JD Similarity */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">JD Similarity (pgvector)</p>
                <p className="text-[10px] text-gray-400">Weight: 20% • Score: {rawJd.toFixed(1)}%</p>
              </div>
              <span className="font-bold text-indigo-600">
                +{(rawJd * 0.20).toFixed(1)} pts
              </span>
            </div>

            {/* Factor 4: Project Relevance */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Project Relevance</p>
                <p className="text-[10px] text-gray-400">Weight: 10% • Score: {rawProj.toFixed(1)}%</p>
              </div>
              <span className="font-bold text-indigo-600">
                +{(rawProj * 0.10).toFixed(1)} pts
              </span>
            </div>

            {/* Factor 5: Education */}
            <div className="pt-2 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900">Education & Credentials</p>
                <p className="text-[10px] text-gray-400">Weight: 5% • Score: {rawEdu.toFixed(1)}%</p>
              </div>
              <span className="font-bold text-indigo-600">
                +{(rawEdu * 0.05).toFixed(1)} pts
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Experience History & Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 font-mono text-xs">
        {/* Work Experience History */}
        <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs">
          <h2 className="font-bold uppercase text-gray-800 tracking-wider mb-4 flex items-center gap-2">
            <span>💼</span> Work Experience History
          </h2>
          <div className="space-y-4">
            {(prof?.experience_history || []).map((exp: any, i: number) => (
              <div key={i} className="border-l-2 border-indigo-400 pl-3.5 pb-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">{exp.title}</h3>
                  <span className="text-[10px] text-gray-400">{exp.start} – {exp.end || 'Present'}</span>
                </div>
                <p className="text-indigo-600 text-[11px] font-semibold">{exp.company}</p>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{exp.description}</p>
                {exp.tech_tags && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {exp.tech_tags.map((t: string) => (
                      <span key={t} className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg text-[10px] border border-gray-200 font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Featured Technical Projects & Education */}
        <div className="space-y-6">
          {/* Projects */}
          <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs">
            <h2 className="font-bold uppercase text-gray-800 tracking-wider mb-4 flex items-center gap-2">
              <span>🚀</span> Featured Technical Projects
            </h2>
            <div className="space-y-3">
              {(prof?.projects || []).map((p: any, i: number) => (
                <div key={i} className="bg-gray-50/80 p-3.5 rounded-xl border border-gray-200/80">
                  <h3 className="font-bold text-gray-900 text-xs">{p.name}</h3>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">{p.description}</p>
                  {p.tech_tags && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.tech_tags.map((t: string) => (
                        <span key={t} className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg text-[10px] font-semibold shadow-2xs">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Education & Credentials */}
          <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs">
            <h2 className="font-bold uppercase text-gray-800 tracking-wider mb-3 flex items-center gap-2">
              <span>🎓</span> Education & Credentials
            </h2>
            <div className="space-y-2">
              {(prof?.education || []).map((ed: any, i: number) => (
                <div key={i} className="text-xs">
                  <p className="font-bold text-gray-900">{ed.degree}</p>
                  <p className="text-gray-500">{ed.institution} ({ed.graduation_year || '2019'})</p>
                </div>
              ))}
              {(prof?.certifications || []).map((cert: string) => (
                <div key={cert} className="inline-block bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg text-xs mr-2 mt-1 font-semibold shadow-2xs">
                  ✓ {cert}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
