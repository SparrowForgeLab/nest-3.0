import React, { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Sunrise, Sunset } from 'lucide-react';

export default function TimeWidget({ clockType = 'digital', clockFormat = '12h' }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours24 = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const getGreeting = () => {
    if (hours24 >= 5 && hours24 < 12) return { text: 'Good morning', icon: <Sunrise className="w-5 h-5 text-amber-400" /> };
    if (hours24 >= 12 && hours24 < 17) return { text: 'Good afternoon', icon: <Sun className="w-5 h-5 text-yellow-400" /> };
    if (hours24 >= 17 && hours24 < 21) return { text: 'Good evening', icon: <Sunset className="w-5 h-5 text-orange-400" /> };
    return { text: 'Good night', icon: <Moon className="w-5 h-5 text-sky-400" /> };
  };

  const greeting = getGreeting();

  // Format Digital Time
  const formatDigitalTime = () => {
    let hrs = hours24;
    let ampm = '';

    if (clockFormat === '12h') {
      ampm = hrs >= 12 ? 'PM' : 'AM';
      hrs = hrs % 12;
      hrs = hrs ? hrs : 12;
    }

    const strHours = String(hrs).padStart(2, '0');
    const strMinutes = String(minutes).padStart(2, '0');
    const strSeconds = String(seconds).padStart(2, '0');

    return { strHours, strMinutes, strSeconds, ampm };
  };

  const { strHours, strMinutes, strSeconds, ampm } = formatDigitalTime();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const dateString = time.toLocaleDateString(undefined, options);

  // Analog Clock angles
  const secAngle = seconds * 6;
  const minAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = (hours24 % 12) * 30 + minutes * 0.5;

  return (
    <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl glass-panel text-slate-100 border border-slate-700/60 shadow-xl">
      {/* Left: Greeting & Date */}
      <div className="flex items-center gap-3 text-center md:text-left">
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center">
          {greeting.icon}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100 flex items-center gap-2 justify-center md:justify-start">
            {greeting.text}, <span className="text-sky-400">Sparrow</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">{dateString}</p>
        </div>
      </div>

      {/* Right: Clock Display */}
      {clockType === 'analog' ? (
        /* Analog Clock */
        <div className="relative w-24 h-24 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            {/* Clock Face Background */}
            <circle cx="50" cy="50" r="46" fill="rgba(15, 23, 42, 0.8)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="3" />

            {/* Hour Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <line
                key={i}
                x1="50"
                y1="8"
                x2="50"
                y2={i % 3 === 0 ? "13" : "10"}
                stroke={i % 3 === 0 ? "#38bdf8" : "rgba(255, 255, 255, 0.3)"}
                strokeWidth={i % 3 === 0 ? "2.5" : "1.5"}
                transform={`rotate(${deg} 50 50)`}
              />
            ))}

            {/* Hour Hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="28"
              stroke="#f8fafc"
              strokeWidth="4"
              strokeLinecap="round"
              transform={`rotate(${hourAngle} 50 50)`}
            />

            {/* Minute Hand */}
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              transform={`rotate(${minAngle} 50 50)`}
            />

            {/* Second Hand */}
            <line
              x1="50"
              y1="55"
              x2="50"
              y2="14"
              stroke="#f43f5e"
              strokeWidth="1.5"
              strokeLinecap="round"
              transform={`rotate(${secAngle} 50 50)`}
            />

            {/* Center Cap */}
            <circle cx="50" cy="50" r="3.5" fill="#f43f5e" />
          </svg>
        </div>
      ) : (
        /* Digital Clock */
        <div className="flex items-baseline gap-1 font-mono">
          <span className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-wider">
            {strHours}:{strMinutes}
          </span>
          <span className="text-xs font-semibold text-slate-400 tracking-normal ml-0.5">
            :{strSeconds}
          </span>
          {clockFormat === '12h' && (
            <span className="text-xs font-bold text-sky-400 ml-1.5 px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
              {ampm}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
