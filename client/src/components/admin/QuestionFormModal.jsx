import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { CheckCircle2 } from 'lucide-react';

const QuestionFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  quizTitle = '',
  isLoading = false,
}) => {
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');

  useEffect(() => {
    if (initialData) {
      setQuestionText(initialData.questionText || '');
      setOptions(
        initialData.options && initialData.options.length >= 4
          ? initialData.options
          : [
              initialData.options?.[0] || '',
              initialData.options?.[1] || '',
              initialData.options?.[2] || '',
              initialData.options?.[3] || '',
            ]
      );
      setCorrectAnswer(initialData.correctAnswer !== undefined ? initialData.correctAnswer : 0);
      setExplanation(initialData.explanation || '');
      setDifficulty(initialData.difficulty || 'Medium');
    } else {
      setQuestionText('');
      setOptions(['', '', '', '']);
      setCorrectAnswer(0);
      setExplanation('');
      setDifficulty('Medium');
    }
  }, [initialData, isOpen]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (options.some((opt) => !opt.trim())) {
      alert('Please fill out all 4 MCQ options.');
      return;
    }
    onSubmit({
      questionText: questionText.trim(),
      options: options.map((opt) => opt.trim()),
      correctAnswer: Number(correctAnswer),
      explanation: explanation.trim(),
      difficulty,
    });
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Question' : 'Add New Question'}
      subtitle={quizTitle ? `Quiz: ${quizTitle}` : 'Configure question details and answers'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Question Text
          </label>
          <textarea
            rows="3"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Enter the question statement clearly..."
            required
            className="block w-full rounded-lg border border-slate-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        {/* 4 MCQ Option fields with radio selector for correct answer */}
        <div className="space-y-2.5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
            MCQ Options & Correct Answer Selection
          </label>
          <p className="text-xs text-slate-500 mb-2">
            Enter all 4 options and select the radio button next to the correct answer.
          </p>

          {options.map((opt, idx) => (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                correctAnswer === idx
                  ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="correctAnswerRadio"
                  checked={correctAnswer === idx}
                  onChange={() => setCorrectAnswer(idx)}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300"
                />
              </label>

              <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                {optionLetters[idx]}
              </span>

              <input
                type="text"
                value={opt}
                onChange={(e) => handleOptionChange(idx, e.target.value)}
                placeholder={`Option ${optionLetters[idx]} text`}
                required
                className="flex-1 bg-transparent border-none text-sm text-slate-900 focus:outline-none placeholder-slate-400"
              />

              {correctAnswer === idx && (
                <span className="text-[11px] font-bold text-emerald-700 px-2 py-0.5 rounded bg-emerald-100 flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Correct
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Question Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="block w-full rounded-lg border border-slate-300 text-sm py-2.5 px-3 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Explanation (Shown to students after quiz completion)
          </label>
          <textarea
            rows="2"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Explain why this option is correct to help students learn..."
            className="block w-full rounded-lg border border-slate-300 text-sm p-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          ></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {initialData ? 'Update Question' : 'Save Question'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuestionFormModal;
