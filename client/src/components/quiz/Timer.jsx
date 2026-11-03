import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatTime } from '../../utils/formatters';

const Timer = ({ secondsLeft, isLowTime }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-mono font-bold tracking-wider transition-colors ${
        isLowTime
          ? 'bg-rose-50 text-rose-700 border-rose-300 ring-4 ring-rose-500/10 animate-pulse'
          : 'bg-white text-slate-800 border-slate-200 shadow-sm'
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-brand-600" />
      )}
      <span>{formatTime(secondsLeft)}</span>
      {isLowTime && (
        <span className="text-[10px] font-sans font-bold text-rose-600 tracking-normal hidden sm:inline">
          Time Low!
        </span>
      )}
    </div>
  );
};

export default Timer;
