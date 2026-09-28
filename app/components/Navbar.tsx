import { Link, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";
import { useState, useRef, useEffect } from "react";

const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/[\s_.-]+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
};

const Navbar = () => {
    const location = useLocation();
    const { auth } = usePuterStore();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const displayName = auth.user?.username || "Guest";
    const initials = getInitials(displayName);

    const isHome = location.pathname === "/";
    const isCandidateMode = location.pathname === "/upload" || location.pathname.startsWith("/resume");
    const isRecruiterMode = location.pathname.startsWith("/recruiter");

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="navbar shadow-xs border border-gray-100/90 relative py-2 px-6 sm:px-8">
            {/* Left: Brand Logo + Vertical Divider */}
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-xs">
                        <span className="text-white font-black text-lg italic transform -skew-x-12 select-none">R</span>
                    </div>
                    <div className="flex items-center">
                        <span className="text-2xl font-black tracking-tight text-gray-900">Resume</span>
                        <span className="text-2xl font-black tracking-tight text-[#6366F1]">IQ</span>
                    </div>
                </Link>

                {/* Vertical Divider */}
                <div className="hidden lg:block h-6 w-px bg-gray-200 mx-1" />

                {/* 1. Home Pill */}
                <Link
                    to="/"
                    className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        isHome
                            ? "bg-[#F0EEFF] text-[#6366F1]"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                >
                    <svg className="w-4 h-4 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Home</span>
                </Link>
            </div>

            {/* Middle: Mode Cards (Matching Image 3 rounded pill cards with borders and shadow) */}
            <div className="hidden lg:flex items-center gap-3">
                {/* 2. Resume IQ - Candidate Mode Card */}
                <Link
                    to="/upload"
                    className={`bg-white border rounded-2xl px-3.5 py-1.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                        isCandidateMode
                            ? "border-indigo-300 shadow-[0_2px_8px_rgba(99,102,241,0.12)] ring-2 ring-indigo-50"
                            : "border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-indigo-200 hover:shadow-xs"
                    }`}
                >
                    <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14 2v6h6" />
                        <circle cx="12" cy="13" r="2" strokeWidth={1.8} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 18c0-1.5 1.34-2.5 3-2.5s3 1 3 2.5" />
                    </svg>
                    <div className="flex flex-col text-left leading-tight">
                        <span className="text-xs font-semibold text-gray-800">Resume IQ -</span>
                        <span className="text-xs font-semibold text-gray-800">Candidate Mode</span>
                    </div>
                </Link>

                {/* 3. Six Agents - Recruiter Mode Card */}
                <Link
                    to="/recruiter"
                    className={`bg-white border rounded-2xl px-3.5 py-1.5 flex items-center gap-2.5 transition-all cursor-pointer ${
                        isRecruiterMode
                            ? "border-indigo-300 shadow-[0_2px_8px_rgba(99,102,241,0.12)] ring-2 ring-indigo-50"
                            : "border-gray-200/90 shadow-[0_1px_3px_rgba(0,0,0,0.06)] hover:border-indigo-200 hover:shadow-xs"
                    }`}
                >
                    <svg className="w-5 h-5 text-gray-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div className="flex flex-col text-left leading-tight">
                        <span className="text-xs font-semibold text-gray-800">Six Agents -</span>
                        <span className="text-xs font-semibold text-gray-800">Recruiter Mode</span>
                    </div>
                </Link>
            </div>

            {/* Right Side: Upload + User Profile */}
            <div className="flex items-center gap-3">
                <Link
                    to="/upload"
                    className="bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-5 py-2 rounded-full font-medium shadow-sm hover:opacity-95 transition-opacity flex items-center gap-2.5 cursor-pointer"
                >
                    <svg className="w-5 h-5 text-white flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <div className="flex flex-col text-left leading-tight text-xs font-semibold text-white">
                        <span>Upload</span>
                        <span>Resume</span>
                    </div>
                </Link>

                {/* User Profile Pill & Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full bg-white border border-gray-200/80 hover:border-gray-300 shadow-2xs transition-all cursor-pointer"
                        title={displayName}
                    >
                        <div className="w-7 h-7 rounded-full bg-[#1E293B] text-white font-bold flex items-center justify-center text-xs flex-shrink-0">
                            {initials}
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-gray-800 hidden sm:inline max-w-[130px] truncate">
                            {displayName}
                        </span>
                        <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                            <div className="px-4 py-2 border-b border-gray-100">
                                <p className="text-xs text-gray-400">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                            </div>

                            {auth.isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        auth.signOut();
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Log Out
                                </button>
                            ) : (
                                <Link
                                    to="/auth"
                                    onClick={() => setMenuOpen(false)}
                                    className="block px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium transition-colors"
                                >
                                    Log In
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;