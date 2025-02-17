// pages/api/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '', // Ensure it's always a string
});

export async function POST(req: Request) {
  const { prompt } = await req.json();

  try {
    const response = await openai.completions.create({
      model: 'gpt-4o-mini',
      prompt: prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    return new Response(JSON.stringify({ text: response.choices[0].text.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating response:', error);
    return new Response('Error generating response', { status: 500 });
  }
}
