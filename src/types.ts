export interface MemoryItem {
  id: string;
  url: string;
  caption?: string;
  date?: string;
}

export interface MilestoneItem {
  id: string;
  date: string;
  title: string;
  description: string;
  icon: string;
}

export interface ReasonItem {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface WishItem {
  id: string;
  author: string;
  content: string;
  color: string; // e.g., tailwind bg classes like bg-rose-100 or bg-slate-900
  textColor?: 'light' | 'dark'; // Automatically computed or set for contrast
  date: string;
}

export interface SocialComment {
  id: string;
  author: string;
  userId: string;
  text: string;
  date: string;
}

export interface SocialPost {
  id: string;
  author: string;
  userId: string;
  imageUrl?: string;
  caption?: string;
  likes: string[]; // List of user IDs who liked this post
  comments: SocialComment[];
  date: string;
}

export interface LoveLetterDetails {
  senderName: string;
  receiverName: string;
  receiverGender: string; // Girl, Boy, Woman, Man, Baby Girl, Baby Boy
  mode: 'ai' | 'custom';
  text: string;
}

export interface GiftRoomDetails {
  giftMessage: string;
  giftImage: string;
  giftAnimation: 'float' | 'spin' | 'bounce' | 'pulse';
  music: string;
  effects: 'confetti' | 'hearts' | 'stars' | 'snow';
  mode: 'preset' | 'custom';
}

export interface PersonalizationDetails {
  recipientName: string;
  nickname: string;
  gender: string; // Girl, Boy, Woman, Man, Baby Girl, Baby Boy
  relationship: string;
  birthdayDate: string;
  favoriteColor: string;
  favoriteTheme: string;
  favoriteMusic: string;
  favoriteQuote: string;
  customMessage: string;
}

export interface SurpiseConfig {
  userId: string;
  personalization: PersonalizationDetails;
  gallery: MemoryItem[];
  socialPosts: SocialPost[];
  loveLetter: LoveLetterDetails;
  reasons: ReasonItem[];
  wishes: WishItem[];
  giftRoom: GiftRoomDetails;
  accentColor: 'rose' | 'pink' | 'emerald' | 'violet' | 'amber' | 'ruby';
  musicEnabled: boolean;
  musicUrl: string;
}

export type ActivePage =
  | 'landing'
  | 'welcome'
  | 'gallery'
  | 'journey'
  | 'letter'
  | 'reasons'
  | 'gift'
  | 'cake'
  | 'wishes'
  | 'countdown'
  | 'final';
