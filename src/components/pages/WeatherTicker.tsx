import React from 'react';
import Marquee from 'react-fast-marquee';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

// Тип ответа от Spring Boot
interface DayForecastResponse {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProb: number;
}

// Внутренний тип с иконкой и описанием
interface DayForecast extends DayForecastResponse {
  weatherDesc: string;
  icon: string;
}

// Преобразование кода погоды в иконку и читаемый текст
const getWeatherMeta = (code: number): { desc: string; icon: string } => {
  if (code === 0) return { desc: 'Ясно', icon: '☀️' };
  if (code === 1 || code === 2) return { desc: 'Малооблачно', icon: '🌤️' };
  if (code === 3) return { desc: 'Пасмурно', icon: '☁️' };
  if ([45, 48].includes(code)) return { desc: 'Туман', icon: '🌫️' };
  if ([51, 53, 55].includes(code)) return { desc: 'Морось', icon: '🌦️' };
  if ([61, 63, 65].includes(code)) return { desc: 'Дождь', icon: '🌧️' };
  if ([71, 73, 75, 77].includes(code)) return { desc: 'Снег', icon: '❄️' };
  if ([80, 81, 82].includes(code)) return { desc: 'Ливень', icon: '⛈️' };
  if ([85, 86].includes(code)) return { desc: 'Снегопад', icon: '🌨️' };
  if (code >= 95) return { desc: 'Гроза', icon: '⚡' };
  return { desc: 'Переменная погода', icon: '🌡️' };
};

// Запрос через axios к вашему Spring Boot бэкенду
const fetchWeather = async (): Promise<DayForecast[]> => {
  // Укажите ваш базовый путь (или относительный, если настроен axios.defaults.baseURL / proxy)
  const response = await api.get<DayForecastResponse[]>(`${process.env.REACT_APP_API_URL}/weather`);
  
  return response.data.map((item) => {
    const meta = getWeatherMeta(item.weatherCode);
    return {
      ...item,
      weatherDesc: meta.desc,
      icon: meta.icon,
    };
  });
};

const containerStyle: React.CSSProperties = {
  backgroundColor: '#0f172a',
  color: '#f8fafc',
  padding: '10px 0',
  fontSize: '15px',
  fontFamily: 'sans-serif',
  display: 'flex',
  alignItems: 'center',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginRight: '60px',
};

const highlightStyle: React.CSSProperties = {
  color: '#38bdf8',
  backgroundColor: '#1e293b',
  padding: '2px 6px',
  borderRadius: '4px',
  fontSize: '13px',
};

export const WeatherTickerSDK: React.FC = () => {
  const {
    data: forecast = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['weather', 'tolyatti'],
    queryFn: fetchWeather,
    refetchInterval: 60 * 60 * 1000, // Раз в 1 час
    staleTime: 30 * 60 * 1000,
  });

  if (isLoading) {
    return <div style={containerStyle}>Загрузка прогноза погоды...</div>;
  }

  if (isError || forecast.length === 0) {
    return null;
  }

  return (
    <div style={containerStyle}>
      <Marquee speed={40} pauseOnHover={true} gradient={false}>
        {forecast.map((day, idx) => (
          <div key={idx} style={itemStyle}>
            <span style={{ fontWeight: 'bold' }}>Тольятти ({day.date}):</span>

            <span>
              {day.icon} {day.weatherDesc}
            </span>

            <span>
              {day.tempMax > 0 ? `+${day.tempMax}` : day.tempMax}° /{' '}
              {day.tempMin > 0 ? `+${day.tempMin}` : day.tempMin}°
            </span>

            {day.precipitationProb > 0 ? (
              <span style={highlightStyle}>
                💧 Осадки: {day.precipitationProb}% ({day.precipitationSum} мм)
              </span>
            ) : (
              <span style={{ color: '#64748b', fontSize: '13px' }}>без осадков</span>
            )}
          </div>
        ))}
      </Marquee>
    </div>
  );
};