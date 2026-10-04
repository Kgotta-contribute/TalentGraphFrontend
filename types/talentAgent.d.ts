interface TalentMandate {
  id: string;
  title: string;
  company: string;
  raw_jd?: string;
  status: 'draft' | 'analyzing' | 'active' | 'closed';
  job_requirements?: TalentJobRequirements;
  created_at: string;
  updated_at: string;
}

interface TalentJobRequirements {
  role: string;
  company?: string;
  experience_target_years: number;
  education_criteria: string;
  mandatory_skills: string[];
  preferred_skills: string[];
  soft_skills: string[];
  responsibilities: string[];
  domain_tags: string[];
}

interface TalentExperienceItem {
  company: string;
  title: string;
  start: string;
  end?: string;
  description: string;
  tech_tags: string[];
}

interface TalentProjectItem {
  name: string;
  description: string;
  tech_tags: string[];
  github_url?: string;
}

interface TalentEducationItem {
  degree: string;
  institution: string;
  graduation_year?: number;
}

interface TalentCandidateProfile {
  full_name: string;
  email?: string;
  phone?: string;
  location?: string;
  current_title?: string;
  years_experience: number;
  summary: string;
  skills: string[];
  experience_history: TalentExperienceItem[];
  projects: TalentProjectItem[];
  education: TalentEducationItem[];
  certifications: string[];
  github_url?: string;
  linkedin_url?: string;
}

interface TalentCandidate {
  id: string;
  full_name?: string;
  email?: string;
  github_url?: string;
  current_title?: string;
  years_experience?: number;
  profile?: TalentCandidateProfile;
  resumeiq_resume_id?: string;
  created_at: string;
}

interface TalentEvidenceItem {
  requirement: string;
  status: 'MATCHED' | 'PARTIAL' | 'MISSING' | 'UNKNOWN';
  source: 'RESUME' | 'PROJECT' | 'GITHUB' | 'EDUCATION';
  evidence: string;
  confidence: number;
}

interface TalentVerificationResult {
  candidate_id: string;
  matched_required: string[];
  matched_preferred: string[];
  required_gaps: string[];
  preferred_gaps: string[];
  partial_matches: string[];
  evidence: TalentEvidenceItem[];
  tech_coverage_pct: number;
}

interface TalentScoringFactors {
  technical_skills: number;
  experience_tenure: number;
  jd_similarity: number;
  project_relevance: number;
  education_certs: number;
}

interface TalentScoringWeights {
  technical_skills: number;
  experience_tenure: number;
  jd_similarity: number;
  project_relevance: number;
  education_certs: number;
}

interface TalentEvaluation {
  id: string;
  mandate_id: string;
  candidate_id: string;
  candidate?: TalentCandidate;
  verification_result?: TalentVerificationResult;
  tech_coverage_pct?: number;
  github_analysis?: TalentGitHubAnalysis;
  github_verified: boolean;
  score_technical?: number;
  score_experience?: number;
  score_jd_similarity?: number;
  score_projects?: number;
  score_education?: number;
  final_score?: number;
  tier?: string;
  scoring_weights?: TalentScoringWeights;
  report?: TalentRecruitmentDossier;
  status: string;
  created_at: string;
}

interface TalentGitHubEvidence {
  skill: string;
  verified: boolean;
  repo: string;
  file_path?: string;
  evidence: string;
  confidence: number;
}

interface TalentGitHubAnalysis {
  candidate_id: string;
  github_url: string;
  repos_analyzed: string[];
  verified_skills: string[];
  unverified_skills: string[];
  activity_signal: 'active' | 'dormant' | 'forks_only' | 'unavailable';
  evidence: TalentGitHubEvidence[];
  summary: string;
}

interface TalentInterviewQuestion {
  focus_area: string;
  question: string;
  rationale: string;
  keywords: string[];
}

interface TalentRecruitmentDossier {
  candidate_id: string;
  executive_summary: string;
  key_strengths: string[];
  identified_skill_gaps: string[];
  risk_factors: string[];
  ramp_up_considerations: string[];
  final_verdict: string;
  hiring_confidence: number;
  relevant_experience: Record<string, unknown>[];
  relevant_projects: Record<string, unknown>[];
  github_summary?: string;
  interview_questions: TalentInterviewQuestion[];
}

interface TalentAnalysisRun {
  id: string;
  mandate_id: string;
  run_type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  agent1_status: string;
  agent2_status: string;
  agent3_status: string;
  github_status: string;
  agent4_status: string;
  agent5_status: string;
  errors: string[];
  created_at: string;
}

interface GitHubRepoInfo {
  owner: string;
  name: string;
  full_name: string;
  html_url: string;
  description: string;
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  license: string;
  default_branch: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size_kb: number;
}

interface GitHubLanguageItem {
  name: string;
  bytes: number;
  percentage: number;
}

interface GitHubRootFileItem {
  name: string;
  type: string;
  size: number;
  path: string;
}

interface GitHubCommitItem {
  sha: string;
  message: string;
  author: string;
  date: string;
}

interface GitHubComponentItem {
  name: string;
  path: string;
  responsibility: string;
  technologies: string[];
}

interface GitHubDesignPattern {
  pattern: string;
  rationale: string;
}

interface GitHubArchitectureComponent {
  name: string;
  tech: string;
  path: string;
  metrics?: string;
  responsibility: string;
  evidence?: string;
  line_number?: number;
  confidence?: number;
}

interface GitHubArchitectureZone {
  name: string;
  badge: string;
  icon: string;
  description: string;
  components: GitHubArchitectureComponent[];
}

interface GitHubRequestLifecycleStep {
  step: number;
  layer: string;
  component: string;
  action: string;
  file_path: string;
  code_snippet?: string;
  output?: string;
}

interface GitHubDataFlowStage {
  stage: number;
  name: string;
  input: string;
  transformation: string;
  output: string;
  component: string;
  file_path: string;
}

interface GitHubAgentPipelineNode {
  name: string;
  role: string;
  file_path: string;
  inputs?: string[];
  outputs?: string[];
  tools_or_models?: string[];
}

interface GitHubAgentPipeline {
  framework: string;
  orchestration: string;
  nodes: GitHubAgentPipelineNode[];
  conditional_edges?: { from: string; to: string; condition: string }[];
}

interface GitHubComplexityMetrics {
  components_count: number;
  endpoints_count: number;
  data_stores_count: number;
  ai_components_count: number;
  complexity_rating: number;
  modularity_rating: number;
  coupling_rating: number;
}

interface GitHubArchitectureAnalysis {
  architecture_style: string;
  system_summary: string;
  tech_stack: {
    frontend: string[];
    backend: string[];
    database_and_storage: string[];
    ai_and_data: string[];
    devops_and_cloud: string[];
    testing_and_tooling: string[];
  };
  core_components: GitHubComponentItem[];
  zones?: GitHubArchitectureZone[];
  request_lifecycle?: GitHubRequestLifecycleStep[];
  data_flow_stages?: GitHubDataFlowStage[];
  agent_pipeline?: GitHubAgentPipeline;
  complexity_metrics?: GitHubComplexityMetrics;
  design_patterns: GitHubDesignPattern[];
  data_flow_explanation: string;
  engineering_strengths: string[];
  potential_bottlenecks_and_risks: string[];
  technical_complexity_score: number;
  production_readiness_tier: string;
  ascii_architecture_diagram?: string;
}

interface GitHubRepoAnalysisResult {
  repo_info: GitHubRepoInfo;
  languages: GitHubLanguageItem[];
  root_contents: GitHubRootFileItem[];
  recent_commits: GitHubCommitItem[];
  analysis: GitHubArchitectureAnalysis;
}

// ──────────────────────────────────────────────
// Harness result types (full pipeline)
// ──────────────────────────────────────────────

interface GitHubObservabilityStep {
  label: string;
  status: string;
  detail?: string;
}

interface GitHubObservability {
  tools_used: number;
  files_analyzed: number;
  execution_time_seconds: number;
  steps: GitHubObservabilityStep[];
  errors: string[];
}

interface GitHubDependencyPackage {
  name: string;
  version: string | null;
  category: string;
  purpose: string;
  ecosystem: string;
}

interface GitHubDependencyAnalysis {
  packages: GitHubDependencyPackage[];
  total_deps: number;
  summary: string;
}

interface GitHubRagAnalysis {
  rag_detected: boolean;
  confidence: number;
  framework: string;
  vector_store: string;
  embedding_model: string | null;
  pipeline_stages: string[];
  evidence_files: string[];
  llm_provider: string;
  summary: string;
}

interface GitHubAgentItem {
  name: string;
  role: string;
  file_path: string | null;
}

interface GitHubAgentDetection {
  agents_detected: boolean;
  framework: string;
  agent_count: number;
  agents: GitHubAgentItem[];
  graph_nodes: string[];
  state_management: string;
  orchestration_pattern: string;
  evidence_files: string[];
  summary: string;
}

interface GitHubSecurityAnalysis {
  hardcoded_secrets_found: boolean;
  secret_indicators: string[];
  auth_mechanism: string;
  authz_patterns: string[];
  insecure_configs: string[];
  security_strengths: string[];
  overall_risk: 'low' | 'medium' | 'high' | 'unknown';
  summary: string;
}

interface GitHubCiCdWorkflow {
  name: string;
  triggers: string[];
  stages: string[];
  summary: string;
}

interface GitHubCiCdAnalysis {
  has_ci: boolean;
  platform: string;
  workflows: GitHubCiCdWorkflow[];
  test_automation: boolean;
  deployment_target: string | null;
  summary: string;
}

interface GitHubCodeQuality {
  type_hints_coverage: string;
  test_files_detected: string[];
  has_tests: boolean;
  error_handling_quality: string;
  hardcoded_configs: string[];
  documentation_quality: string;
  code_organization: string;
  overall_quality_score: number;
  strengths: string[];
  improvement_areas: string[];
}

interface GitHubGitActivity {
  stars: number;
  forks: number;
  open_issues: number;
  watchers: number;
  created_at: string;
  pushed_at: string;
  default_branch: string;
  topics: string[];
  license: string | null;
  days_since_push: number | null;
  activity_signal: 'active' | 'slow' | 'dormant';
  recent_commits: GitHubCommitItem[];
  commit_authors: string[];
  size_kb: number;
}

interface GitHubHarnessResult {
  // Core
  repo_url?: string;
  subpath?: string | null;
  branch?: string | null;
  repo_info: GitHubRepoInfo;
  languages: GitHubLanguageItem[];
  file_tree: GitHubRootFileItem[];
  recent_commits: GitHubCommitItem[];
  manifest_files: Record<string, string>;
  cicd_files: Record<string, string>;
  // Per-agent analysis
  architecture: GitHubArchitectureAnalysis;
  dependencies: GitHubDependencyAnalysis;
  rag_analysis: GitHubRagAnalysis;
  agent_detection: GitHubAgentDetection;
  security: GitHubSecurityAnalysis;
  cicd_analysis: GitHubCiCdAnalysis;
  code_quality: GitHubCodeQuality;
  git_activity: GitHubGitActivity;
  // Chat cache
  source_code_samples: Record<string, string>;
  readme: string;
  // Observability panel
  observability: GitHubObservability;
}

interface GitHubChatResponse {
  answer: string;
  evidence_files: string[];
  confidence: number;
  disclaimer?: string;
  tools_used: number;
}

interface GitHubChatMessage {
  role: 'user' | 'assistant';
  content: string;
  evidence_files?: string[];
  confidence?: number;
  tools_used?: number;
  timestamp: number;
}
