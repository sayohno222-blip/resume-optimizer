// Mock mode — IS_MOCK=true uses mockAnalyzer, no API calls
// API mode — ENABLE_API_ANALYSIS=true calls /api/analyze, falls back to mock on failure
export const SITE_TITLE = "ATS Resume Optimizer";
export const IS_MOCK = true;
export const ENABLE_API_ANALYSIS = true;
export const API_ANALYZE_ENDPOINT = "/api/analyze";
export const MOCK_BANNER_TEXT = "当前为演示版本，分析结果用于展示产品流程";
