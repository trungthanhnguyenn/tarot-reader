import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import Database from '../utils/db';
import OpenAIService from '../utils/openai';
import { TarotCard, DrawnCard, TarotRequest, DatabaseReading } from '../types';
import { validateRequest } from '../middleware/validator';
import allCards from '../../../cards.json';

const router = Router();
const db = new Database();
const openai = new OpenAIService();

const drawCards = (cards: TarotCard[]): DrawnCard[] => {
  const shuffled = cards.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 3);

  return selected.map(card => ({
    name: card.name,
    imageUrl: card.image,
    isReversed: Math.random() < 0.5,
    keywords: card.keywords,
  }));
};

router.post('/tarot', validateRequest, async (req: Request, res: Response) => {
  try {
    const { name, dob }: TarotRequest = req.body;

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
    const readingText = await openai.generateReading(name, dob, drawnCards);

    const newReading: DatabaseReading = {
      id: hashKey,
      name,
      dob,
      date: today,
      cards: JSON.stringify(drawnCards),
      reading: readingText,
    };

    await db.saveReading(newReading);

    res.status(200).json({ 
      success: true,
      data: { cards: drawnCards, reading: readingText }
    });
    return;

  } catch (error: any) {
    console.error('Error processing tarot request:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'An internal server error occurred.' 
    });
    return;
  }
});

export default router;
