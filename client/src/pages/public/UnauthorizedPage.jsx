import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">403 — Access Denied</h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          You do not have the required administrator privileges to view this section of the platform.
        </p>

        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" icon={ArrowLeft} className="w-full">
              Back to Student Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
