import { Router, Request, Response } from 'express';
import GeminiService from '../utils/gemini';
import { TarotCard, DrawnCard, TarotRequest, DatabaseReading } from '../types';
import { validateRequest } from '../middleware/validator';
import allCards from '../../../assets/json/tarot_card_all.json';
import * as crypto from 'crypto';

const router = Router();

// Use memory storage for Vercel serverless environment
class MemoryDatabase {
  private readings: Map<string, DatabaseReading> = new Map();

  async getReading(id: string): Promise<DatabaseReading | null> {
    return this.readings.get(id) || null;
  }

  async saveReading(reading: DatabaseReading): Promise<void> {
    // Store in memory (will reset on function cold start)
    this.readings.set(reading.id, reading);
  }
}

const db = new MemoryDatabase();

const drawCards = (cards: TarotCard[]): DrawnCard[] => {
  const shuffled = cards.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map(card => ({
    name: card.name,
    imageUrl: card.image,
    isReversed: Math.random() < 0.5,
    keywords: card.keywords,
    upright: card.upright,
    reversed: card.reversed,
    vietnamese: card.vietnamese,
  }));
};

router.post('/tarot', validateRequest, async (req: Request, res: Response) => {
  try {
    const { name, dob }: TarotRequest = req.body;

    // Use simple hash for caching (crypto available in Vercel)
    const today = new Date().toISOString().split('T')[0];
    const hashKey = crypto.createHash('sha256').update(`${name}-${dob}-${today}`).digest('hex');

    const cachedReading = await db?.getReading(hashKey);

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

    await db?.saveReading(newReading);

    res.status(200).json({ 
      success: true,
      data: { cards: drawnCards, reading: readingText }
    });
    return;

  } catch (error: unknown) {
    console.error('Error processing tarot request:', error);
    const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
    res.status(500).json({ 
      success: false,
      error: errorMessage
    });
    return;
  }
});

export default router;
