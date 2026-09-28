import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('/auth', 'routes/auth.tsx'),
    route('/upload', 'routes/upload.tsx'),
    route('/resume/:id', 'routes/resume.tsx'),
    // TalentAgent Recruiter Routes
    route('/recruiter', 'routes/recruiter/dashboard.tsx'),
    route('/recruiter/mandates/:mandateId/job-description', 'routes/recruiter/job-description.tsx'),
    route('/recruiter/mandates/:mandateId/candidates', 'routes/recruiter/candidates.tsx'),
    route('/recruiter/mandates/:mandateId/ranking', 'routes/recruiter/ranking.tsx'),
    route('/recruiter/mandates/:mandateId/candidates/:candidateId', 'routes/recruiter/candidate-detail.tsx'),
    route('/recruiter/mandates/:mandateId/github-mcp', 'routes/recruiter/github-mcp.tsx', { id: 'mandate-github-mcp' }),
    route('/recruiter/github-mcp', 'routes/recruiter/github-mcp.tsx', { id: 'standalone-github-mcp' }),
    route('/recruiter/mandates/:mandateId/reports/:candidateId', 'routes/recruiter/report.tsx'),
] satisfies RouteConfig;
