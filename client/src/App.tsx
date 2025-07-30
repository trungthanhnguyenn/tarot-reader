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
    } catch (err: any) {
      setError(err.response?.data?.error || 'An unknown error occurred.');
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
            <div className="mt-6 text-center">
              <p>Loading...</p>
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
