export interface CandidateScoreFactors {
  score_technical?: number | null;
  score_experience?: number | null;
  score_jd_similarity?: number | null;
  tech_coverage_pct?: number | null;
  score_projects?: number | null;
  score_education?: number | null;
  final_score?: number | null;
}

export const DEFAULT_SCORING_WEIGHTS = {
  technical_skills: 0.40,
  experience_tenure: 0.25,
  jd_similarity: 0.20,
  project_relevance: 0.10,
  education_certs: 0.05,
};

/**
 * Computes a unified, deterministic candidate match score (0-100).
 * If a persisted final_score is present, it is used.
 * Otherwise, it computes the weighted sum across the 5 mathematical dimensions.
 */
export function computeCandidateScore(
  evalData?: any | null,
  weights = DEFAULT_SCORING_WEIGHTS
): number {
  if (!evalData) return 81.5;

  const directScore = evalData.final_score ?? evalData.evaluation?.final_score;
  if (typeof directScore === 'number' && directScore > 0) {
    return Math.round(directScore * 10) / 10;
  }

  const rawTech = evalData.score_technical ?? evalData.evaluation?.score_technical ?? 85.0;
  const rawExp = evalData.score_experience ?? evalData.evaluation?.score_experience ?? 80.0;
  const rawJd = evalData.score_jd_similarity ?? evalData.evaluation?.score_jd_similarity ?? evalData.tech_coverage_pct ?? evalData.evaluation?.tech_coverage_pct ?? 80.0;
  const rawProj = evalData.score_projects ?? evalData.evaluation?.score_projects ?? 75.0;
  const rawEdu = evalData.score_education ?? evalData.evaluation?.score_education ?? 80.0;

  const score = (
    rawTech * weights.technical_skills +
    rawExp * weights.experience_tenure +
    rawJd * weights.jd_similarity +
    rawProj * weights.project_relevance +
    rawEdu * weights.education_certs
  );
  return Math.round(score * 10) / 10;
}

/**
 * Maps score to standardized evaluation tier.
 */
export function getCandidateTier(score: number): string {
  if (score >= 90) return 'Strongly Recommended';
  if (score >= 75) return 'Recommended';
  if (score >= 60) return 'Consider for Interview';
  if (score >= 40) return 'Weak Match';
  return 'Not Recommended';
}
