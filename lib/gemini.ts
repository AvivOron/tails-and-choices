import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export type GeminiChapterResponse = {
  chapterText: string;
  optionA: string;
  optionB: string;
  newSummary: string;
};

export async function generateChapter({
  heroName,
  heroGender,
  companionNames,
  setting,
  rollingSummary,
  choiceMade,
}: {
  heroName: string;
  heroGender: 'male' | 'female';
  companionNames: string[];
  setting: string;
  rollingSummary: string;
  choiceMade?: string;
}): Promise<GeminiChapterResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const genderHebrew = heroGender === 'male' ? 'זכר' : 'נקבה';
  const companionsStr = companionNames.length > 0 ? companionNames.join(', ') : 'אין חברים';
  const choiceContext = choiceMade ? `\n- Choice Made: The hero chose: "${choiceMade}"` : '';

  const prompt = `You are a warm, imaginative Hebrew storyteller for toddlers (ages 3-5).

CONTEXT:
- Hero: ${heroName} (${genderHebrew})
- Friends: ${companionsStr}
- Setting: ${setting}
- Past Events: ${rollingSummary || 'This is the very beginning of the story.'}${choiceContext}

RULES:
1. Language: Simple, rhythmic Hebrew (עברית לגיל הרך). Short sentences.
2. Grammar: Strict gender agreement for ${genderHebrew}.
3. The story should be warm, magical, and appropriate for ages 3-5.
4. Each chapter should be 3-4 short sentences.
5. End with a moment that leads naturally to two choices.
6. Format: Return ONLY a valid JSON object with no markdown, no code blocks, just raw JSON:
{
  "chapterText": "3-4 sentences in Hebrew",
  "optionA": "Short Hebrew choice (2-4 words)",
  "optionB": "Short Hebrew choice (2-4 words)",
  "newSummary": "A 1-sentence English summary of the entire plot so far including this new chapter"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code blocks if present
  const jsonText = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '').trim();

  const parsed = JSON.parse(jsonText) as GeminiChapterResponse;
  return parsed;
}
