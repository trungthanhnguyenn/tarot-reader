import { useState } from 'react';
import { DrawnCard } from '../types';

interface TarotCardProps {
  card: DrawnCard;
  position: string;
  index: number;
  canFlip: boolean;
  onFlip?: () => void;
}

const TarotCard: React.FC<TarotCardProps> = ({ card, position, index, canFlip, onFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCardClick = () => {
    if (canFlip && !isFlipped) {
      setIsFlipped(true);
      onFlip?.();
    }
  };

  return (
    <div
      className={`relative w-full max-w-[200px] mx-auto animate-slide-up cursor-pointer`}
      style={{ animationDelay: `${index * 0.3}s` }}
      onClick={handleCardClick}
    >
      <h3 className="text-lg font-semibold text-center mb-4 text-primary-700 dark:text-primary-300">
        {position}
      </h3>
      
      {/* Card Container with 3D flip effect */}
      <div className="card-flip-container relative h-72 w-44 mx-auto">
        <div className={`card-flip-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Card Back */}
          <div className="card-face card-back">
            <div className="w-full h-full bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800 rounded-xl shadow-2xl border-2 border-purple-400 flex items-center justify-center relative overflow-hidden">
              {/* Mystical pattern */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-4 border-2 border-yellow-400 rounded-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-yellow-400 text-6xl">
                  🔮
                </div>
              </div>
              {/* Decorative corners */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-yellow-400"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-yellow-400"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-yellow-400"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-yellow-400"></div>
              
              {canFlip && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-yellow-300 text-xs animate-pulse">
                  Nhấn để lật
                </div>
              )}
            </div>
          </div>

          {/* Card Front */}
          <div className="card-face card-front">
            <div className="w-full h-full bg-white dark:bg-mystic-800 rounded-xl shadow-2xl border border-gray-200 dark:border-mystic-700 overflow-hidden">
              <div className="relative h-full">
                <div className={`absolute inset-0 transition-transform duration-500 ${
                  card.isReversed ? 'rotate-180' : ''
                }`}>
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover rounded-xl"
                    loading="lazy"
                  />
                </div>
                
                {card.isReversed && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    Ngược
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Information (visible after flip) */}
      {isFlipped && (
        <div className="mt-4 animate-fade-in">
          <div className="text-center mb-3">
            <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">
              {card.vietnamese || card.name}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              {card.name}
            </p>
          </div>
          
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

          <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-mystic-700 p-3 rounded-lg">
            <p className="font-medium mb-1">
              {card.isReversed ? '🔄 Ý nghĩa ngược:' : '⬆️ Ý nghĩa thuận:'}
            </p>
            <p className="leading-relaxed">
              {card.isReversed ? card.reversed : card.upright}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TarotCard;
