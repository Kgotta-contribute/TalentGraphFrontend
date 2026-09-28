const ScoreCircle = ({ score = 75, size = 70 }: { score: number; size?: number }) => {
    const stroke = 6;
    const radius = size / 2 - stroke;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.min(Math.max(score, 0), 100) / 100;
    const strokeDashoffset = circumference * (1 - progress);

    const isGood = score >= 70;
    const isMedium = score >= 50 && score < 70;

    return (
        <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
            <svg
                height={size}
                width={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#F1F3F9"
                    strokeWidth={stroke}
                    fill="transparent"
                />
                {/* Partial circle with gradient */}
                <defs>
                    <linearGradient id={`grad-${score}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        {isGood ? (
                            <>
                                <stop offset="0%" stopColor="#818CF8" />
                                <stop offset="100%" stopColor="#4F46E5" />
                            </>
                        ) : isMedium ? (
                            <>
                                <stop offset="0%" stopColor="#FBBF24" />
                                <stop offset="100%" stopColor="#F59E0B" />
                            </>
                        ) : (
                            <>
                                <stop offset="0%" stopColor="#F87171" />
                                <stop offset="100%" stopColor="#818CF8" />
                            </>
                        )}
                    </linearGradient>
                </defs>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={`url(#grad-${score})`}
                    strokeWidth={stroke}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                />
            </svg>

            {/* Score in center */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-bold text-xs text-gray-800 tracking-tight">{`${score}/100`}</span>
            </div>
        </div>
    );
};

export default ScoreCircle;