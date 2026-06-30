export interface BionicInput {
  productType: string;
  inspiration: string;
  styleKeywords: string;
  targetUsers: string;
  designGoal: string;
}

export interface FormExtraction {
  form: string[];
  structure: string[];
  function: string[];
}

export interface DesignDirection {
  title: string;
  description: string;
}

export interface ColorSuggestion {
  name: string;
  hex: string;
  description: string;
}

export interface MaterialSuggestion {
  name: string;
  description: string;
}

export interface FinishSuggestion {
  name: string;
  description: string;
}

export interface CmfAdvice {
  colors: ColorSuggestion[];
  materials: MaterialSuggestion[];
  finish: FinishSuggestion[];
}

export interface AiPrompt {
  platform: string;
  prompt: string;
}

export interface BionicDesignResult {
  inspirationAnalysis: string;
  formExtraction: FormExtraction;
  designDirections: DesignDirection[];
  cmfAdvice: CmfAdvice;
  aiPrompts: AiPrompt[];
  designStatement: string;
}
