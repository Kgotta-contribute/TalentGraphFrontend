import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { getMandate, getMandateRanking, getCandidate, generateReport } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { SAMPLE_RANKING_CANDIDATES } from '~/lib/sampleCandidates';
import { computeCandidateScore, getCandidateTier } from '~/lib/scoringHelper';

// ─────────────────────────────────────────────────────────────────────────────
// 3D Report Document & Floating Pie Chart Illustration (Matching Image 2)
// ─────────────────────────────────────────────────────────────────────────────

const ReportIllustration = () => (
  <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center select-none">
    {/* Soft Glow Behind */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-200/50 via-purple-200/40 to-pink-200/30 rounded-2xl blur-xs transform -rotate-2 scale-95" />

    {/* Illustration Container Box */}
    <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white via-indigo-50/60 to-purple-100/80 border border-indigo-100/90 shadow-sm flex items-center justify-center overflow-visible">
      {/* 4-point Sparkles outside/at corners */}
      <svg className="absolute -top-2 -left-2 w-5 h-5 text-purple-500 animate-pulse" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
      </svg>
      <svg className="absolute -top-1.5 -right-1 w-3.5 h-3.5 text-indigo-400 opacity-80" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0 C12 6.627 6.627 12 0 12 C6.627 12 12 17.373 12 24 C12 17.373 17.373 12 24 12 C17.373 12 12 6.627 12 0 Z" />
      </svg>

      {/* Main SVG graphic (Document with avatar, bar charts & floating 3D pie chart) */}
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 80 80" fill="none">
        <defs>
          <linearGradient id="repDocBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EEF2FF" />
          </linearGradient>
          <linearGradient id="pieSlice1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="pieSlice2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
        </defs>

        {/* Document Sheet */}
        <rect x="18" y="14" width="40" height="52" rx="8" fill="url(#repDocBg)" stroke="#C7D2FE" strokeWidth="1.5" />

        {/* Candidate Avatar Icon on Document */}
        <circle cx="28" cy="27" r="6" fill="#6366F1" />
        <circle cx="28" cy="25" r="2.5" fill="#FFFFFF" />
        <path d="M23 31 C23 28.5 25 28 28 28 C31 28 33 28.5 33 31" fill="#FFFFFF" />

        {/* Skeleton text lines */}
        <rect x="38" y="23" width="14" height="2.5" rx="1.2" fill="#818CF8" />
        <rect x="38" y="28" width="10" height="2.5" rx="1.2" fill="#C7D2FE" />
        <rect x="24" y="38" width="28" height="2" rx="1" fill="#E2E8F0" />
        <rect x="24" y="43" width="22" height="2" rx="1" fill="#E2E8F0" />

        {/* Small mini bar charts on document bottom */}
        <rect x="24" y="52" width="3.5" height="10" rx="1" fill="#C7D2FE" />
        <rect x="30" y="49" width="3.5" height="13" rx="1" fill="#818CF8" />
        <rect x="36" y="46" width="3.5" height="16" rx="1" fill="#6366F1" />

        {/* 3D Floating Pie Chart on Bottom-Right */}
        <g transform="translate(52, 52)">
          <circle cx="0" cy="0" r="14" fill="#6366F1" opacity="0.9" />
          <path d="M0 0 L0 -14 A14 14 0 0 1 14 0 Z" fill="url(#pieSlice2)" />
          <path d="M0 0 L14 0 A14 14 0 0 1 -10 10 Z" fill="url(#pieSlice1)" />
          <path d="M0 0 L-10 10 A14 14 0 0 1 0 -14 Z" fill="#818CF8" />
          <circle cx="0" cy="0" r="4.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  </div>
);

export default function Report() {
  const { mandateId: paramMandateId, candidateId } = useParams();
  const navigate = useNavigate();
  const { activeMandateId, mandates } = useTalentAgentStore();
  const currentMandateId = paramMandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');

  const [mandate, setMandate] = useState<any>(null);
  const [candidate, setCandidate] = useState<any>(null);
  const [evaluation, setEvaluation] = useState<any>(null);
  const [allCandidates, setAllCandidates] = useState<any[]>([]);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    if (currentMandateId) {
      Promise.all([
        getMandate(currentMandateId),
        getMandateRanking(currentMandateId),
      ]).then(([m, r]) => {
        setMandate(m);
        const list = Array.isArray(r) && r.length > 0 ? r : SAMPLE_RANKING_CANDIDATES;
        setAllCandidates(list);

        const currentCandId = candidateId && candidateId !== 'select' && candidateId !== 'c0000000-0000-0000-0000-000000000001' ? candidateId : null;
        if (currentCandId) {
          const ev = list.find((item: any) => (item.candidate_id || item.id) === currentCandId);
          if (ev) {
            setEvaluation(ev);
            setReport(ev?.report || null);
            if (ev.candidate) {
              setCandidate(ev.candidate);
            } else {
              getCandidate(currentCandId).then(setCandidate).catch(console.error);
            }
          } else {
            getCandidate(currentCandId).then(setCandidate).catch(console.error);
          }
        } else {
          // Keep it empty as requested by user ("remove sarah chen keep it empty and when a candidate from dropdown is selceted then load the data in recruitemnet report")
          setCandidate(null);
          setEvaluation(null);
          setReport(null);
        }
        setLoading(false);
      }).catch((err) => {
        console.error(err);
        setAllCandidates(SAMPLE_RANKING_CANDIDATES);
        setCandidate(null);
        setEvaluation(null);
        setReport(null);
        setLoading(false);
      });
    }
  }, [currentMandateId, candidateId]);

  const handleCandidateSwitch = (newCandId: string) => {
    if (!newCandId || newCandId === 'select') {
      setCandidate(null);
      setEvaluation(null);
      setReport(null);
      navigate(`/recruiter/mandates/${currentMandateId}/reports/select`);
      return;
    }
    const ev = allCandidates.find((item) => (item.candidate_id || item.id) === newCandId);
    if (ev) {
      setEvaluation(ev);
      setReport(ev?.report || null);
      if (ev.candidate) {
        setCandidate(ev.candidate);
      } else {
        getCandidate(newCandId).then(setCandidate).catch(console.error);
      }
    } else {
      getCandidate(newCandId).then(setCandidate).catch(console.error);
    }
    navigate(`/recruiter/mandates/${currentMandateId}/reports/${newCandId}`);
  };

  const handleGenerateReport = async () => {
    const targetCandId = candidate?.id || candidateId;
    if (!targetCandId || !currentMandateId) return;
    setIsGenerating(true);
    try {
      const generated = await generateReport(targetCandId, currentMandateId);
      setReport(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const dossier = candidate ? (report || evaluation?.report || {
    executive_summary: `${candidate.full_name} is a ${candidate.current_title || 'Software Engineer'} with ${candidate.years_experience || 'several'} years of hands-on technical experience. Demonstrated strong alignment with ${mandate?.title || 'the target role'} across core competencies and system design fundamentals.`,
    key_strengths: [
      `Direct mastery of core technical stack (${(candidate.profile?.skills || ['Python', 'Cloud Systems', 'Full-Stack']).slice(0, 4).join(', ')})`,
      `${candidate.years_experience || '3+'} years of production engineering experience`,
      'Demonstrated track record of delivering end-to-end architectures and reliable services',
      'Verified technical credentials and engineering capabilities'
    ],
    identified_skill_gaps: evaluation?.verification_result?.required_gaps || [],
    risk_factors: [
      'Requires standard onboarding ramp-up on team-specific continuous integration workflows.',
      'Validation of high-load production scaling during technical interview rounds.'
    ],
    ramp_up_considerations: [
      'Initial 30-day focus on internal infrastructure and deployment pipelines.',
      'Pair programming with senior engineers on system telemetry.'
    ],
    final_verdict: `${candidate.full_name} presents a solid technical profile with verified skill alignment, recommended for technical interview rounds.`,
    hiring_confidence: computeCandidateScore(evaluation) / 100,
    interview_questions: [
      {
        focus_area: 'ARCHITECTURE & PRODUCTION SCALABILITY',
        question: `Can you walk us through the architecture of a high-concurrency production service you built? What were the primary bottlenecks?`,
        rationale: 'Validates architectural depth, concurrency design, and production engineering maturity.',
        keywords: ['throughput', 'latency', 'caching', 'concurrency', 'indexes', 'trade-offs']
      },
      {
        focus_area: 'SKILL ADAPTABILITY & RAMP-UP VELOCITY',
        question: 'How do you approach mastering unfamiliar cloud tools or new frameworks under tight project deadlines?',
        rationale: 'Tests self-directed learning velocity and pragmatic engineering adaptability.',
        keywords: ['fundamentals', 'transferable concepts', 'hands-on labs', 'rapid prototyping']
      },
      {
        focus_area: 'PROJECT RETROSPECTIVE & TECHNICAL JUDGMENT',
        question: 'Looking back at your most significant project, what technical trade-offs did you make and what would you design differently today?',
        rationale: 'Assesses engineering maturity, technical self-awareness, and long-term architectural foresight.',
        keywords: ['trade-offs', 'maintainability', 'scalability', 'tech debt', 'monitoring']
      }
    ]
  }) : null;

  const generateMarkdownReport = (cand: any, dos: any) => {
    const name = cand?.full_name || 'Candidate';
    const title = cand?.current_title || 'Software Engineer';
    const mTitle = mandate?.title || 'Target Role';
    const mCompany = mandate?.company || 'Company';
    const scoreVal = `${computeCandidateScore(evaluation).toFixed(1)}%`;
    const verdictVal = dos?.final_verdict || 'Recommended for technical interview rounds.';
    const confVal = Math.round((dos?.hiring_confidence || (computeCandidateScore(evaluation) / 100)) * 100);

    return `# Recruitment Intelligence Dossier: ${name}
**Candidate**: ${name} (${title})
**Target Mandate**: ${mTitle} — ${mCompany}
**Overall AI Score**: ${scoreVal} | **Verdict**: ${verdictVal}
**Hiring Confidence**: ${confVal}%
**Years of Experience**: ${cand?.years_experience || '3+'} Years
**Contact**: ${cand?.email || 'N/A'}${cand?.profile?.location ? ` | Location: ${cand.profile.location}` : ''}
${cand?.linkedin_url ? `**LinkedIn**: ${cand.linkedin_url}\n` : ''}${cand?.github_url ? `**GitHub**: ${cand.github_url}\n` : ''}

---

## 1. Executive Summary
${dos?.executive_summary || 'Demonstrated solid technical capability and domain alignment with target job requirements.'}

---

## 2. Key Technical Strengths
${(dos?.key_strengths || []).map((s: string) => `- ${s}`).join('\n')}

---

## 3. Identified Skill Gaps & Ramp-Up Considerations
${(dos?.identified_skill_gaps && dos.identified_skill_gaps.length > 0)
  ? dos.identified_skill_gaps.map((g: string) => `- ⚠️ Skill Gap: ${g}`).join('\n')
  : '- ✅ No critical required skill gaps identified. Strong alignment with mandate.'}

### Risk Factors:
${(dos?.risk_factors || []).map((r: string) => `- 🔍 ${r}`).join('\n')}

### Ramp-Up Considerations:
${(dos?.ramp_up_considerations || []).map((rc: string) => `- ⏱️ ${rc}`).join('\n')}

---

## 4. Curated Technical & Architectural Interview Probes
${(dos?.interview_questions || []).map((q: any, i: number) => `### Question ${i + 1}: ${q.focus_area}
**Question**: "${q.question}"
**Assessment Rationale**: ${q.rationale}
**Evaluation Keywords**: ${q.keywords?.join(', ')}
`).join('\n')}

---
*Report generated by TalentAgent Multi-Agent Recruitment Pipeline (Agents 1-5).*
`;
  };

  const handleCopyMarkdown = async () => {
    if (!candidate || !dossier) return;
    const md = generateMarkdownReport(candidate, dossier);

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(md);
      } else {
        throw new Error('Clipboard API not available');
      }
    } catch {
      // Fallback for browsers or environments blocking navigator.clipboard
      const textArea = document.createElement('textarea');
      textArea.value = md;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    if (!candidate || !dossier) return;
    const md = generateMarkdownReport(candidate, dossier);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (candidate.full_name || 'Candidate').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.download = `${safeName}_Recruitment_Report.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <RecruiterLayout mandateId={currentMandateId} candidateId={candidateId}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Header Banner (Matching Image 2) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-indigo-50/20 to-purple-50/30 border border-indigo-100/90 p-5 sm:p-6 mb-7 shadow-xs">
        {/* Decorative watermark graphics on the right (Matching Image 2) */}
        <div className="absolute right-0 top-0 bottom-0 w-96 pointer-events-none overflow-hidden select-none opacity-40 hidden sm:block">
          <svg className="w-full h-full" viewBox="0 0 380 140" fill="none">
            {/* Sparkles */}
            <path d="M40 35 C40 35 42 32 42 29 C42 32 44 35 44 35 C44 35 42 38 42 41 C42 38 40 35 40 35 Z" fill="#818CF8" opacity="0.6" />
            <path d="M340 30 C340 30 342 27 342 24 C342 27 344 30 344 30 C344 30 342 33 342 36 C342 33 340 30 340 30 Z" fill="#6366F1" opacity="0.6" />

            {/* Faint Ascending Bar Charts */}
            <rect x="75" y="65" width="13" height="48" rx="4" fill="#C7D2FE" opacity="0.5" />
            <rect x="95" y="48" width="13" height="65" rx="4" fill="#818CF8" opacity="0.45" />
            <rect x="115" y="32" width="13" height="81" rx="4" fill="#6366F1" opacity="0.4" />

            {/* Faint Pie Chart */}
            <circle cx="150" cy="80" r="14" fill="#818CF8" opacity="0.35" />
            <path d="M150 80 L150 66 A14 14 0 0 1 164 80 Z" fill="#6366F1" opacity="0.5" />

            {/* Faint Document Mockup Card */}
            <g transform="translate(180, 16)">
              <rect x="0" y="0" width="125" height="92" rx="14" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.2" opacity="0.75" />
              <circle cx="26" cy="28" r="10" fill="#818CF8" opacity="0.5" />
              <circle cx="26" cy="26" r="4" fill="#EEF2FF" />
              <path d="M19 35 C19 32 22 31 26 31 C30 31 33 32 33 35" fill="#EEF2FF" />
              <rect x="46" y="22" width="55" height="4" rx="2" fill="#818CF8" opacity="0.5" />
              <rect x="46" y="30" width="38" height="3" rx="1.5" fill="#C7D2FE" opacity="0.6" />
              <rect x="18" y="48" width="88" height="3" rx="1.5" fill="#E2E8F0" />
              <rect x="18" y="56" width="70" height="3" rx="1.5" fill="#E2E8F0" />
              <rect x="18" y="64" width="50" height="3" rx="1.5" fill="#E2E8F0" />
            </g>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          {/* Left: Illustration + Title info */}
          <div className="flex items-start gap-4 sm:gap-5">
            {/* 3D Report + Pie Chart Illustration */}
            <ReportIllustration />

            {/* Title & Description */}
            <div>
              {/* Agent 5 Pill */}
              <div className="mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <span>📄</span>
                  <span>Agent 5 • Report Synthesis</span>
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight flex flex-wrap items-center gap-2">
                <span className="text-gray-900">Candidate</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligence Report
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed max-w-2xl">
                AI-generated assessment of candidate fit, strengths, gaps, risks, and interview areas.
              </p>
            </div>
          </div>

          {/* Right: Actions (Dropdown, Copy MD, Download Report, Print) */}
          <div className="flex items-center gap-2.5 flex-wrap font-mono text-xs self-start xl:self-center shrink-0">
            {/* Candidate Switcher Dropdown */}
            <div className="relative flex items-center">
              <span className="absolute left-3 text-indigo-600 pointer-events-none text-xs">👤</span>
              <select
                value={candidate?.id || (candidateId && candidateId !== 'select' && candidateId !== 'c0000000-0000-0000-0000-000000000001' ? candidateId : '')}
                onChange={(e) => handleCandidateSwitch(e.target.value)}
                className="bg-indigo-50/70 hover:bg-indigo-50 text-indigo-700 border-2 border-indigo-300 hover:border-indigo-400 focus:border-indigo-500 rounded-xl pl-8 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 cursor-pointer font-bold shadow-xs shadow-indigo-500/10 transition appearance-none"
              >
                <option value="">Select Candidate...</option>
                {allCandidates.map((c) => {
                  const scoreVal = computeCandidateScore(c);
                  return (
                    <option key={c.candidate_id || c.id} value={c.candidate_id || c.id} className="bg-white text-gray-800">
                      {c.candidate?.full_name || 'Candidate'} ({scoreVal.toFixed(1)}%)
                    </option>
                  );
                })}
              </select>
              <span className="absolute right-3 text-xs text-indigo-500 font-bold pointer-events-none">∨</span>
            </div>

            {/* Action Buttons: Copy MD, Download Report, Print */}
            <button
              onClick={handleCopyMarkdown}
              disabled={!candidate}
              title={copied ? 'Copied to clipboard!' : 'Copy Markdown report'}
              className="bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold shadow-2xs cursor-pointer"
            >
              <span>{copied ? '✅' : '📋'}</span>
              <span>{copied ? 'Copied MD!' : 'Copy MD'}</span>
            </button>

            <button
              onClick={handleDownloadReport}
              disabled={!candidate}
              title={downloaded ? 'Report downloaded!' : 'Download Markdown report'}
              className="bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold shadow-2xs cursor-pointer"
            >
              <span>{downloaded ? '✅' : '⬇'}</span>
              <span>{downloaded ? 'Downloaded!' : 'Download Report'}</span>
            </button>

            <button
              onClick={handlePrint}
              disabled={!candidate}
              className="bg-white hover:bg-gray-50 disabled:opacity-40 text-gray-700 border border-gray-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition font-semibold shadow-2xs cursor-pointer"
            >
              <span>🖨️</span>
              <span>Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Dossier Content */}
      {!candidate || !dossier ? (
        <div className="bg-white/95 backdrop-blur-xs border border-dashed border-gray-300 rounded-3xl p-16 text-center shadow-xs font-mono">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-3xl mx-auto mb-4 shadow-2xs">
            📄
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-1">No Candidate Selected</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-6 leading-relaxed">
            Please select a candidate from the dropdown above to load and view their Recruitment Intelligence Dossier, AI scoring, gap analysis, and tailored interview probes.
          </p>
          {allCandidates.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allCandidates.map((c) => (
                <button
                  key={c.candidate_id || c.id}
                  onClick={() => handleCandidateSwitch(c.candidate_id || c.id)}
                  className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl border border-indigo-200 transition cursor-pointer shadow-2xs"
                >
                  {c.candidate?.full_name || 'Candidate'} ({computeCandidateScore(c).toFixed(1)}%) →
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-6 mb-8 shadow-xs font-mono text-xs">
          {/* Executive Header Card */}
          <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-5 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">
                  EXECUTIVE CANDIDATE EVALUATION
                </span>
                <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                  {candidate.full_name}
                </h1>
                <p className="text-xs text-gray-500 mt-1">
                  Position: <span className="text-gray-800 font-semibold">{mandate?.title || 'Engineer'}</span> • {mandate?.company || 'Company'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-center min-w-[100px] shadow-2xs">
                  <span className="text-[9px] text-gray-400 font-bold uppercase block">MATCH SCORE</span>
                  <span className="text-lg font-bold text-indigo-600">
                    {computeCandidateScore(evaluation).toFixed(1)}<span className="text-xs text-gray-400 font-normal">/100</span>
                  </span>
                </div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-center min-w-[130px] shadow-2xs">
                  <span className="text-[9px] text-gray-400 font-bold uppercase block">AI RECOMMENDATION</span>
                  <span className="text-xs font-bold text-indigo-700 uppercase block mt-1">
                    {evaluation?.tier && evaluation.tier !== 'pending' ? evaluation.tier : getCandidateTier(computeCandidateScore(evaluation))}
                  </span>
                </div>
              </div>
            </div>
          </div>

        {/* 1. Candidate Summary */}
        <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-5 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-2.5">
            1. CANDIDATE SUMMARY
          </h2>
          <p className="text-gray-600 leading-relaxed text-xs">
            {dossier.executive_summary}
          </p>
        </div>

        {/* 3-Column Grid: Strengths, Gaps, Risk Factors & Verdict */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Key Candidate Strengths */}
          <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
              <span>🛡</span> KEY CANDIDATE STRENGTHS
            </h2>
            <ul className="space-y-2 text-xs">
              {(dossier.key_strengths || []).map((str: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-emerald-950">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Identified Skill Gaps */}
          <div className="bg-rose-50/40 border border-rose-200/80 rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-3 flex items-center gap-2">
              <span>✕</span> IDENTIFIED SKILL GAPS
            </h2>
            <div className="space-y-2">
              {(evaluation?.verification_result?.required_gaps || ['Terraform', 'Linux', 'Helm']).map((gap: string) => (
                <div key={gap} className="flex items-center gap-2 text-rose-950 text-xs">
                  <span className="text-rose-600 font-bold">✕</span>
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Risk Factors & Ramp-Up */}
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-xl p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-800 mb-3 flex items-center gap-2">
              <span>⚠</span> RISK FACTORS & RAMP-UP
            </h2>
            <ul className="space-y-2 text-xs">
              {(dossier.risk_factors || []).map((risk: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-amber-950">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Final Hiring Verdict */}
          <div className="bg-indigo-50/30 border border-indigo-200/80 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-3 flex items-center gap-2">
                <span>⚖</span> FINAL HIRING VERDICT
              </h2>
              <p className="text-gray-700 text-xs leading-relaxed">
                {dossier.final_verdict}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between">
              <span className="text-gray-500">Hiring Confidence</span>
              <span className="text-indigo-700 font-bold">
                {Math.round((dossier?.hiring_confidence || (computeCandidateScore(evaluation) / 100)) * 100) >= 80 ? 'High' : 'Moderate'} ({Math.round((dossier?.hiring_confidence || (computeCandidateScore(evaluation) / 100)) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Relevant Experience & Project Case Studies */}
        <div className="border-t border-gray-100 pt-6 mb-8">
          <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800 mb-4 flex items-center gap-2">
            <span>💼</span> Section 2 — Relevant Experience & Project Case Studies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(candidate?.profile?.experience_history || []).slice(0, 2).map((exp: any, i: number) => (
              <div key={i} className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-xs">{exp.title}</h3>
                  <span className="text-[10px] text-gray-400">{exp.start} – {exp.end || 'Present'}</span>
                </div>
                <p className="text-indigo-600 text-[11px] mb-2 font-semibold">{exp.company}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: AI-Curated Interview Probe Questions */}
        <div className="border-t border-gray-100 pt-6">
          <div className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-2">
              <span>🎯</span> Section 3 — AI-Curated Interview Probe Questions
            </h2>
            <p className="text-[11px] text-gray-500">
              Tailored probe questions targeting candidate-specific architectural claims and identified skill gaps.
            </p>
          </div>

          <div className="space-y-4">
            {(dossier.interview_questions || []).map((q: any, i: number) => (
              <div key={i} className="bg-gray-50/80 p-5 rounded-xl border border-gray-200/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 uppercase tracking-wider shadow-2xs">
                    FOCUS AREA: {q.focus_area}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">Q0{i + 1}</span>
                </div>

                <p className="text-sm font-bold text-gray-900 my-2.5 leading-relaxed">
                  "{q.question}"
                </p>

                <div className="text-xs text-gray-600 mb-3 leading-relaxed">
                  <span className="text-gray-800 font-semibold">Rationale: </span>
                  {q.rationale}
                </div>

                {q.keywords && (
                  <div className="flex items-center gap-2 flex-wrap text-[11px] pt-2.5 border-t border-gray-200/80">
                    <span className="text-gray-500 font-medium">Look for keywords:</span>
                    {q.keywords.map((kw: string) => (
                      <span key={kw} className="bg-white text-gray-700 px-2 py-0.5 rounded-lg border border-gray-200 text-[10px] font-medium shadow-2xs">
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </RecruiterLayout>
);
}
