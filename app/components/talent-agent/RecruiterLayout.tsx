import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { getMandates, createMandate, deleteMandate } from '~/lib/talentAgentApi';
import { isTemplateMandate } from '~/lib/talentMandateTemplates';
import PythonSourceModal from './PythonSourceModal';

interface Props {
  children: React.ReactNode;
  mandateId?: string;
  candidateId?: string;
}

export default function RecruiterLayout({ children, mandateId, candidateId }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  const { mandates, setMandates, activeMandateId, setActiveMandateId, clearMandateOverride } = useTalentAgentStore();
  const [showPythonModal, setShowPythonModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [mandateDropdownOpen, setMandateDropdownOpen] = useState(false);
  const mandateDropdownRef = useRef<HTMLDivElement>(null);

  // New mandate form state
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Load mandates on mount
  useEffect(() => {
    getMandates()
      .then((data) => {
        setMandates(data);
        if (data.length > 0 && !activeMandateId) {
          // Only set a default if nothing is selected yet
          setActiveMandateId(mandateId || data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mandateDropdownRef.current && !mandateDropdownRef.current.contains(e.target as Node)) {
        setMandateDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMandateId = mandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');
  const activeMandate = mandates.find((m) => m.id === currentMandateId) || mandates[0];

  // Helper to format role and company name: "Role (Company)" or "Role" if company is blank
  const formatMandateLabel = (m?: any) => {
    if (!m) return 'Select Mandate';
    const role = (m.job_requirements?.role || m.title || '').trim() || 'Software Engineer';
    const company = (m.company || '').trim();
    return company ? `${role} (${company})` : role;
  };

  const switchMandate = (selectedId: string) => {
    setActiveMandateId(selectedId);
    if (location.pathname.includes('/job-description')) {
      navigate(`/recruiter/mandates/${selectedId}/job-description`);
    } else if (location.pathname.includes('/candidates') && !location.pathname.includes('/candidates/')) {
      navigate(`/recruiter/mandates/${selectedId}/candidates`);
    } else if (location.pathname.includes('/ranking')) {
      navigate(`/recruiter/mandates/${selectedId}/ranking`);
    } else if (location.pathname.includes('/github-mcp')) {
      navigate(`/recruiter/mandates/${selectedId}/github-mcp`);
    } else if (location.pathname.includes('/candidates/')) {
      navigate(`/recruiter/mandates/${selectedId}/ranking`);
    } else if (location.pathname.includes('/reports/')) {
      navigate(`/recruiter/mandates/${selectedId}/ranking`);
    } else {
      navigate('/recruiter');
    }
  };

  const handleCreateNewMandate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsCreating(true);
    try {
      let currentList = [...mandates];

      // Filter only user-added mandates (never evict the 5 load templates)
      const userMandates = currentList.filter((m) => !isTemplateMandate(m.id));

      // Sliding window — if user mandates reach 5 (total 10 in a row with the 5 templates),
      // evict the oldest user mandate to make room for the new one.
      if (userMandates.length >= 5) {
        const oldestUser = userMandates[userMandates.length - 1];
        try {
          await deleteMandate(oldestUser.id);
          clearMandateOverride(oldestUser.id);
        } catch {
          // If delete fails on backend, still evict from UI
        }
        currentList = currentList.filter((m) => m.id !== oldestUser.id);
      }

      const created = await createMandate({
        title: newTitle.trim(),
        company: newCompany.trim(),
      });
      setMandates([created, ...currentList]);
      setActiveMandateId(created.id);
      setShowCreateModal(false);
      setNewTitle('');
      setNewCompany('');
      navigate(`/recruiter/mandates/${created.id}/job-description`);
    } catch (err) {
      console.error('Failed to create mandate:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteCustomMandate = async (e: React.MouseEvent, targetId: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Delete this custom mandate?')) return;
    try {
      await deleteMandate(targetId);
      clearMandateOverride(targetId);
      const remaining = mandates.filter((m) => m.id !== targetId);
      setMandates(remaining);
      if (targetId === currentMandateId) {
        const fallback = remaining[0]?.id || 'a0000000-0000-0000-0000-000000000001';
        switchMandate(fallback);
      }
    } catch (err) {
      console.error('Failed to delete mandate:', err);
    }
  };

  // The tabs (including Page 6 GitHub MCP)
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      page: 'Page 1',
      path: '/recruiter',
      isActive: location.pathname === '/recruiter',
    },
    {
      id: 'job-description',
      label: 'Job Description',
      page: 'Page 2',
      path: `/recruiter/mandates/${currentMandateId}/job-description`,
      isActive: location.pathname.includes('/job-description'),
    },
    {
      id: 'candidates',
      label: 'Resume Upload',
      page: 'Page 3',
      path: `/recruiter/mandates/${currentMandateId}/candidates`,
      isActive: location.pathname.endsWith('/candidates'),
    },
    {
      id: 'ranking',
      label: 'Candidate Ranking',
      page: 'Page 4',
      path: `/recruiter/mandates/${currentMandateId}/ranking`,
      isActive: location.pathname.includes('/ranking'),
    },
    {
      id: 'candidate-detail',
      label: 'Candidate Details',
      page: 'Page 5',
      path: candidateId
        ? `/recruiter/mandates/${currentMandateId}/candidates/${candidateId}`
        : `/recruiter/mandates/${currentMandateId}/candidates/c0000000-0000-0000-0000-000000000001`,
      isActive: location.pathname.includes('/candidates/') && !location.pathname.endsWith('/candidates'),
    },
    {
      id: 'report',
      label: 'Recruitment Report',
      page: 'Page 6',
      path: candidateId
        ? `/recruiter/mandates/${currentMandateId}/reports/${candidateId}`
        : `/recruiter/mandates/${currentMandateId}/reports/c0000000-0000-0000-0000-000000000001`,
      isActive: location.pathname.includes('/reports/'),
    },
    {
      id: 'github-mcp',
      label: 'GitHub MCP',
      page: 'Page 7',
      path: `/recruiter/mandates/${currentMandateId}/github-mcp`,
      isActive: location.pathname.includes('/github-mcp'),
    },
  ];

  return (
    <div className="min-h-screen bg-[url('/images/bg-main.svg')] bg-cover text-gray-900 flex flex-col font-sans selection:bg-indigo-500/20">
      {/* Top Header Bar */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-[1700px] mx-auto px-6 py-3 flex flex-col gap-2.5">
          {/* Upper row: Brand, Active Mandate selector, Code button, Exit */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left: Brand + Badge + Subtitle */}
            <div className="flex items-center gap-3">
              <Link to="/recruiter" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <span className="text-white font-black text-xl italic select-none">R</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black tracking-tight text-gray-900">
                      Talent<span className="text-[#6366F1]">Graph</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-2xs flex items-center gap-1.5">
                      <svg className="w-3 h-3 text-indigo-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span>6-Agent Recruiter Mode</span>
                    </span>
                  </div>
                  <span className="text-[10px] tracking-wider uppercase text-gray-500 font-semibold">
                    AGENTIC RECRUITMENT PIPELINE · 6 Specialized Agents · LangGraph Orchestration
                  </span>
                </div>
              </Link>
            </div>

            {/* Center: Active Mandate Dropdown (IMG_5044 reference) */}
            <div className="relative" ref={mandateDropdownRef}>
              <button
                type="button"
                onClick={() => setMandateDropdownOpen(!mandateDropdownOpen)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-gray-200/90 hover:border-indigo-300 shadow-2xs transition-all cursor-pointer group max-w-full"
                title={formatMandateLabel(activeMandate)}
              >
                <span className="text-[11px] font-semibold text-gray-400 shrink-0">
                  Active Mandate:
                </span>
                <span className="text-xs sm:text-[13px] font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate max-w-[180px] sm:max-w-[280px] md:max-w-[360px] xl:max-w-[480px]">
                  {formatMandateLabel(activeMandate)}
                </span>
                <svg
                  className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ${
                    mandateDropdownOpen ? 'rotate-180 text-indigo-600' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu Popup */}
              {mandateDropdownOpen && (
                <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-80 sm:w-96 md:w-[460px] bg-white rounded-2xl shadow-xl border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">
                      Select Active Mandate
                    </p>
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                      {mandates.length} Available
                    </span>
                  </div>

                  <div className="max-h-80 sm:max-h-96 overflow-y-auto py-1 divide-y divide-gray-50">
                    {mandates.map((m) => {
                      const isSelected = m.id === currentMandateId;
                      const label = formatMandateLabel(m);
                      const isTpl = isTemplateMandate(m.id);
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setMandateDropdownOpen(false);
                            switchMandate(m.id);
                          }}
                          className={`w-full px-4 py-2.5 text-xs transition-colors flex items-center justify-between gap-3 cursor-pointer group ${
                            isSelected
                              ? 'bg-indigo-50/80 text-indigo-700 font-bold'
                              : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium'
                          }`}
                        >
                          <div className="flex flex-col truncate pr-2 flex-1 min-w-0">
                            <div className="flex items-center gap-2 truncate">
                              <span className="truncate">{label}</span>
                              {isTpl ? (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80 rounded shrink-0">
                                  Template
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 rounded shrink-0">
                                  Custom JD
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-gray-400 font-normal mt-0.5">
                              {m.job_requirements?.domain_tags?.slice(0, 3).join(' • ') || (m.status ? `Status: ${m.status.toUpperCase()}` : '')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0 font-bold shadow-xs">
                                ✓
                              </span>
                            )}
                            {!isTpl && (
                              <button
                                type="button"
                                onClick={(e) => handleDeleteCustomMandate(e, m.id)}
                                className="p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                                title="Delete this custom JD"
                              >
                                <svg
                                  className="w-4 h-4 text-gray-400 hover:text-red-600 transition-colors"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={1.8}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-1.5 border-t border-gray-100 px-3">
                    <button
                      type="button"
                      onClick={() => {
                        setMandateDropdownOpen(false);
                        setShowCreateModal(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-indigo-600 hover:bg-indigo-50 rounded-xl flex items-center gap-2 font-bold cursor-pointer transition-colors"
                    >
                      <span>+</span>
                      <span>Create New Mandate...</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Center / Right: Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Python Source Code Button */}
              <button
                onClick={() => setShowPythonModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-gray-50 text-indigo-600 border border-gray-200 transition shadow-2xs cursor-pointer"
              >
                <span>&lt;/&gt;</span>
                <span>Python Source Code</span>
              </button>

              {/* Back to Candidate Mode Link */}
              <Link
                to="/"
                className="text-xs text-gray-600 hover:text-indigo-600 px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 transition flex items-center gap-1 font-semibold shadow-2xs"
              >
                <span>←</span>
                <span>Resume IQ - Candidate Mode</span>
              </Link>
            </div>
          </div>

          {/* Lower row: 6 Navigation Tabs matching Candidate Mode Pill Navigation */}
          <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-gray-100 pt-2">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  tab.isActive
                    ? 'bg-white text-indigo-600 shadow-xs border border-indigo-100 font-bold'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 border border-transparent'
                }`}
              >
                {tab.isActive && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${tab.isActive ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.page}
                </span>
              </Link>
            ))}

            {/* GitHub Project Verification Link (in green box area) */}
            <a
              href="https://github.com/Kgotta-contribute/TalentGraphFrontend"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-900 hover:bg-black text-white transition-all shadow-xs shrink-0 group border border-gray-800 cursor-pointer"
              title="View Source on GitHub: Kgotta-contribute/TalentGraphFrontend"
            >
              <svg className="w-4 h-4 text-white fill-current group-hover:scale-110 transition-transform shrink-0" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span className="font-semibold text-xs tracking-tight">Kgotta-contribute</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-mono">GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1700px] mx-auto px-6 py-6 w-full flex-1">
        {children}
      </main>

      {/* Bottom Status Bar matching light aesthetic */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/80 text-[11px] text-gray-500 px-6 py-2.5 shadow-2xs">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              DB: Supabase PostgreSQL Active
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 text-indigo-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Vector Store: pgvector Index (1024 Chunks)
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1.5 text-blue-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Engine: LangGraph 6-Node Agentic Pipeline
            </span>
          </div>
          <div className="text-gray-400 font-medium">
            RESUME IQ · 6 AGENTS RECRUITER MODE
          </div>
        </div>
      </footer>

      {/* Python Source Code Modal */}
      <PythonSourceModal isOpen={showPythonModal} onClose={() => setShowPythonModal(false)} />

      {/* Create Mandate Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white border border-gray-200 rounded-3xl p-6 w-full max-w-md shadow-2xl font-sans">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-extrabold text-gray-900 text-base">Create New Recruitment Mandate</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateNewMandate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Job Role / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Machine Learning Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nexus Intelligence Labs (leave blank if none)"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 bg-white"
                />
                <p className="text-[11px] text-gray-400 mt-1 font-medium">
                  If provided, appears in brackets as Role (Company).
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newTitle.trim()}
                  className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl hover:opacity-95 transition disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isCreating ? 'Creating...' : 'Create & Open JD'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
