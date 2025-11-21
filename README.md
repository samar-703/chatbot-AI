# 🌏 Travel Assistant AI Chatbot

An AI-powered travel assistant chatbot with **Japanese voice input**, **weather API integration**, and **generative AI** capabilities. Built with Next.js, Shadcn UI, and Magic UI for a premium, modern user experience.

## ✨ Features

- 🎤 **Japanese Voice Input** (Mandatory) - Uses Web Speech API with `ja-JP` language setting
- 🌤️ **Weather API Integration** - Real-time weather data for travel planning
- 🤖 **Gemini AI Integration** - Intelligent travel suggestions and recommendations
- ✈️ **Travel Theme** - Specialized for travel planning, destinations, and activities
- 🎨 **Premium UI** - Built with Shadcn UI and Magic UI for a stunning interface
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd travel-chatbot
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   
   Copy the `env.example` file to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

4. **Add your API keys to `.env.local`:**

   ```env
   # Weather API (choose one provider)
   WEATHER_API_PROVIDER=openweathermap
   WEATHER_API_KEY=your_api_key_here
   
   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### Weather API

**Option 1: OpenWeatherMap (Recommended)**
- Sign up: https://home.openweathermap.org/users/sign_up
- Free tier: 1,000 calls/day
- Get API key from dashboard
- Set `WEATHER_API_PROVIDER=openweathermap`

**Option 2: WeatherAPI.com**
- Sign up: https://www.weatherapi.com/signup.aspx
- Free tier: 1,000,000 calls/month
- Get API key from dashboard
- Set `WEATHER_API_PROVIDER=weatherapi`

### Gemini AI API

- Get your API key: https://aistudio.google.com/app/apikey
- Free tier available with generous limits
- Add to `.env.local` as `GEMINI_API_KEY`

## 📁 Project Structure

```
travel-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Gemini AI integration
│   │   └── weather/
│   │       └── route.ts          # Weather API integration
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main application
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Shadcn UI components
│   ├── ChatInterface.tsx         # Chat message display
│   ├── MessageBubble.tsx         # Individual message component
│   ├── VoiceInput.tsx            # Japanese voice recognition
│   └── WeatherCard.tsx           # Weather display
├── types/
│   └── index.ts                  # TypeScript type definitions
├── lib/
│   └── utils.ts                  # Utility functions
└── env.example                   # Environment variables template
```

## 🎯 Usage

### Voice Input (Japanese)

1. Click the **音声入力** (Voice Input) button
2. Allow microphone access when prompted
3. Speak in Japanese
4. The transcript will appear and be sent to the AI

### Text Input

- Type your message in the input field at the bottom
- Press Enter or click the Send button
- Works in both Japanese and English

### Weather Integration

1. Enter a city name in the top-right search bar (e.g., "Tokyo", "Osaka")
2. Click the location icon or press Enter
3. Weather data will appear in the sidebar
4. The AI will use this data for travel suggestions

## 🛠️ Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** Shadcn UI
- **Animations:** Framer Motion
- **AI:** Google Gemini API
- **Weather:** OpenWeatherMap / WeatherAPI.com
- **Voice:** Web Speech API

## 🎨 UI Libraries

### Shadcn UI

Pre-installed components:
- Button
- Card
- Input
- Scroll Area
- Avatar
- Badge
- Skeleton

To add more components:
```bash
npx shadcn@latest add [component-name]
```

### Magic UI

Installed via `framer-motion` for smooth animations and transitions.

## 📝 Important Notes

### API Configuration

- **All API endpoints are ready to use** - just add your API keys
- **Mock data fallback** - The app works without API keys for testing
- **Detailed comments** - Every API integration point is clearly marked
- **Error handling** - Comprehensive error messages and validation

### Where to Add API Keys

1. **Weather API:**
   - File: `app/api/weather/route.ts`
   - Lines: 17-18 (or use `.env.local`)

2. **Gemini API:**
   - File: `app/api/chat/route.ts`
   - Line: 14 (or use `.env.local`)

### Browser Compatibility

Japanese voice input requires:
- ✅ Chrome (recommended)
- ✅ Edge
- ✅ Safari
- ❌ Firefox (limited support)

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Self-hosted

## 🔒 Security

- Never commit `.env.local` to version control
- Keep your API keys secret
- The `.gitignore` file is configured to exclude sensitive files

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com/)
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

## 🎓 Assignment Compliance

This project fulfills all requirements:

- ✅ **Japanese voice input** (mandatory) - Implemented with Web Speech API
- ✅ **Weather API integration** - Supports multiple providers
- ✅ **Generative AI** - Gemini API integration
- ✅ **Flexible theme** - Travel theme implemented
- ✅ **Working demo** - Ready to run with `npm run dev`
- ✅ **Source code** - Complete Next.js project

**Deadline:** 11/24 20:00 IST

## 📄 License

This project is created for educational purposes.

---

**Built with ❤️ using Next.js, Shadcn UI, and Magic UI**
