export interface TarotCard {
  id: string;
  name: string;
  vietnamese: string;
  keywords: string[];
  upright: string;
  reversed: string;
  image: string;
}

export interface DrawnCard {
  name: string;
  imageUrl: string;
  isReversed: boolean;
  keywords: string[];
}

export interface TarotReading {
  cards: DrawnCard[];
  reading: string;
}

export interface TarotRequest {
  name: string;
  dob: string;
}

export interface TarotResponse {
  success: boolean;
  data?: TarotReading;
  error?: string;
}

export interface FormErrors {
  name?: string;
  dob?: string;
}
