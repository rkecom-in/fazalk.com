/**
 * Assessment primitives safe to import from client components.
 * (No system prompt, tool schema, or server request builder — see lib/assessment.ts.)
 */

export const SITUATION_MAX_LEN = 600

export const DIM_LABELS = ['Stage', 'Leadership', 'Clarity', 'Exposure', 'Challenge'] as const

// Risk values per question/option. Must stay fixed — only display strings are translated.
export const QUESTION_RISKS: number[][] = [
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [1, 2, 3, 4],
  [2, 2, 3, 4],
]

export interface AssessmentResult {
  riskLevel: 'Low' | 'Medium' | 'High'
  overallScore: number
  dimensionScores: Record<string, number>
  headline: string
  analysis: string
  topRisk: string
  nextStep: string
}

export function getRiskLevelFromScore(score: number): AssessmentResult['riskLevel'] {
  if (score <= 9) return 'Low'
  if (score <= 14) return 'Medium'
  return 'High'
}

/** Risk score per dimension for the given answer indexes. Out-of-range -> 0. */
export function computeScores(answers: number[]): number[] {
  return QUESTION_RISKS.map((row, i) => row[answers[i]] ?? 0)
}
