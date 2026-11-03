import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight">
                Quiz<span className="text-brand-600">Master</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Smart Online Quiz Platform built on the MERN stack. Designed for academic institutions,
              students, and administrators to conduct timed, authoritative online assessments.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Tailwind CSS'].map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link to="/quizzes" className="hover:text-brand-600 transition-colors">
                  Browse Quizzes
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-brand-600 transition-colors">
                  Student Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-brand-600 transition-colors">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Capstone Project
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Full Stack Web Development</li>
              <li>Authoritative Server-side Scoring</li>
              <li>Real MongoDB Analytics</li>
              <li>JWT & Role Authorization</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>&copy; {new Date().getFullYear()} QuizMaster Platform. Intermediate-Level Solo Capstone.</p>
          <p className="flex items-center gap-1">
            Built with modern MERN architecture
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
