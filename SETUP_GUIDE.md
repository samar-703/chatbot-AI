# 🚀 Quick Setup Guide - Travel Assistant AI Chatbot

## Step-by-Step Setup Instructions

### 1️⃣ Navigate to Project Directory

```bash
cd C:\Users\hello\.gemini\antigravity\scratch\travel-chatbot
```

### 2️⃣ Install Dependencies (Already Done)

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 3️⃣ Configure API Keys

#### Create `.env.local` file:

```bash
# Copy the example file
cp env.example .env.local
```

Or create manually with this content:

```env
# ============================================
# WEATHER API CONFIGURATION
# ============================================
WEATHER_API_PROVIDER=openweathermap
WEATHER_API_KEY=your_api_key_here

# ============================================
# GEMINI API CONFIGURATION
# ============================================
GEMINI_API_KEY=your_gemini_api_key_here
```

#### Get Your API Keys:

**Weather API (Choose One):**

**Option A: OpenWeatherMap (Recommended)**
1. Go to: https://home.openweathermap.org/users/sign_up
2. Sign up for free account
3. Go to API keys section
4. Copy your API key
5. Free tier: 1,000 calls/day

**Option B: WeatherAPI.com**
1. Go to: https://www.weatherapi.com/signup.aspx
2. Sign up for free account
3. Copy your API key from dashboard
4. Free tier: 1,000,000 calls/month
5. If using this, set `WEATHER_API_PROVIDER=weatherapi`

**Gemini AI API:**
1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy your API key
4. Free tier available with generous limits

### 4️⃣ Add API Keys to `.env.local`

Open `.env.local` and replace the placeholder values:

```env
WEATHER_API_PROVIDER=openweathermap
WEATHER_API_KEY=abc123your_actual_key_here

GEMINI_API_KEY=xyz789your_actual_gemini_key_here
```

### 5️⃣ Run the Development Server

```bash
npm run dev
```

You should see:

```
▲ Next.js 16.0.3 (Turbopack)
- Local:         http://localhost:3000
- Network:       http://192.168.56.1:3000

✓ Ready in 2.2s
```

### 6️⃣ Open in Browser

Navigate to: **http://localhost:3000**

---

## 🎯 How to Use the Chatbot

### Japanese Voice Input

1. **Click the "音声入力" (Voice Input) button**
2. **Allow microphone access** when browser prompts
3. **Speak in Japanese** - The system is configured for `ja-JP`
4. **Watch the transcription** appear in real-time
5. **Message is automatically sent** when you finish speaking

**Supported Browsers:**
- ✅ Chrome (Best)
- ✅ Edge
- ✅ Safari
- ⚠️ Firefox (Limited)

### Text Input

- Type your message in the input field at the bottom
- Press **Enter** or click the **Send** button
- Works in both Japanese and English

### Weather Search

1. Enter a city name in the top-right search bar
   - Examples: "Tokyo", "Osaka", "Kyoto", "New York"
2. Press **Enter** or click the **location icon**
3. Weather card appears in the sidebar
4. AI uses this data for travel suggestions

---

## 🧪 Testing the Features

### Test 1: Voice Input

1. Click "音声入力" button
2. Say in Japanese: "東京の観光スポットを教えてください" (Tell me about Tokyo tourist spots)
3. Verify transcription appears
4. Verify AI responds with travel suggestions

### Test 2: Weather Integration

1. Enter "Tokyo" in weather search
2. Verify weather card appears with:
   - Temperature
   - Conditions
   - Humidity
   - Wind speed
3. Ask AI: "この天気でおすすめの活動は？" (What activities do you recommend for this weather?)

### Test 3: Text Chat

1. Type: "京都への旅行を計画しています" (I'm planning a trip to Kyoto)
2. Verify AI responds with Kyoto travel suggestions
3. Continue conversation about restaurants, temples, etc.

---

## 🔧 Troubleshooting

### Issue: "Microphone access denied"

**Solution:**
1. Click the lock icon in browser address bar
2. Allow microphone access
3. Refresh the page
4. Try voice input again

### Issue: "Weather API key not configured"

**Solution:**
1. Check `.env.local` file exists
2. Verify `WEATHER_API_KEY` is set correctly
3. Restart the dev server (`Ctrl+C` then `npm run dev`)
4. The app will show mock data if key is missing

### Issue: "Gemini API error"

**Solution:**
1. Check `.env.local` file has `GEMINI_API_KEY`
2. Verify the key is valid at https://aistudio.google.com/app/apikey
3. Restart the dev server
4. The app will show mock responses if key is missing

### Issue: Voice input not working

**Solution:**
1. Use Chrome or Edge browser
2. Ensure microphone is connected
3. Check browser permissions
4. Try HTTPS (required for some browsers)

---

## 📦 What's Included

### Core Features
- ✅ Japanese voice input with Web Speech API
- ✅ Weather API integration (OpenWeatherMap + WeatherAPI.com)
- ✅ Gemini AI for travel suggestions
- ✅ Real-time chat interface
- ✅ Premium UI with Shadcn + Magic UI

### Files Structure
```
travel-chatbot/
├── app/
│   ├── api/chat/route.ts       # Gemini AI endpoint
│   ├── api/weather/route.ts    # Weather API endpoint
│   ├── page.tsx                # Main app
│   └── layout.tsx              # Root layout
├── components/
│   ├── VoiceInput.tsx          # Voice recognition
│   ├── ChatInterface.tsx       # Chat display
│   ├── MessageBubble.tsx       # Message component
│   └── WeatherCard.tsx         # Weather display
├── types/index.ts              # TypeScript types
└── README.md                   # Full documentation
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables:
     - `WEATHER_API_KEY`
     - `WEATHER_API_PROVIDER`
     - `GEMINI_API_KEY`
   - Click "Deploy"

3. **Your app is live!** 🎉

---

## 📝 Important Notes

> [!IMPORTANT]
> **API Keys Security**
> - Never commit `.env.local` to Git
> - The `.gitignore` file already excludes it
> - Use environment variables in production

> [!NOTE]
> **Mock Data for Testing**
> - The app works without API keys
> - Mock weather data is provided
> - Mock AI responses are available
> - Perfect for testing the UI

> [!TIP]
> **Best Practices**
> - Test voice input in a quiet environment
> - Speak clearly in Japanese
> - Use Chrome for best voice recognition
> - Keep API keys in `.env.local`

---

## 🎓 Assignment Checklist

- ✅ Japanese voice input (mandatory) - **IMPLEMENTED**
- ✅ Weather API integration - **IMPLEMENTED**
- ✅ Generative AI (Gemini) - **IMPLEMENTED**
- ✅ Travel theme - **IMPLEMENTED**
- ✅ Next.js + Shadcn UI + Magic UI - **IMPLEMENTED**
- ✅ Working demo - **RUNNING ON http://localhost:3000**
- ✅ Source code - **COMPLETE**

**Deadline:** 11/24 20:00 IST ✅

---

## 🆘 Need Help?

### Documentation
- [README.md](file:///C:/Users/hello/.gemini/antigravity/scratch/travel-chatbot/README.md) - Full project documentation
- [Walkthrough](file:///C:/Users/hello/.gemini/antigravity/brain/adaf1ca3-90db-475f-bd2e-9e736c5465fb/walkthrough.md) - Complete project walkthrough

### Code Comments
All API integration points are marked with detailed comments:
- Weather API: `app/api/weather/route.ts`
- Gemini API: `app/api/chat/route.ts`
- Voice Input: `components/VoiceInput.tsx`

### External Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Shadcn UI](https://ui.shadcn.com/)
- [Gemini API](https://ai.google.dev/docs)

---

**Ready to start? Run `npm run dev` and open http://localhost:3000!** 🚀
