import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { quizService } from '../../services/quizService';
import QuizCard from '../../components/quiz/QuizCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { Search, Filter, X } from 'lucide-react';

const BrowseQuizzes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await quizService.getCategories();
        setCategories(res.data || []);
      } catch (err) {
        console.error('Error loading categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch quizzes whenever filters or page changes
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const params = {
          page: currentPage,
          limit: 6,
          search: searchQuery,
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          difficulty: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        };

        const res = await quizService.getQuizzes(params);
        setQuizzes(res.data || []);
        setTotalPages(res.pages || 1);
        setTotalItems(res.total || 0);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [selectedCategory, selectedDifficulty, searchQuery, currentPage]);

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedDifficulty('all');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchParams({});
  };

  const isFiltered =
    selectedCategory !== 'all' || selectedDifficulty !== 'all' || searchQuery !== '';

  return (
    <div className="space-y-6">
      {/* Header and Search Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Available Quizzes</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Filter by technical category, difficulty, or search terms
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search quiz title..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            {/* Category dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Difficulty dropdown */}
            <select
              value={selectedDifficulty}
              onChange={(e) => {
                setSelectedDifficulty(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {isFiltered && (
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 px-2.5 py-1.5 rounded-lg transition-colors font-medium"
              >
                <X className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Found <strong className="text-slate-800">{totalItems}</strong> quizzes
          </span>
        </div>
      </div>

      {/* Quizzes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : quizzes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <QuizCard key={quiz._id} quiz={quiz} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </>
      ) : (
        <EmptyState
          title="No quizzes found"
          message="No quizzes matched your current search and filter criteria."
          actionLabel="Clear Filters"
          onAction={handleClearFilters}
        />
      )}
    </div>
  );
};

export default BrowseQuizzes;
