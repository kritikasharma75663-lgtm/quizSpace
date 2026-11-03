import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { attemptService } from '../../services/attemptService';
import { quizService } from '../../services/quizService';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import PerformanceChart from '../../components/charts/PerformanceChart';
import QuizCard from '../../components/quiz/QuizCard';
import CardSkeleton, { TableSkeleton } from '../../components/common/LoadingSkeleton';
import EmptyState from '../../components/common/EmptyState';
import {
  Award,
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight,
  TrendingUp,
  Target,
  BarChart2,
} from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const UserDashboard = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [historyRes, quizzesRes, catRes] = await Promise.all([
          attemptService.getMyHistory({ limit: 10 }),
          quizService.getQuizzes({ limit: 3 }),
          quizService.getCategories(),
        ]);

        setHistoryData(historyRes.data || []);
        setRecommendedQuizzes(quizzesRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load user dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Compute stats from real attempt history
  const totalAttempted = historyData.length;
  const totalCorrect = historyData.reduce((sum, a) => sum + (a.correctCount || 0), 0);
  const totalQuestions = historyData.reduce((sum, a) => sum + (a.totalMarks || 0), 0);
  const averageScorePercentage =
    totalAttempted > 0
      ? Math.round(historyData.reduce((sum, a) => sum + (a.percentage || 0), 0) / totalAttempted)
      : 0;
  const overallAccuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Chart data: chronological order of recent attempts
  const chartData = [...historyData]
    .reverse()
    .slice(0, 10)
    .map((att, idx) => ({
      name: att.quiz?.title ? (att.quiz.title.length > 14 ? att.quiz.title.substring(0, 14) + '...' : att.quiz.title) : `Attempt ${idx + 1}`,
      score: att.percentage,
    }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
        <TableSkeleton rows={4} cols={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
            Student Assessment Portal
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold mt-1 tracking-tight">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1 leading-relaxed">
            Ready to test your comprehension? Choose from available assessments or review your past attempts.
          </p>
        </div>

        <Link to="/quizzes">
          <Button variant="primary" size="md" icon={Compass} className="bg-white text-brand-900 hover:bg-slate-100 font-bold border-none">
            Browse All Quizzes
          </Button>
        </Link>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Quizzes Attempted"
          value={totalAttempted}
          subtitle="Completed assessments"
          icon={Award}
          color="indigo"
        />
        <StatCard
          title="Average Score"
          value={`${averageScorePercentage}%`}
          subtitle="Across all completed tests"
          icon={TrendingUp}
          color="emerald"
        />
        <StatCard
          title="Overall Accuracy"
          value={`${overallAccuracy}%`}
          subtitle="Total correct vs attempted questions"
          icon={Target}
          color="violet"
        />
        <StatCard
          title="Total Correct Answers"
          value={totalCorrect}
          subtitle="Questions answered correctly"
          icon={CheckCircle2}
          color="amber"
        />
      </div>

      {/* Performance Chart & Recent Attempts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Performance Progression</h3>
              <p className="text-xs text-slate-500">Score percentage (%) over your recent attempts</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-600 font-semibold bg-brand-50 px-2.5 py-1 rounded-lg">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Score Trends</span>
            </div>
          </div>
          <PerformanceChart data={chartData} />
        </div>

        {/* Quick Category Browse */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-900 mb-1">Browse by Category</h3>
          <p className="text-xs text-slate-500 mb-4">Jump directly into a topic domain</p>

          <div className="space-y-2 flex-1">
            {categories.slice(0, 5).map((cat) => (
              <Link
                key={cat._id}
                to={`/quizzes?category=${cat._id}`}
                className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-colors group text-xs"
              >
                <span className="font-semibold text-slate-700 group-hover:text-brand-600">
                  {cat.name}
                </span>
                <span className="text-[11px] font-medium text-slate-400 group-hover:text-brand-600 flex items-center gap-1">
                  <span>{cat.quizCount || 1} quizzes</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            ))}
          </div>

          <Link to="/quizzes" className="mt-4 pt-3 border-t border-slate-100">
            <Button variant="ghost" size="sm" className="w-full text-xs">
              View All Categories &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Quiz Attempts Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Quiz Attempts</h3>
            <p className="text-xs text-slate-500">Authoritative results and score records</p>
          </div>
          <Link to="/attempts">
            <Button variant="outline" size="sm">
              View Full History
            </Button>
          </Link>
        </div>

        {historyData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Quiz Title</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-center">Marks</th>
                  <th className="py-3 px-4 text-center">Percentage</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {historyData.slice(0, 5).map((att) => (
                  <tr key={att._id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {att.quiz?.title || 'Quiz'}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{formatDate(att.createdAt)}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {att.score} / {att.totalMarks}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`font-bold ${
                          att.passed ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {att.percentage}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          att.passed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {att.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link to={`/attempts/${att._id}`}>
                        <Button variant="ghost" size="sm" className="text-brand-600">
                          Review &rarr;
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            title="No quizzes taken yet"
            message="Take your first quiz to begin tracking your academic performance!"
            actionLabel="Explore Quizzes"
            onAction={() => window.location.assign('/quizzes')}
          />
        )}
      </div>

      {/* Recommended Quizzes Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recommended Quizzes</h3>
            <p className="text-xs text-slate-500">Curated tests to challenge your understanding</p>
          </div>
          <Link to="/quizzes">
            <Button variant="ghost" size="sm" icon={ArrowRight}>
              Explore More
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedQuizzes.map((quiz) => (
            <QuizCard key={quiz._id} quiz={quiz} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
