import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
      {totalItems !== undefined && (
        <p className="text-xs text-slate-500">
          Showing page <span className="font-semibold text-slate-700">{currentPage}</span> of{' '}
          <span className="font-semibold text-slate-700">{totalPages}</span> ({totalItems} total)
        </p>
      )}

      <div className="inline-flex items-center -space-x-px rounded-lg border border-slate-300 bg-white shadow-sm">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center gap-1 rounded-l-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed border-r border-slate-200"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Prev</span>
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          // Show first, last, current, and adjacent pages if many pages
          if (
            totalPages > 7 &&
            pageNum !== 1 &&
            pageNum !== totalPages &&
            Math.abs(pageNum - currentPage) > 1
          ) {
            if (pageNum === 2 || pageNum === totalPages - 1) {
              return (
                <span
                  key={pageNum}
                  className="px-2.5 py-1.5 text-xs text-slate-400 select-none border-r border-slate-200"
                >
                  ...
                </span>
              );
            }
            return null;
          }

          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`px-3 py-1.5 text-xs font-medium border-r border-slate-200 ${
                isActive
                  ? 'bg-brand-600 text-white font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center gap-1 rounded-r-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
