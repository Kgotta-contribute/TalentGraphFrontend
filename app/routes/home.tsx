import type { Route } from "./+types/home";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import {usePuterStore} from "~/lib/puter";
import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "ResumeIQ | AI-powered resume intelligence" },
    { name: "description", content: "AI-powered resume intelligence." },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// Left 3D Resume Illustration Component (Matching Reference Image)
// ─────────────────────────────────────────────────────────────────────────────
const LeftResumeIllustration = () => (
  <div className="relative w-64 h-80 xl:w-72 xl:h-88 select-none pointer-events-none drop-shadow-xl">
    <svg className="w-full h-full" viewBox="0 0 260 320" fill="none">
      <defs>
        {/* Subtle dot grid */}
        <pattern id="dotGrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#C7D2FE" opacity="0.6" />
        </pattern>
        <linearGradient id="sheetGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <linearGradient id="sheetGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
        <linearGradient id="avatarBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>
        <filter id="shadowLeft" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#4338CA" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Dot Grid Background */}
      <rect x="0" y="20" width="120" height="120" fill="url(#dotGrid)" />

      {/* 4-point Sparkle Stars */}
      <path d="M22 18 C22 18 24 15 24 11 C24 15 26 18 26 18 C26 18 24 21 24 25 C24 21 22 18 22 18 Z" fill="#FBBF24" />
      <path d="M235 160 C235 160 237 157 237 154 C237 157 239 160 239 160 C239 160 237 163 237 166 C237 163 235 160 235 160 Z" fill="#818CF8" />
      <path d="M242 240 C242 240 244 238 244 235 C244 238 246 240 246 240 C246 240 244 242 244 245 C244 242 242 240 242 240 Z" fill="#A855F7" />
      <path d="M8 210 C8 210 10 208 10 205 C10 208 12 210 12 210 C12 210 10 212 10 215 C10 212 8 210 8 210 Z" fill="#38BDF8" />

      {/* Back Tilted Sheet */}
      <g transform="rotate(-6 120 160)">
        <rect x="25" y="35" width="170" height="230" rx="20" fill="url(#sheetGrad1)" stroke="#E0E7FF" strokeWidth="2" opacity="0.85" filter="url(#shadowLeft)" />
      </g>

      {/* Front Main Resume Sheet */}
      <g transform="rotate(2 130 165)">
        <rect x="35" y="45" width="175" height="235" rx="22" fill="url(#sheetGrad2)" stroke="#EEF2F6" strokeWidth="2" filter="url(#shadowLeft)" />

        {/* User Avatar Circle */}
        <circle cx="70" cy="85" r="18" fill="url(#avatarBgGrad)" />
        {/* Avatar Head & Body */}
        <circle cx="70" cy="80" r="6" fill="#FFFFFF" />
        <path d="M60 97 C60 91 64 89 70 89 C76 89 80 91 80 97 Z" fill="#FFFFFF" />

        {/* Name & Subtitle Skeleton Bars */}
        <rect x="98" y="74" width="70" height="7" rx="3.5" fill="#CBD5E1" />
        <rect x="98" y="87" width="45" height="5" rx="2.5" fill="#E2E8F0" />

        {/* Horizontal Divider Line */}
        <line x1="55" y1="116" x2="190" y2="116" stroke="#F1F5F9" strokeWidth="2" strokeLinecap="round" />

        {/* Full-width Skeleton Bars */}
        <rect x="55" y="132" width="135" height="6" rx="3" fill="#818CF8" opacity="0.8" />
        <rect x="55" y="146" width="115" height="6" rx="3" fill="#E2E8F0" />
        <rect x="55" y="160" width="125" height="6" rx="3" fill="#E2E8F0" />
        <rect x="55" y="174" width="85" height="6" rx="3" fill="#E2E8F0" />

        {/* Lower Left Mini Block */}
        <rect x="55" y="200" width="50" height="5" rx="2.5" fill="#CBD5E1" />
        <rect x="55" y="212" width="35" height="5" rx="2.5" fill="#E2E8F0" />
        <rect x="55" y="224" width="42" height="5" rx="2.5" fill="#E2E8F0" />

        {/* Bar Chart Widget (Bottom Right) */}
        <rect x="125" y="195" width="70" height="62" rx="10" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
        {/* Vertical bars */}
        <rect x="136" y="228" width="8" height="20" rx="4" fill="#C7D2FE" />
        <rect x="149" y="220" width="8" height="28" rx="4" fill="#A5B4FC" />
        <rect x="162" y="212" width="8" height="36" rx="4" fill="#818CF8" />
        <rect x="175" y="205" width="8" height="43" rx="4" fill="#6366F1" />

        {/* Green Checkmark Circle Badge (Floating on Right Edge) */}
        <g transform="translate(195, 125)">
          <circle cx="12" cy="12" r="14" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" filter="url(#shadowLeft)" />
          <path d="M7 12 L10.5 15.5 L17 9" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Right 3D AI Analysis Card Illustration Component (Matching Reference Image)
// ─────────────────────────────────────────────────────────────────────────────
const RightAIAnalysisIllustration = () => (
  <div className="relative w-68 xl:w-76 select-none pointer-events-none drop-shadow-xl flex flex-col items-center">
    {/* Upper 3D Tilted Card */}
    <div className="w-full bg-white/95 backdrop-blur-md rounded-3xl p-5 border border-gray-100 shadow-[0_16px_36px_rgba(79,70,229,0.14)] transform rotate-2 transition-transform">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs font-extrabold text-gray-800 tracking-tight">AI Analysis</span>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Circular Donut Ring (85% Match Score) */}
        <div className="relative w-20 h-20 xl:w-22 xl:h-22 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            {/* Background Track */}
            <circle cx="40" cy="40" r="32" fill="none" stroke="#EEF2F6" strokeWidth="7" />
            {/* 85% Gradient Stroke */}
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="url(#donutGrad)"
              strokeWidth="7"
              strokeDasharray={201}
              strokeDashoffset={201 * (1 - 0.85)}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="donutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06B6D4" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-black text-gray-900 leading-none">85<span className="text-xs font-bold text-gray-500">%</span></span>
            <span className="text-[9px] font-bold text-gray-400 mt-0.5">Match Score</span>
          </div>
        </div>

        {/* 4 Colored Horizontal Pill Bars */}
        <div className="flex-1 space-y-2">
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-rose-400 h-full rounded-full" style={{ width: '90%' }} />
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-teal-400 h-full rounded-full" style={{ width: '75%' }} />
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-sky-400 h-full rounded-full" style={{ width: '85%' }} />
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: '65%' }} />
          </div>
        </div>
      </div>
    </div>

    {/* Floating Pill Badges (Cascading Below with Curving Arrow) */}
    <div className="w-full flex flex-col items-end pr-2 mt-4 space-y-2 relative">
      {/* Badge 1: Skills Matched */}
      <div className="bg-white/95 backdrop-blur-xs border border-emerald-100 rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-2 transform -rotate-1">
        <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
          ✓
        </span>
        <span className="text-[11px] font-extrabold text-emerald-800 tracking-tight">Skills Matched</span>
      </div>

      {/* Badge 2: AI Feedback */}
      <div className="bg-white/95 backdrop-blur-xs border border-blue-100 rounded-full px-3.5 py-1.5 shadow-sm flex items-center gap-2 transform rotate-1">
        <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">
          ★
        </span>
        <span className="text-[11px] font-extrabold text-blue-800 tracking-tight">AI Feedback</span>
      </div>

      {/* Floating Sparkles around right widget */}
      <div className="absolute -left-6 top-8">
        <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
      <div className="absolute right-0 -bottom-4">
        <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
        </svg>
      </div>
    </div>
  </div>
);

export default function Home() {
  const { auth, kv, isLoading } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate('/auth?next=/');
    }
  }, [isLoading, auth.isAuthenticated]);

  useEffect(() => {
    const loadUploadedResumes = async () => {
      try {
        setLoadingResumes(true);
        const result = await kv.list('resume:*', true);
        if (!result) {
          setLoadingResumes(false);
          return;
        }

        const parsedResumes: Resume[] = [];

        if (Array.isArray(result)) {
          for (const item of result) {
            try {
              if (typeof item === 'string') {
                const val = await kv.get(item);
                if (val) {
                  const parsed = JSON.parse(val);
                  parsed._kvKey = item;
                  if (!parsed.id) parsed.id = item.replace(/^resume:/, '');
                  parsedResumes.push(parsed);
                }
              } else if (item && typeof item === 'object') {
                const val = typeof item.value === 'string' ? JSON.parse(item.value) : item.value;
                if (val) {
                  val._kvKey = item.key;
                  if (!val.id) val.id = (item.key || '').replace(/^resume:/, '');
                  parsedResumes.push(val);
                }
              }
            } catch (err) {
              console.error("Failed to parse resume item:", err);
            }
          }
        }

        // Show newest uploads first
        parsedResumes.reverse();

        // Deduplicate: Keep only the latest submission if the same resume is uploaded multiple times
        const seen = new Set<string>();
        const uniqueResumes: Resume[] = [];

        for (const resume of parsedResumes) {
          if (!resume || !resume.id) continue;

          const fileName = (resume.resumePath || '').split('/').pop() || '';
          const company = (resume.companyName || '').trim().toLowerCase();
          const job = (resume.jobTitle || '').trim().toLowerCase();

          const dedupeKey = `${company}|${job}|${fileName}`;

          if (!seen.has(dedupeKey)) {
            seen.add(dedupeKey);
            uniqueResumes.push(resume);
          }
        }

        // Limit to up to 3 distinct resumes
        setResumes(uniqueResumes.slice(0, 3));
      } catch (e) {
        console.error("Error loading resumes from KV:", e);
      } finally {
        setLoadingResumes(false);
      }
    };

    if (auth.isAuthenticated) {
      loadUploadedResumes();
    }
  }, [auth.isAuthenticated]);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen pb-16 font-sans">
      <Navbar />

      <section className="flex flex-col items-center pt-6 max-sm:mx-3 mx-4 md:mx-8 xl:mx-12">
        {/* Main 3-Column Hero Presentation (Matching Reference Image) */}
        <div className="w-full max-w-[1550px] mx-auto flex items-start justify-center lg:justify-between gap-4 xl:gap-8 pt-2">
          {/* ───────────────────────────────────────────────────────────── */}
          {/* Left Column: Hand-drawn text + arrow + 3D Resume Sheet */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col items-start shrink-0 w-60 xl:w-72 pt-4">
            {/* Playful Handwritten Annotation with Arrow */}
            <div className="flex flex-col items-start -rotate-12 mb-3 select-none pointer-events-none ml-2">
              <span className="text-[#818CF8] font-[Caveat] text-xl xl:text-2xl font-bold leading-tight text-left">
                Better<br />
                Resumes<br />
                Brighter<br />
                Opportunities ✨
              </span>
              <svg className="w-12 h-8 text-[#818CF8] mt-1 ml-4" viewBox="0 0 50 30" fill="none" stroke="currentColor">
                <path d="M5 5 C 20 20, 35 25, 45 20" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M45 20 L 40 12 M 45 20 L 36 22" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>

            {/* 3D Stacked Resume Illustration */}
            <LeftResumeIllustration />
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* Center Column: Title, Subtitle, 3 Action Cards, Empty State */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col items-center text-center max-w-3xl pt-2">
            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-tight leading-[1.12]">
              <span className="text-gray-900">Track your </span>
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Applications &
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Resume Ratings
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-3.5 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
              Upload your resume and get AI powered insights across multiple job opportunities.
            </p>

            {/* 2 Action Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-2xl mx-auto mt-6 w-full">
              {/* Card 1: Upload Resume */}
              <Link
                to="/upload"
                className="bg-white/95 backdrop-blur-xs border border-gray-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">Upload Resume</p>
                    <p className="text-[11px] text-gray-400 font-medium">Use your latest resume to get started</p>
                  </div>
                </div>
                <span className="text-indigo-500 font-bold text-sm group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>

              {/* Card 2: Get AI Insights */}
              <Link
                to="/upload"
                className="bg-white/95 backdrop-blur-xs border border-gray-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs hover:shadow-md hover:border-indigo-200 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-extrabold text-gray-900 group-hover:text-indigo-600 transition-colors">Get AI Insights</p>
                    <p className="text-[11px] text-gray-400 font-medium">See match score & personalized feedback</p>
                  </div>
                </div>
                <span className="text-indigo-500 font-bold text-sm group-hover:translate-x-0.5 transition-transform">→</span>
              </Link>
            </div>

            {/* Empty State / Resumes Section */}
            {loadingResumes ? (
              <div className="flex flex-col items-center justify-center p-12">
                <img src="/images/resume-scan.gif" alt="Loading..." className="w-16 h-16" />
                <p className="text-gray-500 mt-2 text-xs font-medium">Loading your submissions...</p>
              </div>
            ) : resumes.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-6 w-full max-w-[1100px] mt-7">
                {resumes.map((resume) => (
                  <ResumeCard
                    key={resume.id}
                    resume={resume}
                    onDelete={(deletedId) => setResumes((prev) => prev.filter((r) => r.id !== deletedId))}
                  />
                ))}
              </div>
            ) : (
              /* Dashed Empty State Box (Matching Reference Image) */
              <div className="w-full max-w-xl mx-auto border-2 border-dashed border-indigo-200/90 rounded-3xl p-7 sm:p-9 bg-white/60 backdrop-blur-xs text-center shadow-xs flex flex-col items-center justify-center mt-7">
                {/* Cloud upload icon inside soft circle */}
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-2xs">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 tracking-tight">
                  No resumes uploaded yet.
                </h3>
                <p className="text-xs text-gray-500 font-medium max-w-md mx-auto mt-1 mb-5 leading-relaxed">
                  Upload your first resume to see AI-powered insights, match scores and personalized feedback.
                </p>

                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm px-7 py-2.5 rounded-full shadow-md shadow-indigo-500/25 transition select-none cursor-pointer"
                >
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <span>Upload Your First Resume</span>
                </Link>
              </div>
            )}
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* Right Column: Hand-drawn text + arrow + 3D AI Analysis Card */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col items-end shrink-0 w-64 xl:w-76 pt-2">
            {/* Playful Handwritten Annotation with Arrow */}
            <div className="flex flex-col items-end rotate-6 mb-2 select-none pointer-events-none mr-2">
              <svg className="w-8 h-6 text-[#60A5FA] mb-0.5" viewBox="0 0 40 30" fill="none" stroke="currentColor">
                <path d="M5 25 C 10 10, 25 5, 35 10" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M35 10 L 28 8 M 35 10 L 32 17" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span className="text-[#60A5FA] font-[Caveat] text-xl xl:text-2xl font-bold leading-tight text-right">
                Your next<br />
                opportunity<br />
                is closer!
              </span>
              <svg className="w-12 h-10 text-[#60A5FA] mt-1 mr-4" viewBox="0 0 50 40" fill="none" stroke="currentColor">
                <path d="M40 5 C 35 25, 20 30, 10 32" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M10 32 L 18 27 M 10 32 L 16 37" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>

            {/* 3D AI Analysis Card & Floating Badges */}
            <RightAIAnalysisIllustration />
          </div>
        </div>
      </section>
    </main>
  );
}
