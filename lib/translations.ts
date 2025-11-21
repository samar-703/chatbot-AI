export type Language = 'en' | 'ja';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
  };
  weather: {
    placeholder: string;
    feelsLike: string;
    humidity: string;
    wind: string;
  };
  chat: {
    inputPlaceholder: string;
    errorMessage: string;
  };
  howToUse: {
    title: string;
    items: string[];
  };
  buttons: {
    send: string;
    location: string;
  };
  errors: {
    locationDenied: string;
    locationUnavailable: string;
    locationTimeout: string;
    weatherFailed: string;
    geolocationNotSupported: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'Chatbot',
      subtitle: 'AI Chatbot / Travel Assistant',
    },
    weather: {
      placeholder: 'City Name (e.g., Tokyo)',
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      wind: 'Wind',
    },
    chat: {
      inputPlaceholder: 'Type your message here...',
      errorMessage: 'Sorry, I encountered an error. Please try again.',
    },
    howToUse: {
      title: 'How to Use',
      items: [
        '⏹️Speak in Japanese/English via Voice Input',
        '⏹️Type text to chat',
        '⏹️Get weather & travel tips',
        '⏹️Plan your trip with AI',
      ],
    },
    buttons: {
      send: 'Send',
      location: 'Use My Location',
    },
    errors: {
      locationDenied: 'Location permission denied. Please enable location access in your browser settings.',
      locationUnavailable: 'Location unavailable. Please try again.',
      locationTimeout: 'Location request timed out. Please check your connection and try again.',
      weatherFailed: 'Failed to fetch weather data. Please try again.',
      geolocationNotSupported: 'Geolocation is not supported by your browser',
    },
  },
  ja: {
    header: {
      title: 'チャットボット',
      subtitle: 'AI チャットボット / 旅行アシスタント',
    },
    weather: {
      placeholder: '都市名（例：東京）',
      feelsLike: '体感温度',
      humidity: '湿度',
      wind: '風速',
    },
    chat: {
      inputPlaceholder: 'メッセージを入力...',
      errorMessage: '申し訳ございません。エラーが発生しました。もう一度お試しください。',
    },
    howToUse: {
      title: '使い方',
      items: [
        '⏹️音声入力で日本語/英語で話す',
        '⏹️テキストでチャット',
        '⏹️天気と旅行のヒントを取得',
        '⏹️AIで旅行を計画',
      ],
    },
    buttons: {
      send: '送信',
      location: '現在地を使用',
    },
    errors: {
      locationDenied: '位置情報の許可が拒否されました。ブラウザの設定で位置情報へのアクセスを有効にしてください。',
      locationUnavailable: '位置情報が利用できません。もう一度お試しください。',
      locationTimeout: '位置情報のリクエストがタイムアウトしました。接続を確認してもう一度お試しください。',
      weatherFailed: '天気データの取得に失敗しました。もう一度お試しください。',
      geolocationNotSupported: 'お使いのブラウザは位置情報をサポートしていません',
    },
  },
};
