import { z } from 'zod';

const CategoryScoreSchema = z.object({
  score: z.number().min(0).max(100),
  label: z.string(),
  maxScore: z.number(),
});

const FeedbackItemSchema = z.object({
  severity: z.enum(['high', 'medium', 'low']),
  category: z.enum(['format', 'keywords', 'structure', 'content']),
  message: z.string(),
  suggestion: z.string(),
});

const AnalysisResultSchema = z.object({
  overallScore: z.number().min(0).max(100),
  categories: z.object({
    format: CategoryScoreSchema,
    keywords: CategoryScoreSchema,
    structure: CategoryScoreSchema,
    content: CategoryScoreSchema,
  }),
  keywords: z.object({
    matched: z.array(z.string()),
    missing: z.array(z.string()),
    overused: z.array(z.string()),
  }),
  feedback: z.array(FeedbackItemSchema).min(1).max(15),
  summary: z.string(),
});

export function validateResult(data: unknown) {
  return AnalysisResultSchema.parse(data);
}
