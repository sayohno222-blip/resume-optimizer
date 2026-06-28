// Vercel Serverless Function
// POST /api/analyze
// Calls DeepSeek Chat API for resume analysis

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Validate API key
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'API_KEY_MISSING',
      message: 'Missing DEEPSEEK_API_KEY environment variable',
    });
    return;
  }

  const baseUrl = (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com').replace(/\/+$/, '');
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';

  // Validate request body
  const { resumeText, jobDescription } = req.body || {};

  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length === 0) {
    res.status(400).json({
      error: 'INVALID_INPUT',
      message: 'resumeText is required and must be a non-empty string',
    });
    return;
  }

  const truncatedText = resumeText.slice(0, 12000);
  const jdText = (jobDescription || '').slice(0, 4000);

  // Build system prompt
  const systemPrompt = [
    'You are an expert ATS (Applicant Tracking System) analyst.',
    'Analyze the candidate\'s resume and provide a detailed assessment.',
    '',
    'Respond with valid JSON only. No markdown fences, no extra text.',
    'Use the following structure exactly:',
    JSON.stringify({
      overallScore: 0,
      categories: {
        format: { score: 0, label: '格式与排版', maxScore: 100 },
        keywords: { score: 0, label: '关键词优化', maxScore: 100 },
        structure: { score: 0, label: '结构与组织', maxScore: 100 },
        content: { score: 0, label: '内容质量', maxScore: 100 },
      },
      keywords: { matched: [], missing: [], overused: [] },
      feedback: [{
        severity: 'high',
        category: 'format',
        message: '',
        suggestion: '',
        impact: '',
        exampleBefore: '',
        exampleAfter: '',
      }],
      summary: '',
    }, null, 2),
    '',
    'Scoring guidelines:',
    '- overallScore: weighted average (format*0.15 + keywords*0.35 + structure*0.20 + content*0.30)',
    '- Format (0-100): single-column layout, standard headings, machine-readable',
    '- Keywords (0-100): match density relevant to the detected role or provided JD',
    '- Structure (0-100): clear sections, reverse-chronological, consistent dates',
    '- Content (0-100): quantified achievements, action verbs, specific technologies',
    '',
    'Provide 4-8 feedback items with varying severity.',
    'If job description is provided, use it for keyword matching.',
    'exampleBefore and exampleAfter are optional but helpful for actionable suggestions.',
  ].join('\n');

  // Build user message
  const jdSection = jdText
    ? `\n\n=== TARGET JOB DESCRIPTION ===\n${jdText}\n=== END JOB DESCRIPTION ===`
    : '\n\nNo job description provided. Evaluate based on the detected role and industry standards.';

  const userMessage = `=== RESUME TEXT ===\n${truncatedText}\n=== END RESUME TEXT ===${jdSection}\n\nAnalyze the resume above and return the JSON assessment.`;

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 4096,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('DeepSeek API error:', response.status, errorBody);
      res.status(502).json({
        error: 'AI_API_ERROR',
        message: `DeepSeek API returned status ${response.status}`,
      });
      return;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content?.trim() || '';

    if (!content) {
      res.status(502).json({
        error: 'AI_API_ERROR',
        message: 'Empty response from DeepSeek API',
      });
      return;
    }

    // Parse JSON, handling markdown code blocks
    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) {
        try {
          parsed = JSON.parse(match[1].trim());
        } catch {
          res.status(502).json({
            error: 'PARSE_ERROR',
            message: 'AI response JSON parsing failed',
          });
          return;
        }
      } else {
        res.status(502).json({
          error: 'PARSE_ERROR',
          message: 'AI response JSON parsing failed',
        });
        return;
      }
    }

    // Validate and normalize the result structure
    const result = normalizeResult(parsed);

    res.status(200).json(result);
  } catch (err) {
    console.error('Serverless function error:', err);
    res.status(500).json({
      error: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error',
    });
  }
}

function normalizeResult(input) {
  const defaultResult = {
    overallScore: 60,
    categories: {
      format: { score: 60, label: '格式与排版', maxScore: 100 },
      keywords: { score: 60, label: '关键词优化', maxScore: 100 },
      structure: { score: 60, label: '结构与组织', maxScore: 100 },
      content: { score: 60, label: '内容质量', maxScore: 100 },
    },
    keywords: { matched: [], missing: [], overused: [] },
    feedback: [
      {
        severity: 'medium',
        category: 'content',
        message: 'AI analysis completed but some details could not be parsed.',
        suggestion: 'Review the analysis and refine your resume further.',
      },
    ],
    summary: 'AI analysis completed.',
  };

  if (!input || typeof input !== 'object') return defaultResult;

  return {
    overallScore: clampScore(input.overallScore),
    categories: {
      format: normalizeCategoryScore(input.categories?.format, '格式与排版'),
      keywords: normalizeCategoryScore(input.categories?.keywords, '关键词优化'),
      structure: normalizeCategoryScore(input.categories?.structure, '结构与组织'),
      content: normalizeCategoryScore(input.categories?.content, '内容质量'),
    },
    keywords: {
      matched: Array.isArray(input.keywords?.matched) ? input.keywords.matched : [],
      missing: Array.isArray(input.keywords?.missing) ? input.keywords.missing : [],
      overused: Array.isArray(input.keywords?.overused) ? input.keywords.overused : [],
    },
    feedback: Array.isArray(input.feedback) && input.feedback.length > 0
      ? input.feedback.slice(0, 10).map(normalizeFeedback)
      : defaultResult.feedback,
    summary: typeof input.summary === 'string' ? input.summary : defaultResult.summary,
  };
}

function clampScore(val) {
  const n = Number(val);
  return isNaN(n) ? 60 : Math.max(0, Math.min(100, Math.round(n)));
}

function normalizeCategoryScore(cat, defaultLabel) {
  if (!cat || typeof cat !== 'object') {
    return { score: 60, label: defaultLabel, maxScore: 100 };
  }
  return {
    score: clampScore(cat.score),
    label: typeof cat.label === 'string' ? cat.label : defaultLabel,
    maxScore: typeof cat.maxScore === 'number' ? cat.maxScore : 100,
  };
}

const VALID_SEVERITIES = ['high', 'medium', 'low'];
const VALID_CATEGORIES = ['format', 'keywords', 'structure', 'content'];

function normalizeFeedback(item) {
  if (!item || typeof item !== 'object') {
    return {
      severity: 'medium',
      category: 'content',
      message: 'Analysis item could not be parsed.',
      suggestion: 'Please review your resume manually.',
    };
  }
  return {
    severity: VALID_SEVERITIES.includes(item.severity) ? item.severity : 'medium',
    category: VALID_CATEGORIES.includes(item.category) ? item.category : 'content',
    message: typeof item.message === 'string' ? item.message : '',
    suggestion: typeof item.suggestion === 'string' ? item.suggestion : '',
    impact: typeof item.impact === 'string' ? item.impact : undefined,
    exampleBefore: typeof item.exampleBefore === 'string' ? item.exampleBefore : undefined,
    exampleAfter: typeof item.exampleAfter === 'string' ? item.exampleAfter : undefined,
  };
}
