import OpenAI from 'openai';
import { DrawnCard } from '../types';

class OpenAIService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  public async generateReading(
    name: string,
    dob: string,
    cards: DrawnCard[]
  ): Promise<string> {
    try {
      const prompt = this.buildPrompt(name, dob, cards);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Bạn là một nhà đọc bài Tarot chuyên nghiệp và giàu kinh nghiệm. Hãy đưa ra lời giải thích sâu sắc, thông thái và đầy cảm hứng cho người tìm hiểu.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.8,
      });

      return completion.choices[0]?.message?.content || 'Không thể tạo kết quả bói bài lúc này.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
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

    return `Bạn là Tarot reader chuyên nghiệp. Người hỏi tên ${name}, sinh ngày ${dob}.

${cardDescriptions}

Hãy viết một đoạn giải nghĩa 300-400 từ bao gồm:
1. Tổng quan về thông điệp từ 3 lá bài
2. Phân tích từng lá theo thứ tự quá khứ → hiện tại → tương lai
3. Lời khuyên thiết thực và tích cực
4. Kết thúc bằng một thông điệp hy vọng

Viết bằng tiếng Việt, giọng điệu thân thiện, không quá huyền bí. Có thể sử dụng **in đậm** và emoji 🃏✨🌟 phù hợp.`;
  }
}

export default OpenAIService;
