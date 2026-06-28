// Real API analysis service
// Calls the Vercel Serverless Function at /api/analyze
// Falls back to mockAnalyzer when IS_MOCK is true or API call fails

import type { AnalysisResult } from "../types";
import { API_ANALYZE_ENDPOINT } from "../config";

export interface ApiAnalyzerCallbacks {
  onStage: (stage: number) => void;
  onComplete: (result: AnalysisResult) => void;
  onError: (error: { code: string; message: string }) => void;
}

/**
 * Read text content from a file.
 * Currently only TXT is fully supported.
 * PDF/DOCX parsing will be added in a later phase.
 */
export async function readFileText(file: File): Promise<string> {
  if (file.type === "text/plain") {
    return await file.text();
  }

  // PDF/DOCX — return placeholder until real parsing is implemented
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") {
    return `[PDF file: ${file.name}]\n\nFull PDF text extraction is not yet implemented.\nThe file size is ${(file.size / 1024).toFixed(1)} KB.\n\nPlease upload a TXT version of your resume for AI analysis.`;
  }
  if (ext === "docx") {
    return `[DOCX file: ${file.name}]\n\nFull DOCX text extraction is not yet implemented.\nThe file size is ${(file.size / 1024).toFixed(1)} KB.\n\nPlease upload a TXT version of your resume for AI analysis.`;
  }

  return `[Unsupported file: ${file.name}]\n\nFile type not recognized. Please upload PDF, DOCX, or TXT.`;
}

/**
 * Call the Vercel Serverless Function to analyze a resume.
 * Dispatches stage updates as the call progresses.
 */
export async function analyzeResumeWithApi(
  file: File,
  jobDescription: string,
  callbacks: ApiAnalyzerCallbacks,
): Promise<void> {
  const { onStage, onComplete, onError } = callbacks;

  try {
    // Stage 1: reading file
    onStage(1);
    const resumeText = await readFileText(file);

    // Stage 2: calling API
    onStage(2);

    const body: Record<string, string> = { resumeText };
    if (jobDescription && jobDescription.trim().length > 0) {
      body.jobDescription = jobDescription.trim();
    }

    const response = await fetch(API_ANALYZE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    // Stage 3: parsing response
    onStage(3);

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || `API returned status ${response.status}`);
    }

    const result: AnalysisResult = await response.json();

    // Validate basic structure
    if (typeof result.overallScore !== "number") {
      throw new Error("Invalid analysis result: missing overallScore");
    }

    // Stage 4: complete
    onStage(4);
    onComplete(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    onError({ code: "API_ERROR", message });
  }
}
