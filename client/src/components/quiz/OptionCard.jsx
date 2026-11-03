import React from 'react';
import { Check } from 'lucide-react';

const OptionCard = ({
  optionText,
  index,
  isSelected,
  onSelect,
}) => {
  const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const letter = letters[index] || index + 1;

  return (
    <div
      onClick={onSelect}
      className={`relative flex items-center p-4 rounded-xl border transition-all cursor-pointer select-none ${
        isSelected
          ? 'bg-brand-50/70 border-brand-500 shadow-sm ring-2 ring-brand-500/20'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
          isSelected
            ? 'bg-brand-600 text-white'
            : 'bg-slate-100 text-slate-700'
        }`}
      >
        {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
      </div>

      <span
        className={`ml-3.5 text-sm font-medium leading-relaxed ${
          isSelected ? 'text-slate-900 font-semibold' : 'text-slate-700'
        }`}
      >
        {optionText}
      </span>
    </div>
  );
};

export default OptionCard;
