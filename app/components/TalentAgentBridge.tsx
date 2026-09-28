import { useState } from 'react';
import { useNavigate } from 'react-router';
import { usePuterStore } from '~/lib/puter';
import { importCandidateFromResume } from '~/lib/talentAgentApi';

interface Feedback {
  // Add necessary feedback types or keep it generic
  [key: string]: any;
}

interface Props {
  resumeId: string | undefined;
  feedback: Feedback | null;
}

const TalentAgentBridge = ({ resumeId, feedback }: Props) => {
  const navigate = useNavigate();
  const { kv } = usePuterStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!resumeId) return;
    setLoading(true);
    setError(null);
    try {
      const raw = await kv.get(`resume:${resumeId}`);
      if (!raw) throw new Error('Resume data not found in storage');
      const data = JSON.parse(raw as string);
      
      const result = await importCandidateFromResume({
        resume_id: resumeId,
        resume_text: data.resumeText || '',
        puter_file_path: data.resumePath,
        resumeiq_audit_json: feedback,
        company_name: data.companyName,
        job_title: data.jobTitle,
      });
      navigate(`/recruiter/mandates/new/candidates/${result.candidate_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">Six Agents — Recruiter Mode</p>
          <p className="text-xs text-gray-500 mt-0.5">Analyze this resume as a recruiter using the TalentAgent 6-agent pipeline — JD matching, verification, GitHub evidence & deterministic ranking.</p>
        </div>
      </div>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
      <button
        onClick={handleImport}
        disabled={loading}
        className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] text-white px-5 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60 self-start"
      >
        {loading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Importing...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Analyze as Recruiter Candidate
          </>
        )}
      </button>
    </div>
  );
};

export default TalentAgentBridge;
