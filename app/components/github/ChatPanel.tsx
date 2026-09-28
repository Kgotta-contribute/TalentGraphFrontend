import React, { useState, useEffect, useRef } from 'react';
import MarkdownViewer from '~/components/talent-agent/MarkdownViewer';
import { RobotMascot, SessionIcon } from '~/components/icons/BrandIcons';
import { analyzeGitHubRepoChat } from '~/lib/talentAgentApi';

export interface ChatSessionItem {
  id: string;
  title: string;
  iconType: 'github' | 'lock' | 'database' | 'code' | 'cloud';
  messageCount: number;
  timeAgo: string;
  messages: GitHubChatMessage[];
}

export function generateSessionMeta(query: string): { title: string; iconType: ChatSessionItem['iconType'] } {
  const q = query.toLowerCase();

  if (/\b(auth|jwt|token|login|password|oauth|session|security|credential|permission|rbac)\b/.test(q)) {
    return { title: 'Authentication & Security', iconType: 'lock' };
  }
  if (/\b(rag|vector|embed|retriev|chroma|pinecone|faiss|pgvector)\b/.test(q)) {
    return { title: 'RAG & Vector Pipeline', iconType: 'database' };
  }
  if (/\b(database|postgres|mysql|sqlite|prisma|sqlalchemy|redis|migration|model|schema|table)\b/.test(q)) {
    return { title: 'Database & Data Models', iconType: 'database' };
  }
  if (/\b(api|endpoint|route|router|controller|fastapi|express|rest|graphql)\b/.test(q)) {
    return { title: 'API Endpoints & Routing', iconType: 'code' };
  }
  if (/\b(deploy|ci\/cd|cicd|docker|action|kubernetes|k8s|cloud|aws|gcp|vercel|infra|helm)\b/.test(q)) {
    return { title: 'Deployment & CI/CD', iconType: 'cloud' };
  }
  if (/\b(folder|structure|architecture|directory|tree|overview|design|components)\b/.test(q)) {
    return { title: 'Architecture & Structure', iconType: 'github' };
  }
  if (/\b(test|coverage|lint|quality|benchmark|performance|type)\b/.test(q)) {
    return { title: 'Code Quality & Testing', iconType: 'code' };
  }
  if (/\b(depend|package|library|requirements|npm|pip|cargo)\b/.test(q)) {
    return { title: 'Dependencies & Ecosystem', iconType: 'code' };
  }

  const clean = query.replace(/[?!.,;:]+$/, '').trim();
  const truncated = clean.length > 34 ? clean.slice(0, 34).replace(/\s+\S*$/, '') + '...' : clean;
  const formatted = truncated.charAt(0).toUpperCase() + truncated.slice(1);
  return { title: formatted || 'Repository Exploration', iconType: 'code' };
}

const EXAMPLE_QUESTIONS = [
  {
    icon: '🔒',
    iconBg: 'bg-blue-50 text-blue-600',
    question: 'How does authentication work in this project?',
  },
  {
    icon: '🗄️',
    iconBg: 'bg-indigo-50 text-indigo-600',
    question: 'Where is the RAG pipeline implemented?',
  },
  {
    icon: '💾',
    iconBg: 'bg-blue-50 text-blue-600',
    question: 'What databases and external services are used?',
  },
  {
    icon: '📁',
    iconBg: 'bg-amber-50 text-amber-600',
    question: 'What is the folder structure and purpose of each directory?',
  },
  {
    icon: '</>',
    iconBg: 'bg-slate-100 text-slate-700',
    question: 'Explain the main API endpoints and their purpose',
  },
  {
    icon: '☁️',
    iconBg: 'bg-sky-50 text-sky-600',
    question: 'How is the project deployed (Infra, CI/CD)?',
  },
];

interface ChatPanelProps {
  result: GitHubHarnessResult;
  inputUrl?: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ result, inputUrl }) => {
  const repoStorageKey = `talent_agent_github_chat_${result.repo_info?.full_name || 'default'}`;

  const [sessions, setSessions] = useState<ChatSessionItem[]>(() => {
    try {
      const raw = localStorage.getItem(repoStorageKey);
      if (raw) return JSON.parse(raw);
      const fallback = localStorage.getItem('talent_agent_github_chat_sessions');
      return fallback ? JSON.parse(fallback) : [];
    } catch {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<GitHubChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Persist sessions to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(repoStorageKey, JSON.stringify(sessions));
      localStorage.setItem('talent_agent_github_chat_sessions', JSON.stringify(sessions));
    } catch {
      // ignore quota errors
    }
  }, [sessions, repoStorageKey]);

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    const session = sessions.find((s) => s.id === id);
    if (session) {
      setChatMessages(session.messages || []);
    }
  };

  const handleNewChat = () => {
    setActiveSessionId(null);
    setChatMessages([]);
    setChatInput('');
  };

  const handleDeleteSession = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      if (activeSessionId === id) {
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
          setChatMessages(remaining[0].messages || []);
        } else {
          setActiveSessionId(null);
          setChatMessages([]);
        }
      }
      return remaining;
    });
  };

  const handleChatSend = async (queryOverride?: string) => {
    const question = (queryOverride || chatInput).trim();
    if (!question || !result) return;
    setChatInput('');

    const newUserMsg: GitHubChatMessage = { role: 'user', content: question, timestamp: Date.now() };
    const currentMessages = [...chatMessages, newUserMsg];
    setChatMessages(currentMessages);
    setChatLoading(true);

    let targetSessionId = activeSessionId;
    const existingSession = sessions.find((s) => s.id === targetSessionId);

    if (!targetSessionId || !existingSession) {
      const meta = generateSessionMeta(question);
      const newSessionId = `session-${Date.now()}`;
      targetSessionId = newSessionId;
      const newSession: ChatSessionItem = {
        id: newSessionId,
        title: meta.title,
        iconType: meta.iconType,
        messageCount: 1,
        timeAgo: 'Just now',
        messages: currentMessages,
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSessionId);
    } else {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== targetSessionId) return s;
          const meta = s.messageCount === 0 ? generateSessionMeta(question) : { title: s.title, iconType: s.iconType };
          return {
            ...s,
            title: meta.title,
            iconType: meta.iconType,
            messageCount: currentMessages.length,
            timeAgo: 'Just now',
            messages: currentMessages,
          };
        })
      );
    }

    try {
      const repoCtx = {
        file_tree: result.file_tree,
        source_code_samples: result.source_code_samples,
        readme: result.readme,
        manifest_files: result.manifest_files,
      };
      const targetUrl = result.repo_url || inputUrl || result.repo_info?.html_url || '';
      const resp = await analyzeGitHubRepoChat(targetUrl, question, repoCtx as Record<string, unknown>);
      const assistantMsg: GitHubChatMessage = {
        role: 'assistant',
        content: resp.answer,
        evidence_files: resp.evidence_files,
        confidence: resp.confidence,
        tools_used: resp.tools_used,
        timestamp: Date.now(),
      };

      const finalMessages = [...currentMessages, assistantMsg];
      setChatMessages(finalMessages);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                messageCount: finalMessages.length,
                timeAgo: 'Just now',
                messages: finalMessages,
              }
            : s
        )
      );
    } catch (e: unknown) {
      const errMsg: GitHubChatMessage = {
        role: 'assistant',
        content: `Error: ${e instanceof Error ? e.message : 'Chat agent failed.'}`,
        timestamp: Date.now(),
      };
      const finalMessages = [...currentMessages, errMsg];
      setChatMessages(finalMessages);

      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId
            ? {
                ...s,
                messageCount: finalMessages.length,
                timeAgo: 'Just now',
                messages: finalMessages,
              }
            : s
        )
      );
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left Column: Chat Sessions */}
      <div className="w-full lg:w-72 shrink-0 bg-white/80 border border-gray-200/90 rounded-2xl p-4 shadow-2xs">
        {/* Header */}
        <div className="flex items-center justify-between mb-3.5 px-1">
          <h4 className="text-xs font-bold text-gray-900 tracking-tight">Chat Sessions</h4>
          <button
            onClick={handleNewChat}
            className="px-2.5 py-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/90 rounded-lg flex items-center gap-1 transition cursor-pointer"
          >
            <span className="font-black">+</span>
            <span>New Chat</span>
          </button>
        </div>

        {/* Sessions list */}
        <div className="space-y-1.5">
          {sessions.length === 0 ? (
            <div className="py-7 px-3 text-center border border-dashed border-gray-200/90 rounded-2xl bg-gray-50/60">
              <div className="w-8 h-8 mx-auto mb-2 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-sm">
                💬
              </div>
              <p className="text-xs font-bold text-gray-700">No chat sessions yet</p>
              <p className="text-[11px] text-gray-400 mt-1 leading-snug">
                Ask a question below or choose an example to start.
              </p>
            </div>
          ) : (
            sessions.map((s: ChatSessionItem) => {
              const isSelected = activeSessionId === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSession(s.id)}
                  className={`w-full text-left p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 select-none group relative ${
                    isSelected
                      ? 'bg-white border-indigo-300 ring-2 ring-indigo-200 shadow-xs'
                      : 'bg-transparent border-transparent hover:bg-gray-50/90 hover:border-gray-200 text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-indigo-50/90' : 'bg-gray-100/80'
                      }`}
                    >
                      <SessionIcon type={s.iconType} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-xs font-bold truncate leading-tight ${
                          isSelected ? 'text-indigo-950 font-black' : 'text-gray-800'
                        }`}
                      >
                        {s.title}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
                        {s.messageCount} messages • {s.timeAgo}
                      </p>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={(e) => handleDeleteSession(s.id, e)}
                    title="Delete session"
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shrink-0 cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Studio / Conversation */}
      <div className="flex-1 w-full space-y-5 min-w-0">
        {/* Hero Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pt-1">
          <RobotMascot />
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Chat with Your GitHub Repository</h2>
            <p className="text-xs text-gray-600 leading-relaxed font-mono">
              Ask questions about the codebase, architecture, implementation details, dependencies, or any technical
              aspects. The agent uses GitHub MCP tools to fetch real evidence from the repository.
            </p>
          </div>
        </div>

        {/* 4 Feature Capability Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-50/80 text-emerald-600 flex items-center justify-center shrink-0 text-sm">
              🔍
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-medium text-gray-500">Search code</h4>
              <p className="text-[10px] text-gray-400 truncate">Find relevant files & functions</p>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-purple-50/80 text-purple-600 flex items-center justify-center shrink-0 text-sm">
              📄
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-medium text-gray-500">Read files</h4>
              <p className="text-[10px] text-gray-400 truncate">Get exact code context</p>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0 text-sm">
              🔗
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-medium text-gray-500">Analyze architecture</h4>
              <p className="text-[10px] text-gray-400 truncate">Understand system design</p>
            </div>
          </div>

          <div className="bg-slate-50/70 border border-slate-200/60 rounded-2xl p-3 flex items-center gap-2.5 shadow-2xs">
            <div className="w-8 h-8 rounded-xl bg-amber-50/80 text-amber-600 flex items-center justify-center shrink-0 text-sm">
              ⚡
            </div>
            <div className="min-w-0">
              <h4 className="text-[11px] font-medium text-gray-500">Answer with evidence</h4>
              <p className="text-[10px] text-gray-400 truncate">Cite files, paths & line numbers</p>
            </div>
          </div>
        </div>

        {/* Distinct Visual Separation Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="w-full border-t border-gray-200/80" />
          <div className="absolute bg-white px-3 flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider select-none">
            <span>💬</span>
            <span>Prompt Starters</span>
          </div>
        </div>

        {/* 6 Example Questions */}
        <div className="bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 border border-indigo-100 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
              <h4 className="text-xs font-black text-gray-900 tracking-tight">Try these example questions</h4>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200/60">
                Instant Analysis
              </span>
            </div>
            <span className="text-[11px] text-indigo-600 font-bold hidden sm:inline-flex items-center gap-1">
              Click to ask <span className="font-black">→</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {EXAMPLE_QUESTIONS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleChatSend(item.question)}
                className="bg-white hover:bg-indigo-50/40 border border-indigo-100/90 hover:border-indigo-400 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-left transition-all duration-200 shadow-2xs hover:shadow-md group cursor-pointer hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0 text-sm font-bold shadow-2xs group-hover:scale-110 transition-transform`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-xs font-semibold text-gray-800 group-hover:text-indigo-700 line-clamp-2 leading-snug transition-colors">
                    {item.question}
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full bg-gray-100/80 group-hover:bg-indigo-600 text-gray-400 group-hover:text-white flex items-center justify-center transition-all shrink-0 text-xs font-black shadow-2xs group-hover:translate-x-0.5">
                  ›
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Messages stream */}
        {chatMessages.length > 0 && (
          <div className="max-h-[500px] min-h-[160px] overflow-y-auto space-y-4 pr-1 pt-2 border-t border-gray-100">
            {chatMessages.map((msg: GitHubChatMessage, i: number) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-2xl px-5 py-4 text-xs transition-all shadow-xs ${
                    msg.role === 'user'
                      ? 'max-w-[80%] bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white font-mono'
                      : 'w-full max-w-[98%] bg-white border border-gray-200/90 text-gray-800 font-sans'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.content}</p>
                  ) : (
                    <MarkdownViewer content={msg.content} />
                  )}
                  {msg.evidence_files && msg.evidence_files.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 font-mono">
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Evidence:</span>
                      {msg.evidence_files.map((f: string, j: number) => (
                        <span
                          key={j}
                          className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded font-medium"
                        >
                          📄 {f}
                        </span>
                      ))}
                    </div>
                  )}
                  {msg.confidence !== undefined && (
                    <div className="mt-2 text-[10px] text-gray-400 font-mono flex items-center justify-between">
                      <span>
                        Confidence: <strong className="text-emerald-600 font-bold">{Math.round(msg.confidence * 100)}%</strong>{' '}
                        · MCP calls: {msg.tools_used}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-500 flex items-center gap-2 font-mono">
                  <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  <span>Fetching targeted evidence via GitHub MCP...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Input Bar */}
        <div className="bg-white border border-gray-200/90 rounded-2xl p-2 pl-4 flex items-center gap-3 shadow-xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition">
          <span className="text-indigo-500 text-base shrink-0 select-none">✨</span>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleChatSend()}
            placeholder='Ask about this repository... (e.g. "How does authentication work?")'
            className="flex-1 bg-transparent border-none text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none py-2 font-mono"
          />
          <button
            type="button"
            onClick={() => handleChatSend()}
            disabled={chatLoading || !chatInput.trim()}
            className="px-5 py-2.5 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs disabled:opacity-50 transition cursor-pointer"
          >
            <span>Send</span>
            <svg className="w-3.5 h-3.5 fill-current transform rotate-45" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;
