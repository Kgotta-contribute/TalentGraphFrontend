import React from 'react';

export const MicrosoftLogo: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 21 21">
    <rect x="1" y="1" width="9" height="9" fill="#F25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
    <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
  </svg>
);

export const OpenAILogo: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0 fill-current text-gray-900' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1683a.071.071 0 0 1 .038.052v5.5826a4.5045 4.5045 0 0 1-4.4945 4.4947zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1683a.0757.0757 0 0 1-.071 0l-4.8303-2.7866A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6669zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1635a.0804.0804 0 0 1-.038-.0567V6.0748a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.4598a.7948.7948 0 0 0-.3927.6813l-.0048 6.7219zm1.0977-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

export const NextJSLogo: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0 fill-current text-black' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="black" />
    <path d="M16.5 17.5L8.5 7H7v10h1.5V9.5l7 8h1z" fill="white" />
    <rect x="14.5" y="7" width="1.5" height="6.5" fill="white" />
  </svg>
);

export const FastAPILogo: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5 shrink-0' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#009688" />
    <path d="M11.64 4.5L7 13.5h4.5L10.5 19.5l6.5-9H12.5l1.5-6h-2.36z" fill="white" />
  </svg>
);

export const LangChainLogo: React.FC<{ className?: string }> = () => (
  <span className="text-xs leading-none select-none">🦜</span>
);

export const GitHubOctocatIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 fill-current text-gray-900' }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const BrandLogo: React.FC<{ type: string; className?: string }> = ({ type, className }) => {
  switch (type.toLowerCase()) {
    case 'microsoft':
      return <MicrosoftLogo className={className} />;
    case 'openai':
      return <OpenAILogo className={className} />;
    case 'nextjs':
      return <NextJSLogo className={className} />;
    case 'fastapi':
      return <FastAPILogo className={className} />;
    case 'langchain':
      return <LangChainLogo className={className} />;
    case 'github':
      return <GitHubOctocatIcon className={className} />;
    default:
      return <span>📦</span>;
  }
};

export const SessionIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'github':
      return <GitHubOctocatIcon className="w-4 h-4 fill-current text-gray-900" />;
    case 'lock':
      return <span className="text-blue-600 text-sm">🔒</span>;
    case 'database':
      return <span className="text-indigo-600 text-sm">🗄️</span>;
    case 'code':
      return <span className="text-slate-800 text-xs font-mono font-bold">&lt;/&gt;</span>;
    case 'cloud':
      return <span className="text-sky-500 text-sm">☁️</span>;
    default:
      return <span>💬</span>;
  }
};

export const RobotMascot: React.FC = () => (
  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex items-center justify-center select-none">
    {/* Floating sparkles */}
    <span className="absolute -top-1 -left-1 text-indigo-400 text-xs animate-bounce select-none">✦</span>
    <span className="absolute top-1 -right-2 text-purple-400 text-sm animate-pulse select-none">✨</span>
    <span className="absolute -bottom-1 -left-2 text-blue-400 text-sm animate-pulse select-none">★</span>
    <span className="absolute bottom-2 -right-1 text-indigo-300 text-xs select-none">✦</span>

    {/* Glow shadow */}
    <div className="absolute inset-2 bg-gradient-to-tr from-indigo-200 to-purple-200 rounded-full blur-md opacity-60 animate-pulse" />

    {/* SVG 3D-feel Robot Mascot */}
    <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-sm">
      <defs>
        <linearGradient id="robotHeadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#F0F4FF" />
          <stop offset="100%" stopColor="#D5DEFB" />
        </linearGradient>
        <linearGradient id="antennaSphere" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
        <linearGradient id="robotScreen" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="eyeColor" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <rect x="47.5" y="10" width="5" height="12" rx="2.5" fill="#94A3B8" />
      <circle cx="50" cy="9" r="6" fill="url(#antennaSphere)" />
      <circle cx="50" cy="9" r="2" fill="#E0E7FF" />

      {/* Ears */}
      <rect x="14" y="38" width="6" height="14" rx="3" fill="#818CF8" />
      <rect x="80" y="38" width="6" height="14" rx="3" fill="#818CF8" />

      {/* Head chassis */}
      <rect x="18" y="20" width="64" height="52" rx="20" fill="url(#robotHeadGrad)" stroke="#CBD5E1" strokeWidth="2.5" />

      {/* Screen visor */}
      <rect x="25" y="27" width="50" height="38" rx="13" fill="url(#robotScreen)" />

      {/* Eyes */}
      <ellipse cx="39" cy="45" rx="5.5" ry="7" fill="url(#eyeColor)" />
      <circle cx="41" cy="42" r="2" fill="#FFFFFF" />

      <ellipse cx="61" cy="45" rx="5.5" ry="7" fill="url(#eyeColor)" />
      <circle cx="63" cy="42" r="2" fill="#FFFFFF" />

      {/* Friendly smile */}
      <path d="M 44 55 Q 50 60 56 55" fill="none" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" />

      {/* Rosy cheeks */}
      <circle cx="31" cy="53" r="3" fill="#F472B6" opacity="0.75" />
      <circle cx="69" cy="53" r="3" fill="#F472B6" opacity="0.75" />
    </svg>
  </div>
);
