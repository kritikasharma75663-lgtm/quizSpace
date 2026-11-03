import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';
import { CheckCircle2, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await login({ email, password });
      toast.success(res.message || 'Logged in successfully!');
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check credentials.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'student') {
      setEmail('user@quizmaster.com');
      setPassword('User@123456');
    } else if (type === 'admin') {
      setEmail('admin@quizmaster.com');
      setPassword('Admin@123456');
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-1 border border-brand-100">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Welcome to QuizMaster
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with your email and password to access assessments
          </p>
        </div>

        {/* Quick Demo Autofill Buttons */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            1-Click Demo Fill:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('student')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Student Alex</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-colors"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@quizmaster.com"
            required
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isLoading}
            icon={ArrowRight}
          >
            Sign In to Dashboard
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-brand-600 hover:text-brand-700">
              Create account free &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
