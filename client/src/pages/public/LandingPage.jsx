import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { quizService } from '../../services/quizService';
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  BarChart3,
  BookOpen,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Layers,
  Terminal,
  Database,
  Code,
  Network,
  Cpu,
  Cloud,
} from 'lucide-react';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [catRes, quizRes] = await Promise.all([
          quizService.getCategories(),
          quizService.getQuizzes({ limit: 4 }),
        ]);
        setCategories(catRes.data || []);
        setQuizzes(quizRes.data || []);
      } catch (err) {
        console.error('Error loading landing data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const getCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'Code':
        return <Code className="w-5 h-5 text-indigo-600" />;
      case 'Database':
        return <Database className="w-5 h-5 text-emerald-600" />;
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-amber-600" />;
      case 'Network':
        return <Network className="w-5 h-5 text-blue-600" />;
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-purple-600" />;
      case 'Cloud':
        return <Cloud className="w-5 h-5 text-sky-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-brand-50/70 via-white to-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Smart Online Assessment Platform • Full Stack MERN</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight sm:leading-none">
            Master Technical Skills With{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-violet-600">
              Authoritative Quizzes
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Take timed, secure quizzes across Web Development, Data Structures, Python, Databases, and
            Cloud. Receive instant server-verified results, detailed explanations, and performance tracking.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/register">
              <Button size="lg" icon={ArrowRight} className="w-full sm:w-auto shadow-md shadow-brand-500/20">
                Get Started Free
              </Button>
            </Link>
            <Link to="/quizzes">
              <Button variant="outline" size="lg" icon={BookOpen} className="w-full sm:w-auto">
                Browse Quizzes
              </Button>
            </Link>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div className="mt-12 max-w-2xl mx-auto bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> Demo Credentials (1-Click Login Ready)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100">
                <span className="font-bold text-indigo-900 block">Student Account</span>
                <span className="text-slate-600">user@quizmaster.com / User@123456</span>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-100">
                <span className="font-bold text-amber-900 block">Admin Account</span>
                <span className="text-slate-600">admin@quizmaster.com / Admin@123456</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <Badge variant="primary" size="md">
            Built for Excellence
          </Badge>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Comprehensive Quiz Experience
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Engineered with strict security rules, countdown validation, and deep analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Authoritative Server Scoring</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Correct answer keys and explanations are securely kept on the server during attempts.
              Client scores are strictly evaluated from stored database answers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 text-violet-600 flex items-center justify-center mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Validated Countdown Timer</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live timers with expiration safety. Server validates attempt start time against duration
              and auto-finalizes expired attempts gracefully.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Real-Time Audit & Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Admins inspect detailed student scorecards, question breakdowns, and export complete
              attempt histories directly to CSV.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section id="categories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <Badge variant="primary">Academic Domains</Badge>
            <h2 className="text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              Explore Topics & Specializations
            </h2>
          </div>
          <Link to="/quizzes" className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1">
            <span>View All Quizzes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/quizzes?category=${cat._id}`}
              className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex items-start gap-4 group"
            >
              <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                  {cat.description || 'Topic assessment questions and tests.'}
                </p>
                <span className="inline-block mt-2 text-[11px] font-semibold text-brand-600">
                  {cat.quizCount || 1} available quizzes &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-900 via-slate-900 to-brand-800 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Test Your Knowledge?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Create an account in seconds or explore quizzes with our pre-populated sample questions.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto bg-brand-500 hover:bg-brand-400 text-white font-bold">
                  Create Free Account
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent border-slate-600 text-white hover:bg-slate-800">
                  Log In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
