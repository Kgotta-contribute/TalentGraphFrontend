import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { getMandate, getMandateRanking, updateScoringWeights, rankMandateCandidates } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { SAMPLE_RANKING_CANDIDATES } from '~/lib/sampleCandidates';
import { computeCandidateScore, getCandidateTier } from '~/lib/scoringHelper';

// ─────────────────────────────────────────────────────────────────────────────
// 3D Trophy & Ranking Illustration Component (Matching Reference Image 1)
// ─────────────────────────────────────────────────────────────────────────────

const RankingIllustration = () => (
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

      {/* Main SVG graphic (Trophy + 3 Bar Charts) */}
      <svg className="w-14 h-14 sm:w-16 sm:h-16" viewBox="0 0 80 80" fill="none">
        <defs>
          {/* Trophy Gold Gradients */}
          <linearGradient id="goldCup" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="35%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="goldHandle" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>
          <linearGradient id="goldBase" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>

          {/* Bar Chart Gradients */}
          <linearGradient id="bar1Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#C7D2FE" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
          <linearGradient id="bar2Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="bar3Grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#4338CA" />
          </linearGradient>
        </defs>

        {/* Soft shadow base */}
        <ellipse cx="28" cy="65" rx="14" ry="3" fill="#E0E7FF" opacity="0.8" />
        <ellipse cx="58" cy="65" rx="12" ry="2.5" fill="#E0E7FF" opacity="0.8" />

        {/* Left Handle */}
        <path
          d="M17 31 C12 31 10 37 12 43 C14 48 18 49 21 49"
          stroke="url(#goldHandle)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        {/* Right Handle */}
        <path
          d="M37 31 C42 31 44 37 42 43 C40 48 36 49 33 49"
          stroke="url(#goldHandle)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />

        {/* Trophy Cup Body */}
        <path
          d="M19 26 H35 C35 26 35.5 44 27 48 C18.5 44 19 26 19 26 Z"
          fill="url(#goldCup)"
          stroke="#F59E0B"
          strokeWidth="0.8"
        />

        {/* Trophy Top Rim */}
        <ellipse cx="27" cy="26" rx="8" ry="2.5" fill="#FDE68A" stroke="#F59E0B" strokeWidth="0.8" />

        {/* Star on Trophy Cup */}
        <polygon
          points="27,33 28.5,36 32,36.5 29.5,39 30,42.5 27,40.8 24,42.5 24.5,39 22,36.5 25.5,36"
          fill="#FFFFFF"
          opacity="0.95"
        />

        {/* Trophy Stem */}
        <rect x="25.5" y="48" width="3" height="7" rx="1" fill="url(#goldHandle)" />

        {/* Trophy Base */}
        <path d="M21 55 H33 L34 62 H20 Z" fill="url(#goldBase)" />
        <rect x="18" y="62" width="18" height="3" rx="1.5" fill="#B45309" />

        {/* Right: Ascending 3D Bar Chart */}
        {/* Bar 1 (Short) */}
        <rect x="44" y="50" width="6.5" height="13" rx="2" fill="url(#bar1Grad)" />
        {/* Bar 2 (Medium) */}
        <rect x="52.5" y="42" width="6.5" height="21" rx="2" fill="url(#bar2Grad)" />
        {/* Bar 3 (Tall) */}
        <rect x="61" y="32" width="6.5" height="31" rx="2" fill="url(#bar3Grad)" />
      </svg>
    </div>
  </div>
);

export default function Ranking() {
  const { mandateId: paramMandateId } = useParams();
  const navigate = useNavigate();
  const { activeMandateId, mandates } = useTalentAgentStore();
  const currentMandateId = paramMandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');

  const [mandate, setMandate] = useState<any>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [minScore, setMinScore] = useState<number>(0);
  const [selectedTier, setSelectedTier] = useState<string>('All Tiers');

  const DEFAULT_WEIGHTS = {
    technical_skills: 0.40,
    experience_tenure: 0.25,
    jd_similarity: 0.20,
    project_relevance: 0.10,
    education_certs: 0.05,
  };

  const [weights, setWeights] = useState(DEFAULT_WEIGHTS);
  const [showWeightsPanel, setShowWeightsPanel] = useState(false);

  useEffect(() => {
    if (currentMandateId) {
      loadData();
    }
  }, [currentMandateId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, r] = await Promise.all([
        getMandate(currentMandateId),
        getMandateRanking(currentMandateId),
      ]);
      setMandate(m);
      if (Array.isArray(r) && r.length > 0) {
        setRanking(r);
      } else {
        setRanking(SAMPLE_RANKING_CANDIDATES);
      }
    } catch (e) {
      console.error(e);
      setRanking(SAMPLE_RANKING_CANDIDATES);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDefaults = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const handleWeightChange = (key: keyof typeof DEFAULT_WEIGHTS, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
  };

  // Dynamically recompute candidate scores based on current weights
  const scoredRanking = ranking.map((c) => {
    const dynamicScore = computeCandidateScore(c, weights);
    const tier = getCandidateTier(dynamicScore);

    return {
      ...c,
      final_score: dynamicScore,
      tier,
    };
  }).sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

  function roundScore(val: number) {
    return Math.round(val * 10) / 10;
  }

  // Filter candidates
  const filteredRanking = scoredRanking.filter((c) => {
    const name = (c.candidate?.full_name || '').toLowerCase();
    const skills = (c.candidate?.profile?.skills || []).map((s: string) => s.toLowerCase()).join(' ');
    const title = (c.candidate?.current_title || '').toLowerCase();
    const term = searchTerm.toLowerCase();

    const matchesSearch = !term || name.includes(term) || skills.includes(term) || title.includes(term);
    const matchesScore = (c.final_score || 0) >= minScore;
    const matchesTier = selectedTier === 'All Tiers' || c.tier === selectedTier;

    return matchesSearch && matchesScore && matchesTier;
  });

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
      case 'Not Recommended':
        return 'bg-rose-50 text-rose-700 border border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200';
    }
  };

  return (
    <RecruiterLayout mandateId={currentMandateId}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Header Banner (Matching Reference Image 1) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-indigo-50/20 to-purple-50/30 border border-indigo-100/90 p-5 sm:p-6 mb-7 shadow-xs">
        {/* Decorative watermark graphics on the right (Matching Image 1) */}
        <div className="absolute right-0 top-0 bottom-0 w-96 pointer-events-none overflow-hidden select-none opacity-40 hidden sm:block">
          <svg className="w-full h-full" viewBox="0 0 380 140" fill="none">
            {/* Faint User Profile Card Widget */}
            <g transform="translate(230, 20)">
              <rect x="0" y="0" width="110" height="60" rx="14" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.2" opacity="0.7" />
              {/* Avatar */}
              <circle cx="24" cy="25" r="9" fill="#818CF8" opacity="0.6" />
              <circle cx="24" cy="22" r="4" fill="#EEF2FF" />
              <path d="M17 31 C17 28 20 27 24 27 C28 27 31 28 31 31" fill="#EEF2FF" />
              {/* Skeleton lines */}
              <rect x="42" y="19" width="50" height="4" rx="2" fill="#818CF8" opacity="0.5" />
              <rect x="42" y="27" width="34" height="3" rx="1.5" fill="#C7D2FE" opacity="0.6" />
            </g>

            {/* Faint Ascending Bar Charts */}
            <rect x="155" y="70" width="14" height="45" rx="4" fill="#C7D2FE" opacity="0.4" />
            <rect x="175" y="50" width="14" height="65" rx="4" fill="#818CF8" opacity="0.35" />
            <rect x="195" y="32" width="14" height="83" rx="4" fill="#6366F1" opacity="0.3" />

            {/* Soft sparkles */}
            <circle cx="130" cy="55" r="3" fill="#818CF8" opacity="0.5" />
            <circle cx="100" cy="85" r="2" fill="#C7D2FE" opacity="0.6" />
            <path d="M140 30 C140 30 142 27 142 24 C142 27 144 30 144 30 C144 30 142 33 142 36 C142 33 140 30 140 30 Z" fill="#818CF8" opacity="0.6" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Left: Illustration + Title info */}
          <div className="flex items-start gap-4 sm:gap-5">
            {/* 3D Trophy + Bar Chart Illustration */}
            <RankingIllustration />

            {/* Title & Description */}
            <div>
              {/* Agent 4 Pill */}
              <div className="mb-1.5">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full shadow-2xs">
                  <span>🎯</span>
                  <span>Agent 4 • Ranking & Evaluation</span>
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight flex flex-wrap items-center gap-2">
                <span className="text-gray-900">Candidate</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Ranking & Leaderboard
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                Agent 4: Multi-criteria weighted mathematical scoring against active job requirements.
              </p>
            </div>
          </div>

          {/* Right: Configure Scoring Weights Button */}
          <button
            onClick={() => setShowWeightsPanel(!showWeightsPanel)}
            className={`relative z-10 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition shadow-2xs self-start lg:self-center border cursor-pointer ${
              showWeightsPanel
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-indigo-500/10'
                : 'bg-white hover:bg-indigo-50/50 text-indigo-600 hover:text-indigo-700 border-indigo-200 hover:border-indigo-300'
            }`}
          >
            <span className="text-indigo-600">⚙️</span>
            <span>Configure Scoring Weights</span>
          </button>
        </div>
      </div>

      {/* ADJUSTABLE MULTI-CRITERIA SCORING MODEL */}
      {showWeightsPanel && (
        <div className="bg-white/95 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 mb-6 shadow-xs font-mono text-xs animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-indigo-600">🎛️</span>
              <span className="font-bold text-gray-800 tracking-wider uppercase text-xs">
                ADJUSTABLE MULTI-CRITERIA SCORING MODEL
              </span>
              <span className="text-[11px] text-gray-500 font-normal">
                Adjust sliders to dynamically re-weigh the ranking formula across all candidates in real time.
              </span>
            </div>
            <button
              onClick={handleResetDefaults}
              className="text-gray-400 hover:text-indigo-600 text-xs flex items-center gap-1 transition cursor-pointer"
            >
              <span>↺</span>
              <span>Reset Defaults</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {/* Card 1: Technical Skills */}
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">Technical Skills</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
                  {(weights.technical_skills * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={weights.technical_skills}
                onChange={(e) => handleWeightChange('technical_skills', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 my-1 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 mt-1">Required vs matched skill overlap</span>
            </div>

            {/* Card 2: Experience Tenure */}
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">Experience Tenure</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
                  {(weights.experience_tenure * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={weights.experience_tenure}
                onChange={(e) => handleWeightChange('experience_tenure', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 my-1 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 mt-1">Target vs candidate total years</span>
            </div>

            {/* Card 3: JD Similarity (RAG) */}
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">JD Similarity (RAG)</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
                  {(weights.jd_similarity * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={weights.jd_similarity}
                onChange={(e) => handleWeightChange('jd_similarity', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 my-1 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 mt-1">Cosine vector semantic similarity</span>
            </div>

            {/* Card 4: Project Relevance */}
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">Project Relevance</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
                  {(weights.project_relevance * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={weights.project_relevance}
                onChange={(e) => handleWeightChange('project_relevance', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 my-1 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 mt-1">Project tech stacks & scale</span>
            </div>

            {/* Card 5: Education / Certs */}
            <div className="bg-gray-50/80 border border-gray-200/80 rounded-xl p-3.5 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-800">Education / Certs</span>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 shadow-2xs">
                  {(weights.education_certs * 100).toFixed(0)}%
                </span>
              </div>
              <input
                type="range" min="0" max="1" step="0.05"
                value={weights.education_certs}
                onChange={(e) => handleWeightChange('education_certs', parseFloat(e.target.value))}
                className="w-full accent-indigo-600 my-1 cursor-pointer"
              />
              <span className="text-[10px] text-gray-400 mt-1">Degrees and verified certifications</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-3.5 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl flex-1 min-w-[240px] max-w-md shadow-2xs">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search candidate name or skills..."
            className="bg-transparent text-gray-800 placeholder-gray-400 focus:outline-none w-full text-xs"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600 cursor-pointer">✕</button>
          )}
        </div>

        {/* Min Score Slider */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 px-3.5 py-1.5 rounded-xl shadow-2xs">
          <span className="text-gray-500 whitespace-nowrap">Min Score:</span>
          <span className="font-bold text-indigo-600 w-8">{minScore}%</span>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={minScore}
            onChange={(e) => setMinScore(parseInt(e.target.value))}
            className="w-24 accent-indigo-600 cursor-pointer"
          />
        </div>

        {/* Tier Dropdown */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-xl shadow-2xs">
          <span className="text-gray-500">Tier:</span>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value)}
            className="bg-transparent text-gray-800 focus:outline-none cursor-pointer pr-2"
          >
            <option value="All Tiers" className="bg-white text-gray-800">All Tiers</option>
            <option value="Strongly Recommended" className="bg-white text-gray-800">Strongly Recommended</option>
            <option value="Recommended" className="bg-white text-gray-800">Recommended</option>
            <option value="Consider for Interview" className="bg-white text-gray-800">Consider for Interview</option>
            <option value="Weak Match" className="bg-white text-gray-800">Weak Match</option>
            <option value="Not Recommended" className="bg-white text-gray-800">Not Recommended</option>
          </select>
        </div>

        {/* Results count */}
        <div className="text-gray-400 text-right pr-2">
          Showing <span className="text-gray-800 font-bold">{filteredRanking.length}</span> of {ranking.length}
        </div>
      </div>

      {/* Full Ranking Table */}
      <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-gray-50/80 text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5 font-bold uppercase w-14">Rank</th>
                <th className="px-6 py-3.5 font-bold uppercase">Candidate</th>
                <th className="px-6 py-3.5 font-bold uppercase">Match Score</th>
                <th className="px-6 py-3.5 font-bold uppercase">Skills Match</th>
                <th className="px-6 py-3.5 font-bold uppercase">Experience</th>
                <th className="px-6 py-3.5 font-bold uppercase">Recommendation</th>
                <th className="px-6 py-3.5 font-bold uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRanking.map((evalItem, idx) => {
                const cand = evalItem.candidate;
                const score = evalItem.final_score || 0;
                const techPct = evalItem.tech_coverage_pct || 75;
                const years = parseFloat(cand?.years_experience || '4.0');
                const targetYears = mandate?.job_requirements?.experience_target_years || 4;
                const meetsExp = years >= targetYears;

                return (
                  <tr key={evalItem.id || idx} className="hover:bg-gray-50/60 transition group">
                    {/* Rank */}
                    <td className="px-5 py-4 font-bold text-gray-400">
                      {idx < 9 ? `0${idx + 1}` : idx + 1}
                    </td>

                    {/* Candidate */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-200 text-indigo-700 flex items-center justify-center font-bold uppercase text-xs border border-indigo-200/60">
                          {cand?.full_name?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-xs leading-tight group-hover:text-indigo-600 transition">
                            {cand?.full_name || 'Candidate Name'}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {cand?.current_title || 'Engineer'} • {cand?.profile?.location || 'San Francisco, CA'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Match Score (progress bar + text) */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-28 bg-gray-100 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] h-full rounded-full"
                            style={{ width: `${Math.min(100, score)}%` }}
                          />
                        </div>
                        <span className="font-bold text-indigo-700 w-12 text-right">
                          {score.toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Skills Match */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-indigo-600">{Math.round(techPct)}%</span>
                        <span className="text-gray-400">
                          ({evalItem.verification_result?.matched_required?.length || 8}/
                          {mandate?.job_requirements?.mandatory_skills?.length || 10} req)
                        </span>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-800 font-semibold">{years} Yrs</span>
                        {meetsExp ? (
                          <span className="text-emerald-600 text-[11px] font-semibold">✓ Meets</span>
                        ) : (
                          <span className="text-amber-600 text-[11px] font-semibold">⚠ Gap</span>
                        )}
                      </div>
                    </td>

                    {/* Recommendation Badge */}
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase whitespace-nowrap shadow-2xs ${getTierBadge(evalItem.tier)}`}>
                        {evalItem.tier}
                      </span>
                    </td>

                    {/* Actions: Deep Dive & Report buttons */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/recruiter/mandates/${currentMandateId}/candidates/${evalItem.candidate_id}`)}
                          className="px-3 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-indigo-600 rounded-xl border border-gray-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
                        >
                          Deep Dive
                        </button>
                        <button
                          onClick={() => navigate(`/recruiter/mandates/${currentMandateId}/reports/${evalItem.candidate_id}`)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-semibold shadow-2xs transition cursor-pointer"
                        >
                          Report
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </RecruiterLayout>
  );
}
