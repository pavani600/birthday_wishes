import { SurpiseConfig } from './types';

export const getInitialConfig = (userId: string): SurpiseConfig => ({
  userId,
  personalization: {
    recipientName: 'Pavani',
    nickname: 'My Princess',
    gender: 'Girl',
    relationship: 'Girlfriend',
    birthdayDate: '2026-10-15',
    favoriteColor: '#ff2e93',
    favoriteTheme: 'romantic',
    favoriteMusic: 'Chopin: Nocturne Op. 9 No. 2',
    favoriteQuote: 'You are my today and all of my tomorrows.',
    customMessage: 'Thank you for making my life so incredibly beautiful! Happy Birthday!'
  },
  gallery: [
    {
      id: 'm1',
      url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      caption: 'The moment our eyes met, and my world changed forever.',
      date: 'Oct 15, 2023',
    },
    {
      id: 'm2',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
      caption: 'Our first cozy sunset walk, holding hands and sharing dreams.',
      date: 'Dec 05, 2023',
    },
    {
      id: 'm3',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800&auto=format&fit=crop',
      caption: 'That unforgettable night, laughing until our stomachs hurt.',
      date: 'Feb 14, 2024',
    },
  ],
  socialPosts: [
    {
      id: 'p1',
      author: 'Your Love',
      userId: userId,
      imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
      caption: 'Happy birthday to the most wonderful person in my life! You make every day brighter! 💖✨',
      likes: [],
      comments: [
        {
          id: 'c1',
          author: 'A Friend',
          userId: 'friend_1',
          text: 'This is so cute! Happy birthday Pavani! 🎉',
          date: '2026-07-04'
        }
      ],
      date: '2026-07-04'
    }
  ],
  loveLetter: {
    senderName: 'Your Love',
    receiverName: 'Pavani',
    receiverGender: 'Girl',
    mode: 'ai',
    text: `My Dearest Pavani,

Happy Birthday, my love! ❤️

Today is not just a celebration of another year of your life; it is a celebration of the day the world became a brighter, more beautiful place. Every single day spent with you feels like a sweet dream I never want to wake up from.

You have this magical way of filling my life with laughter, warmth, and absolute joy. In your eyes, I find my home. In your laugh, I find my favorite song. You are my best friend, my safest haven, and my greatest adventure.

Thank you for being the beautiful soul that you are. Thank you for your kindness, your boundless support, and the love you shower upon me. I promise to stand by you, to laugh with you in the sun, and to hold you close through the storms.

As you blow out your candles today, know that my biggest wish has already come true—I have you in my life.

I love you, today, tomorrow, and for all of our forevers.

Forever Yours,
Your Love ❤️`
  },
  reasons: [
    {
      id: 'r1',
      title: 'Your Radiant Smile',
      description: 'It has the power to instantly dissolve my worries and make my entire day shine bright.',
      emoji: '✨',
    },
    {
      id: 'r2',
      title: 'Your Beautiful Soul',
      description: 'Your kindness, empathy, and how deeply you care for everyone around you inspire me daily.',
      emoji: '🌸',
    },
    {
      id: 'r3',
      title: 'Your Sweet Laughter',
      description: "It is my absolute favorite sound in the world. Hearing you laugh is pure, unadulterated music.",
      emoji: '🎵',
    },
  ],
  wishes: [
    {
      id: 'w1',
      author: 'A Friend',
      content: 'Wishing you the happiest of birthdays! May your day be as wonderful and radiant as your smile! 🌟',
      color: 'bg-rose-100',
      date: '2026-07-04',
    },
    {
      id: 'w2',
      author: 'Your Love',
      content: 'Happy Birthday, my queen! Today is all about you. I hope this special website brings a giant smile to your face. ❤️',
      color: 'bg-slate-900',
      date: '2026-07-04',
    },
  ],
  giftRoom: {
    giftMessage: 'Unwrap your special birthday surprise! I hope this little token brings you as much happiness as you bring to my heart.',
    giftImage: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    giftAnimation: 'float',
    music: 'preset',
    effects: 'confetti',
    mode: 'preset'
  },
  accentColor: 'rose',
  musicEnabled: true,
  musicUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3',
});
