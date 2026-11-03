import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse space-y-3">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-20"></div>
      <div className="h-4 bg-slate-200 rounded w-16"></div>
    </div>
    <div className="h-5 bg-slate-200 rounded w-3/4"></div>
    <div className="h-4 bg-slate-200 rounded w-full"></div>
    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-8 bg-slate-200 rounded w-28"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, cols = 5 }) => (
  <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded flex-1"></div>
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-6 py-4 flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-4 bg-slate-100 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default CardSkeleton;
