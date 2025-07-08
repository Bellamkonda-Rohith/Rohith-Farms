export type ParentInfo = {
  name: string;
  imageUrl: string;
  videoUrl: string;
};

export type Bird = {
  id: string;
  name: string;
  bloodline: string;
  traits: string;
  isAvailable: boolean;
  imageUrl: string;
  videoUrl: string; // YouTube embed URL
  father: ParentInfo;
  mother: ParentInfo;
};
