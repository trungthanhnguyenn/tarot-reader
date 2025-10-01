import { GoogleGenerativeAI } from '@google/generative-ai';
import { DrawnCard } from '../types';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    const apiKey = process.env.GEMINI_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_KEY environment variable is required');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
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

export default GeminiService;
