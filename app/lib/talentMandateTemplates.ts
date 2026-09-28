export interface TemplateMandateMeta {
  id: string;
  templateKey: string;
  title: string;
  company: string;
  role: string;
  domain_tags: string[];
}

export const TEMPLATE_MANDATES: TemplateMandateMeta[] = [
  {
    id: 'a0000000-0000-0000-0000-000000000001',
    templateKey: 'Tekion Senior Full-Stack',
    title: 'Senior Full-Stack & AI Systems Engineer',
    company: 'Tekion',
    role: 'Senior Full-Stack & AI Systems Engineer',
    domain_tags: ['AI/ML', 'Full-Stack', 'Distributed Systems', 'Cloud'],
  },
  {
    id: 'a0000000-0000-0000-0000-000000000002',
    templateKey: 'Senior Cloud & DevOps',
    title: 'Senior Cloud Platform & DevOps Engineer',
    company: 'Aether Cloud Networks',
    role: 'Senior Cloud Platform & DevOps Engineer',
    domain_tags: ['Cloud', 'DevOps', 'Kubernetes', 'Infrastructure as Code', 'SRE'],
  },
  {
    id: 'a0000000-0000-0000-0000-000000000003',
    templateKey: 'Staff Machine Learning',
    title: 'Staff Machine Learning Engineer',
    company: 'Cognitive Core AI',
    role: 'Staff Machine Learning Engineer',
    domain_tags: ['Machine Learning', 'LLMs', 'PyTorch', 'Distributed Training'],
  },
  {
    id: 'a0000000-0000-0000-0000-000000000004',
    templateKey: 'Amazon SDE II (Paragon)',
    title: 'Software Development Engineer II',
    company: 'Amazon',
    role: 'Software Development Engineer II',
    domain_tags: ['Distributed Systems', 'Cloud', 'AWS', 'Backend'],
  },
  {
    id: 'a0000000-0000-0000-0000-000000000005',
    templateKey: 'Rippling (AI Governance)',
    title: 'Software Engineer II (AI Governance)',
    company: 'Rippling',
    role: 'Software Engineer II (AI Governance)',
    domain_tags: ['AI Governance', 'Security', 'MCP', 'Full-Stack', 'Identity'],
  },
];

export const TEMPLATE_MANDATE_IDS = new Set<string>(
  TEMPLATE_MANDATES.map((t) => t.id)
);

export function isTemplateMandate(id?: string | null): boolean {
  if (!id) return false;
  return TEMPLATE_MANDATE_IDS.has(id);
}

export function getTemplateMandateId(templateKey: string): string | undefined {
  const normalized = templateKey.toLowerCase();
  if (normalized.includes('full-stack') || normalized.includes('tekion')) {
    return 'a0000000-0000-0000-0000-000000000001';
  }
  const match = TEMPLATE_MANDATES.find(
    (t) => t.templateKey.toLowerCase() === normalized
  );
  return match?.id;
}

export function getTemplateKeyFromId(id?: string | null): string | undefined {
  if (!id) return undefined;
  const match = TEMPLATE_MANDATES.find((t) => t.id === id);
  return match?.templateKey;
}

/**
 * Organizes mandates into:
 * 1) Up to 5 User-added Mandates (newest first, sliding window limit of 5)
 * 2) Exactly 5 Load Template Mandates
 * Total length is at most 10 in a row.
 */
export function organizeMandates(rawMandates: TalentMandate[]): TalentMandate[] {
  const userMandates: TalentMandate[] = [];
  const templateMandatesMap = new Map<string, TalentMandate>();

  for (const m of rawMandates) {
    if (isTemplateMandate(m.id)) {
      templateMandatesMap.set(m.id, m);
    } else {
      userMandates.push(m);
    }
  }

  // Sort user mandates newest first (created_at DESC)
  userMandates.sort((a, b) => {
    const da = a.created_at ? new Date(a.created_at).getTime() : 0;
    const db = b.created_at ? new Date(b.created_at).getTime() : 0;
    return db - da;
  });

  // Limit user mandates to at most 5
  const cappedUserMandates = userMandates.slice(0, 5);

  // Collect the 5 template mandates in order, filling from TEMPLATE_MANDATES metadata if not in API response
  const templateMandates: TalentMandate[] = TEMPLATE_MANDATES.map((meta) => {
    const found = templateMandatesMap.get(meta.id);
    if (found) return found;
    // Fallback stub if not returned by API
    return {
      id: meta.id,
      title: meta.title,
      company: meta.company,
      status: 'active',
      job_requirements: {
        role: meta.role,
        experience_target_years: 3,
        education_criteria: "Bachelor's Degree",
        mandatory_skills: [],
        preferred_skills: [],
        soft_skills: [],
        responsibilities: [],
        domain_tags: meta.domain_tags,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as TalentMandate;
  });

  // Return user-added JDs first (up to 5), then the 5 load templates -> max 10 total
  return [...cappedUserMandates, ...templateMandates];
}
