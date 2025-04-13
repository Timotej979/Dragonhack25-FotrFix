// lib/ai/vector/embed.ts
export async function embedTextWithGemini(text: string): Promise<number[]> {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ content: text }),
    });
  
    const data = await res.json();
    return data.embedding?.values || [];
  }
  