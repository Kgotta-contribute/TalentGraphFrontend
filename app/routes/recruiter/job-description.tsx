import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import RecruiterLayout from '~/components/talent-agent/RecruiterLayout';
import { getMandate, getMandates, saveJobDescription, analyzeJD, createMandate, deleteMandate } from '~/lib/talentAgentApi';
import { useTalentAgentStore } from '~/lib/talentAgentStore';
import { isTemplateMandate, getTemplateMandateId, getTemplateKeyFromId, TEMPLATE_MANDATES } from '~/lib/talentMandateTemplates';

const TEMPLATES = {
  'Tekion Senior Full-Stack': `TEKION COMPANY

We are seeking a Senior Full-Stack & AI Systems Engineer to architect and build our next-generation multi-agent LLM platform.

Key Responsibilities:
- Architect and maintain asynchronous Python/FastAPI microservices.
- Build multi-agent LLM & RAG retrieval systems with LangGraph/LangChain.
- Develop responsive React & TypeScript interfaces.
- Optimize vector database indexes and semantic search retrieval (FAISS, pgvector).
- Deploy containerized services to cloud infrastructure with CI/CD.

Mandatory Technical Skills:
Python, FastAPI, LangGraph, LangChain, React, TypeScript, Vector Search, FAISS, Docker, PostgreSQL.

Preferred Qualifications:
AWS, Kubernetes, Redis, Celery, Sentence-Transformers, ChromaDB, CI/CD, Tailwind CSS.

Experience Target:
4+ Years (Senior). Bachelor's or Master's in Computer Science or related quantitative field.`,

  'Senior Full-Stack': `TEKION COMPANY

We are seeking a Senior Full-Stack & AI Systems Engineer to architect and build our next-generation multi-agent LLM platform.

Key Responsibilities:
- Architect and maintain asynchronous Python/FastAPI microservices.
- Build multi-agent LLM & RAG retrieval systems with LangGraph/LangChain.
- Develop responsive React & TypeScript interfaces.
- Optimize vector database indexes and semantic search retrieval (FAISS, pgvector).
- Deploy containerized services to cloud infrastructure with CI/CD.

Mandatory Technical Skills:
Python, FastAPI, LangGraph, LangChain, React, TypeScript, Vector Search, FAISS, Docker, PostgreSQL.

Preferred Qualifications:
AWS, Kubernetes, Redis, Celery, Sentence-Transformers, ChromaDB, CI/CD, Tailwind CSS.

Experience Target:
4+ Years (Senior). Bachelor's or Master's in Computer Science or related quantitative field.`,

  'Staff Machine Learning': `- 7+ years building and deploying large-scale Machine Learning systems in production.
- Deep expertise in PyTorch, Transformer architectures, and LLM fine-tuning techniques (LoRA, QLoRA).
- Hands-on experience with multi-agent orchestration frameworks (LangGraph, AutoGen) and RAG pipelines.
- Distributed training across GPU clusters (DeepSpeed, Megatron-LM).

Preferred Qualifications:
- Published papers at top-tier ML conferences (NeurIPS, ICML, ICLR).
- Experience with high-performance C++ extensions and TensorRT-LLM inference optimization.
- Ph.D. or M.S. in Computer Science, Artificial Intelligence, or Electrical Engineering.`,

  'Senior Cloud & DevOps': `- 5+ years specializing in Cloud Platform Engineering, Kubernetes (EKS/GKE), and Infrastructure as Code.
- Mastery of Terraform, Helm, Docker, and GitOps workflows with ArgoCD.
- Production experience with Linux kernel debugging, networking (BGP, Cilium), and observability (Prometheus, Grafana, OpenTelemetry).
- Multi-cloud architecture across AWS and GCP with zero-downtime automated canary deployments.

Preferred Qualifications:
- CKA/CKS (Certified Kubernetes Administrator / Security Specialist).
- Go (Golang) and Python for writing custom Kubernetes operators and internal developer platform tooling.
- B.S. in Computer Science or equivalent operational experience.`,

  'Amazon SDE II (Paragon)': `AMAZON Software Dev Engineer II Paragon 

About the job
Description

Would you like to work on one of the world's largest transactional distributed systems? How about working with customers and peers from the entire range of Amazon's business on cool new features? Whether you're passionate about building highly scalable and reliable systems or a software developer who likes to solve business problems, Selling Partner Services (SPS) is the place for you. Our team is responsible for Case Management System.

We are looking for software engineers who thrive on complex problems and solve for operating complex and mission critical systems under high loads. Our systems manage case resolution systems with hundreds of millions of requests, and respond to millions of service requests. We have both frontend and backend code stack and opportunities. We are aimed to provide customizable and LLM based solution to our clients. Do you think you are up for this challenge? Or would you like to learn more and stretch your skills and career?

The successful candidate is expected to contribute to all parts of the software development and deployment lifecycle, including design, development, documentation, testing and maintenance. They must possess good verbal and written communication skills, be self-driven and deliver high quality results in a fast paced environment.

You will thrive in our collaborative environment, working alongside accomplished engineers who value teamwork and technical excellence. We're looking for experienced technical leaders.

Key job responsibilities

As a Software Development Engineer on the team you will take ownership over the software design, documentation, development, engineering approach, delivery and support of systems built natively in AWS. In this role you will collaborate with leaders, work backwards from customers, identify problems, propose innovative solutions, relentlessly raise standards, and have a positive impact on hundreds of millions of customers.

Basic Qualifications

 1+ years of non-internship professional software development experience
 Experience programming with at least one software programming language

Preferred Qualifications

 Bachelor's degree in computer science or equivalent

Our inclusive culture empowers Amazonians to deliver the best results for our customers. If you have a disability and need a workplace accommodation or adjustment during the application and hiring process, including support for the interview or onboarding process, please visit https://amazon.jobs/content/en/how-we-hire/accommodations for more information. If the country/region you’re applying in isn’t listed, please contact your Recruiting Partner.


Company - ADCI - Karnataka

Job ID: A10528516`,

  'Rippling (AI Governance)': `Rippling
Software Engineer II (AI Governance)

About the job
About Rippling

Rippling gives businesses one place to run HR, IT, and Finance. It brings together all of the workforce systems that are normally scattered across a company, like payroll, expenses, benefits, and computers. For the first time ever, you can manage and automate every part of the employee lifecycle in a single system.

Take onboarding, for example. With Rippling, you can hire a new employee anywhere in the world and set up their payroll, corporate card, computer, benefits, and even third-party apps like Slack and Microsoft 365—all within 90 seconds.

Based in San Francisco, CA, Rippling has raised $1.85B from the world’s top investors—including Kleiner Perkins, Founders Fund, Sequoia, Greenoaks, and Bedrock—and was named one of America's best startup employers by Forbes.

We prioritize candidate safety. Please be aware that all official communication will only be sent from @Rippling.com addresses.

About The Role

AI is changing how companies work, but most enterprises still lack a clear way to govern it. Employees are using AI apps directly. Developers are routing code through agents. Business teams are connecting models to SaaS tools through Model Context Protocol (MCP) servers. Companies are spending more on AI every month, often without a reliable view into who is using what, what data is leaving the company, or which agents have access to sensitive systems.

The AI Governance team is building Rippling's answer to that problem.

This team sits at the intersection of identity, access control, model routing, MCP security, data protection, spend management, and auditability. The goal is to give companies one governed path for AI usage across employees, agents, models, and business tools.

As a Software Engineer II on AI Governance, you will help define and build a new product category. You will work on systems that make AI usage attributable, policy-aware, budget-aware, and auditable at runtime. This is a high-ambiguity, high-impact role for someone who wants to build foundational platform technology while staying close to a rapidly evolving customer problem.

What You Will Do

Build high-quality, reliable AI governance products with meticulous attention to detail. 
Ship incremental improvements rapidly, learn from customer feedback, and continuously refine the product. 
Contribute to the design and implementation of MCP access controls, model gateway policies, runtime authorization, audit pipelines, and usage attribution. 
Own ambiguous product and engineering problems from initial exploration through production rollout. 
Use AI-native development practices to increase engineering velocity while maintaining high standards for correctness, security, and quality. 
Collaborate clearly with Product, Security, Legal, IT, and other engineering teams to make thoughtful trade-offs and deliver customer impact. 

What You Will Need

3+ years of software engineering experience building and operating production systems. Experience with Python, Go, Django, React, MongoDB, or AWS is helpful but not required. 
Strong software engineering fundamentals, with experience building reliable, maintainable, and well-designed systems. 
High agency and a bias toward shipping, with the ability to turn ambiguous problems into incremental releases and fast feedback loops. 
An AI-native engineering mindset, including hands-on use of AI tools to increase velocity while maintaining high standards for correctness, security, and quality. 
Curiosity and a continuous-learning mindset, with the ability to quickly understand emerging technologies, unfamiliar domains, and evolving customer needs. 
Strong product ownership, with a focus on solving real customer problems and delivering measurable impact. 
Sound security and systems judgment, particularly around identity, authorization, data movement, policy enforcement, or auditability. 
Clear written and verbal communication, with the ability to collaborate effectively across engineering and non-engineering teams. 
Familiarity with AI infrastructure, model gateways, MCP, developer tools, identity systems, or data protection is a plus but not required. 

Additional Information

Rippling is an equal opportunity employer. We are committed to building a diverse and inclusive workforce and do not discriminate based on race, religion, color, national origin, ancestry, physical disability, mental disability, medical condition, genetic information, marital status, sex, gender, gender identity, gender expression, age, sexual orientation, veteran or military status, or any other legally protected characteristics, Rippling is committed to providing reasonable accommodations for candidates with disabilities who need assistance during the hiring process. To request a reasonable accommodation, please email accomodations@rippling.com

Rippling highly values having employees working in-office to foster a collaborative work environment and company culture. For office-based employees (employees who live within a defined radius of a Rippling office), Rippling considers working in the office, at least three days a week under current policy, to be an essential function of the employee's role.`
};

const TEMPLATE_KEYS_ORDER: (keyof typeof TEMPLATES)[] = [
  'Staff Machine Learning',
  'Amazon SDE II (Paragon)',
  'Rippling (AI Governance)',
  'Tekion Senior Full-Stack',
  'Senior Cloud & DevOps',
];

// ─────────────────────────────────────────────────────────────────────────────
// JD Content Validator — 2-Stage Pipeline
// Stage 1: Strip webpage/social-media noise
// Stage 2: Detect JD evidence in cleaned content
// ─────────────────────────────────────────────────────────────────────────────

// ── Safety checks (run on raw text before cleaning) ─────────────────────────

const ABUSIVE_BLOCKLIST = [
  /\bf+u+c+k+\b/i, /\bs+h+i+t+\b/i, /\bb+i+t+c+h+\b/i, /\ba+s+s+h+o+l+e+\b/i,
  /\bc+u+n+t+\b/i,  /\bd+i+c+k+\b/i,  /\bp+u+s+s+y+\b/i, /\bn+i+g+g+\w+\b/i,
  /\bw+h+o+r+e+\b/i, /\br+e+t+a+r+d+\b/i,
];

const SONG_POEM_MARKERS = [
  /\[(chorus|verse|bridge|outro|intro|refrain|hook)\]/i,
  /\brefrain:\b/i, /\(repeat\)/i, /\bda-da-da\b/i, /\bla la la\b/i, /\boh-oh-oh\b/i,
];

const NON_JD_CONTENT_SIGNALS = [
  /\b(breaking news|live updates|latest news|advertisement|ePaper)\b/i,
  /copyright ©.*all rights reserved/i,
  /skip to (content|main)/i,
  /\b(today's paper|journalism of courage|express premium)\b/i,
  /medal tally|kabaddi|asian games/i,
  // Repeated news-section labels on consecutive lines (nav menus)
  /\b(sports|cricket|bollywood|politics|opinion|trending)\b[\s\S]{0,60}\b(sports|cricket|bollywood|politics|opinion|trending)\b[\s\S]{0,60}\b(sports|cricket|bollywood|politics|opinion|trending)\b/i,
];

// ── Stage 1: Noise line classifier ───────────────────────────────────────────

// Exact UI strings that are pure platform noise (case-insensitive)
const NOISE_EXACT = new Set([
  'apply', 'save', 'premium', 'show all', 'on-site', 'full-time', 'part-time',
  'hybrid', 'remote', 'contract', 'temporary',
  'people you can reach out to', 'responses managed off linkedin',
  'promoted by hirer', 'tailor my resume', 'create cover letter',
  'help me stand out', 'show match details',
  'determine your fit and how to stand out',
  'about the company', 'see all',
]);

const NOISE_PATTERNS = [
  /^reposted \d+ (day|week|month)s? ago$/i,
  /^over \d+ people (clicked|applied|viewed)/i,
  /^https?:\/\//i,                          // standalone URL lines
  /^\[.+\]\(https?:\/\/.+\)$/,              // markdown link-only lines  [text](url)
  /^<https?:\/\/.+>$/,                      // angle-bracket URLs
  /^\d+ (applicants?|connections?|followers?)$/i,
  /^be an early applicant$/i,
  /^actively recruiting$/i,
  /^(easy apply|apply now|apply on company website)$/i,
];

function isNoiseLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (NOISE_EXACT.has(t.toLowerCase())) return true;
  return NOISE_PATTERNS.some((p) => p.test(t));
}

// ── Stage 2: JD evidence signals (section headers + key phrases) ─────────────
// Each matched signal contributes 1 point. Need ≥ 3 points to be confident.

const JD_EVIDENCE_SIGNALS = [
  // Section headers — very strong
  'about the job',
  'role description',
  'job description',
  'key responsibilities',
  'responsibilities',
  'what you will do',
  "what you'll do",
  'your responsibilities',
  'required qualifications',
  'minimum qualifications',
  'basic qualifications',
  'preferred qualifications',
  'qualifications',
  'requirements',
  'technical skills',
  'skills required',
  'required skills',
  "what we're looking for",
  'what we are looking for',
  'desired competencies',
  'success measures',
  'about the role',
  'about this role',
  'the role',
  // Qualification phrases
  "bachelor's degree",
  "master's degree",
  'years of experience',
  'years experience',
  '+ years',
  'equivalent experience',
  'phd',
  // Employment phrases
  'equal opportunity employer',
  'we are looking for',
  'we are hiring',
  'join our team',
  'in this role',
  'you will be responsible',
  // Role-title indicators
  'software engineer',
  'data engineer',
  'product manager',
  'engineering manager',
  'full stack',
  'fullstack',
  'ml engineer',
  'senior engineer',
  'staff engineer',
  'principal engineer',
  'product engineer',
  'solutions architect',
  'tech lead',
];

// ── Main validator ────────────────────────────────────────────────────────────

function validateJdContent(text: string): string | null {
  const trimmed = text.trim();
  if (trimmed.length < 120) return null; // too short — don't nag while typing

  // ── Safety: abusive words (raw text, before any cleaning) ─────────────────
  for (const pattern of ABUSIVE_BLOCKLIST) {
    if (pattern.test(trimmed)) {
      return 'Abusive or offensive content detected. Agent 1 requires a professional job description.';
    }
  }

  // ── Safety: song / poem markers (raw text) ────────────────────────────────
  for (const pattern of SONG_POEM_MARKERS) {
    if (pattern.test(trimmed)) {
      return 'Text appears to contain song lyrics or poetry markers (e.g. [Chorus], [Verse]). Please paste a job description.';
    }
  }

  // ── Non-JD content: news / media sites (raw text) ─────────────────────────
  for (const pattern of NON_JD_CONTENT_SIGNALS) {
    if (pattern.test(trimmed)) {
      return 'Text appears to be a news article or website content, not a job description. Please paste the job description text only.';
    }
  }

  // ── Extreme URL density — definitely a full webpage dump (raw) ────────────
  const urlCount = (trimmed.match(/https?:\/\//g) ?? []).length;
  if (urlCount > 30) {
    return `Too many URLs detected (${urlCount}). Please paste the plain-text job description, not a full webpage.`;
  }

  // ══ STAGE 1: Strip noise lines ════════════════════════════════════════════
  const cleanedLines = trimmed
    .split('\n')
    .filter((line) => !isNoiseLine(line));
  const cleaned = cleanedLines.join('\n');
  const cleanedLower = cleaned.toLowerCase();

  // If cleaning removed almost everything → was pure noise / nav menu
  const cleanedWordCount = cleaned.split(/\s+/).filter(Boolean).length;
  if (cleanedWordCount < 30) {
    return 'Text is too sparse after removing navigation/UI noise. Please paste the actual job description body.';
  }

  // ══ STAGE 2: JD Evidence Detection on cleaned content ═════════════════════
  const matchedSignals = JD_EVIDENCE_SIGNALS.filter((s) => cleanedLower.includes(s));

  if (matchedSignals.length >= 3) return null; // ✅ HIGH confidence — valid JD

  if (matchedSignals.length === 2) return null; // ✅ MEDIUM confidence — likely valid

  // 0–1 signals — not enough JD evidence
  const found = matchedSignals.length > 0
    ? `Found only: "${matchedSignals[0]}". `
    : '';
  return `${found}Non-job content detected: text lacks job description sections such as "Responsibilities", "Qualifications", or "About the job". Please paste a valid job description.`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Header Illustration Component (Matching Image 1)
// ─────────────────────────────────────────────────────────────────────────────

const JdIllustration = () => (
  <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0 flex items-center justify-center select-none">
    <svg className="w-full h-full drop-shadow-md" viewBox="0 0 100 110" fill="none">
      <defs>
        <linearGradient id="docBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F8FAFC" />
        </linearGradient>
        <linearGradient id="jdBadge" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <linearGradient id="lensRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="glassFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
      </defs>

      {/* Sparkles / 4-point stars */}
      <path d="M12 28 C12 28 14 26 14 23 C14 26 16 28 16 28 C16 28 14 30 14 33 C14 30 12 28 12 28 Z" fill="#A855F7" />
      <path d="M4 52 C4 52 7 49 7 45 C7 49 10 52 10 52 C10 52 7 55 7 59 C7 55 4 52 4 52 Z" fill="#38BDF8" />
      <path d="M82 24 C82 24 84 22 84 19 C84 22 86 24 86 24 C86 24 84 26 84 29 C84 26 82 24 82 24 Z" fill="#818CF8" />
      <circle cx="89" cy="48" r="1.5" fill="#38BDF8" />

      {/* Main Document Body */}
      <rect x="18" y="16" width="58" height="72" rx="12" fill="url(#docBg)" stroke="#E2E8F0" strokeWidth="1.8" />

      {/* Document Top Badge: "JD" */}
      <rect x="29" y="24" width="26" height="15" rx="4.5" fill="url(#jdBadge)" />
      <text x="42" y="35" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.5">JD</text>

      {/* Skeleton Text Lines on Document */}
      <rect x="26" y="46" width="40" height="3" rx="1.5" fill="#CBD5E1" opacity="0.8" />
      <rect x="26" y="53" width="34" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="60" width="28" height="3" rx="1.5" fill="#E2E8F0" />
      <rect x="26" y="67" width="22" height="3" rx="1.5" fill="#E2E8F0" />

      {/* 3D Magnifying Glass in Front */}
      <path d="M68 76 L85 93 C86.5 94.5 86.5 97 85 98.5 C83.5 100 81 100 79.5 98.5 L62.5 81.5 Z" fill="url(#handleGrad)" />
      <circle cx="56" cy="67" r="17" fill="url(#glassFill)" stroke="url(#lensRing)" strokeWidth="4" />
      <path d="M48 57 Q56 52 64 57" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
    </svg>
  </div>
);

const TEMPLATE_METADATA: Record<string, { role: string; company: string }> = {
  'Tekion Senior Full-Stack': { role: 'Senior Full-Stack & AI Systems Engineer', company: 'Tekion' },
  'Senior Full-Stack': { role: 'Senior Full-Stack & AI Systems Engineer', company: 'Tekion' },
  'Staff Machine Learning': { role: 'Staff Machine Learning Engineer', company: 'Cognitive Core AI' },
  'Senior Cloud & DevOps': { role: 'Senior Cloud & DevOps Engineer', company: 'Aether Cloud Networks' },
  'Amazon SDE II (Paragon)': { role: 'Software Development Engineer II', company: 'Amazon' },
  'Rippling (AI Governance)': { role: 'Software Engineer II (AI Governance)', company: 'Rippling' },
};

const TEMPLATE_TAXONOMIES: Record<string, any> = {
  'Tekion Senior Full-Stack': {
    role: 'Senior Full-Stack & AI Systems Engineer',
    experience_target_years: 4,
    education_criteria: "Bachelor's or Master's in Computer Science or related quantitative field",
    mandatory_skills: [
      'Python', 'FastAPI', 'LangGraph', 'LangChain', 'React',
      'TypeScript', 'Vector Search', 'FAISS', 'Docker', 'PostgreSQL'
    ],
    preferred_skills: [
      'AWS', 'Kubernetes', 'Redis', 'Celery',
      'Sentence-Transformers', 'ChromaDB', 'CI/CD', 'Tailwind CSS'
    ],
    soft_skills: [
      'Problem Solving', 'System Architecture',
      'Cross-functional Collaboration', 'Technical Communication'
    ],
    responsibilities: [
      'Architect and maintain asynchronous Python/FastAPI microservices',
      'Build multi-agent LLM & RAG retrieval systems with LangGraph/LangChain',
      'Develop responsive React & TypeScript interfaces',
      'Optimize vector database indexes and semantic search retrieval',
      'Deploy containerized services to cloud infrastructure with CI/CD'
    ],
    domain_tags: ['AI/ML', 'Full-Stack', 'Distributed Systems', 'Cloud', 'Vector Search']
  },
  'Senior Full-Stack': {
    role: 'Senior Full-Stack & AI Systems Engineer',
    experience_target_years: 4,
    education_criteria: "Bachelor's or Master's in Computer Science or related quantitative field",
    mandatory_skills: [
      'Python', 'FastAPI', 'LangGraph', 'LangChain', 'React',
      'TypeScript', 'Vector Search', 'FAISS', 'Docker', 'PostgreSQL'
    ],
    preferred_skills: [
      'AWS', 'Kubernetes', 'Redis', 'Celery',
      'Sentence-Transformers', 'ChromaDB', 'CI/CD', 'Tailwind CSS'
    ],
    soft_skills: [
      'Problem Solving', 'System Architecture',
      'Cross-functional Collaboration', 'Technical Communication'
    ],
    responsibilities: [
      'Architect and maintain asynchronous Python/FastAPI microservices',
      'Build multi-agent LLM & RAG retrieval systems with LangGraph/LangChain',
      'Develop responsive React & TypeScript interfaces',
      'Optimize vector database indexes and semantic search retrieval',
      'Deploy containerized services to cloud infrastructure with CI/CD'
    ],
    domain_tags: ['AI/ML', 'Full-Stack', 'Distributed Systems', 'Cloud', 'Vector Search']
  },
  'Senior Cloud & DevOps': {
    role: 'Senior Cloud Platform & DevOps Engineer',
    experience_target_years: 5,
    education_criteria: 'B.S. in Computer Science, Software Engineering, or equivalent operational experience',
    mandatory_skills: [
      'Kubernetes', 'Terraform', 'Linux', 'Helm',
      'Docker', 'CI/CD', 'Python', 'AWS'
    ],
    preferred_skills: [
      'ArgoCD', 'Prometheus', 'Grafana', 'Golang', 'GCP', 'PostgreSQL'
    ],
    soft_skills: [
      'Incident Management', 'Reliability Engineering',
      'DevOps Culture', 'Infrastructure Architecture'
    ],
    responsibilities: [
      'Architect and maintain production EKS/GKE Kubernetes clusters',
      'Automate multi-region infrastructure provisioning using Terraform',
      'Implement GitOps pipelines with ArgoCD and automated canary releases',
      'Monitor real-time system metrics with Prometheus and Grafana dashboards'
    ],
    domain_tags: ['Cloud', 'DevOps', 'Kubernetes', 'Infrastructure as Code', 'SRE']
  },
  'Staff Machine Learning': {
    role: 'Staff Machine Learning Engineer',
    experience_target_years: 7,
    education_criteria: 'Ph.D. or M.S. in Computer Science, Artificial Intelligence, or Electrical Engineering',
    mandatory_skills: [
      'Python', 'PyTorch', 'Transformers', 'LLMs',
      'LangGraph', 'DeepSpeed', 'Distributed Training', 'CUDA'
    ],
    preferred_skills: [
      'TensorRT-LLM', 'C++', 'vLLM', 'Triton', 'Ray', 'Vector Search'
    ],
    soft_skills: [
      'Research Leadership', 'AI Ethics & Alignment', 'Technical Mentorship'
    ],
    responsibilities: [
      'Lead research and production deployment of LLM fine-tuning and agentic systems',
      'Optimize distributed multi-node GPU clusters for high-throughput inference',
      'Architect state-of-the-art multi-agent RAG pipelines'
    ],
    domain_tags: ['Machine Learning', 'LLMs', 'PyTorch', 'Distributed Training', 'AI Research']
  },
  'Amazon SDE II (Paragon)': {
    role: 'Software Development Engineer II',
    experience_target_years: 1,
    education_criteria: "Bachelor's degree in Computer Science or equivalent",
    mandatory_skills: [
      'Java', 'Python', 'AWS Native Systems', 'Cloud Architecture',
      'Distributed Systems', 'RESTful APIs', 'Software Development Lifecycle'
    ],
    preferred_skills: [
      'DynamoDB', 'SQS', 'SNS', 'Lambda', 'Microservices', 'Docker'
    ],
    soft_skills: [
      'Customer Obsession', 'Ownership', 'Bias for Action', 'Deliver Results'
    ],
    responsibilities: [
      'Design and operate high-scale transactional distributed systems',
      'Develop cloud-native services natively in AWS',
      'Write clean, robust, and maintainable unit and integration tests'
    ],
    domain_tags: ['Distributed Systems', 'Cloud', 'AWS', 'Backend', 'E-Commerce']
  },
  'Rippling (AI Governance)': {
    role: 'Software Engineer II (AI Governance)',
    experience_target_years: 3,
    education_criteria: "Bachelor's or Master's degree in Computer Science or equivalent",
    mandatory_skills: [
      'Python', 'Go', 'Django', 'React', 'AWS',
      'AI-native Engineering', 'Security & Systems Judgment', 'API Development'
    ],
    preferred_skills: [
      'Model Context Protocol (MCP)', 'Model Gateways', 'AI Infrastructure',
      'Identity & Access Management', 'Data Protection', 'MongoDB'
    ],
    soft_skills: [
      'High Agency', 'Product Ownership', 'Bias Toward Shipping', 'Collaboration'
    ],
    responsibilities: [
      'Design runtime authorization and audit pipelines for LLM agents',
      'Implement MCP access control filters and model gateway proxies',
      'Build policy-aware budget controls for enterprise AI consumption'
    ],
    domain_tags: ['AI Governance', 'Security', 'MCP', 'Full-Stack', 'Identity']
  }
};

function extractCompanyFromJdText(text: string): string {
  // Check markdown link like [Infosys](https://www.linkedin.com/company/infosys/life/)
  const m0 = text.match(/\[([A-Za-z0-9&.,\s-]{2,40})\]\(https?:\/\/(?:www\.)?linkedin\.com\/company\/[^\)]+\)/i);
  if (m0 && m0[1]) return m0[1].trim();

  const m1 = text.match(/(?:Company|Employer|Organization)\s*[-:]\s*([A-Za-z0-9&.,\s-]{2,40})/i);
  if (m1 && m1[1]) return m1[1].split('\n')[0].trim();
  const m2 = text.match(/About\s+([A-Z][A-Za-z0-9&.,\s-]{1,30})/);
  if (m2 && m2[1]) {
    const cand = m2[1].trim();
    if (!['the role', 'the job', 'the position', 'our team', 'this role', 'us', 'you'].includes(cand.toLowerCase())) {
      return cand;
    }
  }
  return '';
}

function extractRoleAndCompanyQuickly(text: string): { role: string; company: string } {
  let company = extractCompanyFromJdText(text);
  let role = '';

  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !isNoiseLine(l));

  // 1. Check markdown link for job title (e.g. [AI-Driven - Full Stack Engineer](https://linkedin.com/jobs/view/...))
  for (const line of lines.slice(0, 8)) {
    const jobLinkMatch = line.match(/^\[([^\]]{3,80})\]\(https?:\/\/(?:www\.)?linkedin\.com\/jobs\/view\//i);
    if (jobLinkMatch) {
      role = jobLinkMatch[1].trim();
      break;
    }
  }

  // 2. Explicit header: Role: ..., Title: ..., Position: ...
  if (!role) {
    const roleMatch = text.match(/(?:Role|Title|Position|Job Title)\s*[-:]\s*([A-Za-z0-9&/(),.\s-]{3,60})/i);
    if (roleMatch && roleMatch[1]) {
      role = roleMatch[1].split('\n')[0].trim();
    }
  }

  // 3. If company still unknown, check line 0 if it looks like a brand name
  if (!company && lines.length > 0) {
    const firstLine = lines[0].replace(/^\[|\]\([^)]+\)$/g, '').trim();
    if (firstLine.length >= 2 && firstLine.length <= 35 && !/engineer|developer|scientist|manager|architect|analyst/i.test(firstLine)) {
      company = firstLine;
    }
  }

  // 4. Role keyword search in top non-noise lines
  if (!role && lines.length > 0) {
    for (const line of lines.slice(0, 6)) {
      const cleanLine = line.replace(/^\[|\]\([^)]+\)$/g, '').trim();
      if (company && cleanLine.toLowerCase() === company.toLowerCase()) continue;
      if (/(engineer|developer|scientist|manager|architect|lead|specialist|designer|analyst|consultant|director|administrator|coordinator|officer)/i.test(cleanLine)) {
        if (cleanLine.length <= 75) {
          role = cleanLine;
          break;
        }
      }
    }
  }

  // 5. Fallback line 1 if reasonable length
  if (!role && lines.length > 1) {
    const secondLine = lines[1].replace(/^\[|\]\([^)]+\)$/g, '').trim();
    if (secondLine.length >= 3 && secondLine.length <= 70) {
      role = secondLine;
    }
  }

  return { role: role || 'Custom Job Mandate', company: company || '' };
}

function extractRequirementsClientSide(text: string): any {
  const normalized = text.toLowerCase();

  // 1. Check if matches any of the 5 pre-defined templates
  if (normalized.includes('amazon') || normalized.includes('paragon') || normalized.includes('selling partner') || normalized.includes('a10528516')) {
    return TEMPLATE_TAXONOMIES['Amazon SDE II (Paragon)'];
  }
  if (normalized.includes('rippling') || normalized.includes('ai governance')) {
    return TEMPLATE_TAXONOMIES['Rippling (AI Governance)'];
  }
  if (normalized.includes('staff machine learning') || normalized.includes('cognitive core') || normalized.includes('deepspeed')) {
    return TEMPLATE_TAXONOMIES['Staff Machine Learning'];
  }
  if (normalized.includes('aether cloud') || normalized.includes('argocd') || normalized.includes('devops engineer')) {
    return TEMPLATE_TAXONOMIES['Senior Cloud & DevOps'];
  }
  if (normalized.includes('tekion') || normalized.includes('nexus intelligence') || normalized.includes('vector search')) {
    return TEMPLATE_TAXONOMIES['Tekion Senior Full-Stack'];
  }

  // 2. Dynamic heuristic parser for any custom JD
  const { role, company } = extractRoleAndCompanyQuickly(text);

  // Experience target
  let expYears = 3;
  const expMatch = text.match(/(\d+)\+?\s*(?:-\s*\d+\+?)?\s*years?(?:\s+of)?(?:\s+experience)?/i);
  if (expMatch && expMatch[1]) {
    expYears = parseInt(expMatch[1], 10);
  }

  // Education
  let education = "Bachelor's Degree in Computer Science or related quantitative field";
  if (/ph\.?d/i.test(text)) {
    education = "Ph.D. or Master's in Computer Science, Artificial Intelligence, or related field";
  } else if (/master(?:'s)?/i.test(text)) {
    education = "Master's or Bachelor's in Computer Science or related field";
  }

  // Technical skills vocabulary
  const KNOWN_TECH = [
    'Python', 'FastAPI', 'Django', 'Flask', 'Java', 'Spring Boot', 'TypeScript', 'JavaScript',
    'React', 'Next.js', 'Vue.js', 'Node.js', 'Go', 'Golang', 'Rust', 'C++', 'C#', '.NET',
    'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB', 'Elasticsearch',
    'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Terraform', 'CI/CD', 'Helm', 'ArgoCD',
    'Kafka', 'RabbitMQ', 'GraphQL', 'RESTful APIs', 'Microservices', 'Git',
    'PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'LLMs', 'RAG', 'Vector Search', 'FAISS',
    'pgvector', 'OpenAI', 'Transformers', 'DeepSpeed', 'CUDA', 'Hugging Face'
  ];

  const mandatorySkills: string[] = [];
  const preferredSkills: string[] = [];

  for (const tech of KNOWN_TECH) {
    const reg = new RegExp(`\\b${tech.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    if (reg.test(text)) {
      if (mandatorySkills.length < 10) {
        mandatorySkills.push(tech);
      } else if (preferredSkills.length < 8) {
        preferredSkills.push(tech);
      }
    }
  }

  if (mandatorySkills.length === 0) {
    mandatorySkills.push('Problem Solving', 'Software Engineering', 'System Design', 'Git', 'Agile');
  }

  // Responsibilities
  const responsibilities: string[] = [];
  const lines = text.split('\n').map((l) => l.trim().replace(/^[-*•]\s*/, ''));
  for (const l of lines) {
    if (l.length >= 25 && l.length <= 150 && /^(architect|design|build|develop|maintain|lead|collaborate|optimize|implement|deliver|ensure|drive)/i.test(l)) {
      responsibilities.push(l);
      if (responsibilities.length >= 5) break;
    }
  }
  if (responsibilities.length === 0) {
    responsibilities.push(
      `Architect and build high-performance services for ${role}`,
      'Collaborate across cross-functional engineering and product teams',
      'Maintain rigorous standards for code quality, testing, and deployment'
    );
  }

  // Domain tags
  const domainTags: string[] = [];
  if (mandatorySkills.some((s) => ['PyTorch', 'LangChain', 'LangGraph', 'LLMs', 'Vector Search', 'FAISS'].includes(s))) domainTags.push('AI/ML');
  if (mandatorySkills.some((s) => ['React', 'TypeScript', 'JavaScript', 'Next.js'].includes(s))) domainTags.push('Frontend');
  if (mandatorySkills.some((s) => ['Python', 'FastAPI', 'Java', 'Go', 'PostgreSQL'].includes(s))) domainTags.push('Backend');
  if (mandatorySkills.some((s) => ['Docker', 'Kubernetes', 'AWS', 'GCP', 'Terraform', 'CI/CD'].includes(s))) domainTags.push('Cloud/DevOps');
  if (domainTags.length === 0) domainTags.push('Full-Stack', 'Distributed Systems');

  return {
    role,
    company,
    experience_target_years: expYears,
    education_criteria: education,
    mandatory_skills: mandatorySkills,
    preferred_skills: preferredSkills.length > 0 ? preferredSkills : ['CI/CD', 'Docker', 'Agile'],
    soft_skills: ['Problem Solving', 'Ownership', 'Cross-functional Collaboration', 'Technical Communication'],
    responsibilities,
    domain_tags: domainTags
  };
}

export default function JobDescription() {
  const { mandateId: paramMandateId } = useParams();
  const { activeMandateId, setActiveMandateId, mandates, setMandates, applyMandateOverride, clearMandateOverride } = useTalentAgentStore();
  const currentMandateId = paramMandateId || activeMandateId || (mandates[0]?.id ?? 'a0000000-0000-0000-0000-000000000001');

  const [mandate, setMandate] = useState<any>(null);
  const [rawJd, setRawJd] = useState('');
  const [activeView, setActiveView] = useState<'visual' | 'json'>('visual');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [requirements, setRequirements] = useState<any>(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [jdValidationError, setJdValidationError] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isNewMandatePending, setIsNewMandatePending] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!currentMandateId) return;

    if (isTemplateMandate(currentMandateId)) {
      const tplKey = getTemplateKeyFromId(currentMandateId) || 'Tekion Senior Full-Stack';
      const defaultText = TEMPLATES[tplKey as keyof typeof TEMPLATES] || TEMPLATES['Tekion Senior Full-Stack'];
      const defaultTaxonomy = TEMPLATE_TAXONOMIES[tplKey] || TEMPLATE_TAXONOMIES['Tekion Senior Full-Stack'];
      const meta = TEMPLATE_MANDATES.find((t) => t.id === currentMandateId);

      // Instant pre-population from local cache so the UI never displays blank
      setRawJd(defaultText);
      if (defaultTaxonomy) setRequirements(defaultTaxonomy);
      setIsNewMandatePending(false);
      setJdValidationError(null);
      setAnalysisError(null);

      if (meta) {
        setMandate({
          id: meta.id,
          title: meta.title,
          company: meta.company,
          raw_jd: defaultText,
          job_requirements: defaultTaxonomy,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      // Re-fetch in background to sync any updates
      getMandate(currentMandateId).then((m) => {
        setMandate(m);
        if (m.raw_jd) setRawJd(m.raw_jd);
        if (m.job_requirements) setRequirements(m.job_requirements);
      }).catch((err) => {
        console.warn('Backend mandate fetch failed, using local template data:', err);
      });
    } else {
      // User custom mandate
      getMandate(currentMandateId).then((m) => {
        setMandate(m);
        setRawJd(m.raw_jd || '');
        setIsNewMandatePending(false);
        if (m.job_requirements) {
          setRequirements(m.job_requirements);
        }
      }).catch((err) => {
        console.error('Failed to load user mandate:', err);
      });
    }
  }, [currentMandateId]);

  const handleTemplateClick = (templateKey: keyof typeof TEMPLATES) => {
    const text = TEMPLATES[templateKey];
    const taxonomy = TEMPLATE_TAXONOMIES[templateKey];

    // Immediately load text and taxonomy so there is zero latency/blankness
    if (text) setRawJd(text);
    if (taxonomy) setRequirements(taxonomy);
    setJdValidationError(null);
    setAnalysisError(null);
    setIsNewMandatePending(false);

    const targetId = getTemplateMandateId(templateKey);
    if (targetId) {
      const meta = TEMPLATE_MANDATES.find((t) => t.id === targetId);
      if (meta) {
        setMandate({
          id: meta.id,
          title: meta.title,
          company: meta.company,
          raw_jd: text,
          job_requirements: taxonomy,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
      setActiveMandateId(targetId);
      if (targetId !== currentMandateId) {
        navigate(`/recruiter/mandates/${targetId}/job-description`);
      }
    }
  };

  const shouldCreateNewMandate = (newText: string) => {
    if (isNewMandatePending) return true;
    if (isTemplateMandate(currentMandateId)) return true;
    const savedJd = (mandate?.raw_jd || '').trim();
    // If current mandate already has a saved JD and the new text is a substantial new JD (>= 60 chars) different from saved JD
    if (savedJd && savedJd.length > 50 && newText.trim().length >= 60 && newText.trim() !== savedJd) {
      return true;
    }
    return false;
  };

  const createAndActivateMandateFromText = async (text: string): Promise<string | null> => {
    setIsNewMandatePending(false);
    const { role, company } = extractRoleAndCompanyQuickly(text);

    // Enforce sliding window (max 5 user-added mandates, total 10 in a row with 5 templates)
    let currentList = [...mandates];
    const userMandates = currentList.filter((m) => !isTemplateMandate(m.id));
    if (userMandates.length >= 5) {
      const oldestUser = userMandates[userMandates.length - 1];
      try {
        await deleteMandate(oldestUser.id);
        clearMandateOverride(oldestUser.id);
      } catch (e) {
        console.warn('Failed to delete oldest user mandate:', e);
      }
      currentList = currentList.filter((m) => m.id !== oldestUser.id);
    }

    try {
      const created = await createMandate({
        title: role,
        company: company,
      });

      // Save raw JD immediately
      await saveJobDescription(created.id, text, { title: role, company });

      // Apply override so active mandate pill & dropdown immediately show "Role (Company)"
      applyMandateOverride(created.id, {
        title: role,
        company: company,
        raw_jd: text,
      });

      // Refresh mandates list in store so the new mandate row appears in the dropdown immediately
      const freshList = await getMandates();
      setMandates(freshList);
      setActiveMandateId(created.id);

      setMandate({
        id: created.id,
        title: role,
        company: company,
        raw_jd: text,
      });

      navigate(`/recruiter/mandates/${created.id}/job-description`);
      return created.id;
    } catch (err) {
      console.error('Failed to create and activate mandate:', err);
      return null;
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText || pastedText.trim().length < 40) return;

    if (shouldCreateNewMandate(pastedText)) {
      e.preventDefault();
      setRawJd(pastedText);
      setJdValidationError(validateJdContent(pastedText));
      await createAndActivateMandateFromText(pastedText);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawJd(content);
        setJdValidationError(validateJdContent(content));
        if (shouldCreateNewMandate(content)) {
          await createAndActivateMandateFromText(content);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleRunAgent = async () => {
    if (!rawJd.trim()) return;
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      let targetId = currentMandateId;

      // If new mandate is needed (e.g. from template or after Clear)
      if (shouldCreateNewMandate(rawJd)) {
        try {
          const createdId = await createAndActivateMandateFromText(rawJd);
          if (createdId) targetId = createdId;
        } catch (e) {
          console.warn('Backend mandate creation skipped:', e);
        }
      }

      const extractedCompany = extractCompanyFromJdText(rawJd);
      let reqs: any;

      try {
        await saveJobDescription(targetId, rawJd, { company: extractedCompany });
        reqs = await analyzeJD(targetId);
      } catch (backendErr) {
        console.warn('Backend analyzeJD call failed, executing resilient client-side heuristic extraction:', backendErr);
        // Resilient client-side fallback extractor
        reqs = extractRequirementsClientSide(rawJd);
      }

      setRequirements(reqs);

      const roleName = reqs.role || 'Software Engineer';
      const companyName = reqs.company || extractedCompany || '';

      // Persist override so active mandate pill across all pages displays the role immediately
      applyMandateOverride(targetId, {
        title: roleName,
        company: companyName,
        job_requirements: reqs,
        raw_jd: rawJd,
      });

      try {
        await saveJobDescription(targetId, rawJd, { title: roleName, company: companyName });
        const freshList = await getMandates();
        setMandates(freshList);
      } catch (e) {
        console.warn('Backend sync skipped:', e);
      }

      setActiveMandateId(targetId);

      setMandate((prev: any) => ({
        ...(prev || {}),
        id: targetId,
        title: roleName,
        company: companyName,
        job_requirements: reqs,
        raw_jd: rawJd,
      }));

      if (targetId !== currentMandateId) {
        navigate(`/recruiter/mandates/${targetId}/job-description`);
      }
    } catch (err) {
      console.error(err);
      // Even in the worst case, extract client-side
      const fallbackReqs = extractRequirementsClientSide(rawJd);
      setRequirements(fallbackReqs);
      setAnalysisError(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemoveMandatorySkill = (skill: string) => {
    if (!requirements) return;
    setRequirements({
      ...requirements,
      mandatory_skills: requirements.mandatory_skills.filter((s: string) => s !== skill)
    });
  };

  const handleAddMandatorySkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillInput.trim() || !requirements) return;
    if (!requirements.mandatory_skills.includes(newSkillInput.trim())) {
      setRequirements({
        ...requirements,
        mandatory_skills: [...requirements.mandatory_skills, newSkillInput.trim()]
      });
    }
    setNewSkillInput('');
    setShowAddSkill(false);
  };

  return (
    <RecruiterLayout mandateId={currentMandateId}>
      {/* Page Header (Matching Image 1) */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6 mb-6">
        {/* Left: Illustration + Title + Green Box */}
        <div className="flex flex-col">
          {/* Agent 1 Pill (Matching Image 1 style) */}
          <div className="mb-1.5">
            <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full">
              Agent 1 —
            </span>
          </div>

          <div className="flex items-start gap-4 sm:gap-5">
            {/* 3D Document & Magnifying Glass Illustration */}
            <JdIllustration />

            {/* Title & Description Box */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Job Description
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Intelligence Agent
              </h2>

              {/* Green Box */}
              <div className="mt-2.5 bg-emerald-50/80 border border-emerald-400 rounded-xl px-4 py-2.5 shadow-2xs max-w-2xl">
                <p className="text-xs sm:text-[13px] text-gray-900 font-medium leading-relaxed">
                  Intelligently extracts and structures key requirements from any job description — identifying skills, responsibilities, experience, and more in seconds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Load Template Buttons (5 rows, 1 column) */}
        <div className="flex flex-col xl:items-end gap-1.5 text-xs font-mono shrink-0">
          <span className="text-gray-500 font-semibold mb-0.5">Load Template:</span>
          <div className="flex flex-col gap-1.5 w-full sm:w-56">
            {TEMPLATE_KEYS_ORDER.map((tpl) => {
              const tplId = getTemplateMandateId(tpl);
              const isActive = tplId === currentMandateId;
              return (
                <button
                  key={tpl}
                  onClick={() => handleTemplateClick(tpl as any)}
                  className={`w-full px-3 py-1.5 rounded-xl border text-[11px] font-semibold transition shadow-2xs cursor-pointer flex items-center justify-between ${
                    isActive
                      ? 'ring-2 ring-indigo-600 bg-indigo-50/90 text-indigo-900 border-indigo-400 font-bold shadow-xs'
                      : tpl.includes('Amazon')
                      ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 font-bold'
                      : tpl.includes('Rippling')
                      ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                      : tpl.includes('Tekion')
                      ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-300 font-bold'
                      : 'bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 border-gray-200'
                  }`}
                >
                  <span>
                    {tpl.includes('Amazon')
                      ? `📦 ${tpl}`
                      : tpl.includes('Rippling')
                      ? `🛡️ ${tpl}`
                      : tpl.includes('Tekion')
                      ? `⚡ ${tpl}`
                      : tpl}
                  </span>
                  <span className={`text-[10px] ml-2 ${isActive ? 'text-indigo-600 font-bold' : 'text-gray-400'}`}>
                    {isActive ? '✓' : '→'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: RAW JOB DESCRIPTION TEXT */}
        <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-gray-700 uppercase tracking-wider">
              RAW JOB DESCRIPTION TEXT
            </span>
            <div className="flex items-center gap-2">
              {!isTemplateMandate(currentMandateId) && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!window.confirm('Delete this custom mandate?')) return;
                    try {
                      await deleteMandate(currentMandateId);
                      clearMandateOverride(currentMandateId);
                      const remaining = mandates.filter((m) => m.id !== currentMandateId);
                      setMandates(remaining);
                      const fallback = remaining[0]?.id || 'a0000000-0000-0000-0000-000000000001';
                      setActiveMandateId(fallback);
                      navigate(`/recruiter/mandates/${fallback}/job-description`);
                    } catch (err) {
                      console.error('Failed to delete mandate:', err);
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono font-semibold text-red-600 hover:text-red-700 px-2.5 py-1 rounded-xl bg-white hover:bg-red-50 border border-gray-200 hover:border-red-200 transition cursor-pointer shadow-2xs"
                  title="Delete this custom mandate"
                >
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Delete Mandate</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setRawJd('');
                  setRequirements(null);
                  setIsNewMandatePending(true);
                  setJdValidationError(null);
                  setAnalysisError(null);
                }}
                disabled={!rawJd && !isNewMandatePending}
                className="flex items-center gap-1.5 text-xs font-mono font-semibold text-gray-500 hover:text-red-600 disabled:opacity-35 disabled:cursor-not-allowed disabled:hover:text-gray-500 px-2.5 py-1 rounded-xl bg-white hover:bg-red-50 disabled:hover:bg-white border border-gray-200 hover:border-red-200 disabled:hover:border-gray-200 transition cursor-pointer shadow-2xs"
                title="Clear job description text to enter a new mandate"
              >
                <svg className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear (X)</span>
              </button>
              <label className="flex items-center gap-1.5 text-xs font-mono font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer px-2.5 py-1 rounded-xl bg-white hover:bg-indigo-50 border border-gray-200 transition shadow-2xs">
                <span>📤</span>
                <span>Upload TXT/MD</span>
                <input type="file" accept=".txt,.md" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <textarea
            value={rawJd}
            onPaste={handlePaste}
            onChange={async (e) => {
              const val = e.target.value;
              setRawJd(val);
              setJdValidationError(validateJdContent(val));
              if (isNewMandatePending && val.trim().length >= 60) {
                await createAndActivateMandateFromText(val);
              }
            }}
            rows={18}
            className="w-full bg-gray-50/60 border border-gray-200 rounded-xl p-4 font-mono text-xs text-gray-800 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-none shadow-inner"
            placeholder={
              isNewMandatePending
                ? "Paste new job description here — it will automatically be added as a new active mandate..."
                : "Paste raw job description here..."
            }
          />

          {/* Validation Warning Banner */}
          {jdValidationError && (
            <div className="mt-2 flex items-start gap-2 bg-amber-50 border border-amber-300 text-amber-900 text-xs rounded-xl px-3 py-2 shadow-2xs">
              <span className="shrink-0 text-amber-500 text-sm">⚠️</span>
              <span className="leading-relaxed font-mono">
                <strong>Non-Job Content Detected:</strong> {jdValidationError}
              </span>
            </div>
          )}

          {/* Analysis Error Banner */}
          {analysisError && (
            <div className="mt-2 flex items-start gap-2 bg-red-50 border border-red-300 text-red-900 text-xs rounded-xl px-3 py-2 shadow-2xs">
              <span className="shrink-0 text-red-500 text-sm">❌</span>
              <span className="leading-relaxed font-mono">
                <strong>Analysis Failed:</strong> {analysisError}
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-[11px] font-mono text-gray-400">
              {rawJd.length} characters · Markdown supported
            </span>
            <button
              onClick={handleRunAgent}
              disabled={isAnalyzing || !rawJd.trim() || !!jdValidationError}
              className="bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white font-bold px-5 py-2.5 rounded-xl text-xs font-mono flex items-center gap-2 transition shadow-xs shadow-indigo-500/20 disabled:opacity-50 cursor-pointer"
            >
              {isAnalyzing ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <span>Analyzing with Groq...</span>
                </>
              ) : (
                <>
                  <span>⚡</span>
                  <span>Run Job Description Analyzer Agent</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: EXTRACTED REQUIREMENTS & SKILL TAXONOMY */}
        <div className="bg-white/90 backdrop-blur-xs border border-gray-200/90 rounded-2xl p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
                <span>⚙️</span> EXTRACTED REQUIREMENTS & SKILL TAXONOMY
              </span>
              <p className="text-[10px] font-mono text-gray-400">Agent 1 output state stored in LangGraph context</p>
            </div>

            {/* View Mode Toggle: Visual Taxonomy | LangGraph State JSON */}
            <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200 text-[11px] font-mono">
              <button
                onClick={() => setActiveView('visual')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeView === 'visual'
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                Visual Taxonomy
              </button>
              <button
                onClick={() => setActiveView('json')}
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  activeView === 'json'
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                LangGraph State JSON
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeView === 'visual' ? (
            <div className="space-y-4 overflow-y-auto max-h-[640px] pr-1">
              {/* 3 Top Cards: Role, Experience, Education */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200/80">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">EXTRACTED ROLE</span>
                  <p className="font-bold text-gray-900 text-xs leading-tight">{requirements?.role || 'Senior AI Engineer'}</p>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200/80">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">EXPERIENCE TARGET</span>
                  <p className="font-bold text-indigo-600 text-xs leading-tight">
                    {requirements?.experience_target_years || 4}+ Years (Senior)
                  </p>
                </div>
                <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-200/80">
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider block mb-1">EDUCATION CRITERIA</span>
                  <p className="font-medium text-gray-700 text-[11px] leading-tight line-clamp-2">
                    {requirements?.education_criteria || "Bachelor's or Master's degree"}
                  </p>
                </div>
              </div>

              {/* Mandatory Technical Skills */}
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-mono font-bold text-indigo-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    Mandatory Technical Skills ({requirements?.mandatory_skills?.length || 0})
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {requirements?.mandatory_skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-indigo-50 text-indigo-700 border border-indigo-200/90 px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 group shadow-2xs"
                    >
                      <span>{skill}</span>
                      <button
                        onClick={() => handleRemoveMandatorySkill(skill)}
                        className="text-indigo-400 hover:text-rose-500 text-[10px] transition cursor-pointer"
                        title="Remove skill"
                      >
                        ✕
                      </button>
                    </span>
                  ))}

                  {showAddSkill ? (
                    <form onSubmit={handleAddMandatorySkill} className="inline-flex items-center gap-1">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        placeholder="Skill name..."
                        className="bg-white text-gray-800 border border-indigo-500 px-2 py-0.5 rounded text-xs font-mono focus:outline-none w-28 shadow-xs"
                        autoFocus
                      />
                      <button type="submit" className="text-indigo-600 text-xs font-bold px-1 cursor-pointer">✓</button>
                      <button type="button" onClick={() => setShowAddSkill(false)} className="text-gray-400 text-xs px-1 cursor-pointer">✕</button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowAddSkill(true)}
                      className="bg-white hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 border border-gray-300 hover:border-indigo-300 border-dashed px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition cursor-pointer shadow-2xs"
                    >
                      Add required skill... +
                    </button>
                  )}
                </div>
              </div>

              {/* Preferred / Nice-to-Have Skills */}
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                <span className="text-xs font-mono font-bold text-gray-700 flex items-center gap-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  Preferred / Nice-to-Have Skills ({requirements?.preferred_skills?.length || 0})
                </span>
                <div className="flex flex-wrap gap-2">
                  {requirements?.preferred_skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg text-xs font-mono font-medium shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills & Behavioral Attributes */}
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                <span className="text-xs font-mono font-bold text-gray-700 flex items-center gap-1.5 mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Soft Skills & Behavioral Attributes
                </span>
                <div className="flex flex-wrap gap-2">
                  {requirements?.soft_skills?.map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg text-xs font-mono font-medium shadow-2xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Key Job Responsibilities */}
              <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                <span className="text-xs font-mono font-bold text-gray-800 flex items-center gap-1.5 mb-2.5">
                  <span>📋</span> Key Job Responsibilities
                </span>
                <ul className="space-y-1.5 text-xs font-mono text-gray-600">
                  {requirements?.responsibilities?.map((resp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            /* LangGraph State JSON View */
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 font-mono text-xs text-emerald-400 overflow-y-auto max-h-[640px] leading-relaxed shadow-inner">
              <pre>{JSON.stringify(requirements, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
}
