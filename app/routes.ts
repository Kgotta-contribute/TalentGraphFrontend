import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    
    // TalentAgent Recruiter Routes
    route('/recruiter', 'routes/recruiter/dashboard.tsx'),

    // Job Description (with and without mandateId parameter)
    route('/recruiter/mandates/:mandateId/job-description', 'routes/recruiter/job-description.tsx', { id: 'mandate-jd' }),
    route('/recruiter/mandates/job-description', 'routes/recruiter/job-description.tsx', { id: 'default-jd' }),

    // Candidates / Resume Upload (with and without mandateId parameter)
    route('/recruiter/mandates/:mandateId/candidates', 'routes/recruiter/candidates.tsx', { id: 'mandate-candidates' }),
    route('/recruiter/mandates/candidates', 'routes/recruiter/candidates.tsx', { id: 'default-candidates' }),

    // Candidate Ranking (with and without mandateId parameter)
    route('/recruiter/mandates/:mandateId/ranking', 'routes/recruiter/ranking.tsx', { id: 'mandate-ranking' }),
    route('/recruiter/mandates/ranking', 'routes/recruiter/ranking.tsx', { id: 'default-ranking' }),

    // Candidate Detail (with and without mandateId parameter)
    route('/recruiter/mandates/:mandateId/candidates/:candidateId', 'routes/recruiter/candidate-detail.tsx', { id: 'mandate-candidate-detail' }),
    route('/recruiter/mandates/candidates/:candidateId', 'routes/recruiter/candidate-detail.tsx', { id: 'default-candidate-detail' }),

    // GitHub MCP (all variants)
    route('/recruiter/mandates/:mandateId/github-mcp', 'routes/recruiter/github-mcp.tsx', { id: 'mandate-github-mcp' }),
    route('/recruiter/mandates/github-mcp', 'routes/recruiter/github-mcp.tsx', { id: 'mandate-github-mcp-no-id' }),
    route('/recruiter/github-mcp', 'routes/recruiter/github-mcp.tsx', { id: 'standalone-github-mcp' }),

    // Reports / Recruitment Dossier (with and without mandateId parameter)
    route('/recruiter/mandates/:mandateId/reports/:candidateId', 'routes/recruiter/report.tsx', { id: 'mandate-report' }),
    route('/recruiter/mandates/reports/:candidateId', 'routes/recruiter/report.tsx', { id: 'default-report' }),
] satisfies RouteConfig;
