import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { HelpCircle, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-brand-600 border border-indigo-200 flex items-center justify-center mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">404 — Page Not Found</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          The page or quiz you requested could not be located. It may have been moved or unpublished.
        </p>

        <div className="pt-2">
          <Link to="/">
            <Button variant="primary" icon={Home} className="w-full">
              Return to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
