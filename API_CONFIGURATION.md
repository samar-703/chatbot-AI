# 🔑 API Configuration Guide

## Quick Setup - 2 Options

### ✅ **Option 1: Using Environment Variables (RECOMMENDED)**

Create a file named `.env.local` in the project root:

**Location:** `C:\Users\hello\.gemini\antigravity\scratch\travel-chatbot\.env.local`

**Content:**
```env
# Weather API Configuration
WEATHER_API_PROVIDER=openweathermap
WEATHER_API_KEY=paste_your_weather_api_key_here

# Gemini AI Configuration
GEMINI_API_KEY=paste_your_gemini_api_key_here
```

**That's it!** Restart the dev server and you're done.

---

### Option 2: Direct Code Changes

If you prefer to add API keys directly in the code:

#### **File 1: Weather API**
**Path:** `app/api/weather/route.ts`

**Line 17-18:** Replace this:
```typescript
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_API_PROVIDER = process.env.WEATHER_API_PROVIDER || 'openweathermap';
```

**With this:**
```typescript
const WEATHER_API_KEY = 'your_actual_weather_api_key_here';
const WEATHER_API_PROVIDER = 'openweathermap'; // or 'weatherapi'
```

---

#### **File 2: Gemini AI**
**Path:** `app/api/chat/route.ts`

**Line 14:** Replace this:
```typescript
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
```

**With this:**
```typescript
const GEMINI_API_KEY = 'your_actual_gemini_api_key_here';
```

---

## 🔑 Where to Get API Keys

### Weather API

**OpenWeatherMap (Recommended):**
1. Go to: https://home.openweathermap.org/users/sign_up
2. Sign up (free)
3. Go to "API keys" tab
4. Copy your key
5. Free tier: 1,000 calls/day

**OR WeatherAPI.com:**
1. Go to: https://www.weatherapi.com/signup.aspx
2. Sign up (free)
3. Copy key from dashboard
4. Free tier: 1,000,000 calls/month
5. If using this, set `WEATHER_API_PROVIDER=weatherapi`

### Gemini AI

1. Go to: https://aistudio.google.com/app/apikey
2. Click "Create API Key"
3. Copy the key
4. Free tier available

---

## 📝 Summary

**You only need to change 2 things:**

1. **Weather API Key** → Either in `.env.local` OR `app/api/weather/route.ts` line 17
2. **Gemini API Key** → Either in `.env.local` OR `app/api/chat/route.ts` line 14

**After adding keys:**
- Stop the dev server (Ctrl+C)
- Run `npm run dev` again
- Test the app!

---

## ⚠️ Important Notes

- ✅ Use `.env.local` method (safer, easier)
- ❌ Don't commit API keys to Git
- 🔄 Restart server after adding keys
- 🧪 App works with mock data if no keys (for testing UI)
