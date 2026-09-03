import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import { fetchWeatherApi } from 'openmeteo';

// Типизация для нашего стейта прогноза
interface DayForecast {
  date: string;
  weatherDesc: string;
  icon: string;
  tempMax: number;
  tempMin: number;
  precipitationSum: number;
  precipitationProb: number;
}

// Перевод кода погоды в иконку и текст
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

export const WeatherTickerSDK: React.FC = () => {
  const [forecast, setForecast] = useState<DayForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const params = {
          latitude: 53.5078, // Тольятти
          longitude: 49.4204,
          // Запрашиваем дневные данные вместо почасовых, чтобы было удобно читать в информере
          daily: [
            "weather_code", 
            "temperature_2m_max", 
            "temperature_2m_min", 
            "precipitation_sum", 
            "precipitation_probability_max"
          ],
          timezone: "auto",
          forecast_days: 5 // Прогноз на 5 дней
        };
        
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        const response = responses[0];
        
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const daily = response.daily()!;
        
        // ВАЖНО: Индексы variables() должны строго совпадать с порядком в массиве `daily` в params!
        const weatherCodes = daily.variables(0)!.valuesArray();
        const tempMax = daily.variables(1)!.valuesArray();
        const tempMin = daily.variables(2)!.valuesArray();
        const precipSum = daily.variables(3)!.valuesArray();
        const precipProb = daily.variables(4)!.valuesArray();

        // Генерируем массив дат
        const timeArray = Array.from(
          { length: (Number(daily.timeEnd()) - Number(daily.time())) / daily.interval() },
          (_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
        );

        // Собираем данные в удобный массив объектов
        const formattedData: DayForecast[] = timeArray.map((dateObj, index) => {
          const meta = getWeatherMeta(weatherCodes[index]);
          
          return {
            date: dateObj.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short' }),
            weatherDesc: meta.desc,
            icon: meta.icon,
            tempMax: Math.round(tempMax[index]),
            tempMin: Math.round(tempMin[index]),
            // Округляем осадки до 1 знака после запятой
            precipitationSum: Math.round(precipSum[index] * 10) / 10, 
            precipitationProb: Math.round(precipProb[index]),
          };
        });

        setForecast(formattedData);
      } catch (err) {
        console.error("Ошибка получения погоды через SDK:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Обновляем данные раз в час
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
    fontSize: '13px'
  };

  if (loading) return <div style={containerStyle}>Загрузка данных Open-Meteo...</div>;
  if (error || forecast.length === 0) return null;

  return (
    <div style={containerStyle}>
      <Marquee speed={40} pauseOnHover={true} gradient={false}>
        {forecast.map((day, idx) => (
          <div key={idx} style={itemStyle}>
            <span style={{ fontWeight: 'bold' }}>Тольятти ({day.date}):</span>
            
            <span>{day.icon} {day.weatherDesc}</span>
            
            <span>
              {day.tempMax > 0 ? `+${day.tempMax}` : day.tempMax}° / {day.tempMin > 0 ? `+${day.tempMin}` : day.tempMin}°
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