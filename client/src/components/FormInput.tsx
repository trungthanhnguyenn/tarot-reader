import { useState, useEffect } from 'react';
import { FormErrors } from '../types';

interface FormInputProps {
  onSubmit: (name: string, dob: string) => void;
  isLoading: boolean;
}

const FormInput: React.FC<FormInputProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});

  const validateName = (value: string): string | undefined => {
    if (!value.trim()) {
      return 'Tên không được để trống';
    }
    if (value.trim().length < 2) {
      return 'Tên phải có ít nhất 2 ký tự';
    }
    if (value.length > 50) {
      return 'Tên không được vượt quá 50 ký tự';
    }
    if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(value.trim())) {
      return 'Tên chỉ được chứa chữ cái và khoảng trắng';
    }
    return undefined;
  };

  const validateDob = (value: string): string | undefined => {
    if (!value) {
      return 'Ngày sinh không được để trống';
    }
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return 'Định dạng ngày sinh không hợp lệ';
    }

    const dobDate = new Date(value);
    const today = new Date();
    
    if (dobDate > today) {
      return 'Ngày sinh không được là tương lai';
    }

    const age = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    const dayDiff = today.getDate() - dobDate.getDate();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      actualAge--;
    }

    if (actualAge < 13 || actualAge > 100) {
      return 'Tuổi phải từ 13 đến 100';
    }

    return undefined;
  };

  useEffect(() => {
    const nameError = name ? validateName(name) : undefined;
    const dobError = dob ? validateDob(dob) : undefined;
    
    setErrors({
      name: nameError,
      dob: dobError,
    });
  }, [name, dob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameError = validateName(name);
    const dobError = validateDob(dob);

    if (nameError || dobError) {
      setErrors({
        name: nameError,
        dob: dobError,
      });
      return;
    }

    onSubmit(name.trim(), dob);
  };

  const isFormValid = !errors.name && !errors.dob && name.trim() && dob;

  return (
    <div className="bg-white dark:bg-mystic-800 p-6 rounded-xl card-shadow mystical-bg">
      <h2 className="text-2xl font-semibold mb-6 text-center text-primary-700 dark:text-primary-300">
        🔮 Khám Phá Số Phận Của Bạn 🔮
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Tên của bạn *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-mystic-700 dark:border-mystic-600 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-mystic-600'
            }`}
            placeholder="Nhập tên của bạn..."
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dob" className="block text-sm font-medium mb-2">
            Ngày sinh *
          </label>
          <input
            type="date"
            id="dob"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-mystic-700 dark:border-mystic-600 dark:text-white ${
              errors.dob ? 'border-red-500' : 'border-gray-300 dark:border-mystic-600'
            }`}
            disabled={isLoading}
          />
          {errors.dob && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.dob}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isLoading}
          className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
            !isFormValid || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang bốc bài...
            </span>
          ) : (
            '🃏 Bốc Bài Tarot 🃏'
          )}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600 dark:text-mystic-400 text-center">
        Thông tin của bạn sẽ được bảo mật và chỉ dùng để tạo ra kết quả bói bài cá nhân hóa.
      </p>
    </div>
  );
};

export default FormInput;
