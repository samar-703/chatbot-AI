import { NextRequest, NextResponse } from 'next/server';
import { WeatherData } from '@/types';

// ============================================
// CONFIGURATION: Add your Weather API key here
// ============================================
// You can use OpenWeatherMap (https://openweathermap.org/api)
// or WeatherAPI.com (https://www.weatherapi.com/)
// 
// For OpenWeatherMap:
// const WEATHER_API_KEY = 'your_openweathermap_api_key_here';
// const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
//
// For WeatherAPI.com:
// const WEATHER_API_KEY = 'your_weatherapi_key_here';
// const WEATHER_API_URL = 'https://api.weatherapi.com/v1/current.json';

const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_API_PROVIDER = process.env.WEATHER_API_PROVIDER || 'openweathermap'; // 'openweathermap' or 'weatherapi'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    // Validate input
    if (!city && (!lat || !lon)) {
      return NextResponse.json(
        { error: 'Please provide either a city name or coordinates (lat, lon)' },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!WEATHER_API_KEY) {
      return NextResponse.json(
        { 
          error: 'Weather API key not configured. Please add WEATHER_API_KEY to your .env.local file',
          mock: true,
          data: getMockWeatherData(city || 'Tokyo')
        },
        { status: 200 }
      );
    }

    // Fetch weather data based on provider
    let weatherData: WeatherData;

    if (WEATHER_API_PROVIDER === 'openweathermap') {
      weatherData = await fetchOpenWeatherMap(city, lat, lon);
    } else if (WEATHER_API_PROVIDER === 'weatherapi') {
      weatherData = await fetchWeatherAPI(city, lat, lon);
    } else {
      return NextResponse.json(
        { error: 'Invalid WEATHER_API_PROVIDER. Use "openweathermap" or "weatherapi"' },
        { status: 500 }
      );
    }

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch weather data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// ============================================
// OpenWeatherMap API Integration
// ============================================
async function fetchOpenWeatherMap(
  city: string | null,
  lat: string | null,
  lon: string | null
): Promise<WeatherData> {
  let url = 'https://api.openweathermap.org/data/2.5/weather?';
  
  if (city) {
    url += `q=${encodeURIComponent(city)}`;
  } else if (lat && lon) {
    url += `lat=${lat}&lon=${lon}`;
  }
  
  url += `&appid=${WEATHER_API_KEY}&units=metric`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`OpenWeatherMap API error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    location: data.name,
    temperature: Math.round(data.main.temp),
    condition: data.weather[0].main,
    description: data.weather[0].description,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
    feelsLike: Math.round(data.main.feels_like),
  };
}

// ============================================
// WeatherAPI.com Integration
// ============================================
async function fetchWeatherAPI(
  city: string | null,
  lat: string | null,
  lon: string | null
): Promise<WeatherData> {
  let query = '';
  
  if (city) {
    query = city;
  } else if (lat && lon) {
    query = `${lat},${lon}`;
  }

  const url = `https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(query)}`;

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`WeatherAPI error: ${response.statusText}`);
  }

  const data = await response.json();

  return {
    location: data.location.name,
    temperature: Math.round(data.current.temp_c),
    condition: data.current.condition.text,
    description: data.current.condition.text,
    humidity: data.current.humidity,
    windSpeed: data.current.wind_kph / 3.6, // Convert to m/s
    icon: data.current.condition.icon,
    feelsLike: Math.round(data.current.feelslike_c),
  };
}

// ============================================
// Mock Data (for testing without API key)
// ============================================
function getMockWeatherData(city: string): WeatherData {
  return {
    location: city,
    temperature: 22,
    condition: 'Partly Cloudy',
    description: 'partly cloudy',
    humidity: 65,
    windSpeed: 3.5,
    icon: '02d',
    feelsLike: 21,
  };
}
