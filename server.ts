import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini API client safely on the server side
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const app = express();
const PORT = 3000;

app.use(express.json());

// API Endpoints for server-side AI integrations

// AI Love Letter Generation Endpoint
app.post('/api/generate-letter', async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your Secrets.',
    });
  }

  const { senderName, receiverName, receiverGender, relationship, nickname, favoriteQuote, customMessage } = req.body;

  // Gender-specific romantic opening
  let opening = 'My Love';
  if (receiverGender === 'Girl') opening = 'My Princess ❤️';
  else if (receiverGender === 'Boy') opening = 'My Handsome ❤️';
  else if (receiverGender === 'Woman') opening = 'Beautiful Woman ❤️';
  else if (receiverGender === 'Man') opening = 'Wonderful Man ❤️';
  else if (receiverGender === 'Baby Girl') opening = 'Sweet Little Princess ❤️';
  else if (receiverGender === 'Baby Boy') opening = 'Cute Little Champion ❤️';

  const prompt = `Write a deeply emotional, highly romantic, poetic birthday love letter from "${senderName}" to their "${relationship}" named "${receiverName}" (often called "${nickname}").
The letter is for their birthday.
The tone should be sincere, warm, and elegant (no cheesy cliches, focus on authentic connection and deep emotional bonds).
Incorporate the following personalization details naturally if provided:
- Favorite Quote to include/reference: "${favoriteQuote || ''}"
- Personal Custom Message or memory to weave in: "${customMessage || ''}"
- Use the affectionate terms appropriate for: "${opening}"

The output must be a beautifully formatted, ready-to-read letter (around 3-4 paragraphs) with line breaks and appropriate emojis. End the letter with a romantic closing and "${senderName} ❤️".
Return ONLY the text of the letter. Do not include any greeting headers or frontmatter. Start directly with the letter opening (e.g. "${opening}, ...")`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
    });

    res.json({ letter: response.text });
  } catch (error: any) {
    console.error('Error generating letter:', error);
    res.status(500).json({ error: error.message || 'Failed to generate AI love letter' });
  }
});

// AI Personal Reasons generator
app.post('/api/generate-reasons', async (req, res) => {
  if (!ai) {
    return res.status(500).json({
      error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your Secrets.',
    });
  }

  const { receiverName, nickname, gender, relationship, customMessage } = req.body;

  const prompt = `Generate exactly 5 heartfelt, distinct, and highly personalized reasons "Why I Love You" for "${receiverName}" (nickname: "${nickname}", relationship: "${relationship}", gender: "${gender}").
Weave in details or ideas from this message if relevant: "${customMessage || ''}"

Return the reasons as a valid JSON array of objects. Do not wrap in markdown or backticks.
Each object in the JSON array MUST have EXACTLY these fields:
- "title": a short, punchy reason title (e.g., "Your Radiant Smile", "Unwavering Support", "Your Beautiful Mind")
- "description": a highly touching, heartfelt 1-2 sentence description explaining that reason
- "emoji": a single beautiful, matching emoji (e.g., "✨", "🌸", "🤗", "💖")

Example format:
[
  { "title": "Your Radiant Smile", "description": "It has the power to melt any cold day and instantly fill my heart with light.", "emoji": "✨" }
]`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '[]');
    res.json({ reasons: parsed });
  } catch (error: any) {
    console.error('Error generating reasons:', error);
    res.status(500).json({ error: error.message || 'Failed to generate personalized reasons' });
  }
});

// Set up Vite development server middleware or production static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // SPA routing fallback: send index.html for all non-api routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
