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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const genderHebrew = heroGender === 'male' ? 'זכר' : 'נקבה';
  const companionsStr = companionNames.length > 0 ? companionNames.join(', ') : 'none';
  const companionsRule = companionNames.length > 0
    ? `3. MANDATORY FRIENDS RULE: The friends (${companionsStr}) MUST appear by name in the chapter and have spoken dialogue. They must DO something — help, react, discover, or speak. Do not just mention them in passing.`
    : '3. No friends in this story.';
  const choiceContext = choiceMade ? `\n- Choice Made: The hero chose: "${choiceMade}"` : '';

  const prompt = `You are a warm, imaginative Hebrew storyteller for toddlers (ages 3-5).

CONTEXT:
- Hero: ${heroName} (${genderHebrew})
- Friends: ${companionsStr}
- Setting: ${setting}
- Past Events: ${rollingSummary || 'This is the very beginning of the story.'}${choiceContext}

RULES:
1. Language: Simple, rhythmic Hebrew (עברית לגיל הרך). Short sentences, easy words.
2. Grammar: Strict gender agreement for ${genderHebrew}.
${companionsRule}
4. IMPORTANT: If a choice was made, the chapter MUST open by directly continuing from that choice — describe what happens as a result of it. Do not ignore the choice.
5. Each chapter should be 20-25 sentences long, telling a rich and detailed mini-scene with a clear beginning, middle, and end. Include descriptions of the surroundings, the characters' feelings, dialogue between characters, and small adventures or discoveries along the way.
6. End the chapter with a moment of suspense or decision that leads naturally to two choices.
7. The two choices should be meaningfully different and lead the story in different directions.
8. Format: Return ONLY a valid JSON object with no markdown, no code blocks, just raw JSON:
{
  "chapterText": "20-25 sentences in Hebrew",
  "optionA": "Short Hebrew choice (2-4 words)",
  "optionB": "Short Hebrew choice (2-4 words)",
  "newSummary": "A 1-2 sentence English summary of the entire plot so far including this new chapter"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown code blocks if present
  const jsonText = text.replace(/^```json?\s*/i, '').replace(/\s*```$/, '').trim();

  const parsed = JSON.parse(jsonText) as GeminiChapterResponse;
  return parsed;
}
