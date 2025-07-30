import { TarotReading } from '../types';
import ReactMarkdown from 'react-markdown';

interface TarotResultProps {
  reading: TarotReading;
}

const TarotResult: React.FC<TarotResultProps> = ({ reading }) => {
  const positions = ['Quá Khứ', 'Hiện Tại', 'Tương Lai'];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center gradient-text mb-8">
        🔮 Kết Quả Bói Bài Tarot 🔮
      </h2>

      {/* Cards Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {reading.cards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-mystic-800 rounded-xl p-6 card-shadow mystical-bg animate-slide-up"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <h3 className="text-lg font-semibold text-center mb-4 text-primary-700 dark:text-primary-300">
              {positions[index]}
            </h3>
            
            <div className="relative mb-4 flex justify-center">
              <div className={`transform transition-transform duration-500 hover:scale-105 ${
                card.isReversed ? 'rotate-180' : ''
              }`}>
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  className="w-32 h-48 object-cover rounded-lg shadow-lg"
                  loading="lazy"
                />
              </div>
              {card.isReversed && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  Ngược
                </div>
              )}
            </div>

            <div className="text-center">
              <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">
                {card.name}
              </h4>
              <div className="flex flex-wrap justify-center gap-1 mb-3">
                {card.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full text-xs"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reading Text */}
      <div className="bg-white dark:bg-mystic-800 rounded-xl p-6 card-shadow mystical-bg animate-fade-in">
        <h3 className="text-2xl font-semibold mb-4 text-center text-primary-700 dark:text-primary-300">
          🌟 Giải Nghĩa Bài Tarot 🌟
        </h3>
        
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {reading.reading}
          </ReactMarkdown>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-center">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          ⚠️ <strong>Lưu ý:</strong> Kết quả bói bài Tarot chỉ mang tính chất tham khảo và giải trí. 
          Hãy sử dụng trí tuệ của bạn để đưa ra những quyết định quan trọng trong cuộc sống.
        </p>
      </div>
    </div>
  );
};

export default TarotResult;
