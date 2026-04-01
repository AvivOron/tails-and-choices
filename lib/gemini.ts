import { GoogleGenerativeAI, type GenerationConfig } from '@google/generative-ai';

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
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

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
6. End the chapter with a narrative sentence describing the decision moment. Do NOT end with a question (no "?"). Do NOT write "מה תעשה" or any question form.
7. optionA and optionB MUST be in second-person imperative Hebrew conjugated for ${genderHebrew}: male examples: "תפתח את הארגז", "תרוץ ליער" — female examples: "תפתחי את הארגז", "תרוצי ליער". NEVER use infinitive (לפתוח, לרוץ). NEVER phrase as an answer to a question.
8. Format: Return ONLY a valid JSON object with no markdown, no code blocks, just raw JSON:
{
  "chapterText": "20-25 sentences in Hebrew",
  "optionA": "Action the hero can take (2-4 words, starts with a verb)",
  "optionB": "Different action the hero can take (2-4 words, starts with a verb)",
  "newSummary": "A 1-2 sentence English summary of the entire plot so far including this new chapter"
}`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Extract JSON object from response, stripping any markdown or surrounding text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in Gemini response');
  const parsed = JSON.parse(jsonMatch[0]) as GeminiChapterResponse;
  return parsed;
}

export async function generateChapterImage({
  heroName,
  setting,
  rollingSummary,
}: {
  heroName: string;
  setting: string;
  rollingSummary: string;
}): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-preview-image-generation' });

  const prompt = `Create a colorful, warm, child-friendly picture book illustration.
Hero: ${heroName}
Setting: ${setting}
Story so far: ${rollingSummary}
Style: soft watercolor, bright and cheerful, suitable for children ages 3-5, no text in the image, storybook art.`;

  const generationConfig: GenerationConfig & { responseModalities: string[] } = {
    responseModalities: ['IMAGE'],
  };

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig,
  });

  const parts = result.response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('No image in Gemini response');
}
