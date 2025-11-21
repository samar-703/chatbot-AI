'use client';

import { WeatherData } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { motion } from 'framer-motion';

interface WeatherCardProps {
  weather: WeatherData;
}

export default function WeatherCard({ weather }: WeatherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden border-2 border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">{weather.location}</h3>
              <p className="text-sm text-zinc-400 capitalize">{weather.description}</p>
            </div>
            <Cloud className="h-12 w-12 text-blue-500" />
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Thermometer className="h-8 w-8 text-orange-500" />
            <span className="text-5xl font-bold text-white">{weather.temperature}°C</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-black/40 border border-zinc-800">
              <Thermometer className="h-5 w-5 text-orange-400" />
              <span className="text-xs text-zinc-400">体感</span>
              <span className="text-sm font-semibold text-white">{weather.feelsLike}°C</span>
            </div>

            <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-black/40 border border-zinc-800">
              <Droplets className="h-5 w-5 text-blue-400" />
              <span className="text-xs text-zinc-400">湿度</span>
              <span className="text-sm font-semibold text-white">{weather.humidity}%</span>
            </div>

            <div className="flex flex-col items-center gap-1 p-3 rounded-lg bg-black/40 border border-zinc-800">
              <Wind className="h-5 w-5 text-cyan-400" />
              <span className="text-xs text-zinc-400">風速</span>
              <span className="text-sm font-semibold text-white">{weather.windSpeed.toFixed(1)} m/s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
