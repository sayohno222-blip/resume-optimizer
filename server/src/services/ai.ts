import OpenAI from 'openai';
import { config } from '../config.js';
import { buildUserMessage } from '../prompts/user.template.js';
import * as fs from 'fs';
import * as path from 'path';

const systemPrompt = fs.readFileSync(
  path.resolve(import.meta.dirname, '../prompts/system.txt'),
  'utf-8',
);

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: config.deepseekApiKey,
      baseURL: 'https://api.deepseek.com',
    });
  }
  return client;
}

export async function analyzeWithAI(resumeText: string, jobDescription?: string): Promise<unknown> {
  const openai = getClient();
  const userMessage = buildUserMessage(resumeText, jobDescription);

  const response = await openai.chat.completions.create({
    model: config.aiModel,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
  });

  const text = response.choices[0]?.message?.content?.trim() || '';
  if (!text) {
    throw new Error('AI_API_ERROR: No text response');
  }

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1].trim());
    }
    throw new Error('AI_API_ERROR: Could not parse JSON response');
  }
}

export async function* analyzeWithAIStream(
  resumeText: string,
  jobDescription?: string,
): AsyncGenerator<string, void, unknown> {
  const openai = getClient();
  const userMessage = buildUserMessage(resumeText, jobDescription);

  const stream = await openai.chat.completions.create({
    model: config.aiModel,
    max_tokens: 4096,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}
