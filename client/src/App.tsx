import { useState } from 'react';
import FormInput from './components/FormInput';
import TarotResult from './components/TarotResult';
import ThemeToggle from './components/ThemeToggle';
import { TarotReading } from './types';
import axios from 'axios';

function App() {
  const [tarotReading, setTarotReading] = useState<TarotReading | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (name: string, dob: string) => {
    setIsLoading(true);
    setError(null);
    setTarotReading(null);

    try {
      const response = await axios.post('/api/tarot', { name, dob });
      setTarotReading(response.data.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
            Tarot Reader
          </h1>
          <ThemeToggle />
        </header>

        <main>
          <FormInput onSubmit={handleFormSubmit} isLoading={isLoading} />
          {error && (
            <div className="mt-6 p-4 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 rounded-lg animate-fade-in">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}
          {isLoading && (
            <div className="mt-8 bg-white dark:bg-mystic-800 rounded-xl p-8 card-shadow mystical-bg animate-fade-in">
              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 border-4 border-primary-200 dark:border-primary-800 rounded-full animate-pulse"></div>
                  <div className="absolute inset-2 border-4 border-primary-400 dark:border-primary-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                    🔮
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-primary-700 dark:text-primary-300 mb-3">
                  ✨ Đang bốc bài cho bạn... ✨
                </h3>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <p className="animate-pulse">🃏 Trộn 78 lá bài Tarot...</p>
                  <p className="animate-pulse" style={{ animationDelay: '0.5s' }}>🌟 Kết nối với năng lượng tâm linh...</p>
                  <p className="animate-pulse" style={{ animationDelay: '1s' }}>📖 AI đang giải nghĩa cho bạn...</p>
                </div>
                <div className="mt-6 text-xs text-gray-500 dark:text-gray-500">
                  Quá trình này có thể mất vài giây để tạo ra kết quả chính xác nhất
                </div>
              </div>
            </div>
          )}
          {tarotReading && (
            <div className="mt-8 animate-fade-in">
              <TarotResult reading={tarotReading} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
