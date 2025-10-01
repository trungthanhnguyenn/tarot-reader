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
  upright?: string;
  reversed?: string;
  vietnamese?: string;
}

export interface TarotReading {
  cards: DrawnCard[];
  reading: string;
}

export interface TarotRequest {
  name: string;
  dob: string;
}

export interface DatabaseReading {
  id: string;
  name: string;
  dob: string;
  date: string;
  cards: string; // JSON string
  reading: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
