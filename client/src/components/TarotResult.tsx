import { useState } from 'react';
import { TarotReading } from '../types';
import ReactMarkdown from 'react-markdown';
import TarotCard from './TarotCard';

interface TarotResultProps {
  reading: TarotReading;
}

const TarotResult: React.FC<TarotResultProps> = ({ reading }) => {
  const positions = ['Quá Khứ', 'Hiện Tại', 'Tương Lai'];
  const [flippedCount, setFlippedCount] = useState(0);
  const allCardsFlipped = flippedCount === (reading?.cards?.length || 0);

  return (
    <div className="space-y-8">
      {/* Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reading.cards.map((card, index) => (
          <TarotCard 
            key={index} 
            card={card} 
            position={positions[index]} 
            index={index} 
            canFlip={true}
            onFlip={() => setFlippedCount(prev => prev + 1)}
          />
        ))}
      </div>

      {/* Reading Text */}
      {allCardsFlipped && (
        <div className="bg-white dark:bg-mystic-800 rounded-xl p-6 card-shadow mystical-bg animate-fade-in">
          <h2 className="text-3xl font-bold text-center gradient-text mb-8">
            🔮 Giải Nghĩa Bài Tarot 🔮
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {reading.reading}
            </ReactMarkdown>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center mt-8">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Lưu ý:</strong> Kết quả bói bài Tarot chỉ mang tính chất tham khảo và giải trí. 
          Hãy sử dụng trí tuệ của bạn để đưa ra những quyết định quan trọng trong cuộc sống.
        </p>
      </div>
    </div>
  );
};

export default TarotResult;
