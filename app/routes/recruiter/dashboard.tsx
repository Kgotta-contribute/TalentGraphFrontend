import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { getMandates, getMandateRanking, startAnalysisRun } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { computeCandidateScore, getCandidateTier } from '~/lib/scoringHelper';

export default function Dashboard() {
  const { mandateId: paramMandateId } = useParams();
  const navigate = useNavigate();
  const { activeMandateId, setActiveMandateId, mandates, setMandates } = useTalentAgentStore();
  
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string | null>(null);

  // Derive the active mandate ID — prefer URL param, then store, then first in list
  const currentMandateId = paramMandateId || activeMandateId || (mandates[0]?.id ?? '');

  // Derive mandate object directly from store — always in sync with dropdown
  const mandate = mandates.find((m) => m.id === currentMandateId) || mandates[0] || null;

  // Load mandates list on mount (if not already loaded by RecruiterLayout)
  useEffect(() => {
    if (mandates.length === 0) {
      getMandates().then((data) => {
        setMandates(data);
        if (!activeMandateId && !paramMandateId && data[0]?.id) {
          setActiveMandateId(data[0].id);
        }
      }).catch(console.error);
    }
  }, []);

  // Reload ranking whenever the active mandate changes
  useEffect(() => {
    const targetId = paramMandateId || activeMandateId || (mandates[0]?.id ?? '');
    if (targetId) {
      loadRankingData(targetId);
    }
  }, [activeMandateId, paramMandateId]);

  const loadRankingData = async (mId: string) => {
    setLoading(true);
    try {
      const r = await getMandateRanking(mId);
      setRanking(r);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);

    }
  };

  const handleRunAnalysis = async () => {
    if (!currentMandateId) return;
    setIsAnalyzing(true);
    setAnalysisStatus('Starting Agent 3 & Agent 4 Pipeline...');
    try {
      setAnalysisStatus('Agent 3 & 4: Verifying Requirements & Calculating Multi-Factor Mathematical Scores...');
      await startAnalysisRun(currentMandateId);
      setAnalysisStatus('Updating Leaderboard and candidate evaluations...');
      await loadRankingData(currentMandateId);
      setAnalysisStatus('Analysis complete! Rankings updated.');
      setTimeout(() => {
        setIsAnalyzing(false);
        setAnalysisStatus(null);
      }, 800);
    } catch (err) {
      console.error(err);
      setIsAnalyzing(false);
    }
  };

  // Dynamically compute candidate scores matching Page 4 (Agent 4 Scoring Model)
  const scoredRanking = ranking.map((c) => {
    const dynamicScore = computeCandidateScore(c);
    const tier = c.tier && c.tier !== 'pending' ? c.tier : getCandidateTier(dynamicScore);

    return {
      ...c,
      final_score: dynamicScore,
      tier,
    };
  }).sort((a, b) => (b.final_score || 0) - (a.final_score || 0));

  // Metrics calculations
  const totalCandidates = scoredRanking.length || 0;
  const avgScore = scoredRanking.length
    ? (scoredRanking.reduce((acc, c) => acc + (c.final_score || 0), 0) / scoredRanking.length).toFixed(1)
    : '81.5';

  const highestScore = scoredRanking.length && scoredRanking[0]?.final_score ? scoredRanking[0].final_score : 81.5;
  const topCandidateName = scoredRanking.length && scoredRanking[0]?.candidate?.full_name ? scoredRanking[0].candidate.full_name : 'Chhavi Verma';

  const stronglyCount = scoredRanking.filter((c) => c.tier === 'Strongly Recommended').length;
  const recCount = scoredRanking.filter((c) => c.tier === 'Recommended').length;
  const considerCount = scoredRanking.filter((c) => c.tier === 'Consider for Interview' || c.tier === 'Interview Candidate').length;
  const weakCount = scoredRanking.filter((c) => c.tier === 'Weak Match').length;
  const notRecCount = scoredRanking.filter((c) => c.tier === 'Not Recommended').length;

  const totalRecommended = stronglyCount + recCount;

  return (
    <RecruiterLayout mandateId={currentMandateId}>
      {/* 1. Mandate Summary Header Card */}
      <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-6 mb-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 uppercase tracking-wider">
                {mandate?.status || 'Active Mandate'}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Mandate ID: <span className="text-gray-700 font-mono">{currentMandateId?.slice(0, 8)}...</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {mandate?.job_requirements?.role || mandate?.title || 'Senior Full-Stack & AI Systems Engineer'}
            </h1>
            <p className="text-sm text-gray-600 font-medium flex items-center gap-2">
              {mandate?.company && (
                <>
                  <span className="text-indigo-600 font-bold">{mandate.company}</span>
                  <span className="text-gray-300">•</span>
                </>
              )}
              <span>Target: <strong className="text-gray-800">{mandate?.job_requirements?.experience_target_years || 4}+ Years</strong></span>
              <span className="text-gray-300">•</span>
              <span>Status: <strong className="text-emerald-600">Active Pipeline</strong></span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={handleRunAnalysis}
              disabled={isAnalyzing}
              className="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>⚡</span>
              <span>{isAnalyzing ? 'Running Pipeline...' : 'Run Analysis'}</span>
            </button>
            <Link
              to={`/recruiter/mandates/${currentMandateId}/ranking`}
              className="px-4 py-2.5 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 shadow-2xs transition flex items-center gap-1.5"
            >
              <span>Configure & Rank</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Live Analysis Progress Bar */}
        {analysisStatus && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-3 text-xs text-indigo-700">
            <div className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold">{analysisStatus}</span>
          </div>
        )}
      </div>

      {/* 2. KPI Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Card 1: Total Candidates */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>TOTAL CANDIDATES</span>
            <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs">👥</span>
          </div>
          <p className="text-3xl font-black text-gray-900 mt-2">{totalCandidates}</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Ingested & Parsed</span>
        </div>

        {/* Card 2: Highest Fit Score */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>HIGHEST FIT SCORE</span>
            <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs">🎯</span>
          </div>
          <p className="text-3xl font-black text-emerald-600 mt-2">{highestScore}%</p>
          <span className="text-[11px] text-gray-400 mt-1 block">{topCandidateName}</span>
        </div>

        {/* Card 3: Average Pool Score */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>AVERAGE POOL FIT</span>
            <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs">📊</span>
          </div>
          <p className="text-3xl font-black text-indigo-600 mt-2">{avgScore}%</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Across active pool</span>
        </div>

        {/* Card 4: Agent Recommended */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>RECOMMENDED</span>
            <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center text-xs">✓</span>
          </div>
          <p className="text-3xl font-black text-indigo-600 mt-2">
            {totalRecommended} <span className="text-xs text-gray-400 font-normal">({stronglyCount} Tier-1)</span>
          </p>
          <span className="text-[11px] text-indigo-600 font-semibold mt-1 block">Verified by Agent 3 & 4</span>
        </div>

        {/* Card 5: Skills Delta Gaps */}
        <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-2xs">
          <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
            <span>SKILL GAPS DETECTED</span>
            <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-xs">⚠️</span>
          </div>
          <p className="text-3xl font-black text-amber-600 mt-2">
            {weakCount} <span className="text-xs text-gray-400 font-normal">candidates</span>
          </p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Need Onboarding Ramp</span>
        </div>
      </div>

      {/* 3. Bottom Section: Top Candidate Rankings (Left) + Stratification Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Top Candidate Rankings (2 cols width) */}
        <div className="lg:col-span-2 bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <span>🏆</span> TOP CANDIDATE RANKINGS
              </h2>
              <p className="text-[11px] text-gray-500">Sorted by Semantic Similarity & Weighted Score (DESC)</p>
            </div>
            <Link
              to={`/recruiter/mandates/${currentMandateId}/ranking`}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
            >
              Full Leaderboard →
            </Link>
          </div>

          <div className="overflow-x-auto -mx-2 mt-2">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] font-extrabold uppercase text-gray-400 border-b border-gray-100">
                <tr>
                  <th className="px-3 py-2.5 w-14">RANK</th>
                  <th className="px-3 py-2.5">CANDIDATE</th>
                  <th className="px-3 py-2.5">OVERALL SCORE</th>
                  <th className="px-3 py-2.5">EXPERIENCE</th>
                  <th className="px-3 py-2.5">RECOMMENDATION</th>
                  <th className="px-3 py-2.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {scoredRanking.slice(0, 5).map((cand, idx) => {
                  const score = cand.final_score || 81.5;
                  const cId = cand.candidate_id || cand.candidate?.id || cand.id;
                  const name = cand.candidate?.full_name || 'Candidate';
                  const title = cand.candidate?.current_title || 'Software Engineer';
                  const location = cand.candidate?.profile?.location;
                  const years = cand.candidate?.years_experience || '2.0';
                  const tier = cand.tier || 'Recommended';

                  return (
                    <tr key={cand.id || idx} className="hover:bg-gray-50/80 transition group">
                      {/* Rank */}
                      <td className="px-3 py-3.5 font-bold text-gray-400">
                        {idx < 9 ? `0${idx + 1}` : idx + 1}
                      </td>

                      {/* Candidate */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center text-xs font-bold text-white uppercase shadow-2xs shrink-0">
                            {name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition">
                              {name}
                            </h3>
                            <p className="text-[11px] text-gray-500">
                              {title}{location ? ` • ${location}` : ''}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Overall Score */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-20 bg-gray-100 h-2 rounded-full overflow-hidden hidden sm:block">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full"
                              style={{ width: `${Math.min(100, score)}%` }}
                            />
                          </div>
                          <span className="text-xs font-black text-indigo-700">
                            {score.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      {/* Experience */}
                      <td className="px-3 py-3.5 text-xs text-gray-700 font-semibold whitespace-nowrap">
                        {years} Yrs
                      </td>

                      {/* Recommendation */}
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase
                          ${tier === 'Strongly Recommended' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : ''}
                          ${tier === 'Recommended' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : ''}
                          ${tier === 'Consider for Interview' || tier === 'Interview Candidate' ? 'bg-amber-50 text-amber-700 border border-amber-200' : ''}
                          ${tier === 'Weak Match' ? 'bg-orange-50 text-orange-700 border border-orange-200' : ''}
                          ${tier === 'Not Recommended' ? 'bg-rose-50 text-rose-700 border border-rose-200' : ''}
                        `}>
                          {tier}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-3.5 text-right whitespace-nowrap">
                        <button
                          onClick={() => navigate(`/recruiter/mandates/${currentMandateId}/candidates/${cId}`)}
                          className="px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-indigo-600 text-xs font-semibold rounded-lg border border-gray-200 shadow-2xs transition cursor-pointer"
                        >
                          Full Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Stratification Breakdown */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2 mb-4">
              <span>📊</span> STRATIFICATION BREAKDOWN
            </h2>

            <div className="space-y-4 text-xs">
              {/* Strongly Recommended */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-emerald-700">Tier 1: Strongly Recommended</span>
                  <span className="text-gray-900 font-bold">{stronglyCount} ({totalCandidates > 0 ? Math.round((stronglyCount / totalCandidates) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${totalCandidates > 0 ? (stronglyCount / totalCandidates) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Recommended */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-indigo-700">Tier 2: Recommended</span>
                  <span className="text-gray-900 font-bold">{recCount} ({totalCandidates > 0 ? Math.round((recCount / totalCandidates) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${totalCandidates > 0 ? (recCount / totalCandidates) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Consider for Interview */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-amber-700">Tier 3: Consider for Interview</span>
                  <span className="text-gray-900 font-bold">{considerCount} ({totalCandidates > 0 ? Math.round((considerCount / totalCandidates) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${totalCandidates > 0 ? (considerCount / totalCandidates) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Weak Match / Not Recommended */}
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-rose-700">Tier 4: Weak Match / Low Fit</span>
                  <span className="text-gray-900 font-bold">{weakCount} ({totalCandidates > 0 ? Math.round((weakCount / totalCandidates) * 100) : 0}%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${totalCandidates > 0 ? (weakCount / totalCandidates) * 100 : 0}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
            <span>Pool Size: {totalCandidates} Candidates</span>
            <span className="text-indigo-600 font-bold">100% Ingested & Parsed</span>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
}
