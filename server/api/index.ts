import { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { GoogleGenerativeAI } from '@google/generative-ai';
import allCards from '../../assets/json/tarot_card_all.json';

// Types
interface TarotCard {
  id: string;
  name: string;
  vietnamese: string;
  keywords: string[];
  upright: string;
  reversed: string;
  image: string;
}

interface DrawnCard {
  name: string;
  imageUrl: string;
  isReversed: boolean;
  keywords: string[];
  upright?: string;
  reversed?: string;
  vietnamese?: string;
}

interface TarotRequest {
  name: string;
  dob: string;
}

interface DatabaseReading {
  id: string;
  name: string;
  dob: string;
  date: string;
  cards: string;
  reading: string;
}

// Gemini Service integrated
class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  public async generateReading(
    name: string,
    dob: string,
    cards: DrawnCard[]
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt(name, dob, cards);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return text || 'Không thể tạo kết quả bói bài lúc này.';
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Không thể kết nối với dịch vụ AI để tạo kết quả bói bài');
    }
  }

  private buildPrompt(name: string, dob: string, cards: DrawnCard[]): string {
    const cardDescriptions = cards.map((card, index) => {
      const position = ['quá khứ', 'hiện tại', 'tương lai'][index];
      const orientation = card.isReversed ? 'ngược' : 'thuận';
      const keywords = card.keywords.join(', ');
      
      return `Lá ${index + 1} (${position}): **${card.name}** ${orientation} - Từ khóa: ${keywords}`;
    }).join('\n');

    return `Bạn là Master Tarot Reader với 20+ năm kinh nghiệm, chuyên gia trong việc kết nối thông điệp tâm linh và đưa ra lời khuyên sống động, thiết thực. Phong cách của bạn: thân thiện, sâu sắc, đầy cảm hứng và luôn mang lại hy vọng tích cực cho người hỏi.

Chào Master Tarot Reader!

Tôi là ${name}, sinh ngày ${dob}. Tôi đang tìm kiếm sự dẫn lối từ những lá bài.

Hôm nay, tôi đã bốc được 3 lá bài sau:
${cardDescriptions}

Hãy dành thời gian để phân tích sâu sắc và viết một bài giải nghĩa cho 3 lá bài này, theo cấu trúc sau:

1.  **Lời Chào & Tổng Quan:** Bắt đầu bằng lời chào ấm áp đến ${name}. Đưa ra một tổng quan sâu sắc về thông điệp chung mà 3 lá bài này mang lại, kết nối chúng thành một câu chuyện có ý nghĩa.

2.  **Hành Trình Qua Các Lá Bài (Phân Tích Chi Tiết):**
    *   **Quá khứ:** Phân tích lá bài đầu tiên. Nó nói lên điều gì về nền tảng, những sự kiện đã qua và bài học kinh nghiệm của ${name}?
    *   **Hiện tại:** Phân tích lá bài thứ hai. Nó phản ánh tình hình hiện tại, những thách thức và cơ hội mà ${name} đang đối mặt là gì?
    *   **Tương lai:** Phân tích lá bài thứ ba. Nó đưa ra dự báo gì về những điều sắp tới? Con đường nào đang mở ra?

3.  **Lời Khuyên & Hướng Dẫn:** Dựa trên toàn bộ trải bài, hãy đưa ra những lời khuyên cụ thể, thực tế và mang tính xây dựng. Giúp ${name} biết họ nên tập trung vào điều gì, cần thay đổi những gì và làm thế nào để tận dụng tốt nhất năng lượng hiện tại.

4.  **Thông Điệp Kết Thúc:** Kết thúc bài viết bằng một thông điệp tích cực, truyền cảm hứng và đầy hy vọng. Nhắc nhở ${name} về sức mạnh nội tại và khả năng tự định hình tương lai của họ.

**Yêu cầu văn phong:**
*   Sử dụng ngôn ngữ tiếng Việt phong phú, truyền cảm và sâu sắc.
*   Giọng văn như một người thầy thông thái, một người bạn đồng hành đáng tin cậy.
*   Sử dụng markdown (in đậm, in nghiêng) và các biểu tượng cảm xúc (🃏, ✨, 🌟, 🔮) một cách tinh tế để làm nổi bật các ý chính và tăng tính hấp dẫn cho bài viết.`;
  }
}

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