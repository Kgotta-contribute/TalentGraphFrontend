export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume-1.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume-2.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume-3.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume-1.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume-2.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume-3.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
{
  "overallScore": number, // 0-100 overall score
  "recruiterRead": {
    "detectedRole": string, // e.g. "Full-Stack Software Engineer (AI/ML focus)"
    "seniorityLevel": string, // e.g. "Mid-Level (~1.5 yrs experience + internship, strong feature delivery, no team leadership)"
    "shortlistOdds": "Strong" | "Borderline" | "Low",
    "summary": string, // 2-3 sentence executive recruiter verdict
    "strongestHighlight": string // Candidate's single most impressive achievement/bullet
  },
  "ATS": {
    "score": number, // ATS score 0-100
    "parseHealth": number, // e.g. 95-100%
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string
      }
    ]
  },
  "actionVerbRepetition": [
    {
      "verb": string, // e.g. "Developed", "Engineered", "Implemented"
      "count": number, // count of times this verb starts a bullet (e.g. 4)
      "suggestedReplacements": string[], // 3-4 powerful synonyms e.g. ["Architected", "Spearheaded", "Constructed"]
      "lines": string[] // 1-2 excerpt lines using this verb
    }
  ],
  "quantifiedMetrics": {
    "totalBullets": number, // total count of bullets across experience & projects
    "quantifiedCount": number, // count of bullets with measurable metrics/numbers/percentages
    "percentage": number, // (quantifiedCount / totalBullets) * 100
    "unquantifiedBullets": [
      {
        "original": string, // the weak unquantified line from the resume
        "rewrite": string, // concrete high-impact rewritten line with metric placeholders like [X%] or [$Y]
        "suggestion": string // what metric to add (e.g. "Add throughput, latency reduction, or team scale")
      }
    ]
  },
  "buzzwords": [
    {
      "word": string, // e.g. "dynamic", "highly motivated", "results-driven"
      "whyAvoid": string, // why recruiters consider this cliché / vague
      "beforeExample": string, // excerpt showing the buzzword
      "afterExample": string // rewritten version with hard evidence
    }
  ],
  "careerArc": [
    {
      "period": string, // e.g. "2020 - 2024", "09/2024 - Present"
      "title": string, // e.g. "B.E. in Information Science", "Associate Software Engineer", "ClarityAI"
      "organization": string, // e.g. "NMIT Bangalore", "Carelon Global Solutions"
      "isFlagged": boolean, // true ONLY if there is an impossible chronological inconsistency (e.g. end date precedes start date)
      "flagReason": string // explanation if flagged e.g. "End date precedes start date"
    }
  ],
  "marketSkillGaps": [
    {
      "skill": string, // e.g. "CI/CD", "Kubernetes", "Microservices", "Cosmos DB", "Distributed Systems"
      "frequencyPercent": number, // e.g. 26, 19, 14
      "whyRelevant": string // explanation of how this maps to target role/market
    }
  ],
  "passedChecks": [
    {
      "title": string, // e.g. "Reverse Chronological Order", "Bullet Point Length", "Contact Information Present"
      "description": string // e.g. "All work history is structured from most recent to oldest."
    }
  ],
  "interviewQuestions": [
    string // 4-5 tailored technical/behavioral interview questions triggered by this resume
  ],
  "toneAndStyle": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  },
  "content": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  },
  "structure": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  },
  "skills": {
    "score": number,
    "tips": [
      {
        "type": "good" | "improve",
        "tip": string,
        "explanation": string
      }
    ]
  }
}`;

export const prepareInstructions = ({
                                        jobTitle,
                                        jobDescription,
                                        resumeText,
                                    }: {
    jobTitle: string;
    jobDescription: string;
    resumeText?: string;
}) =>
    `You are an elite ATS resume audit engine and hiring manager evaluator (like Resume Worded, Enhancv, and Resumly.ai).
  Perform a deep, data-driven diagnostic of this resume against industry standards and the target job description.

  CRITICAL DIAGNOSTIC CHECKS:
  1. Action Verb Repetition: Count starting action verbs (e.g. "Developed", "Engineered", "Implemented", "Built"). If any verb is repeated more than 2 times, list its exact frequency, lines, and 3-4 synonym replacements.
  2. Quantified Impact Ratio: Count the EXACT number of total bullet points and how many contain concrete measurable numbers (%, ms, $, scale, users, accuracy). Target is 50-75%+. Extract unquantified bullets and write high-impact "Before ➔ After" rewrites with bracketed metric suggestions [X%].
  3. Buzzwords & Clichés: Detect vague words (e.g., "dynamic", "cutting-edge", "highly motivated", "results-driven", "team player") and provide before/after examples.
  4. Recruiter 7-Second Read: Assess detected candidate archetype, seniority level, and shortlist odds. Extract the single strongest highlight.
  5. Career Arc Timeline: Order the candidate's career steps chronologically. Note: The current year is 2026. Do NOT flag dates in 2026 or earlier as future dates or anomalies. ONLY flag an entry if there is a genuine timeline impossibility (e.g., end date precedes start date, or dates beyond 2027).
  6. Market Skill Gaps: Identify in-demand skills relevant to the role/job description that are missing from the resume, along with estimated posting frequency percentages.
  7. Passed Checks: Highlight 3-5 structural & stylistic checks the candidate passed (e.g., clean hierarchy, single column layout, proper verb tenses).
  8. Interview Questions: Generate 4-5 tough interview questions directly triggered by specific claims on the resume.

  Target Job Title: ${jobTitle || 'Software Engineer'}
  Target Job Description: ${jobDescription || 'General Tech Role'}

  ${resumeText ? `Resume Content:\n"""\n${resumeText}\n"""\n` : ''}

  Provide the feedback strictly as a valid JSON object matching this schema:
  ${AIResponseFormat}

  Return ONLY the JSON object, without markdown code fences, backticks, or any additional text.`;