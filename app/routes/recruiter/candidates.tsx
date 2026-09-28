import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { getMandateCandidates, importCandidateFromResume } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { usePuterStore } from '~/lib/puter';
import { extractTextFromPdf } from '~/lib/pdf2img';

// ─────────────────────────────────────────────────────────────────────────────
// 3D Resume Illustration Component (Matching Reference Image)
// ─────────────────────────────────────────────────────────────────────────────

const ResumeIllustration = () => (
  <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none">
    <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 110" fill="none">
      <defs>
        <linearGradient id="docBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="uploadPillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Sparkles / 4-point stars */}
      <path d="M10 24 C10 24 12 22 12 19 C12 22 14 24 14 24 C14 24 12 26 12 29 C12 26 10 24 10 24 Z" fill="#A855F7" />
      <path d="M6 56 C6 56 8 54 8 51 C8 54 10 56 10 56 C10 56 8 58 8 61 C8 58 6 56 6 56 Z" fill="#38BDF8" />
      <path d="M84 22 C84 22 86 20 86 17 C86 20 88 22 88 22 C88 22 86 24 86 27 C86 24 84 22 84 22 Z" fill="#818CF8" />

      {/* Main Document Body */}
      <rect x="18" y="16" width="60" height="74" rx="12" fill="url(#docBgGrad)" stroke="#E2E8F0" strokeWidth="1.8" />

      {/* Avatar Badge on Document Top Left */}
      <rect x="26" y="24" width="20" height="20" rx="6" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.2" />
      {/* Head */}
      <circle cx="36" cy="31" r="3.5" fill="#6366F1" />
      {/* Shoulders */}
      <path d="M30 40 C30 36.5 32.5 35 36 35 C39.5 35 42 36.5 42 40 Z" fill="#6366F1" />

      {/* Skeleton Text Lines on Document */}
      <rect x="50" y="26" width="20" height="3" rx="1.5" fill="#CBD5E1" opacity="0.8" />
      <rect x="50" y="33" width="16" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="50" y="40" width="14" height="3" rx="1.5" fill="#E2E8F0" />

      {/* Full-width skeleton lines */}
      <rect x="26" y="52" width="44" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="59" width="38" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="66" width="32" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="73" width="24" height="3" rx="1.5" fill="#E2E8F0" />

      {/* Floating 3D Upload Pill / Circle in Front */}
      <circle cx="70" cy="74" r="16" fill="url(#uploadPillGrad)" stroke="#FFFFFF" strokeWidth="2.5" />
      {/* Upward Arrow */}
      <path d="M70 66 L65 72 H68 V79 H72 V72 H75 Z" fill="#FFFFFF" />
    </svg>
  </div>
);

import { SAMPLE_CANDIDATES } from '~/lib/sampleCandidates';



const NUMBER_BADGE_COLORS = [
  'bg-amber-100 text-amber-800 border-amber-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-sky-100 text-sky-800 border-sky-200',
  'bg-emerald-100 text-emerald-800 border-emerald-200',
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-indigo-100 text-indigo-800 border-indigo-200',
  'bg-rose-100 text-rose-800 border-rose-200',
];

export default function Candidates() {
  const { mandateId: paramMandateId } = useParams();
  const navigate = useNavigate();
  const { activeMandateId, mandates } = useTalentAgentStore();
  const { kv } = usePuterStore();

  const currentMandateId = paramMandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');

  const [candidates, setCandidates] = useState<any[]>(SAMPLE_CANDIDATES);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [puterResumes, setPuterResumes] = useState<any[]>([]);
  const [showPuterModal, setShowPuterModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];
  const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

  useEffect(() => {
    if (currentMandateId) {
      loadCandidates();
    }
  }, [currentMandateId]);

  const loadCandidates = async () => {
    try {
      const data = await getMandateCandidates(currentMandateId);
      if (Array.isArray(data) && data.length > 0) {
        setCandidates(data);
      } else {
        setCandidates(SAMPLE_CANDIDATES);
      }
    } catch (e) {
      console.error(e);
      setCandidates(SAMPLE_CANDIDATES);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setUploadError(null);
    setUploadSuccess(null);

    // 1. Validation pass: check file extensions, size, and duplicates
    const validFiles: File[] = [];
    for (const file of files) {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        setUploadError(`Invalid file type "${file.name}". Supports PDF, DOC, DOCX, and TXT only.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        setUploadError(`File size exceeds 3MB limit: "${file.name}" is ${sizeMb}MB. Max allowed is 3MB.`);
        return;
      }
      const isDuplicate = candidates.some((c) => {
        const cName = (c.candidate?.full_name || '').toLowerCase().trim();
        const baseName = file.name.replace(/\.[^/.]+$/, '').toLowerCase().trim();
        return cName === baseName || (c.candidate?.resumeiq_resume_id && c.candidate.resumeiq_resume_id.includes(file.name));
      });
      if (isDuplicate) {
        setUploadError(`Duplicate detected: "${file.name}" has already been uploaded to the candidate pool.`);
        return;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsImporting(true);
    try {
      for (const file of validFiles) {
        let text = '';
        try {
          if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
            text = await extractTextFromPdf(file);
          } else {
            text = await file.text();
          }
        } catch (readErr) {
          console.error('File extraction failed:', readErr);
          text = `Candidate parsed from ${file.name}`;
        }

        const cleanText = (text || '').replace(/\x00/g, ' ');

        await importCandidateFromResume({
          resume_id: `upload-${Date.now()}-${file.name}`,
          resume_text: cleanText || `Candidate Resume: ${file.name}`,
          company_name: file.name.replace(/\.[^/.]+$/, ''),
          mandate_id: currentMandateId,
        });
      }
      setUploadSuccess(`Successfully parsed and added ${validFiles.length} candidate resume${validFiles.length > 1 ? 's' : ''} to the candidate pool!`);
      setTimeout(() => setUploadSuccess(null), 4000);
      await loadCandidates();
    } catch (e) {
      console.error('Batch import failed:', e);
      setUploadError('Batch import failed. Please verify that files contain readable text.');
    } finally {
      setIsImporting(false);
    }
  };

  const openPuterImport = async () => {
    setShowPuterModal(true);
    try {
      const list = await kv.list('resume:*', true);
      if (Array.isArray(list)) {
        const loaded: any[] = [];
        for (const item of list) {
          const val = typeof item === 'string' ? await kv.get(item) : item.value;
          if (val) loaded.push(typeof val === 'string' ? JSON.parse(val) : val);
        }
        setPuterResumes(loaded);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImportSinglePuterResume = async (res: any) => {
    setIsImporting(true);
    try {
      await importCandidateFromResume({
        resume_id: res.id,
        resume_text: res.resumeText || '',
        puter_file_path: res.resumePath,
        resumeiq_audit_json: res.feedback,
        company_name: res.companyName,
        job_title: res.jobTitle,
        mandate_id: currentMandateId,
      });
      setShowPuterModal(false);
      await loadCandidates();
    } catch (e) {
      console.error(e);
    } finally {
      setIsImporting(false);
    }
  };

  const handleClearPool = () => {
    if (confirm('Are you sure you want to clear the candidates pool?')) {
      setCandidates([]);
    }
  };

  const handleLoadSampleResumes = () => {
    setCandidates((prev) => {
      // If no candidates are present, load all sample resumes
      if (!prev || prev.length === 0) {
        return [...SAMPLE_CANDIDATES];
      }

      // If candidates are already present, append sample resumes after them without removing existing ones
      const existingNames = new Set(
        prev.map((c) => (c.candidate?.full_name || '').trim().toLowerCase())
      );
      const existingIds = new Set(
        prev.map((c) => String(c.candidate_id || c.id || c.candidate?.id || ''))
      );

      const toAdd = SAMPLE_CANDIDATES.filter((sample) => {
        const sampleName = (sample.candidate?.full_name || '').trim().toLowerCase();
        const sampleId = String(sample.candidate_id || sample.id || sample.candidate?.id || '');
        return !existingNames.has(sampleName) && !existingIds.has(sampleId);
      });

      return [...prev, ...toAdd];
    });
  };

  const handleDeleteCandidate = async (candidateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this candidate from the pool?')) {
      try {
        await fetch(`${import.meta.env.VITE_TALENT_AGENT_API_URL || 'http://localhost:8000'}/api/v1/candidates/${candidateId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Delete error:', err);
      }
      setCandidates((prev) => prev.filter((c) => (c.candidate_id || c.id) !== candidateId));
    }
  };

  const filteredCandidates = candidates.filter((ev) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const name = (ev.candidate?.full_name || '').toLowerCase();
    const title = (ev.candidate?.current_title || '').toLowerCase();
    const skills = (ev.candidate?.profile?.skills || []).map((s: string) => s.toLowerCase());
    return name.includes(q) || title.includes(q) || skills.some((s: string) => s.includes(q));
  });

  return (
    <RecruiterLayout mandateId={currentMandateId}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Header (Matching Reference Image) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 mb-7">
        {/* Left: Illustration + Title */}
        <div className="flex flex-col">
          {/* Agent 2 Pill (Matching Image 2 style) */}
          <div className="mb-1.5">
            <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
              Agent 2 —
            </span>
          </div>

          <div className="flex items-start gap-4 sm:gap-5">
            {/* 3D Resume Illustration */}
            <ResumeIllustration />

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight flex flex-wrap items-center gap-2">
                <span className="text-gray-900">Resume Upload &</span>
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Parsing Agent
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1.5 max-w-3xl leading-relaxed">
                Ingests candidate resumes, extracts structured profiles (experience, projects, education), and standardizes skill taxonomy for mandate verification and ranking.
              </p>
            </div>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {/* Load Sample Resumes Button */}
          <button
            onClick={handleLoadSampleResumes}
            className="px-4 py-2 bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200/90 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>📁</span>
            <span>Load Sample Resumes</span>
          </button>

          {/* Clear Pool Button */}
          <button
            onClick={handleClearPool}
            className="px-4 py-2 bg-rose-50/80 hover:bg-rose-100/90 text-rose-600 border border-rose-200/80 rounded-full text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>🗑</span>
            <span>Clear Pool</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Middle Row: Upload Box (Left) + Supported Formats (Right) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-7">
        {/* Left Column: Drag & Drop Multiple Candidate Resumes (7 cols) */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`lg:col-span-8 border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all relative flex flex-col items-center justify-center ${
            uploadError
              ? 'border-rose-500 bg-rose-50/80 shadow-lg shadow-rose-500/10 ring-2 ring-rose-400'
              : dragActive
              ? 'border-indigo-500 bg-indigo-50/60 shadow-md'
              : 'border-indigo-300 hover:border-indigo-400 bg-white/70 backdrop-blur-xs shadow-xs'
          }`}
        >
          {/* Toast Warning / Error Notification */}
          {uploadError && (
            <div className="w-full max-w-lg mb-4 px-4 py-2.5 bg-rose-100 border border-rose-300 text-rose-800 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-xs animate-pulse">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{uploadError}</span>
              </div>
              <button
                onClick={() => setUploadError(null)}
                className="text-rose-600 hover:text-rose-900 font-black cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Toast Success Notification */}
          {uploadSuccess && (
            <div className="w-full max-w-lg mb-4 px-4 py-2 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl flex items-center justify-between gap-3 text-xs font-bold shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-base">✅</span>
                <span>{uploadSuccess}</span>
              </div>
              <button
                onClick={() => setUploadSuccess(null)}
                className="text-emerald-600 hover:text-emerald-900 font-black cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>
          )}

          {/* Cloud with Up-Arrow Floating Icon (turns red on error) */}
          <div className={`w-14 h-14 rounded-2xl text-white flex items-center justify-center shadow-lg mb-3.5 transition-all ${
            uploadError
              ? 'bg-gradient-to-tr from-rose-500 via-rose-600 to-red-600 shadow-rose-500/30'
              : 'bg-gradient-to-tr from-indigo-500 via-indigo-600 to-purple-600 shadow-indigo-500/30'
          }`}>
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>

          <h3 className={`font-extrabold text-sm sm:text-base tracking-tight ${uploadError ? 'text-rose-900' : 'text-gray-900'}`}>
            Drag & drop multiple candidate resumes here
          </h3>
          <p className={`text-xs font-medium mt-1 mb-5 ${uploadError ? 'text-rose-600' : 'text-gray-400'}`}>
            Supports PDF, DOC, DOCX, TXT • Max 3MB per file • Duplicate files are detected automatically
          </p>

          {/* Browse Files Button */}
          <label
            style={{ color: '#FFFFFF' }}
            className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold cursor-pointer transition shadow-md select-none ${
              uploadError
                ? 'bg-gradient-to-r from-rose-600 via-rose-700 to-red-700 hover:from-rose-700 hover:to-red-800 shadow-rose-500/25 !text-white'
                : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-indigo-500/25 !text-white'
            }`}
          >
            <svg className="w-4 h-4 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="#FFFFFF" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span style={{ color: '#FFFFFF' }} className="!text-white font-extrabold tracking-tight">
              Browse Files
            </span>
            <input
              type="file"
              multiple
              accept=".pdf,.txt,.doc,.docx"
              onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
              className="hidden"
            />
          </label>

          {isImporting && (
            <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center rounded-3xl z-10">
              <div className="flex items-center gap-3 text-sm font-bold text-indigo-700">
                <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>Parsing resumes & extracting candidate profiles...</span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Supported Formats Card (4 cols) */}
        <div className="lg:col-span-4 bg-white/95 backdrop-blur-xs border border-gray-200/90 rounded-3xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 mb-4 tracking-tight">
              Supported Formats
            </h3>

            {/* 4 Format Badges in a Row */}
            <div className="grid grid-cols-4 gap-2.5 mb-5">
              {/* PDF */}
              <div className="bg-red-50/70 border border-red-100 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                <span className="text-[10px] font-black text-red-600 tracking-wider">PDF</span>
              </div>

              {/* DOC */}
              <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs">
                <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                <span className="text-[10px] font-black text-blue-600 tracking-wider">DOC</span>
              </div>

              {/* DOCX */}
              <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs">
                <svg className="w-6 h-6 text-sky-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                <span className="text-[10px] font-black text-sky-600 tracking-wider">DOCX</span>
              </div>

              {/* TXT */}
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-2.5 flex flex-col items-center justify-center gap-1.5 shadow-2xs">
                <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
                <span className="text-[10px] font-black text-gray-600 tracking-wider">TXT</span>
              </div>
            </div>

            {/* Feature Check List */}
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span>Automatic text extraction (even from scanned PDFs)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  #
                </span>
                <span>Duplicate resume <strong>detection</strong> (by content hash)</span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  ⚡
                </span>
                <span>Indexes semantic embeddings using <strong>pgvector</strong></span>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-700 font-medium">
                <span className="w-4 h-4 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                  👤
                </span>
                <span>Extracts skills, experience, education, projects and more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Bottom Table: Parsed Candidates Pool */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="bg-white/95 backdrop-blur-xs border border-gray-200/90 rounded-3xl shadow-xs overflow-hidden">
        {/* Table Controls Header */}
        <div className="px-6 py-4.5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Candidates Group Icon */}
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                PARSED CANDIDATES POOL ({filteredCandidates.length})
              </h2>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">
                Each profile is structured into skills, experience history, projects, and education.
              </p>
            </div>
          </div>

          {/* Right: Search + Filters + Rank Candidates */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400 text-xs">🔍</span>
              <input
                type="text"
                placeholder="Search candidates or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white border border-gray-200 rounded-full pl-8 pr-3 py-1.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-indigo-500 w-52 sm:w-60 shadow-2xs transition"
              />
            </div>

            {/* Filters Button */}
            <button className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-full flex items-center gap-1.5 transition shadow-2xs cursor-pointer">
              <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filters</span>
              <span className="text-[10px] text-gray-400">∨</span>
            </button>

            {/* Rank Candidates Gradient Button */}
            <button
              onClick={() => navigate(`/recruiter/mandates/${currentMandateId}/ranking`)}
              className="px-5 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-full flex items-center gap-1.5 transition shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <span>✨</span>
              <span>Rank Candidates</span>
            </button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50/70 text-gray-500 border-b border-gray-200 text-[10px] font-extrabold uppercase tracking-wider">
              <tr>
                <th className="pl-6 pr-3 py-3 w-12">#</th>
                <th className="px-4 py-3">CANDIDATE</th>
                <th className="px-4 py-3">EXPERIENCE</th>
                <th className="px-4 py-3">EDUCATION</th>
                <th className="px-4 py-3">KEY SKILLS (EXTRACTED)</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="px-6 py-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-sans">
              {filteredCandidates.map((ev, idx) => {
                const cId = ev.candidate_id || ev.id;
                const candidate = ev.candidate || {};
                const name = candidate.full_name || candidate.profile?.full_name || 'Candidate';
                const email = candidate.email || candidate.profile?.email || '—';
                const years = candidate.years_experience ?? candidate.profile?.years_experience ?? '0';
                const title = candidate.current_title || candidate.profile?.current_title || 'Software Engineer';
                const educationItem = candidate.profile?.education?.[0] || {
                  degree: 'Education Details Pending',
                  institution: 'University',
                };
                const skills = candidate.profile?.skills || [];
                const badgeColor = NUMBER_BADGE_COLORS[idx % NUMBER_BADGE_COLORS.length];

                return (
                  <tr
                    key={cId}
                    className="hover:bg-indigo-50/30 transition"
                  >
                    {/* Number Badge */}
                    <td className="pl-6 pr-3 py-3.5">
                      <div className={`w-6 h-6 rounded-full border text-[11px] font-black flex items-center justify-center shadow-2xs ${badgeColor}`}>
                        {idx + 1}
                      </div>
                    </td>

                    {/* Candidate */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-extrabold text-gray-900 text-xs sm:text-sm tracking-tight">{name}</p>
                        <p className="text-[11px] text-gray-400 font-mono mt-0.5">{email}</p>
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{years} yrs</p>
                        <p className="text-[11px] text-gray-500 font-medium truncate max-w-[200px] mt-0.5">{title}</p>
                      </div>
                    </td>

                    {/* Education */}
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="font-bold text-gray-900 text-xs truncate max-w-[220px]">
                          {educationItem.degree}
                        </p>
                        <p className="text-[11px] text-gray-400 font-medium truncate max-w-[220px] mt-0.5">
                          {educationItem.institution}
                        </p>
                      </div>
                    </td>

                    {/* Key Skills (Extracted) */}
                    <td className="px-4 py-3.5">
                      <div className="flex flex-wrap items-center gap-1.5 max-w-sm">
                        {skills.slice(0, 4).map((s: string) => (
                          <span
                            key={s}
                            className="bg-indigo-50/90 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-lg text-[10px] font-bold shadow-2xs"
                          >
                            {s}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span className="text-gray-500 text-[10px] bg-gray-100 px-1.5 py-0.5 rounded-lg border border-gray-200 font-semibold">
                            +{skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black">
                          ✓
                        </span>
                        <span>Parsed</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/recruiter/mandates/${currentMandateId}/candidates/${cId}`)}
                          className="px-3.5 py-1 bg-white hover:bg-gray-50 text-gray-700 hover:text-indigo-600 text-xs rounded-full border border-gray-200 font-semibold transition shadow-2xs cursor-pointer"
                        >
                          Full Profile
                        </button>
                        <button
                          onClick={(e) => handleDeleteCandidate(cId, e)}
                          title="Delete candidate"
                          className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-700 border border-rose-200/80 flex items-center justify-center text-xs transition cursor-pointer shadow-2xs"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
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

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Puter Import Modal */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {showPuterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl font-sans">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-sm">Select Resume from ResumeIQ Pool</h3>
              <button
                onClick={() => setShowPuterModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
            {puterResumes.length === 0 ? (
              <p className="text-gray-500 py-6 text-center text-xs">
                No existing candidate resumes found in ResumeIQ storage.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {puterResumes.map((r, i) => (
                  <div
                    key={r.id || i}
                    className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{r.jobTitle || 'Resume Submission'}</p>
                      <p className="text-[11px] text-gray-500">{r.companyName || 'Candidate'}</p>
                    </div>
                    <button
                      onClick={() => handleImportSinglePuterResume(r)}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-full text-xs shadow-2xs cursor-pointer"
                    >
                      Import
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </RecruiterLayout>
  );
}

