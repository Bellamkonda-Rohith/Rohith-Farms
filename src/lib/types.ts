export type Bird = {
  id: string;
  name: string;
  age: string;
  price: number;
  description: string;
  
  birdImages: string[];
  birdVideos: string[];
  
  motherImages: string[];
  motherVideos: string[];
  
  fatherImages: string[];
  fatherVideos: string[];

  isFeatured: boolean;
  isSold: boolean;
  createdAt: string; // ISO string format
};

export type AdminUser = {
    uid: string;
    phoneNumber: string;
};
