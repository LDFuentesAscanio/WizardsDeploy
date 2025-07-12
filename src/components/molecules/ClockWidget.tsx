'use client';
//External libraries
import { useEffect, useState } from 'react';

export default function ClockWidget() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#67ff94] text-[#2c3d5a] w-full max-w-xs rounded-2xl shadow p-6 text-center">
      <p className="text-sm uppercase">Current Time</p>
      <p className="text-3xl font-bold mt-1">{time.toLocaleTimeString()}</p>
    </div>
  );
}
