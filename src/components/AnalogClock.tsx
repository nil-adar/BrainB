
import { useEffect, useState } from 'react';

export const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDegrees = (hours * 30) + (minutes / 2);
  const minuteDegrees = (minutes * 6) + (seconds / 10);
  const secondDegrees = seconds * 6;

  return (
    <div className="w-full h-full relative flex items-center justify-center">
      {/* Clock face */}
      <div className="w-full h-full rounded-full bg-white border-8 border-primary shadow-lg relative">
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-5 flex justify-center"
            style={{
              height: '75%',
              transform: `rotate(${i * 30}deg)`,
              transformOrigin: 'bottom center',
              top: '-25%',
              left: 'calc(50% - 0.625rem)',
            }}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <span
                className="text-primary font-bold text-base"
                style={{ transform: `rotate(-${i * 30}deg)` }}
              >
                {i === 0 ? '12' : i}
              </span>
            </div>
          </div>
        ))}

        {/* Hour hand */}
        <div
          className="absolute w-2 bg-primary rounded-full"
          style={{
            height: '28%',
            transform: `rotate(${hourDegrees}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
            left: 'calc(50% - 0.25rem)',
          }}
        />

        {/* Minute hand */}
        <div
          className="absolute w-1.5 bg-primary rounded-full"
          style={{
            height: '38%',
            transform: `rotate(${minuteDegrees}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
            left: 'calc(50% - 0.1875rem)',
          }}
        />

        {/* Second hand */}
        <div
          className="absolute w-1 bg-accent rounded-full"
          style={{
            height: '43%',
            transform: `rotate(${secondDegrees}deg)`,
            transformOrigin: 'bottom center',
            bottom: '50%',
            left: 'calc(50% - 0.125rem)',
          }}
        />

        {/* Center dot */}
        <div className="absolute w-4 h-4 bg-primary rounded-full"
          style={{
            top: 'calc(50% - 0.5rem)',
            left: 'calc(50% - 0.5rem)',
          }}
        />
      </div>
    </div>
  );
};
