
import type { Timestamp } from "firebase/firestore";

export interface Bird {
  id: string;
  name: string;
  age: string;
  weight: string;
  color: string;
  line: string;
  price?: number;
  availability: 'Available' | 'Sold';
  isFeatured: boolean;
  images: string[];
  videos: string[];
  parents: {
    father: {
      images: string[];
      videos: string[];
    };
    mother: {
      images: string[];
      videos: string[];
    };
  };
  skills?: string[];
  createdAt: Timestamp;
}

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  isAdmin: boolean;
  createdAt: Timestamp;
}
