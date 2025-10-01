import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';
import crypto from 'crypto';
import GeminiService from '../src/utils/gemini';
import { TarotCard, DrawnCard, TarotRequest, DatabaseReading } from '../src/types';
import allCards from '../../assets/json/tarot_card_all.json';

// Memory storage for Vercel serverless
class MemoryDatabase {
  private readings: Map<string, DatabaseReading> = new Map();

  async getReading(id: string): Promise<DatabaseReading | null> {
    return this.readings.get(id) || null;
  }

  async saveReading(reading: DatabaseReading): Promise<void> {
    this.readings.set(reading.id, reading);
  }
}

const corsHandler = cors({
  origin: true,
  credentials: true,
});

const drawCards = (cards: TarotCard[]): DrawnCard[] => {
  const shuffled = cards.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map(card => ({
    name: card.name,
    imageUrl: `/img/${card.image.split('/').pop()}`, // Convert to /img/filename.png
    isReversed: Math.random() < 0.5,
    keywords: card.keywords,
    upright: card.upright,
    reversed: card.reversed,
    vietnamese: card.vietnamese,
  }));
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(200).end();
  }

  // Apply CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle health check
  if (req.url?.includes('/health')) {
    return res.status(200).json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }

  // Handle tarot API (remove /api prefix since it's already routed)
  if (req.method === 'POST' && (req.url === '/api/tarot' || req.url === '/tarot')) {
    try {
      const { name, dob }: TarotRequest = req.body;

      if (!name || !dob) {
        return res.status(400).json({
          success: false,
          error: 'Name and date of birth are required'
        });
      }

      const db = new MemoryDatabase();
      const today = new Date().toISOString().split('T')[0];
      const hashKey = crypto.createHash('sha256').update(`${name}-${dob}-${today}`).digest('hex');

      const cachedReading = await db.getReading(hashKey);

      if (cachedReading) {
        const cachedCards: DrawnCard[] = JSON.parse(cachedReading.cards);
        return res.json({
          success: true,
          data: { cards: cachedCards, reading: cachedReading.reading },
          message: 'Retrieved from cache.'
        });
      }

      const drawnCards = drawCards(allCards as TarotCard[]);
      const gemini = new GeminiService();
      const readingText = await gemini.generateReading(name, dob, drawnCards);

      const newReading: DatabaseReading = {
        id: hashKey,
        name,
        dob,
        date: today,
        cards: JSON.stringify(drawnCards),
        reading: readingText,
      };

      await db.saveReading(newReading);

      return res.status(200).json({ 
        success: true,
        data: { cards: drawnCards, reading: readingText }
      });

    } catch (error: any) {
      console.error('Error processing tarot request:', error);
      return res.status(500).json({ 
        success: false,
        error: error.message || 'An internal server error occurred.' 
      });
    }
  }

  return res.status(404).json({ 
    success: false,
    error: 'Endpoint not found' 
  });
}