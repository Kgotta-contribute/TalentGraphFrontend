// Shared Sample Candidates Data parsed from C:\Users\verma\OneDrive\ドキュメント\RESUMES SAMPLE
// Used across Candidates, Ranking, Candidate Detail, and Report pages

export interface SampleCandidate {
  id: string;
  candidate_id: string;
  mandate_id?: string;
  final_score?: number;
  tier?: string;
  tech_coverage_pct?: number;
  score_technical?: number;
  score_experience?: number;
  score_jd_similarity?: number;
  score_projects?: number;
  score_education?: number;
  status?: string;
  candidate: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    location?: string;
    current_title: string;
    years_experience: number;
    github_url: string | null;
    linkedin_url: string | null;
    profile: {
      full_name?: string;
      email?: string;
      phone?: string;
      location?: string;
      current_title?: string;
      years_experience?: number;
      summary?: string;
      skills: string[];
      experience_history?: Array<{
        company: string;
        title: string;
        start: string;
        end?: string;
        description: string;
        tech_tags?: string[];
      }>;
      projects?: Array<{
        name: string;
        description: string;
        tech_tags?: string[];
        github_url?: string | null;
      }>;
      education: Array<{
        degree: string;
        institution: string;
        graduation_year?: number;
      }>;
      certifications?: string[];
    };
  };
  verification_result?: {
    tech_coverage_pct: number;
    matched_required: string[];
    matched_preferred: string[];
    required_gaps: string[];
    preferred_gaps: string[];
  };
  report?: {
    executive_summary: string;
    key_strengths: string[];
    identified_skill_gaps: string[];
    risk_factors: string[];
    ramp_up_considerations: string[];
    final_verdict: string;
    hiring_confidence: number;
    interview_questions: Array<{
      focus_area: string;
      question: string;
      rationale: string;
      keywords: string[];
    }>;
  };
}

export const SAMPLE_CANDIDATES: SampleCandidate[] = [
  {
    id: 'c2000000-0000-0000-0000-000000000006',
    candidate_id: 'c2000000-0000-0000-0000-000000000006',
    status: 'Parsed',
    final_score: 94.5,
    tier: 'Strongly Recommended',
    tech_coverage_pct: 95,
    score_technical: 96.0,
    score_experience: 98.0,
    score_jd_similarity: 92.0,
    score_projects: 90.0,
    score_education: 90.0,
    candidate: {
      id: 'c2000000-0000-0000-0000-000000000006',
      full_name: 'Rohan Verma',
      email: 'rohan.verma.dev@gmail.com',
      phone: '+91-9845012345',
      location: 'Bangalore, India',
      current_title: 'Senior Staff Software Engineer',
      years_experience: 12.0,
      github_url: 'https://github.com/rohanvermadev',
      linkedin_url: 'https://www.linkedin.com/in/rohanvermadev/',
      profile: {
        full_name: 'Rohan Verma',
        email: 'rohan.verma.dev@gmail.com',
        phone: '+91-9845012345',
        location: 'Bangalore, India',
        current_title: 'Senior Staff Software Engineer',
        years_experience: 12.0,
        summary: 'Senior Staff Software Engineer with 12 years of experience building scalable AI-powered distributed systems for consumer and enterprise platforms. Expertise in Java, Python, microservices, Agentic AI and system design, with proven ownership of complex architectures at Walmart, Zscaler, Ola, and Paytm.',
        skills: ['Java', 'Python', 'Microservices', 'Spring Boot', 'Kafka', 'Distributed Systems', 'Agentic AI', 'MCP', 'LLMs', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis', 'AWS'],
        experience_history: [
          {
            company: 'Zscaler',
            title: 'Senior Staff Software Engineer',
            start: 'Feb 2026',
            end: 'Present',
            description: 'Designed and built a secure enterprise AI chat platform using Agentic AI, MCP, RAG, and distributed systems to enable intelligent access to enterprise data. Consolidated overlapping features and automated analytics workflows.',
            tech_tags: ['Python', 'FastAPI', 'PydanticAI', 'AWS', 'PostgreSQL', 'MCP', 'Agent Orchestration']
          },
          {
            company: 'Coforge',
            title: 'Senior Lead Software Engineer',
            start: 'Jan 2025',
            end: 'Jan 2026',
            description: 'Owned microservices architecture of shopmyexchange.com and credit card platform. Handled entire SDLC with 50k+ QPS during peak traffic while maintaining p95 latency 200ms and 99.9% availability.',
            tech_tags: ['Java', 'Spring Boot', 'Distributed Systems', 'Kubernetes', 'GCP', 'Cassandra']
          },
          {
            company: 'WalmartLabs',
            title: 'Software Engineer 3',
            start: 'Feb 2019',
            end: 'Jul 2020',
            description: 'Engineered high-throughput invoice processing pipelines and customer messaging bots. Won 1st place in Walmart-level hackathon Codeception.',
            tech_tags: ['Java', 'Microservices', 'Kafka', 'Spring Boot']
          }
        ],
        projects: [
          {
            name: 'Enterprise Agentic AI Gateway',
            description: 'Multi-agent orchestration platform supporting contextual memory, tool routing, and secure vector RAG over enterprise data repositories.',
            tech_tags: ['Python', 'LangGraph', 'FastAPI', 'pgvector', 'Docker'],
            github_url: 'https://github.com/rohanvermadev/agentic-gateway'
          }
        ],
        education: [
          { degree: 'B.Tech Computer Science & Engineering', institution: 'The LNM Institute of Information Technology (LNMIIT), Jaipur', graduation_year: 2014 }
        ],
        certifications: ['AWS Certified Solutions Architect', 'Kubernetes Certified Administrator']
      }
    },
    verification_result: {
      tech_coverage_pct: 95,
      matched_required: ['Java', 'Python', 'Microservices', 'Distributed Systems', 'Kafka', 'Docker', 'Kubernetes', 'PostgreSQL'],
      matched_preferred: ['Agentic AI', 'MCP', 'AWS', 'Redis', 'FastAPI'],
      required_gaps: [],
      preferred_gaps: []
    }
  },
  {
    id: 'c2000000-0000-0000-0000-000000000005',
    candidate_id: 'c2000000-0000-0000-0000-000000000005',
    status: 'Parsed',
    final_score: 91.2,
    tier: 'Strongly Recommended',
    tech_coverage_pct: 90,
    score_technical: 92.0,
    score_experience: 95.0,
    score_jd_similarity: 90.0,
    score_projects: 88.0,
    score_education: 90.0,
    candidate: {
      id: 'c2000000-0000-0000-0000-000000000005',
      full_name: 'Priya Venkatesh Rao',
      email: 'priya.venkatesh.rao@gmail.com',
      phone: '+91-9876543210',
      location: 'Hyderabad, India',
      current_title: 'Senior Software Engineer II',
      years_experience: 9.0,
      github_url: 'https://github.com/priyavenkatesh',
      linkedin_url: 'https://www.linkedin.com/in/priyavenkateshrao/',
      profile: {
        full_name: 'Priya Venkatesh Rao',
        email: 'priya.venkatesh.rao@gmail.com',
        phone: '+91-9876543210',
        location: 'Hyderabad, India',
        current_title: 'Senior Software Engineer II',
        years_experience: 9.0,
        summary: 'Senior Software Engineer with 9 years of experience in distributed microservices, low-latency streaming pipelines, and event-driven architectures using Go, Java, Kafka, and gRPC.',
        skills: ['Java', 'Go', 'Python', 'TypeScript', 'Microservices', 'Spring Boot', 'gRPC', 'Kafka', 'Event-Driven Architecture', 'High Level Design', 'PostgreSQL', 'Docker'],
        experience_history: [
          {
            company: 'Grab Financial Group',
            title: 'Senior Software Engineer II',
            start: '2021',
            end: 'Present',
            description: 'Architected real-time fraud mitigation streaming services processing 80,000 events/second using Kafka and Go. Reduced p99 latency by 42%.',
            tech_tags: ['Go', 'Kafka', 'gRPC', 'PostgreSQL', 'Kubernetes']
          }
        ],
        projects: [
          {
            name: 'Distributed Event Bus Engine',
            description: 'Ultra-low latency pub/sub streaming gateway built with Go and gRPC for microservice telemetry aggregation.',
            tech_tags: ['Go', 'gRPC', 'Kafka', 'Prometheus']
          }
        ],
        education: [
          { degree: 'B.Tech Computer Science & Engineering', institution: 'National Institute of Technology (NIT), Trichy', graduation_year: 2016 }
        ],
        certifications: ['Confluent Certified Developer for Apache Kafka']
      }
    },
    verification_result: {
      tech_coverage_pct: 90,
      matched_required: ['Java', 'Go', 'Microservices', 'Kafka', 'Distributed Systems', 'PostgreSQL'],
      matched_preferred: ['gRPC', 'TypeScript', 'Docker'],
      required_gaps: [],
      preferred_gaps: []
    }
  },
  {
    id: 'c2000000-0000-0000-0000-000000000001',
    candidate_id: 'c2000000-0000-0000-0000-000000000001',
    status: 'Parsed',
    final_score: 86.8,
    tier: 'Recommended',
    tech_coverage_pct: 85,
    score_technical: 88.0,
    score_experience: 85.0,
    score_jd_similarity: 86.0,
    score_projects: 84.0,
    score_education: 88.0,
    candidate: {
      id: 'c2000000-0000-0000-0000-000000000001',
      full_name: 'Ananya Mehta',
      email: 'ananya.mehta.dev@gmail.com',
      phone: '+91-9123456780',
      location: 'Pune, India',
      current_title: 'Software Engineer II',
      years_experience: 4.0,
      github_url: null,
      linkedin_url: 'https://linkedin.com/in/ananyamehta1/',
      profile: {
        full_name: 'Ananya Mehta',
        email: 'ananya.mehta.dev@gmail.com',
        location: 'Pune, India',
        current_title: 'Software Engineer II',
        years_experience: 4.0,
        summary: 'Software Engineer with 4 years specializing in backend microservices, AWS cloud infrastructure, Vault security, and scalable data caching with Redis and PostgreSQL.',
        skills: ['Python', 'Java', 'AWS', 'Vault', 'Kubernetes', 'Kafka', 'Redis', 'PostgreSQL', 'Elasticsearch', 'Spring Boot', 'RESTful APIs', 'Grafana'],
        experience_history: [
          {
            company: 'Persistent Systems',
            title: 'Software Engineer II',
            start: '2022',
            end: 'Present',
            description: 'Built scalable backend microservices on AWS with Vault secret management and Redis caching layers. Improved API throughput by 35%.',
            tech_tags: ['Java', 'Spring Boot', 'AWS', 'Redis', 'PostgreSQL']
          }
        ],
        projects: [
          {
            name: 'Cloud Secret Synchronizer',
            description: 'Automated policy rotation daemon across multi-region Kubernetes clusters integrated with HashiCorp Vault.',
            tech_tags: ['Python', 'Vault', 'Kubernetes', 'AWS']
          }
        ],
        education: [
          { degree: 'B.Tech - Computer Science and Engineering', institution: 'PSG College Of Technology', graduation_year: 2022 }
        ],
        certifications: ['AWS Certified Developer Associate']
      }
    },
    verification_result: {
      tech_coverage_pct: 85,
      matched_required: ['Python', 'Java', 'AWS', 'Kubernetes', 'PostgreSQL', 'Kafka'],
      matched_preferred: ['Redis', 'Elasticsearch', 'Grafana'],
      required_gaps: [],
      preferred_gaps: []
    }
  },
  {
    id: 'c2000000-0000-0000-0000-000000000003',
    candidate_id: 'c2000000-0000-0000-0000-000000000003',
    status: 'Parsed',
    final_score: 83.5,
    tier: 'Recommended',
    tech_coverage_pct: 80,
    score_technical: 82.0,
    score_experience: 88.0,
    score_jd_similarity: 82.0,
    score_projects: 85.0,
    score_education: 90.0,
    candidate: {
      id: 'c2000000-0000-0000-0000-000000000003',
      full_name: 'Maria Fernandez',
      email: 'maria.fernandez.mem@gmail.com',
      phone: '+1-919-555-0143',
      location: 'Durham, NC',
      current_title: 'Student Product Consultant',
      years_experience: 6.2,
      github_url: null,
      linkedin_url: 'https://linkedin.com/in/mariafernandez',
      profile: {
        full_name: 'Maria Fernandez',
        email: 'maria.fernandez.mem@gmail.com',
        location: 'Durham, NC',
        current_title: 'Student Product Consultant',
        years_experience: 6.2,
        summary: 'Engineering manager and technical product consultant with 6+ years experience bridging software engineering, streaming systems, and enterprise GenAI/RAG deployments.',
        skills: ['Data Streaming', 'PRD', 'Cloud Services', 'OpenAI', 'RAGs', 'Jira', 'Confluence', 'Figma', 'Java', 'Python', 'JavaScript', 'Salesforce'],
        experience_history: [
          {
            company: 'Duke Tech Solutions',
            title: 'Technical Product Consultant',
            start: '2023',
            end: 'Present',
            description: 'Consulted enterprise clients on GenAI retrieval-augmented generation pipelines and cloud migration roadmaps.',
            tech_tags: ['OpenAI', 'RAGs', 'Python', 'AWS']
          }
        ],
        projects: [
          {
            name: 'Enterprise GenAI Knowledge Retrieval System',
            description: 'Designed interactive RAG architecture with vector databases and prompt evaluation benchmarks.',
            tech_tags: ['Python', 'OpenAI', 'Vector Search']
          }
        ],
        education: [
          { degree: 'Master of Engineering Management', institution: 'Duke University', graduation_year: 2025 }
        ],
        certifications: ['Scrum Product Owner (CSPO)']
      }
    },
    verification_result: {
      tech_coverage_pct: 80,
      matched_required: ['Python', 'Java', 'Cloud Services', 'Data Streaming'],
      matched_preferred: ['OpenAI', 'RAGs'],
      required_gaps: [],
      preferred_gaps: []
    }
  },
  {
    id: 'c2000000-0000-0000-0000-000000000004',
    candidate_id: 'c2000000-0000-0000-0000-000000000004',
    status: 'Parsed',
    final_score: 79.4,
    tier: 'Recommended',
    tech_coverage_pct: 75,
    score_technical: 78.0,
    score_experience: 78.0,
    score_jd_similarity: 80.0,
    score_projects: 82.0,
    score_education: 80.0,
    candidate: {
      id: 'c2000000-0000-0000-0000-000000000004',
      full_name: 'Priya Sharma',
      email: 'priya.sharma.dev2024@gmail.com',
      phone: '+91-9781234567',
      location: 'Chandigarh, India',
      current_title: 'Software Developer',
      years_experience: 2.3,
      github_url: null,
      linkedin_url: 'https://www.linkedin.com/in/priyasharmadev/',
      profile: {
        full_name: 'Priya Sharma',
        email: 'priya.sharma.dev2024@gmail.com',
        location: 'Chandigarh, India',
        current_title: 'Software Developer',
        years_experience: 2.3,
        summary: 'Full-stack software developer with 2+ years experience building web applications using Python, Django, React.js, and containerized deployments with Docker and Kubernetes.',
        skills: ['Python', 'C++', 'Java', 'Spring Boot', 'Django', 'React.js', 'Kubernetes', 'Docker', 'Git', 'PostgreSQL', 'MySQL', 'MongoDB'],
        experience_history: [
          {
            company: 'Tech Mahindra',
            title: 'Software Developer',
            start: '2022',
            end: 'Present',
            description: 'Developed REST APIs using Django and React.js frontend interfaces for enterprise logistics management platform.',
            tech_tags: ['Python', 'Django', 'React.js', 'PostgreSQL', 'Docker']
          }
        ],
        projects: [
          {
            name: 'Containerized Microservice Dashboard',
            description: 'Full-stack dashboard for container metrics monitoring and automated alert management.',
            tech_tags: ['React.js', 'Django', 'Docker', 'Kubernetes']
          }
        ],
        education: [
          { degree: 'Bachelor of Technology', institution: 'Guru Nanak Dev Engineering College', graduation_year: 2021 }
        ],
        certifications: []
      }
    },
    verification_result: {
      tech_coverage_pct: 75,
      matched_required: ['Python', 'Java', 'React.js', 'PostgreSQL', 'Docker'],
      matched_preferred: ['Kubernetes', 'MongoDB'],
      required_gaps: [],
      preferred_gaps: []
    }
  },
  {
    id: 'c2000000-0000-0000-0000-000000000002',
    candidate_id: 'c2000000-0000-0000-0000-000000000002',
    status: 'Parsed',
    final_score: 72.8,
    tier: 'Consider for Interview',
    tech_coverage_pct: 70,
    score_technical: 74.0,
    score_experience: 65.0,
    score_jd_similarity: 75.0,
    score_projects: 85.0,
    score_education: 78.0,
    candidate: {
      id: 'c2000000-0000-0000-0000-000000000002',
      full_name: 'Chhaya Verma',
      email: 'chhaya.verma.dev@gmail.com',
      phone: '+91-9988776655',
      location: 'Durgapur, India',
      current_title: 'Software Development Engineer Intern',
      years_experience: 1.0,
      github_url: 'https://github.com/ChhayaVKumar',
      linkedin_url: 'https://linkedin.com/in/chhaya-verma',
      profile: {
        full_name: 'Chhaya Verma',
        email: 'chhaya.verma.dev@gmail.com',
        location: 'Durgapur, India',
        current_title: 'Software Development Engineer Intern',
        years_experience: 1.0,
        summary: 'Energetic full-stack developer with 1 year internship experience building modern web applications with React, Next.js, TypeScript, Node.js, and Spring Boot.',
        skills: ['C++', 'Java', 'Python', 'JavaScript', 'TypeScript', 'SQL', 'React', 'Next.js', 'Node.js', 'Prisma', 'Spring Boot', 'REST APIs'],
        experience_history: [
          {
            company: 'Fintech Startup Labs',
            title: 'Software Development Engineer Intern',
            start: '2023',
            end: 'Present',
            description: 'Developed responsive user interfaces with Next.js and Tailwind CSS; created backend REST endpoints with Node.js and Prisma.',
            tech_tags: ['Next.js', 'TypeScript', 'Node.js', 'Prisma']
          }
        ],
        projects: [
          {
            name: 'Interactive Code Sandbox',
            description: 'Browser-based execution environment built with Next.js, Monaco Editor, and containerized code runners.',
            tech_tags: ['TypeScript', 'Next.js', 'Docker'],
            github_url: 'https://github.com/ChhayaVKumar/code-sandbox'
          }
        ],
        education: [
          { degree: 'Bachelor of Technology in Electrical Engineering', institution: 'National Institute of Technology, Durgapur', graduation_year: 2026 }
        ],
        certifications: []
      }
    },
    verification_result: {
      tech_coverage_pct: 70,
      matched_required: ['Java', 'Python', 'TypeScript', 'React', 'REST APIs'],
      matched_preferred: ['Next.js', 'Node.js'],
      required_gaps: ['Senior Distributed Systems Architecture'],
      preferred_gaps: []
    }
  }
];

export const SAMPLE_RANKING_CANDIDATES = SAMPLE_CANDIDATES;
