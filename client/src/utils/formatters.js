// Format seconds into MM:SS
export const formatTime = (seconds) => {
  if (seconds === null || seconds === undefined || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Format duration into "X min" or "Xm Ys"
export const formatDuration = (seconds) => {
  if (!seconds && seconds !== 0) return '0s';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs}s`;
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}s`;
};

// Format date to local readable string
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Difficulty styling colors
export const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
    case 'medium':
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
    case 'hard':
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/20';
  }
};

// Attempt status badge
export const getAttemptStatusBadge = (status) => {
  switch (status) {
    case 'Completed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'In Progress':
      return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
    case 'Expired':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};
