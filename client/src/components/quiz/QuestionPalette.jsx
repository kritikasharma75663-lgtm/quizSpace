import React from 'react';

const QuestionPalette = ({
  totalQuestions,
  currentIndex,
  answers,
  questions,
  onSelectQuestion,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
          Question Navigator
        </h4>
        <span className="text-xs text-slate-500">
          {Object.keys(answers).length} / {totalQuestions} answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
        {questions.map((q, idx) => {
          const isAnswered =
            answers[q._id] !== undefined &&
            answers[q._id] !== null &&
            answers[q._id] !== '';
          const isCurrent = idx === currentIndex;

          let btnClass = 'bg-slate-100 text-slate-600 hover:bg-slate-200';
          if (isAnswered) {
            btnClass = 'bg-emerald-600 text-white font-bold hover:bg-emerald-700';
          }
          if (isCurrent) {
            btnClass = `${btnClass} ring-2 ring-brand-600 ring-offset-2 scale-105 z-10`;
          }

          return (
            <button
              key={q._id || idx}
              onClick={() => onSelectQuestion(idx)}
              className={`h-9 rounded-lg text-xs font-medium flex items-center justify-center transition-all ${btnClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200"></span>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full border-2 border-brand-600 bg-white"></span>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPalette;
