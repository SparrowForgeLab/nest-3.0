import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CloudSun, MapPin, RefreshCw, Search, Check, X, Calendar, Settings, ArrowUp, ArrowDown, Sliders } from 'lucide-react';

export default function WeatherWidget({
  location = 'London, UK',
  lat = 51.5074,
  lon = -0.1278,
  units = 'celsius',
  weatherSize = 'normal',
  weatherLayout = 'vertical',
  weatherDisplaySize = 'large',
  onUpdateLocation
}) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [forecastDays, setForecastDays] = useState(5); // 3, 5, 7, 10 days

  // Location Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Widget Settings Panel State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [wSize, setWSize] = useState(weatherSize);
  const [wLayout, setWLayout] = useState(weatherLayout);
  const [wDispSize, setWDispSize] = useState(weatherDisplaySize);
  const [wUnits, setWUnits] = useState(units);

  useEffect(() => {
    setWSize(weatherSize);
    setWLayout(weatherLayout);
    setWDispSize(weatherDisplaySize);
    setWUnits(units);
  }, [weatherSize, weatherLayout, weatherDisplaySize, units]);

  const fetchWeather = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/widgets/weather?lat=${lat}&lon=${lon}&units=${wUnits}&days=${forecastDays}`);
      setWeather(res.data);
    } catch (err) {
      setError('Weather unavailable');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [lat, lon, wUnits, forecastDays]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearchLoading(true);
    try {
      const res = await axios.get(`/api/widgets/weather/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(res.data || []);
    } catch (err) {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectLocation = (loc) => {
    const locName = loc.formatted || loc.name || 'Custom Location';
    onUpdateLocation && onUpdateLocation({
      weather_location: locName,
      weather_lat: loc.latitude,
      weather_lon: loc.longitude
    });
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSaveSettingField = (updates) => {
    onUpdateLocation && onUpdateLocation(updates);
  };

  const getWeatherCodeEmoji = (code) => {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '⛅';
    if (code >= 45 && code <= 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95) return '⛈️';
    return '☁️';
  };

  const getWeatherCodeDescription = (code) => {
    if (code === 0) return 'Clear Sky';
    if (code >= 1 && code <= 3) return 'Partly Cloudy';
    if (code >= 45 && code <= 48) return 'Foggy';
    if (code >= 51 && code <= 67) return 'Rain / Drizzle';
    if (code >= 71 && code <= 77) return 'Snow';
    if (code >= 80 && code <= 82) return 'Rain Showers';
    if (code >= 95) return 'Thunderstorm';
    return 'Cloudy';
  };

  const tempUnit = wUnits === 'fahrenheit' ? '°F' : '°C';
  const windUnit = wUnits === 'fahrenheit' ? 'mph' : 'km/h';

  const formatDayName = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString(undefined, { weekday: 'short' });
  };

  const todayHigh = weather?.daily?.temperature_2m_max?.[0] !== undefined ? Math.round(weather.daily.temperature_2m_max[0]) : null;
  const todayLow = weather?.daily?.temperature_2m_min?.[0] !== undefined ? Math.round(weather.daily.temperature_2m_min[0]) : null;

  const isHeroDisplay = wDispSize === 'hero';
  const isLargeDisplay = wDispSize === 'large' || isHeroDisplay;

  const widgetSpanClass = {
    normal: '',
    large: 'md:col-span-2',
    hero: 'col-span-full'
  }[wSize] || '';

  return (
    <div className={`glass-panel rounded-2xl p-4 text-slate-200 relative flex flex-col justify-between transition-all duration-300 ${widgetSpanClass}`}>
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-700/50 pb-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-300 truncate pr-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => { setIsSearching(!isSearching); setIsSettingsOpen(false); }}
              className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
              title="Search City, ZIP Code or Coordinates"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => { setIsSettingsOpen(!isSettingsOpen); setIsSearching(false); }}
              className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
              title="Weather Settings & Format Controls"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={fetchWeather}
              className="p-1 rounded text-slate-400 hover:text-sky-400 hover:bg-slate-800 transition"
              title="Refresh Weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Inline Location Search Bar */}
        {isSearching && (
          <div className="mb-3 p-2.5 bg-slate-950/95 border border-slate-700 rounded-xl space-y-2">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="City, ZIP, or lat,lon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 outline-none focus:border-sky-400"
                autoFocus
              />
              <button
                type="submit"
                className="px-2.5 py-1 bg-sky-500 hover:bg-sky-400 text-white rounded-lg text-xs font-semibold"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearching(false)}
                className="p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </form>

            {searchLoading && <p className="text-[11px] text-slate-400">Searching locations...</p>}

            {searchResults.length > 0 && (
              <div className="max-h-32 overflow-y-auto space-y-1 pr-1 border-t border-slate-800 pt-1.5">
                {searchResults.map((loc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(loc)}
                    className="w-full text-left p-1.5 rounded-lg hover:bg-sky-500/20 hover:text-sky-300 text-[11px] transition truncate flex items-center justify-between"
                  >
                    <span className="truncate">{loc.formatted || loc.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono flex-shrink-0 ml-1">
                      {loc.latitude.toFixed(2)}, {loc.longitude.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Inline Weather Format & Settings Panel */}
        {isSettingsOpen && (
          <div className="mb-3 p-3 bg-slate-950/95 border border-slate-700 rounded-xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-bold text-sky-400 flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5" /> Weather Settings & Format Controls
              </span>
              <button onClick={() => setIsSettingsOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Forecast Days</label>
                <select
                  value={forecastDays}
                  onChange={(e) => setForecastDays(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-xs"
                >
                  <option value={3}>3 Days</option>
                  <option value={5}>5 Days</option>
                  <option value={7}>7 Days</option>
                  <option value={10}>10 Days</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Temperature Unit</label>
                <select
                  value={wUnits}
                  onChange={(e) => {
                    setWUnits(e.target.value);
                    handleSaveSettingField({ weather_units: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-xs"
                >
                  <option value="celsius">Celsius (°C)</option>
                  <option value="fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Widget Size</label>
                <select
                  value={wSize}
                  onChange={(e) => {
                    setWSize(e.target.value);
                    handleSaveSettingField({ weather_size: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-xs"
                >
                  <option value="normal">Standard (1 Col)</option>
                  <option value="large">Wide (2 Cols)</option>
                  <option value="hero">Hero (Full Width)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Layout Mode</label>
                <select
                  value={wLayout}
                  onChange={(e) => {
                    setWLayout(e.target.value);
                    handleSaveSettingField({ weather_layout: e.target.value });
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-slate-200 text-xs"
                >
                  <option value="vertical">Stacked</option>
                  <option value="horizontal">Side-by-Side</option>
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <label className="text-[11px] text-slate-400 font-medium">Temperature Display Size:</label>
              <div className="flex gap-1.5">
                {['normal', 'large', 'hero'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => {
                      setWDispSize(sz);
                      handleSaveSettingField({ weather_display_size: sz });
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] capitalize font-medium transition ${
                      wDispSize === sz
                        ? 'bg-sky-500 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Weather View */}
        {loading ? (
          <div className="py-6 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-400" /> Fetching {forecastDays}-Day Forecast...
          </div>
        ) : error || !weather || !weather.current_weather ? (
          <div className="py-6 text-center text-xs text-slate-400">
            {error || 'Weather data unavailable'}
          </div>
        ) : (
          <div className={`${wLayout === 'horizontal' ? 'md:flex md:items-center md:justify-between md:gap-6' : 'space-y-3'}`}>
            {/* Current Day Temperature & Condition Display */}
            <div className={`flex items-center justify-between ${wLayout === 'horizontal' ? 'md:flex-1' : ''}`}>
              <div className="flex items-center gap-3">
                {/* Weather Condition Emoji */}
                <div className={`flex items-center justify-center rounded-2xl bg-slate-900/90 border border-slate-800 ${
                  isHeroDisplay ? 'text-5xl w-16 h-16 p-2' : isLargeDisplay ? 'text-4xl w-12 h-12 p-1.5' : 'text-3xl w-10 h-10'
                }`}>
                  {getWeatherCodeEmoji(weather.current_weather.weathercode)}
                </div>

                <div>
                  <div className={`font-bold text-slate-100 flex items-baseline gap-1 leading-none ${
                    isHeroDisplay ? 'text-5xl sm:text-6xl tracking-tight' : isLargeDisplay ? 'text-3xl sm:text-4xl' : 'text-2xl'
                  }`}>
                    {Math.round(weather.current_weather.temperature)}
                    <span className={`font-normal text-slate-400 ${isHeroDisplay ? 'text-2xl' : 'text-sm'}`}>{tempUnit}</span>
                  </div>

                  <p className={`font-semibold text-sky-300 mt-1 capitalize ${isHeroDisplay ? 'text-sm' : 'text-xs'}`}>
                    {getWeatherCodeDescription(weather.current_weather.weathercode)}
                  </p>
                </div>
              </div>

              {/* High / Low & Wind Stats */}
              <div className="text-right space-y-1">
                {todayHigh !== null && todayLow !== null && (
                  <div className="flex items-center justify-end gap-2 text-xs font-semibold font-mono">
                    <span className="text-emerald-400 flex items-center gap-0.5" title="Today High">
                      <ArrowUp className="w-3 h-3 stroke-[3]" /> {todayHigh}°
                    </span>
                    <span className="text-sky-400 flex items-center gap-0.5" title="Today Low">
                      <ArrowDown className="w-3 h-3 stroke-[3]" /> {todayLow}°
                    </span>
                  </div>
                )}

                <div className="text-[11px] text-slate-400 space-y-0.5">
                  <p>Wind: {weather.current_weather.windspeed} {windUnit}</p>
                  <p>Direction: {weather.current_weather.winddirection}°</p>
                </div>
              </div>
            </div>

            {/* Daily Forecast Cards Shelf */}
            {weather.daily && weather.daily.time && (
              <div className={`pt-2.5 border-t border-slate-700/50 ${wLayout === 'horizontal' ? 'md:pt-0 md:border-t-0 md:border-l md:pl-6 md:w-1/2' : ''}`}>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mb-1.5 uppercase tracking-wider">
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-sky-400" /> {forecastDays}-Day Forecast</span>
                </div>

                <div className="grid grid-flow-col auto-cols-fr gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {weather.daily.time.map((timeStr, idx) => {
                    const maxTemp = Math.round(weather.daily.temperature_2m_max[idx]);
                    const minTemp = Math.round(weather.daily.temperature_2m_min[idx]);
                    const code = weather.daily.weathercode[idx];

                    return (
                      <div
                        key={timeStr}
                        className="bg-slate-900/80 border border-slate-800 rounded-xl p-1.5 text-center flex flex-col items-center justify-between min-w-[42px]"
                      >
                        <span className="text-[10px] font-bold text-slate-300">{formatDayName(timeStr)}</span>
                        <span className="text-sm my-0.5">{getWeatherCodeEmoji(code)}</span>
                        <div className="text-[10px] font-mono leading-tight">
                          <span className="text-slate-100 font-bold">{maxTemp}°</span>
                          <span className="text-slate-500 block text-[9px]">{minTemp}°</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
