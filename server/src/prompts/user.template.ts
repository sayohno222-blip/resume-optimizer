export function buildUserMessage(resumeText: string, jobDescription?: string): string {
  const jdSection = jobDescription
    ? `\n\n=== TARGET JOB DESCRIPTION ===\n${jobDescription}\n=== END JOB DESCRIPTION ===`
    : '\n\nNo job description was provided. Evaluate keywords based on the detected role and industry standards.';

  return `=== RESUME TEXT ===\n${resumeText}\n=== END RESUME TEXT ===${jdSection}\n\nAnalyze the resume above and return the JSON assessment.`;
}
