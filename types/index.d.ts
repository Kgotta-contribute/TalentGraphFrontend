interface Job {
    title: string;
    description: string;
    location: string;
    requiredSkills: string[];
}

interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
    createdAt?: string;
    _kvKey?: string;
}

interface Feedback {
    overallScore: number;
    recruiterRead?: {
        detectedRole: string;
        seniorityLevel: string;
        shortlistOdds: "Strong" | "Borderline" | "Low";
        summary: string;
        strongestHighlight?: string;
    };
    ATS: {
        score: number;
        parseHealth?: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    actionVerbRepetition?: {
        verb: string;
        count: number;
        suggestedReplacements: string[];
        lines?: string[];
    }[];
    quantifiedMetrics?: {
        totalBullets: number;
        quantifiedCount: number;
        percentage: number;
        unquantifiedBullets: {
            original: string;
            rewrite: string;
            suggestion?: string;
        }[];
    };
    buzzwords?: {
        word: string;
        whyAvoid: string;
        beforeExample: string;
        afterExample: string;
    }[];
    careerArc?: {
        period: string;
        title: string;
        organization?: string;
        isFlagged?: boolean;
        flagReason?: string;
    }[];
    marketSkillGaps?: {
        skill: string;
        frequencyPercent: number;
        whyRelevant: string;
    }[];
    passedChecks?: {
        title: string;
        description: string;
    }[];
    interviewQuestions?: string[];
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}