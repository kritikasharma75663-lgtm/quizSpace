import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Clock, HelpCircle, Award, Play } from 'lucide-react';
import { getDifficultyColor } from '../../utils/formatters';

const QuizCard = ({ quiz }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <Badge variant="primary" size="sm">
            {quiz.category?.name || 'General'}
          </Badge>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getDifficultyColor(
              quiz.difficulty
            )}`}
          >
            {quiz.difficulty}
          </span>
        </div>

        {/* Title & description */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 line-clamp-1 mb-2">
          {quiz.title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1 mb-4">
          {quiz.description}
        </p>

        {/* Metadata stats */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 bg-slate-50/50 rounded-lg px-3 text-center mb-4">
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
              Time
            </span>
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-700 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{quiz.duration}m</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
              Questions
            </span>
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-700 mt-0.5">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>{quiz.questionCount || 10}</span>
            </div>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
              Pass Rate
            </span>
            <div className="flex items-center justify-center gap-1 text-xs font-semibold text-slate-700 mt-0.5">
              <Award className="w-3 h-3 text-slate-400" />
              <span>{quiz.passingPercentage}%</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <Link to={`/quizzes/${quiz._id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              Instructions
            </Button>
          </Link>
          <Link to={`/quizzes/${quiz._id}/attempt`} className="flex-1">
            <Button variant="primary" size="sm" icon={Play} className="w-full">
              Start
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
